import { NextResponse } from 'next/server'
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai'
import { streamText, generateText, createDataStreamResponse } from 'ai'
import { detectCompanyTicker } from '@/lib/company-ticker-map'
import { selectRelevantContent } from '@/lib/content-selection'
import FirecrawlApp from '@mendable/firecrawl-js'

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[${requestId}] Fireplexity Search API called`)
  try {
    const body = await request.json()
    const messages = body.messages || []
    const query = messages[messages.length - 1]?.content || body.query
    const provider = body.provider || 'openai' // Default to openai
    const openRouterModel = body.openRouterModel // Model for OpenRouter
    const openRouterApiKey = body.openRouterApiKey || process.env.OPENROUTER_API_KEY

    console.log(`[${requestId}] Query received:`, query)
    console.log(`[${requestId}] Provider:`, provider)
    if (provider === 'openrouter') {
      console.log(`[${requestId}] OpenRouter Model:`, openRouterModel)
    }

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // API key validation
    const firecrawlApiKey = body.firecrawlApiKey || process.env.FIRECRAWL_API_KEY
    if (!firecrawlApiKey) {
      return NextResponse.json({ error: 'Firecrawl API key not configured' }, { status: 500 })
    }

    let llmProvider: OpenAIProvider
    let modelName: string = 'gpt-4o-mini' // Default OpenAI model

    if (provider === 'openai') {
      const openaiApiKey = process.env.OPENAI_API_KEY
      if (!openaiApiKey) {
        return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
      }
      llmProvider = createOpenAI({ apiKey: openaiApiKey })
    } else if (provider === 'openrouter') {
      if (!openRouterApiKey) {
        return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
      }
      if (!openRouterModel) {
        return NextResponse.json({ error: 'OpenRouter model not selected' }, { status: 400 })
      }
      llmProvider = createOpenAI({
        apiKey: openRouterApiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      })
      modelName = openRouterModel
      console.log(`[${requestId}] Using OpenRouter model: ${modelName}`)
    } else {
      return NextResponse.json({ error: 'Invalid provider specified' }, { status: 400 })
    }

    // Initialize Firecrawl
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

    // Always perform a fresh search for each query to ensure relevant results
    const isFollowUp = messages.length > 2
    
    // Use createDataStreamResponse with a custom data stream
    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          let sources: Array<{
            url: string
            title: string
            description?: string
            content?: string
            markdown?: string
            publishedDate?: string
            author?: string
            image?: string
            favicon?: string
            siteName?: string
          }> = []
          let context = ''
          
          // Always search for sources to ensure fresh, relevant results
          dataStream.writeData({ type: 'status', message: 'Starting search...' })
          dataStream.writeData({ type: 'status', message: 'Searching for relevant sources...' })
            
          const searchData = await firecrawl.search(query, {
            limit: 6,
            scrapeOptions: {
              formats: ['markdown'],
              onlyMainContent: true
            }
          })
          
          // Transform sources metadata
          sources = searchData.data?.map((item: any) => ({
            url: item.url,
            title: item.title || item.url,
            description: item.description || item.metadata?.description,
            content: item.content,
            markdown: item.markdown,
            publishedDate: item.publishedDate,
            author: item.author,
            image: item.metadata?.ogImage || item.metadata?.image,
            favicon: item.metadata?.favicon,
            siteName: item.metadata?.siteName,
          })).filter((item: any) => item.url) || []

          // Send sources immediately
          dataStream.writeData({ type: 'sources', sources })
          
          // Small delay to ensure sources render first
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Update status
          dataStream.writeData({ type: 'status', message: 'Analyzing sources and generating answer...' })
          
          // Detect if query is about a company
          const ticker = detectCompanyTicker(query)
          console.log(`[${requestId}] Query: "${query}" -> Detected ticker: ${ticker}`)
          if (ticker) {
            dataStream.writeData({ type: 'ticker', symbol: ticker })
          }
          
          // Prepare context from sources with intelligent content selection
          context = sources
            .map((source: { title: string; markdown?: string; content?: string; url: string }, index: number) => {
              const content = source.markdown || source.content || ''
              const relevantContent = selectRelevantContent(content, query, 2000)
              return `[${index + 1}] ${source.title}\nURL: ${source.url}\n${relevantContent}`
            })
            .join('\n\n---\n\n')

          console.log(`[${requestId}] Creating text stream for query:`, query)
          console.log(`[${requestId}] Context length:`, context.length)
          
          // Prepare messages for the AI
          let aiMessages = []
          
          if (!isFollowUp) {
            // Initial query with sources
            aiMessages = [
              {
                role: 'system',
                content: `You are a friendly assistant that helps users find information.
                
                RESPONSE STYLE:
                - For greetings (hi, hello), respond warmly and ask how you can help
                - For simple questions, give direct, concise answers
                - For complex topics, provide detailed explanations only when needed
                - Match the user's energy level - be brief if they're brief
                
                FORMAT:
                - Use markdown for readability when appropriate
                - Keep responses natural and conversational
                - Include citations inline as [1], [2], etc. when referencing specific sources
                - Citations should correspond to the source order (first source = [1], second = [2], etc.)
                - Use the format [1] not CITATION_1 or any other format`
              },
              {
                role: 'user',
                content: `Answer this query: "${query}"\n\nBased on these sources:\n${context}`
              }
            ]
          } else {
            // Follow-up question - still use fresh sources from the new search
            aiMessages = [
              {
                role: 'system',
                content: `You are a friendly assistant continuing our conversation.
                
                REMEMBER:
                - Keep the same conversational tone from before
                - Build on previous context naturally
                - Match the user's communication style
                - Use markdown when it helps clarity
                - Include citations inline as [1], [2], etc. when referencing specific sources
                - Citations should correspond to the source order (first source = [1], second = [2], etc.)
                - Use the format [1] not CITATION_1 or any other format`
              },
              // Include conversation context
              ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content
              })),
              // Add the current query with the fresh sources
              {
                role: 'user',
                content: `Answer this query: "${query}"\n\nBased on these sources:\n${context}`
              }
            ]
          }
          
          // Start generating follow-up questions in parallel (before streaming answer)
          const conversationPreview = isFollowUp 
            ? messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n\n')
            : `user: ${query}`
            
          const followUpPromise = generateText({
            model: llmProvider(modelName), // Use dynamic model and provider
            messages: [
              {
                role: 'system',
                content: `Generate 5 natural follow-up questions based on the query and context.\n                \n                ONLY generate questions if the query warrants them:\n                - Skip for simple greetings or basic acknowledgments\n                - Create questions that feel natural, not forced\n                - Make them genuinely helpful, not just filler\n                - Focus on the topic and sources available\n                \n                If the query doesn't need follow-ups, return an empty response.
                ${isFollowUp ? 'Consider the full conversation history and avoid repeating previous questions.' : ''}
                Return only the questions, one per line, no numbering or bullets.`
              },
              {
                role: 'user',
                content: `Query: ${query}\n\nConversation context:\n${conversationPreview}\n\n${sources.length > 0 ? `Available sources about: ${sources.map((s: { title: string }) => s.title).join(', ')}\n\n` : ''}Generate 5 diverse follow-up questions that would help the user learn more about this topic from different angles.`
              }
            ],
            temperature: 0.7,
            maxTokens: 150,
          })
          
          // Stream the text generation
          const result = streamText({
            model: llmProvider(modelName), // Use dynamic model and provider
            messages: aiMessages,
            temperature: 0.7,
            maxTokens: 2000
          })
          
          // Merge the text stream into the data stream
          // This ensures proper ordering of text chunks
          result.mergeIntoDataStream(dataStream)
          
          // Wait for both the text generation and follow-up questions
          const [fullAnswer, followUpResponse] = await Promise.all([
            result.text,
            followUpPromise
          ])
          
          // Process follow-up questions
          const followUpQuestions = followUpResponse.text
            .split('\n')
            .map((q: string) => q.trim())
            .filter((q: string) => q.length > 0)
            .slice(0, 5)

          // Send follow-up questions after the answer is complete
          dataStream.writeData({ type: 'follow_up_questions', questions: followUpQuestions })
          
          // Signal completion
          dataStream.writeData({ type: 'complete' })
          
        } catch (error) {
          console.error('Stream error:', error)
          
          // Handle specific error types
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const statusCode = error && typeof error === 'object' && 'statusCode' in error 
            ? error.statusCode 
            : error && typeof error === 'object' && 'status' in error
            ? error.status
            : undefined
          
          // Provide user-friendly error messages
          const errorResponses: Record<number, { error: string; suggestion?: string }> = {
            401: {
              error: 'Invalid API key',
              suggestion: 'Please check your API key for the selected provider.'
            },
            402: {
              error: 'Insufficient credits',
              suggestion: 'You\'ve run out of credits for the selected provider. Please upgrade your plan.'
            },
            429: {
              error: 'Rate limit exceeded',
              suggestion: 'Too many requests. Please wait a moment and try again.'
            },
            504: {
              error: 'Request timeout',
              suggestion: 'The search took too long. Try a simpler query or fewer sources.'
            }
          }
          
          const errorResponse = statusCode && errorResponses[statusCode as keyof typeof errorResponses] 
            ? errorResponses[statusCode as keyof typeof errorResponses]
            : { error: errorMessage }
          
          const errorData: Record<string, any> = { 
            type: 'error', 
            error: errorResponse.error
          }
          
          if (errorResponse.suggestion) {
            errorData.suggestion = errorResponse.suggestion
          }
          
          if (statusCode) {
            errorData.statusCode = statusCode
          }
          
          dataStream.writeData(errorData)
        }
      },
      headers: {
        'x-vercel-ai-data-stream': 'v1',
      },
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''
    console.error('Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      { error: 'Search failed', message: errorMessage, details: errorStack },
      { status: 500 }
    )
  }
}