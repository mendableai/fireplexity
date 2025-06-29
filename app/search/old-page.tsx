'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { SearchComponent } from '../search'
import { ChatInterface } from '../chat-interface'
import { SearchResult } from '../types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface MessageData {
  sources: SearchResult[]
  followUpQuestions: string[]
  ticker?: string
}

export default function SearchPage() {
  const [sources, setSources] = useState<SearchResult[]>([])
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [searchStatus, setSearchStatus] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const lastDataLength = useRef(0)
  const [messageData, setMessageData] = useState<Map<number, MessageData>>(new Map())
  const currentMessageIndex = useRef(0)
  const [currentTicker, setCurrentTicker] = useState<string | null>(null)
  const [firecrawlApiKey, setFirecrawlApiKey] = useState<string>('')
  const [hasApiKey, setHasApiKey] = useState<boolean>(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false)
  const [, setIsCheckingEnv] = useState<boolean>(true)
  const [pendingQuery, setPendingQuery] = useState<string>('')

  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: '/api/fireplexity/search',
    body: {
      ...(firecrawlApiKey && { firecrawlApiKey })
    },
    onResponse: () => {
      setSearchStatus('')
      setSources([])
      setFollowUpQuestions([])
      setCurrentTicker(null)
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      currentMessageIndex.current = assistantMessages.length
    },
    onError: (error) => {
      console.error('Chat error:', error)
      setSearchStatus('')
    },
    onFinish: () => {
      setSearchStatus('')
      lastDataLength.current = 0
    }
  })

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const newItems = data.slice(lastDataLength.current)
      
      newItems.forEach((item) => {
        if (!item || typeof item !== 'object' || !('type' in item)) return
        
        const typedItem = item as unknown as { type: string; message?: string; sources?: SearchResult[]; questions?: string[]; symbol?: string }
        if (typedItem.type === 'status') {
          setSearchStatus(typedItem.message || '')
        }
        if (typedItem.type === 'ticker' && typedItem.symbol) {
          setCurrentTicker(typedItem.symbol)
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, ticker: typedItem.symbol })
          setMessageData(newMap)
        }
        if (typedItem.type === 'sources' && typedItem.sources) {
          setSources(typedItem.sources)
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, sources: typedItem.sources })
          setMessageData(newMap)
        }
        if (typedItem.type === 'follow_up_questions' && typedItem.questions) {
          setFollowUpQuestions(typedItem.questions)
          const newMap = new Map(messageData)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, { ...existingData, followUpQuestions: typedItem.questions })
          setMessageData(newMap)
        }
      })
      
      lastDataLength.current = data.length
    }
  }, [data, messageData])

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/fireplexity/check-env')
        const data = await response.json()
        
        if (data.hasFirecrawlKey) {
          setHasApiKey(true)
        } else {
          const storedKey = localStorage.getItem('firecrawl-api-key')
          if (storedKey) {
            setFirecrawlApiKey(storedKey)
            setHasApiKey(true)
          }
        }
      } catch (error) {
        console.error('Error checking environment:', error)
      } finally {
        setIsCheckingEnv(false)
      }
    }
    
    checkApiKey()
  }, [])

  const handleApiKeySubmit = () => {
    if (firecrawlApiKey.trim()) {
      localStorage.setItem('firecrawl-api-key', firecrawlApiKey)
      setHasApiKey(true)
      setShowApiKeyModal(false)
      toast.success('API key saved successfully!')
      
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
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    if (!hasApiKey) {
      setPendingQuery(input)
      setShowApiKeyModal(true)
      return
    }
    
    setHasSearched(true)
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    handleSubmit(e)
  }
  
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!hasApiKey) {
      setPendingQuery(input)
      setShowApiKeyModal(true)
      e.preventDefault()
      return
    }
    
    if (messages.length > 0 && sources.length > 0) {
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
    
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    handleSubmit(e)
  }

  const isChatActive = hasSearched || messages.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-1 mt-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
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

      <div className={`px-4 sm:px-6 lg:px-8 pt-2 pb-4 transition-all duration-500 ${isChatActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-[2.5rem] lg:text-[3.8rem] text-[#36322F] dark:text-white font-semibold tracking-tight leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="relative px-1 pb-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500 inline-flex justify-center items-center">
              Fireplexity
            </span>
            <span className="block leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:400ms] [animation-fill-mode:forwards]">
              Search &amp; Scrape
            </span>
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:600ms] [animation-fill-mode:forwards]">
            AI-powered web search with instant results and follow-up questions
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-full">
          {!isChatActive ? (
            <SearchComponent 
              handleSubmit={handleSearch}
              input={input}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
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
      
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
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
              placeholder="Enter your Firecrawl API key"
              value={firecrawlApiKey}
              onChange={(e) => setFirecrawlApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleApiKeySubmit()
                }
              }}
              className="h-12"
            />
            <Button onClick={handleApiKeySubmit} variant="orange" className="w-full">
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
