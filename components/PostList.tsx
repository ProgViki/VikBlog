'use client'

import { useState } from 'react'
import { PostCard } from './PostCard'
import { Button } from '@/components/ui/Button'
import type { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  title?: string
  showViewAll?: boolean
}

export function PostList({ posts, title = 'Latest Write-ups', showViewAll = true }: PostListProps) {
  const [visibleCount, setVisibleCount] = useState(3)
  const postsToShow = posts.slice(0, visibleCount)
  const hasMore = visibleCount < posts.length

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-4xl mb-3">✍️</div>
        <p className="text-sm">No posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          ✍️ {title}
          <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {posts.length} posts
          </span>
        </h2>
        {showViewAll && (
          <a href="/posts" className="text-sm text-primary hover:text-secondary font-medium transition-colors">
            view all →
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {postsToShow.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setVisibleCount(prev => prev + 3)}
          >
            Load more posts
          </Button>
        </div>
      )}
    </section>
  )
}