import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) throw new Error('No token')
  
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
  return decoded.userId
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    
    const sessions = await prisma.therapySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({ sessions })

  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const body = await request.json()
    
    const session = await prisma.therapySession.create({
      data: {
        userId,
        title: body.title || 'Therapy Session',
        startTime: new Date(body.startTime),
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json({ session }, { status: 201 })

  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}