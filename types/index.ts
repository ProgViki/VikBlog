export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  publishedAt: string | null
  scheduledFor: string | null
  views: number
  likes: number
  readTime: number
  tags: string[]
  category: string
  authorId: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  comments?: Comment[]
  bookmarks?: Bookmark[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  parentId: string | null
  children?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Subscriber {
  id: string
  email: string
  name: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface AnalyticsEvent {
  id: string
  event: string
  path: string
  sessionId: string | null
  userId: string | null
  metadata: Record<string, any> | null
  timestamp: string
}

export interface Bookmark {
  id: string
  userId: string
  postId: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: 'USER' | 'ADMIN' | 'EDITOR'
  posts: Post[]
  comments: Comment[]
  bookmarks: Bookmark[]
  createdAt: string
  updatedAt: string
}