'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'
import type { Post } from '@/types'

interface SearchResult {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  readTime: number
  publishedAt: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const searchPosts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    searchPosts(debouncedQuery)
  }, [debouncedQuery, searchPosts])

  const handleSelect = (slug: string) => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    router.push(`/posts/${slug}`)
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts, tags, topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <Card className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto z-50 p-2">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.slug)}
                  className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Badge variant="outline">{result.category}</Badge>
                    {result.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <span>{result.readTime} min read</span>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-4 text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </Card>
      )}
    </div>
  )
}