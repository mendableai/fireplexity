'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { SearchComponent } from '../search'
import { ChatInterface } from '../chat-interface'
import { SearchResult } from '../types'
import { ConversationSidebar } from '@/components/conversation-sidebar'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface MessageData {
  sources: SearchResult[]
  followUpQuestions: string[]
  ticker?: string
}

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export default function SearchPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [convexUserId, setConvexUserId] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sources, setSources] = useState<SearchResult[]>([])
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [searchStatus, setSearchStatus] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const lastDataLength = useRef(0)
  const [messageData, setMessageData] = useState<Map<number, MessageData>>(new Map())
  const currentMessageIndex = useRef(0)
  const [currentTicker, setCurrentTicker] = useState<string | null>(null)
  
  // Convex mutations
  const createUser = useMutation(api.users.createUser)
  const getUserByWorkosId = useQuery(api.users.getUserByWorkosId, 
    user ? { workosId: user.id } : 'skip'
  )
  const createConversation = useMutation(api.conversations.createConversation)
  const addMessage = useMutation(api.conversations.addMessage)
  const currentConversation = useQuery(
    api.conversations.getConversation,
    currentConversationId ? { conversationId: currentConversationId as Id<"conversations"> } : 'skip'
  )
  const incrementSearchCount = useMutation(api.users.incrementSearchCount)
  const canUserSearch = useQuery(api.users.canUserSearch,
    convexUserId ? { userId: convexUserId as Id<"users"> } : 'skip'
  )

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          router.push('/api/auth/signin')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/api/auth/signin')
      }
    }
    
    checkAuth()
  }, [router])

  // Create or get Convex user
  useEffect(() => {
    const setupConvexUser = async () => {
      if (!user) return
      
      if (getUserByWorkosId === null) {
        // User doesn't exist in Convex, create them
        try {
          await createUser({
            workosId: user.id,
            email: user.email,
            name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
          })
        } catch (error) {
          console.error('Failed to create user in Convex:', error)
        }
      } else if (getUserByWorkosId) {
        // User exists, set their Convex ID
        setConvexUserId(getUserByWorkosId._id)
      }
    }
    
    setupConvexUser()
  }, [user, getUserByWorkosId, createUser])

  const { messages, input, handleInputChange, handleSubmit, isLoading, data, setMessages } = useChat({
    api: '/api/fireplexity/search',
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
      toast.error('Failed to search. Please try again.')
    },
    onFinish: async (message) => {
      setSearchStatus('')
      lastDataLength.current = 0
      
      // Save assistant message to Convex
      if (convexUserId && currentConversationId && message.role === 'assistant') {
        try {
          await addMessage({
            conversationId: currentConversationId as Id<"conversations">,
            userId: convexUserId as Id<"users">,
            role: 'assistant',
            content: message.content,
            sources: sources.length > 0 ? sources : undefined,
            followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
          })
        } catch (error) {
          console.error('Failed to save message:', error)
        }
      }
    }
  })

  // Parse streaming data
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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || !convexUserId) return
    
    // Check if user can search
    if (canUserSearch === false) {
      toast.error('You have reached your daily search limit. Please upgrade to Pro for unlimited searches.')
      return
    }
    
    setHasSearched(true)
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    
    // Increment search count
    try {
      await incrementSearchCount({ userId: convexUserId as Id<"users"> })
    } catch (error) {
      console.error('Failed to increment search count:', error)
    }
    
    // Create new conversation if needed
    if (!currentConversationId) {
      try {
        const conversationId = await createConversation({
          userId: convexUserId as Id<"users">,
          title: input.trim().substring(0, 50),
          firstMessage: input.trim(),
        })
        setCurrentConversationId(conversationId)
      } catch (error) {
        console.error('Failed to create conversation:', error)
        toast.error('Failed to save conversation')
      }
    } else {
      // Save user message to existing conversation
      try {
        await addMessage({
          conversationId: currentConversationId as Id<"conversations">,
          userId: convexUserId as Id<"users">,
          role: 'user',
          content: input.trim(),
        })
      } catch (error) {
        console.error('Failed to save message:', error)
      }
    }
    
    handleSubmit(e)
  }
  
  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!convexUserId || !currentConversationId) return
    
    // Check if user can search
    if (canUserSearch === false) {
      toast.error('You have reached your daily search limit. Please upgrade to Pro for unlimited searches.')
      return
    }
    
    // Save current state for last message
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
    
    // Increment search count
    try {
      await incrementSearchCount({ userId: convexUserId as Id<"users"> })
    } catch (error) {
      console.error('Failed to increment search count:', error)
    }
    
    // Save user message to Convex
    try {
      await addMessage({
        conversationId: currentConversationId as Id<"conversations">,
        userId: convexUserId as Id<"users">,
        role: 'user',
        content: input.trim(),
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
    
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    handleSubmit(e)
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    // Load conversation messages
    if (currentConversation) {
      const chatMessages = currentConversation.messages.map(msg => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
      }))
      setMessages(chatMessages)
      setHasSearched(true)
      
      // Restore message data
      const newMessageData = new Map<number, MessageData>()
      currentConversation.messages.forEach((msg, index) => {
        if (msg.role === 'assistant' && (msg.sources || msg.followUpQuestions)) {
          newMessageData.set(Math.floor(index / 2), {
            sources: msg.sources || [],
            followUpQuestions: msg.followUpQuestions || [],
          })
        }
      })
      setMessageData(newMessageData)
    }
  }

  const handleNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([])
    setHasSearched(false)
    setSources([])
    setFollowUpQuestions([])
    setCurrentTicker(null)
    setMessageData(new Map())
  }

  const isChatActive = hasSearched || messages.length > 0

  if (!user || !convexUserId) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-full -mt-16"> {/* Compensate for navigation height */}
      <ConversationSidebar
        userId={convexUserId}
        currentConversationId={currentConversationId || undefined}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      
      <div className="flex-1 flex flex-col pt-16"> {/* Add padding for navigation */}
        <div className={`px-4 sm:px-6 lg:px-8 pt-8 pb-4 transition-all duration-500 ${isChatActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-[2rem] lg:text-[3rem] text-[#36322F] dark:text-white font-semibold tracking-tight leading-[1.1]">
              <span className="relative px-1 pb-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500">
                AI-Powered Search
              </span>
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              Search the web with AI and save your conversations
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full">
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
      </div>
    </div>
  )
}