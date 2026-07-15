import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'

const subscribeSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      )
    }

    const { email, name } = result.data

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.verified) {
        return NextResponse.json(
          { error: 'Already subscribed' },
          { status: 400 }
        )
      }
      
      // Resend verification
      const verificationToken = crypto.randomBytes(32).toString('hex')
      await prisma.subscriber.update({
        where: { email },
        data: {
          verificationToken,
          updatedAt: new Date(),
        },
      })

      // In production: Send verification email here
      console.log(`[Email] Verification token for ${email}: ${verificationToken}`)

      return NextResponse.json({
        message: 'Verification email resent. Please check your inbox.',
      })
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const unsubscribeToken = crypto.randomBytes(32).toString('hex')

    await prisma.subscriber.create({
      data: {
        email,
        name,
        verificationToken,
        unsubscribeToken,
        verified: false,
      },
    })

    // In production: Send verification email here
    console.log(`[Email] New subscriber: ${email}`)
    console.log(`[Email] Verification token: ${verificationToken}`)

    return NextResponse.json({
      message: 'Subscription successful! Please check your email to verify.',
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Verification token required' },
      { status: 400 }
    )
  }

  try {
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        verificationToken: token,
        verified: false,
      },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    })

    return NextResponse.json({
      message: 'Email verified successfully! You are now subscribed.',
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}