import { getPosts } from '@/lib/posts'
import { PostList } from '@/components/blog/PostList'
import { SearchBar } from '@/components/blog/SearchBar'

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="container-narrow py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <SearchBar />
      </div>
      <PostList posts={posts} showViewAll={false} />
    </div>
  )
}