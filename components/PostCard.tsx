import Link from 'next/link'
import { Post } from '@/types'
import { format } from 'date-fns'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const categoryColors: Record<Post['category'], string> = {
    'distributed-systems': 'tag-vscode',
    'devops': 'tag-emerald',
    'analytics': 'tag-vscode',
    'security': 'tag-emerald',
    'cloud': 'tag-gray',
  }

  return (
    <article className="border-b border-gray-100 py-5 last:border-0 group">
      <Link href={`/posts/${post.slug}`}>
        <div className="flex flex-col md:flex-row md:items-start gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`tag ${categoryColors[post.category]}`}>
                  <i className="fas fa-tag mr-1" /> {tag}
                </span>
              ))}
              <span className="text-gray-400 text-xs">
                <i className="far fa-calendar-alt mr-1" /> {format(new Date(post.date), 'd MMM yyyy')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 leading-snug group-hover:text-vscode-blue transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span><i className="far fa-clock mr-1" /> {post.readTime} min read</span>
              <span><i className="fas fa-chart-simple mr-1" /> {post.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1">
                <i className="fas fa-code text-vscode-blue text-[10px]" /> 
                {post.category}
              </span>
            </div>
          </div>
          <div className="flex md:flex-col items-start md:items-end gap-1 text-xs text-gray-400">
            {post.tags.slice(3, 5).map((tag) => (
              <span key={tag} className="bg-gray-50 px-2 py-0.5 rounded border border-gray-200/60">
                #{tag.replace(/\s/g, '-').toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}