'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Home, Search, CreditCard, LogOut, Menu, X } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const navItems = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/dashboard#subscription', label: 'Subscription', icon: CreditCard },
  ] : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-1 mt-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Image 
              src="/firecrawl-logo-with-fire.png" 
              alt="Firecrawl Logo" 
              width={113} 
              height={24}
              className="w-[113px] h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.firstName || user.email?.split('@')[0]}
                </span>
                <Button asChild variant="ghost" size="sm">
                  <a href="/api/auth/signout" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <a href="/api/auth/signin">Sign In</a>
                </Button>
                <Button asChild variant="orange">
                  <a href="/api/auth/signin">Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {user.firstName || user.email?.split('@')[0]}
                    </div>
                    <a
                      href="/api/auth/signout"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-3">
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <a href="/api/auth/signin">Sign In</a>
                    </Button>
                    <Button asChild variant="orange" size="sm" className="w-full">
                      <a href="/api/auth/signin">Get Started</a>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}