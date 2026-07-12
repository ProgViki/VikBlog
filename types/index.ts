export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: number
  views: number
  tags: string[]
  category: 'distributed-systems' | 'devops' | 'analytics' | 'security' | 'cloud'
  content: string
  published: boolean
}

export interface Subscriber {
  email: string
  subscribedAt: Date
  verified: boolean
}

export interface AnalyticsEvent {
  event: 'page_view' | 'post_view' | 'subscribe' | 'click'
  path: string
  timestamp: Date
  metadata?: Record<string, unknown>
}