'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/blog/SearchBar'
import { PostList } from '@/components/blog/PostList'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Post } from '@/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function search() {
      if (!query) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [query])

  return (
    <div className="container-narrow py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">
            {query ? `Found ${results.length} results for "${query}"` : 'Search for posts'}
          </p>
          <PostList posts={results} showViewAll={false} />
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-narrow py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}