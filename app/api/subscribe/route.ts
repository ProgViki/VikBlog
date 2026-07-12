import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Fixed: Use non-deprecated email validation
const subscribeSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
})

// In production: store in database with Supabase, PostgreSQL, etc.
const subscribers: string[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use safeParse for better error handling
    const result = subscribeSchema.safeParse(body)
    
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Check for duplicate
    if (subscribers.includes(email)) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      )
    }

    // Store subscriber
    subscribers.push(email)

    // Log for analytics
    console.log(`[Analytics] New subscriber: ${email}`)

    return NextResponse.json(
      { message: 'Subscription successful', email },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}