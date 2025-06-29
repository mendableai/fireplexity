import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasFirecrawlKey: !!process.env.FIRECRAWL_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY
  })
}