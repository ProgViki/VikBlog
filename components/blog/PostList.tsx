'use client'

import { PostCard } from './PostCard'
import type { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  title?: string
  showViewAll?: boolean
}

// ✅ Use named export
export function PostList({ 
  posts, 
  title = 'Latest Write-ups', 
  showViewAll = true 
}: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No posts yet. Check back soon!</p>
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
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}