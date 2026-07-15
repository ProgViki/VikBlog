import { getPostBySlug, getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Clock, Eye, Heart, ArrowLeft, Share2, Bookmark } from 'lucide-react'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CommentSection } from '@/components/blog/CommentSection'
import { SubscriptionCard } from '@/components/shared/SubscriptionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { compileMDXContent, extractTOC } from '@/lib/posts/mdx'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const { content } = await compileMDXContent(post.content)
  const headings = extractTOC(post.content)

  return (
    <>
      <ReadingProgress />
      <article className="container-narrow py-8">
        {/* Back button */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          back to all posts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Post header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                <Badge variant="default">{post.category}</Badge>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.publishedAt!), 'd MMMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </header>

            {/* Post content */}
            <div className="prose-custom">
              {content}
            </div>

            {/* Post footer - tags */}
            <div className="border-t border-border mt-8 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag.replace(/\s/g, '-').toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="mt-12">
              <CommentSection postId={post.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <TableOfContents headings={headings} />
              )}
              <div className="mt-8">
                <SubscriptionCard compact />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}