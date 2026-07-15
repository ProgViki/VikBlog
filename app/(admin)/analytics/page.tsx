import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import {
  Activity,
  Users,
  Eye,
  TrendingUp,
  MousePointerClick,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default async function AdminAnalyticsPage() {
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

  // Fetch analytics data
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    totalEvents,
    totalViews,
    totalSubscribers,
    totalPosts,
    eventsByDay,
    topPosts,
    topReferrers,
    eventsByType,
    subscriberGrowth,
    bounceRate,
    avgSessionDuration,
    deviceBreakdown,
    countryBreakdown,
    dailyActiveUsers,
    popularTags,
    engagementMetrics,
  ] = await Promise.all([
    // Total events
    prisma.analyticsEvent.count({
      where: {
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    
    // Total page views
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    
    // Total subscribers
    prisma.subscriber.count(),
    
    // Total published posts
    prisma.post.count({
      where: {
        status: 'PUBLISHED',
      },
    }),
    
    // Events by day (last 30 days)
    prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM analytics_events
      WHERE timestamp >= ${thirtyDaysAgo}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `,
    
    // Top posts by views
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        likes: true,
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        views: 'desc',
      },
      take: 10,
    }),
    
    // Top referrers
    prisma.$queryRaw`
      SELECT 
        metadata->>'referrer' as referrer,
        COUNT(*) as count
      FROM analytics_events
      WHERE event = 'page_view'
        AND timestamp >= ${thirtyDaysAgo}
        AND metadata->>'referrer' IS NOT NULL
      GROUP BY metadata->>'referrer'
      ORDER BY count DESC
      LIMIT 10
    `,
    
    // Events by type
    prisma.analyticsEvent.groupBy({
      by: ['event'],
      _count: true,
      where: {
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        _count: {
          event: 'desc',
        },
      },
    }),
    
    // Subscriber growth (last 30 days)
    prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM subscribers
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    
    // Bounce rate (sessions with only 1 page view)
    prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(DISTINCT CASE 
          WHEN event = 'page_view' 
          THEN session_id 
        END) as sessions_with_views
      FROM analytics_events
      WHERE timestamp >= ${thirtyDaysAgo}
    `,
    
    // Average session duration
    prisma.$queryRaw`
      WITH session_durations AS (
        SELECT 
          session_id,
          EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) as duration
        FROM analytics_events
        WHERE timestamp >= ${thirtyDaysAgo}
          AND session_id IS NOT NULL
        GROUP BY session_id
      )
      SELECT AVG(duration) as avg_duration
      FROM session_durations
    `,
    
    // Device breakdown
    prisma.$queryRaw`
      SELECT 
        COALESCE(metadata->>'device', 'unknown') as device,
        COUNT(*) as count
      FROM analytics_events
      WHERE event = 'page_view'
        AND timestamp >= ${thirtyDaysAgo}
      GROUP BY metadata->>'device'
      ORDER BY count DESC
    `,
    
    // Country breakdown
    prisma.$queryRaw`
      SELECT 
        COALESCE(metadata->>'country', 'unknown') as country,
        COUNT(*) as count
      FROM analytics_events
      WHERE event = 'page_view'
        AND timestamp >= ${thirtyDaysAgo}
        AND metadata->>'country' IS NOT NULL
      GROUP BY metadata->>'country'
      ORDER BY count DESC
      LIMIT 10
    `,
    
    // Daily active users (sessions with at least 1 event)
    prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(DISTINCT session_id) as count
      FROM analytics_events
      WHERE timestamp >= ${thirtyDaysAgo}
        AND session_id IS NOT NULL
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `,
    
    // Popular tags from posts
    prisma.$queryRaw`
      SELECT 
        unnest(tags) as tag,
        COUNT(*) as count
      FROM posts
      WHERE status = 'PUBLISHED'
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 10
    `,
    
    // Engagement metrics
    prisma.post.aggregate({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: thirtyDaysAgo,
        },
      },
      _avg: {
        views: true,
        likes: true,
        readTime: true,
      },
      _sum: {
        views: true,
        likes: true,
      },
      _count: {
        id: true,
      },
    }),
  ])

  // Calculate metrics
  const viewsChange = ((totalViews as any) / (totalEvents as any) * 100) || 0
  const subscriberChange = ((subscriberGrowth as any[]).length > 0 ? 
    ((subscriberGrowth as any[])[(subscriberGrowth as any[]).length - 1]?.count || 0) - 
    ((subscriberGrowth as any[])[0]?.count || 0) : 0)

  return (
    <div className="container-wide py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Last 30 days of activity</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated in real-time</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
          change={`${viewsChange > 0 ? '+' : ''}${viewsChange.toFixed(1)}%`}
          changeType={viewsChange > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Subscribers"
          value={totalSubscribers.toLocaleString()}
          icon={Users}
          change={`${subscriberChange > 0 ? '+' : ''}${subscriberChange}`}
          changeType={subscriberChange > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Published Posts"
          value={totalPosts.toString()}
          icon={Activity}
          change={`+${engagementMetrics._count.id || 0} this month`}
          changeType="up"
        />
        <StatCard
          title="Avg. Engagement"
          value={`${Math.round(engagementMetrics._avg.views || 0)}`}
          icon={TrendingUp}
          change={`${Math.round(engagementMetrics._avg.likes || 0)} likes avg`}
          changeType="up"
        />
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        eventsByDay={eventsByDay as any[]}
        eventsByType={eventsByType}
        topPosts={topPosts}
        topReferrers={topReferrers as any[]}
        subscriberGrowth={subscriberGrowth as any[]}
        deviceBreakdown={deviceBreakdown as any[]}
        countryBreakdown={countryBreakdown as any[]}
        dailyActiveUsers={dailyActiveUsers as any[]}
        popularTags={popularTags as any[]}
        bounceRate={bounceRate as any}
        avgSessionDuration={avgSessionDuration as any}
      />

      {/* Detailed Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 text-sm text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <a
                        href={`/posts/${post.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {post.title}
                      </a>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>{post.likes} likes</span>
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {((post.views / totalViews) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topReferrers.slice(0, 5).map((item: any) => (
                    <div key={item.referrer} className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[200px]">
                        {item.referrer || 'Direct'}
                      </span>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceBreakdown.map((item: any) => (
                    <div key={item.device} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{item.device}</span>
                      <span className="text-sm font-medium">
                        {((item.count / totalViews) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {countryBreakdown.map((item: any) => (
                    <div key={item.country} className="flex justify-between items-center">
                      <span className="text-sm">{item.country}</span>
                      <span className="text-sm font-medium">
                        {((item.count / totalViews) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="text-sm font-medium">
                    {bounceRate && bounceRate[0] 
                      ? ((1 - (bounceRate[0].sessions_with_views / bounceRate[0].total_sessions)) * 100).toFixed(1)
                      : '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Avg. Session Duration</span>
                  <span className="text-sm font-medium">
                    {avgSessionDuration && avgSessionDuration[0]?.avg_duration
                      ? `${Math.round(avgSessionDuration[0].avg_duration / 60)}m ${Math.round(avgSessionDuration[0].avg_duration % 60)}s`
                      : '0s'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Pages per Session</span>
                  <span className="text-sm font-medium">
                    {bounceRate && bounceRate[0]
                      ? (bounceRate[0].sessions_with_views / bounceRate[0].total_sessions).toFixed(1)
                      : '0'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 10).map((item: any) => (
                    <span
                      key={item.tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      #{item.tag} ({item.count})
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Total Views (30d)</span>
                  <span className="text-sm font-medium">
                    {engagementMetrics._sum.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Total Likes</span>
                  <span className="text-sm font-medium">
                    {engagementMetrics._sum.likes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Avg. Read Time</span>
                  <span className="text-sm font-medium">
                    {Math.round(engagementMetrics._avg.readTime || 0)} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string
  value: string
  icon: any
  change: string
  changeType: 'up' | 'down'
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {changeType === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm ${changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {change}
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}