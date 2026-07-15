import { getRecentPosts } from '@/lib/posts'
import { PostList } from '@/components/blog/PostList'
import { SubscriptionCard } from '@/components/shared/SubscriptionCard'
import { HeroSection } from '@/components/shared/HeroSection'

export default async function HomePage() {
  const posts = await getRecentPosts(5)

  return (
    <div className="container-narrow py-8">
      <HeroSection />
      <SubscriptionCard />
      <PostList posts={posts} />
    </div>
  )
}