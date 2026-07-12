import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// In production: store in database with Supabase, PostgreSQL, etc.
// This is a mock implementation
const subscribers: string[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    // Check for duplicate
    if (subscribers.includes(email)) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      )
    }

    // Store subscriber
    subscribers.push(email)

    // In production:
    // - Send confirmation email
    // - Store in database with timestamp
    // - Trigger welcome automation

    // Log for analytics
    console.log(`[Analytics] New subscriber: ${email}`)

    return NextResponse.json(
      { message: 'Subscription successful', email },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Fixed: Access error.issues instead of error.errors
      const firstError = error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      )
    }

    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}