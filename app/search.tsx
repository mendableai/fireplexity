'use client'

import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchComponentProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export function SearchComponent({ handleSubmit, input, handleInputChange, isLoading }: SearchComponentProps) {
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pt-12">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex w-full min-w-0 px-3 py-1 h-14 rounded-xl border border-gray-200 dark:border-gray-700
          bg-white dark:bg-zinc-800
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          selection:bg-primary selection:text-primary-foreground
          focus-visible:border-orange-400 focus-visible:ring-orange-400/20 focus-visible:ring-2
          transition-colors"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          variant="orange"
          className="absolute right-2 rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  )
}