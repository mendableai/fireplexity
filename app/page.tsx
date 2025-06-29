'use client'

import { useChat } from 'ai/react'
import { SearchComponent } from './search'
import { ChatInterface } from './chat-interface'
import { SearchResult, OpenRouterModel } from './types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ErrorDisplay } from '@/components/error-display'
import { Label } from '@/components/ui/label'
import { Combobox } from "@/components/ui/combobox"


interface MessageData {
  sources: SearchResult[]
  followUpQuestions: string[]
  ticker?: string
}

export default function FireplexityPage() {
  const [sources, setSources] = useState<SearchResult[]>([])
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [searchStatus, setSearchStatus] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const lastDataLength = useRef(0)
  const [messageData, setMessageData] = useState<Map<number, MessageData>>(new Map())
  const currentMessageIndex = useRef(0)
  const [currentTicker, setCurrentTicker] = useState<string | null>(null)

  // API Key States
  const [firecrawlApiKey, setFirecrawlApiKey] = useState<string>('')
  const [hasFirecrawlApiKey, setHasFirecrawlApiKey] = useState<boolean>(false)
  const [showFirecrawlApiKeyModal, setShowFirecrawlApiKeyModal] = useState<boolean>(false)

  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>('')
  const [hasOpenRouterApiKey, setHasOpenRouterApiKey] = useState<boolean>(false)
  const [showOpenRouterApiKeyModal, setShowOpenRouterApiKeyModal] = useState<boolean>(false)

  const [isCheckingEnv, setIsCheckingEnv] = useState<boolean>(true)
  const [pendingQuery, setPendingQuery] = useState<string>('')

  // Provider and Model States
  const [provider, setProvider] = useState<string>('openai') // 'openai' or 'openrouter'
  const [openRouterModel, setOpenRouterModel] = useState<string>('')
  const [availableOpenRouterModels, setAvailableOpenRouterModels] = useState<OpenRouterModel[]>([])
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false)


  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: '/api/fireplexity/search',
    body: {
      provider,
      ...(provider === 'openrouter' && { openRouterModel }),
      ...(firecrawlApiKey && { firecrawlApiKey }),
      ...(provider === 'openrouter' && openRouterApiKey && { openRouterApiKey }),
    },
    onResponse: () => {
      // Clear status when response starts
      setSearchStatus('')
      // Clear current data for new response
      setSources([])
      setFollowUpQuestions([])
      setCurrentTicker(null)
      // Track the current message index (assistant messages only)
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      currentMessageIndex.current = assistantMessages.length
    },
    onError: (error) => {
      console.error('Chat error:', error)
      setSearchStatus('')
      toast.error(error.message || "An error occurred during the chat.")
    },
    onFinish: () => {
      setSearchStatus('')
      // Reset data length tracker
      lastDataLength.current = 0
    }
  })

  // Handle custom data from stream - only process new items
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Only process new items that haven't been processed before
      const newItems = data.slice(lastDataLength.current)
      
      newItems.forEach((item) => {
        if (!item || typeof item !== 'object' || !('type' in item)) return
        
        const typedItem = item as unknown as { type: string; message?: string; sources?: SearchResult[]; questions?: string[]; symbol?: string, error?: string, suggestion?: string }
        if (typedItem.type === 'status') {
          setSearchStatus(typedItem.message || '')
        }
        if (typedItem.type === 'ticker' && typedItem.symbol) {
          setCurrentTicker(typedItem.symbol)
          // Also store in message data map
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, ticker: typedItem.symbol })
          setMessageData(newMap)
        }
        if (typedItem.type === 'sources' && typedItem.sources) {
          setSources(typedItem.sources)
          // Also store in message data map
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, sources: typedItem.sources })
          setMessageData(newMap)
        }
        if (typedItem.type === 'follow_up_questions' && typedItem.questions) {
          setFollowUpQuestions(typedItem.questions)
          // Also store in message data map
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, followUpQuestions: typedItem.questions })
          setMessageData(newMap)
        }
        if (typedItem.type === 'error') {
          toast.error(typedItem.error, { description: typedItem.suggestion })
          setSearchStatus('')
        }
      })
      
      // Update the last processed length
      lastDataLength.current = data.length
    }
  }, [data, messageData, messages])


  // Check for environment variables and stored API keys on mount
  useEffect(() => {
    const checkApiKeys = async () => {
      setIsCheckingEnv(true)
      try {
        const response = await fetch('/api/fireplexity/check-env')
        const data = await response.json()
        
        if (data.hasFirecrawlKey) {
          setHasFirecrawlApiKey(true)
        } else {
          const storedFcKey = localStorage.getItem('firecrawl-api-key')
          if (storedFcKey) {
            setFirecrawlApiKey(storedFcKey)
            setHasFirecrawlApiKey(true)
          }
        }

        if (data.hasOpenRouterKey) {
          setHasOpenRouterApiKey(true)
        } else {
          const storedOrKey = localStorage.getItem('openrouter-api-key')
          if (storedOrKey) {
            setOpenRouterApiKey(storedOrKey)
            setHasOpenRouterApiKey(true)
          }
        }

      } catch (error) {
        console.error('Error checking environment:', error)
        toast.error("Failed to check API key status.")
      } finally {
        setIsCheckingEnv(false)
      }
    }
    
    checkApiKeys()
  }, [])

  // Fetch OpenRouter models when provider is set to openrouter
  useEffect(() => {
    const fetchModels = async () => {
      if (provider === 'openrouter' && availableOpenRouterModels.length === 0) {
        setIsFetchingModels(true)
        try {
          const response = await fetch('/api/openrouter/models')
          if (!response.ok) {
            const errorData = await response.json()
            toast.error('Failed to fetch OpenRouter models', { description: errorData.details?.error?.message || response.statusText })
            setAvailableOpenRouterModels([])
            return
          }
          const modelData = await response.json()
          // Sort all models by name
          const allModels = modelData.data
            .sort((a: OpenRouterModel, b: OpenRouterModel) => (a.name || a.id).localeCompare(b.name || b.id));
          setAvailableOpenRouterModels(allModels)
          if (allModels.length > 0 && !openRouterModel) {
            setOpenRouterModel(allModels[0].id) // Set default model
          }
        } catch (error) {
          console.error('Error fetching OpenRouter models:', error)
          toast.error('Error fetching OpenRouter models.')
          setAvailableOpenRouterModels([])
        } finally {
          setIsFetchingModels(false)
        }
      }
    }
    fetchModels()
  }, [provider, openRouterModel, availableOpenRouterModels.length])


  const handleFirecrawlApiKeySubmit = () => {
    if (firecrawlApiKey.trim()) {
      localStorage.setItem('firecrawl-api-key', firecrawlApiKey)
      setHasFirecrawlApiKey(true)
      setShowFirecrawlApiKeyModal(false)
      toast.success('Firecrawl API key saved!')
      
      if (pendingQuery) {
        triggerPendingQuery()
      }
    }
  }

  const handleOpenRouterApiKeySubmit = () => {
    if (openRouterApiKey.trim()) {
      localStorage.setItem('openrouter-api-key', openRouterApiKey)
      setHasOpenRouterApiKey(true)
      setShowOpenRouterApiKeyModal(false)
      toast.success('OpenRouter API key saved!')

      if (pendingQuery) {
        triggerPendingQuery()
      }
    }
  }

  const triggerPendingQuery = () => {
    if (pendingQuery) {
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: {
          querySelector: () => ({ value: pendingQuery })
        }
      } as any
      handleInputChange({ target: { value: pendingQuery } } as any)
      setTimeout(() => {
        handleSubmit(fakeEvent)
        setPendingQuery('')
      }, 100)
    }
  }


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    // Check for Firecrawl API key
    if (!hasFirecrawlApiKey) {
      setPendingQuery(input)
      setShowFirecrawlApiKeyModal(true)
      return
    }

    // Check for OpenRouter API key if provider is openrouter
    if (provider === 'openrouter' && !hasOpenRouterApiKey) {
      setPendingQuery(input)
      setShowOpenRouterApiKeyModal(true)
      return
    }
    
    setHasSearched(true)
    // Clear current data immediately when submitting new query
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    handleSubmit(e)
  }
  
  // Wrapped submit handler for chat interface
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) {
      e.preventDefault()
      return
    }
    // Check for Firecrawl API key
    if (!hasFirecrawlApiKey) {
      setPendingQuery(input)
      setShowFirecrawlApiKeyModal(true)
      e.preventDefault()
      return
    }

    // Check for OpenRouter API key if provider is openrouter
    if (provider === 'openrouter' && !hasOpenRouterApiKey) {
      setPendingQuery(input)
      setShowOpenRouterApiKeyModal(true)
      e.preventDefault()
      return
    }
    
    // Store current data in messageData before clearing
    if (messages.length > 0 && (sources.length > 0 || followUpQuestions.length > 0 || currentTicker)) {
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      const lastAssistantIndex = assistantMessages.length - 1
      if (lastAssistantIndex >= 0) {
        const newMap = new Map(messageData)
        newMap.set(lastAssistantIndex, {
          sources: sources,
          followUpQuestions: followUpQuestions,
          ticker: currentTicker || undefined
        })
        setMessageData(newMap)
      }
    }
    
    // Clear current data immediately when submitting new query
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    handleSubmit(e)
  }

  const isChatActive = hasSearched || messages.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo - matching other pages */}
      <header className="px-4 sm:px-6 lg:px-8 py-1 mt-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="https://firecrawl.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image 
              src="/firecrawl-logo-with-fire.png" 
              alt="Firecrawl Logo" 
              width={113} 
              height={24}
              className="w-[113px] h-auto"
            />
          </Link>
          <Button
            asChild
            variant="code"
            className="font-medium flex items-center gap-2"
          >
            <a 
              href="https://github.com/mendableai/fireplexity" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Use this template
            </a>
          </Button>
        </div>
      </header>

      {/* Hero section - matching other pages */}
      <div className={`px-4 sm:px-6 lg:px-8 pt-2 pb-4 transition-all duration-500 ${isChatActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-[2.5rem] lg:text-[3.8rem] text-[#36322F] dark:text-white font-semibold tracking-tight leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="relative px-1 pb-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500 inline-flex justify-center items-center">
              Fireplexity
            </span>
            <span className="block leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:400ms] [animation-fill-mode:forwards]">
              Search & Scrape
            </span>
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:600ms] [animation-fill-mode:forwards]">
            AI-powered web search with instant results and follow-up questions. Now with OpenRouter support!
          </p>
        </div>
      </div>

      {/* Configuration Section - Only show before first search */}
      {!isChatActive && (
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="provider-select" className="text-gray-700">LLM Provider</Label>
                <Combobox
                  options={[
                    { value: "openai", label: "OpenAI" },
                    { value: "openrouter", label: "OpenRouter" },
                  ]}
                  value={provider}
                  onChange={setProvider}
                  placeholder="Select Provider"
                  searchPlaceholder="Search providers..."
                  emptyStateMessage="No provider found."
                />
              </div>

              {provider === 'openrouter' && (
                <div>
                  <Label htmlFor="openrouter-model-select" className="text-gray-700">OpenRouter Model</Label>
                  <Combobox
                    options={availableOpenRouterModels.map(model => ({ value: model.id, label: model.name || model.id }))}
                    value={openRouterModel}
                    onChange={setOpenRouterModel}
                    placeholder={isFetchingModels ? "Loading models..." : "Select Model"}
                    searchPlaceholder="Search models..."
                    emptyStateMessage={isFetchingModels ? "Loading..." : (availableOpenRouterModels.length === 0 ? "No models found or failed to load" : "No model found.")}
                    disabled={isFetchingModels || availableOpenRouterModels.length === 0}
                  />
                  {!hasOpenRouterApiKey && (
                    <Button variant="link" size="sm" className="mt-1 px-0 text-orange-600 hover:text-orange-700" onClick={() => setShowOpenRouterApiKeyModal(true)}>
                      Set OpenRouter API Key
                    </Button>
                  )}
                </div>
              )}
            </div>
            {!hasFirecrawlApiKey && (
                <div className="mt-4">
                    <Button variant="link" size="sm" className="px-0 text-orange-600 hover:text-orange-700" onClick={() => setShowFirecrawlApiKeyModal(true)}>
                      Set Firecrawl API Key
                    </Button>
                </div>
            )}
          </div>
        </div>
      )}


      {/* Main content wrapper */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-full">
          {!isChatActive ? (
            <SearchComponent 
              handleSubmit={handleSearch}
              input={input}
              handleInputChange={handleInputChange}
              isLoading={isLoading || isCheckingEnv || (provider === 'openrouter' && isFetchingModels)}
              disabled={isCheckingEnv || (provider === 'openrouter' && isFetchingModels)}
            />
          ) : (
            <ChatInterface 
              messages={messages}
              sources={sources}
              followUpQuestions={followUpQuestions}
              searchStatus={searchStatus}
              isLoading={isLoading}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleChatSubmit}
              messageData={messageData}
              currentTicker={currentTicker}
            />
          )}
        </div>
      </div>

      {/* Footer - matching other pages */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by{' '}
            <a 
              href="https://firecrawl.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
            >
              Firecrawl
            </a>
          </p>
        </div>
      </footer>
      
      {/* Firecrawl API Key Modal */}
      <Dialog open={showFirecrawlApiKeyModal} onOpenChange={setShowFirecrawlApiKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Firecrawl API Key Required</DialogTitle>
            <DialogDescription>
              To use Fireplexity search, you need a Firecrawl API key. Get one for free at{' '}
              <a 
                href="https://www.firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                firecrawl.dev
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="firecrawlApiKeyInput"
              placeholder="Enter your Firecrawl API key"
              value={firecrawlApiKey}
              onChange={(e) => setFirecrawlApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleFirecrawlApiKeySubmit()
                }
              }}
              className="h-12"
            />
            <Button onClick={handleFirecrawlApiKeySubmit} variant="orange" className="w-full">
              Save Firecrawl API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OpenRouter API Key Modal */}
      <Dialog open={showOpenRouterApiKeyModal} onOpenChange={setShowOpenRouterApiKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenRouter API Key Required</DialogTitle>
            <DialogDescription>
              To use the OpenRouter provider, you need an OpenRouter API key. Get one from{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                openrouter.ai
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="openRouterApiKeyInput"
              placeholder="Enter your OpenRouter API key"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleOpenRouterApiKeySubmit()
                }
              }}
              className="h-12"
            />
            <Button onClick={handleOpenRouterApiKeySubmit} variant="orange" className="w-full">
              Save OpenRouter API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}