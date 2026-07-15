import { prisma } from '@/lib/db/prisma'
import type { Post } from '@/types'

export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  return posts.map((post) => ({
    ...post,
    comments: post._count.comments,
  })) as unknown as Post[]
}

export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })

  return posts as unknown as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where: {
          parentId: null,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!post) return null

  return post as unknown as Post
}

export async function incrementPostViews(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: {
      views: {
        increment: 1,
      },
    },
  })
}