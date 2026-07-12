'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SubscriptionCard() {
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

  return (
    <div className="card-sharp p-5 md:p-6 my-6">
      <form onSubmit={handleSubscribe}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-envelope text-vscode-blue" />
              never miss a post
              <span className="text-xs font-normal text-gray-400 ml-1">· subscribe</span>
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              weekly insights on system design, devops &amp; security.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-subscribe"
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 min-w-[120px]"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                <i className="fas fa-paper-plane text-xs" />
              )}
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm ${status === 'success' ? 'text-emerald' : 'text-red-500'}`}
          >
            {message}
          </motion.p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
          <span><i className="fas fa-check-circle text-emerald mr-1" /> no spam, unsubscribe anytime</span>
          <span><i className="fas fa-lock text-vscode-blue mr-1" /> 256-bit encrypted</span>
          <span><i className="fas fa-user-check text-emerald mr-1" /> 2k+ subscribers</span>
        </div>
      </form>
    </div>
  )
}