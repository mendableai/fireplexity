import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { SUBSCRIPTION_TIERS } from '@/lib/polar'

export default function LandingPage() {
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
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="orange">
              <Link href="/api/auth/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-[2.5rem] lg:text-[4.5rem] text-[#36322F] dark:text-white font-semibold tracking-tight leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="relative px-1 pb-1 text-transparent bg-clip-text bg-gradient-to-tr from-red-600 to-yellow-500 inline-flex justify-center items-center">
              Fireplexity
            </span>
            <span className="block leading-[1.1] opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:400ms] [animation-fill-mode:forwards]">
              AI-Powered Search
            </span>
          </h1>
          <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:600ms] [animation-fill-mode:forwards]">
            Get instant, intelligent answers from the web with real-time citations and follow-up questions. 
            Search smarter, not harder.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up [animation-duration:500ms] [animation-delay:800ms] [animation-fill-mode:forwards]">
            <Button asChild size="lg" variant="orange" className="text-lg px-8 py-3">
              <Link href="/api/auth/signin">Start Searching Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              Why Choose Fireplexity?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of web search with AI-powered intelligence and real-time data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant answers with real-time web scraping and AI processing in seconds.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verified Sources</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every answer comes with real citations and source links for complete transparency.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Follow-ups</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get intelligent follow-up questions to dive deeper into any topic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {SUBSCRIPTION_TIERS.FREE.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ${SUBSCRIPTION_TIERS.FREE.price}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_TIERS.FREE.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/api/auth/signin">Get Started Free</Link>
              </Button>
            </div>
            
            <div className="border-2 border-orange-500 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {SUBSCRIPTION_TIERS.PRO.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ${SUBSCRIPTION_TIERS.PRO.price}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_TIERS.PRO.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="orange" className="w-full">
                <Link href="/api/auth/signin">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 mt-auto border-t border-gray-200 dark:border-gray-700">
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
            {' • '}
            <a 
              href="https://github.com/mendableai/fireplexity" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
            >
              Open Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
