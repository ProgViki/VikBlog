import { Post } from '@/types'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

// Sample posts data (in production, read from markdown files)
const samplePosts: Post[] = [
  {
    slug: 'zero-trust-mesh',
    title: 'Zero-trust mesh: beyond the service mesh hype',
    excerpt: 'Deep dive into identity-aware proxies, mTLS, and policy-as-code. Production patterns for multi-cluster secure communication.',
    date: '2026-07-12',
    readTime: 14,
    views: 1800,
    tags: ['distributed systems', 'security', 'service mesh'],
    category: 'distributed-systems',
    content: '## Introduction\n\nZero-trust networking has become...',
    published: true,
  },
  {
    slug: 'gitops-at-scale',
    title: 'GitOps at scale: ArgoCD + Crossplane control plane',
    excerpt: 'Declarative infrastructure, drift detection, and progressive delivery. Real-world multi-cluster management with AWS and Azure.',
    date: '2026-07-08',
    readTime: 11,
    views: 2100,
    tags: ['devops', 'cloud', 'gitops'],
    category: 'devops',
    content: '## The GitOps evolution...',
    published: true,
  },
  {
    slug: 'streaming-analytics-lakehouse',
    title: 'Streaming analytics with Flink & Iceberg: lakehouse patterns',
    excerpt: 'Real-time event processing, schema evolution, and analytical views. Cost-optimized architectures for petabyte scale.',
    date: '2026-07-04',
    readTime: 16,
    views: 1200,
    tags: ['analytics', 'data', 'streaming'],
    category: 'analytics',
    content: '## Real-time analytics at scale...',
    published: true,
  },
  {
    slug: 'kubernetes-security-hardening',
    title: 'Kubernetes security hardening: from cluster to pod',
    excerpt: 'Comprehensive security controls for production K8s: RBAC, network policies, pod security, and runtime protection.',
    date: '2026-06-28',
    readTime: 18,
    views: 3200,
    tags: ['security', 'kubernetes', 'devops'],
    category: 'security',
    content: '## Defense in depth for K8s...',
    published: true,
  },
  {
    slug: 'observability-with-opentelemetry',
    title: 'Observability with OpenTelemetry: beyond metrics and logs',
    excerpt: 'Implementing distributed tracing, metrics, and logs with a unified collector. Cost-effective observability at scale.',
    date: '2026-06-22',
    readTime: 13,
    views: 950,
    tags: ['analytics', 'devops', 'observability'],
    category: 'analytics',
    content: '## The three pillars...',
    published: true,
  },
]

export function getPosts(): Post[] {
  // In production: read from filesystem
  // const files = fs.readdirSync(postsDirectory)
  // return files.map((file) => {
  //   const slug = file.replace(/\.md$/, '')
  //   const fullPath = path.join(postsDirectory, file)
  //   const fileContents = fs.readFileSync(fullPath, 'utf8')
  //   const { data, content } = matter(fileContents)
  //   return { slug, ...data, content } as Post
  // })
  return samplePosts.filter(p => p.published)
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug)
}

export function getRecentPosts(limit: number = 5): Post[] {
  return getPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getPostsByCategory(category: Post['category']): Post[] {
  return getPosts().filter(p => p.category === category)
}