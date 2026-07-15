'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Lock, UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface SubscriptionCardProps {
  compact?: boolean
}

export function SubscriptionCard({ compact = false }: SubscriptionCardProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('✅ Check your email to confirm subscription')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (compact) {
    return (
      <Card className="p-4">
        <form onSubmit={handleSubscribe}>
          <h4 className="text-sm font-semibold mb-2">Subscribe to the newsletter</h4>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <Button type="submit" size="sm" disabled={status === 'loading'}>
              {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go'}
            </Button>
          </div>
          {message && (
            <p className={cn(
              'text-xs mt-2',
              status === 'success' ? 'text-secondary' : 'text-destructive'
            )}>
              {message}
            </p>
          )}
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-5 md:p-6 my-6 border-2 border-primary/10">
      <form onSubmit={handleSubscribe}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              never miss a post
              <span className="text-xs font-normal text-muted-foreground ml-1">· subscribe</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              weekly insights on system design, devops &amp; security.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-64"
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <Button
              type="submit"
              className="min-w-[120px]"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-3 text-sm',
              status === 'success' ? 'text-secondary' : 'text-destructive'
            )}
          >
            {message}
          </motion.p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-secondary" />
            no spam, unsubscribe anytime
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-primary" />
            256-bit encrypted
          </span>
          <span className="flex items-center gap-1">
            <UserCheck className="h-3 w-3 text-secondary" />
            2k+ subscribers
          </span>
        </div>
      </form>
    </Card>
  )
}