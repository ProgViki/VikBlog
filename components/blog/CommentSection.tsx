'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Send, Trash2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  children?: Comment[]
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)

  // Mock auth - replace with actual session
  useEffect(() => {
    // Check if user is signed in
    setIsSignedIn(false) // Replace with actual auth check
  }, [])

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      alert('Please sign in to comment')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content,
          parentId: replyTo,
        }),
      })

      if (response.ok) {
        setContent('')
        setReplyTo(null)
        loadComments()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={cn(
          'space-y-2',
          depth > 0 && 'ml-8 pl-4 border-l-2 border-muted'
        )}
      >
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center">
              {comment.author.name?.[0] || 'U'}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                {isSignedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        </Card>
        {comment.children && renderComments(comment.children, depth + 1)}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Comments ({comments.length})
      </h3>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder={replyTo ? 'Reply to comment...' : 'Add a comment...'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !content.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {replyTo ? 'Reply' : 'Post'}
          </Button>
        </form>
      ) : (
        <Card className="p-4 text-center text-muted-foreground">
          <p>Please sign in to join the conversation</p>
          <Button className="mt-2" size="sm">
            Sign In
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {renderComments(comments)}
      </div>
    </div>
  )
}