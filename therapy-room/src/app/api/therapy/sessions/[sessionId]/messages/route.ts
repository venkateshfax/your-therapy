import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) throw new Error('No token')
  
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
  return decoded.userId
}

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const userId = await getUserFromToken(request)
    const sessionId = params.sessionId
    
    // Verify session belongs to user
    const session = await prisma.therapySession.findFirst({
      where: { 
        id: sessionId,
        userId 
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    })

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const userId = await getUserFromToken(request)
    const sessionId = params.sessionId
    const body = await request.json()
    
    // Verify session belongs to user
    const session = await prisma.therapySession.findFirst({
      where: { 
        id: sessionId,
        userId 
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const message = await prisma.message.create({
      data: {
        sessionId,
        content: body.content,
        isFromUser: body.isFromUser,
        timestamp: new Date(body.timestamp)
      }
    })

    return NextResponse.json({ message }, { status: 201 })

  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}