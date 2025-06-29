'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { SUBSCRIPTION_TIERS } from '@/lib/polar'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  
  const userData = useQuery(api.users.getUserByWorkosId, 
    user ? { workosId: user.id } : 'skip'
  )
  
  const createUser = useMutation(api.users.createUser)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && userData === null && !isCreatingUser) {
      setIsCreatingUser(true)
      createUser({
        workosId: user.id,
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      }).finally(() => {
        setIsCreatingUser(false)
      })
    }
  }, [user, userData, createUser, isCreatingUser])

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: 'pro' }),
      })
      
      const data = await response.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Please sign in to continue
          </h1>
          <Button asChild variant="orange">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentTier = userData?.subscriptionTier || 'free'
  const isProUser = currentTier === 'pro' && userData?.subscriptionStatus === 'active'
  const searchesUsed = userData?.searchesUsedToday || 0
  const searchLimit = isProUser ? -1 : SUBSCRIPTION_TIERS.FREE.searches_per_day
  const canSearch = isProUser || searchesUsed < searchLimit

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-1 mt-2 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <Image 
              src="/firecrawl-logo-with-fire.png" 
              alt="Firecrawl Logo" 
              width={113} 
              height={24}
              className="w-[113px] h-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user.firstName || user.email}
            </span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your searches and subscription
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quick Search</span>
                    <Button asChild variant="orange">
                      <Link href="/search">Start Searching</Link>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Get instant AI-powered answers from the web
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Ready to search? Click the button above to get started.
                    </p>
                    {!canSearch && (
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        You've reached your daily search limit. Upgrade to Pro for unlimited searches.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your search history and usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No recent searches yet</p>
                    <p className="text-sm mt-2">Start searching to see your activity here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Searches Today</span>
                        <span>{searchesUsed}{searchLimit > 0 ? ` / ${searchLimit}` : ''}</span>
                      </div>
                      {searchLimit > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((searchesUsed / searchLimit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Plan</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isProUser 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isProUser && (
                <Card className="border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-600 dark:text-orange-400">
                      Upgrade to Pro
                    </CardTitle>
                    <CardDescription>
                      Unlock unlimited searches and advanced features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {SUBSCRIPTION_TIERS.PRO.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${SUBSCRIPTION_TIERS.PRO.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <Button onClick={handleUpgrade} variant="orange" className="w-full">
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isProUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">
                      Pro Subscription
                    </CardTitle>
                    <CardDescription>
                      You have unlimited access to all features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {SUBSCRIPTION_TIERS.PRO.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
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
    </div>
  )
}
