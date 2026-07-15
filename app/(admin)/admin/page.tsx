import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

export default async function AdminPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/')
  }

  const [posts, subscribers, analytics] = await Promise.all([
    prisma.post.findMany({
      where: user.role === 'EDITOR' ? { authorId: user.id } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            comments: true,
            bookmarks: true,
          },
        },
      },
    }),
    prisma.subscriber.count(),
    prisma.analyticsEvent.groupBy({
      by: ['event'],
      _count: true,
      where: {
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])

  const totalViews = await prisma.analyticsEvent.count({
    where: {
      event: 'page_view',
      timestamp: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  })

  return (
    <div className="container-wide py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">
            Welcome, {user.name || user.email}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Posts</div>
          <div className="text-2xl font-bold">{posts.length}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Subscribers</div>
          <div className="text-2xl font-bold">{subscribers}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Page Views (30d)</div>
          <div className="text-2xl font-bold">{totalViews}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Comments</div>
          <div className="text-2xl font-bold">
            {posts.reduce((acc, p) => acc + p._count.comments, 0)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">All Posts</h2>
                <a href="/admin/posts/new">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                    New Post
                  </button>
                </a>
              </div>
            </div>
            <div className="divide-y">
              {posts.map((post) => (
                <div key={post.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.status}</span>
                      <span>{post.views} views</span>
                      <span>{post._count.comments} comments</span>
                      <span>{post._count.bookmarks} bookmarks</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/admin/posts/${post.id}/edit`}>
                      <button className="text-sm text-primary hover:underline">Edit</button>
                    </a>
                    <button className="text-sm text-destructive hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Event Breakdown (30 days)</h2>
            <div className="space-y-2">
              {analytics.map((item) => (
                <div key={item.event} className="flex justify-between items-center">
                  <span className="text-sm">{item.event}</span>
                  <span className="text-sm font-medium">{item._count}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscribers">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Subscriber Management</h2>
            <p className="text-muted-foreground">
              Total subscribers: {subscribers}
            </p>
            <button className="mt-4 text-sm text-primary hover:underline">
              Export CSV
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}