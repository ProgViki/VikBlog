import Link from 'next/link'
import Image from 'next/image'
// import { Calendar, Clock, Eye, Heart, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import type { Post } from '@/types'
import { FaCalendar, FaClock, FaHeart, FaEye } from 'react-icons/fa';
import { Tag } from 'lucide-react'
import { format, isValid } from 'date-fns'


interface PostCardProps {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {

    // ✅ Fixed: Format date safely
  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'Draft'
    const parsedDate = new Date(date)
    return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : 'Invalid date'
  }


  const categoryColors: Record<string, string> = {
    'DISTRIBUTED_SYSTEMS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'DEVOPS': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    'ANALYTICS': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'SECURITY': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'CLOUD': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  }

  if (variant === 'compact') {
    return (
      <Link href={`/posts/${post.slug}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {post.coverImage && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>
                    {/* {format(new Date(post.publishedAt!), 'MMM d')} */}
                      <span>{formatDate(post.publishedAt)}</span>
                  </span>
                  <span>·</span>
                  <span>{post.readTime || 5} min read</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          {post.coverImage && (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              <Badge className={categoryColors[post.category] || ''}>
                {post.category.replace('_', ' ')}
              </Badge>
            </div>
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </CardHeader>
          <CardFooter className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FaCalendar className="h-4 w-4" />
              <span>{format(new Date(post.publishedAt!), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="h-4 w-4" />
              <span>{post.readTime || 5} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <FaEye className="h-4 w-4" />
              <span>{(post.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart className="h-4 w-4" />
              <span>{(post.likes || 0).toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}