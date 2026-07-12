import { Post } from '@/types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
  title?: string
  showViewAll?: boolean
}

export default function PostList({ posts, title = 'Latest Write-ups', showViewAll = true }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <i className="fas fa-pen-fancy text-4xl mb-3 block" />
        <p className="text-sm">No posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-pen-fancy text-vscode-blue" /> {title}
          <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {posts.length} posts
          </span>
        </h2>
        {showViewAll && (
          <a href="#" className="text-sm text-vscode-blue hover:text-emerald font-medium transition-colors">
            view all <i className="fas fa-arrow-right ml-1" />
          </a>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length > 3 && (
        <div className="flex justify-center mt-6">
          <button className="text-sm text-gray-400 border border-gray-200 rounded-full px-5 py-1.5 hover:border-vscode-blue hover:text-vscode-blue transition-colors">
            <i className="fas fa-rotate-right mr-1" /> load more
          </button>
        </div>
      )}
    </section>
  )
}