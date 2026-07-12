import { getPostBySlug, getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SubscriptionCard from '@/components/SubscriptionCard'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="container-narrow py-8">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-vscode-blue transition-colors mb-6">
            <i className="fas fa-arrow-left" /> back to all posts
          </Link>

          {/* Post header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
              <span className="tag tag-vscode">{post.category}</span>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag tag-gray">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <span><i className="far fa-calendar-alt mr-1" /> {format(new Date(post.date), 'd MMMM yyyy')}</span>
              <span><i className="far fa-clock mr-1" /> {post.readTime} min read</span>
              <span><i className="fas fa-chart-simple mr-1" /> {post.views.toLocaleString()} views</span>
            </div>
          </header>

          {/* Post content */}
          <div className="prose prose-gray max-w-none prose-headings:text-gray-800 prose-a:text-vscode-blue hover:prose-a:text-emerald prose-code:text-vscode-blue prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-gray-900 prose-pre:text-gray-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Post footer - tags */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="tag tag-gray">#{tag.replace(/\s/g, '-').toLowerCase()}</span>
              ))}
            </div>
          </div>

          {/* Subscription after post */}
          <SubscriptionCard />
        </article>
      </main>
      <Footer />
    </>
  )
}