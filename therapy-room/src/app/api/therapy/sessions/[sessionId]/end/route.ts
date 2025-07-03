import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) throw new Error('No token')
  
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
  return decoded.userId
}

export async function POST(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const userId = await getUserFromToken(request)
    const sessionId = params.sessionId
    
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

    const endTime = new Date()
    const startTime = new Date(session.startTime)
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    const updatedSession = await prisma.therapySession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        endTime: endTime,
        duration: duration
      }
    })

    return NextResponse.json({ session: updatedSession })

  } catch (error) {
    console.error('Session end error:', error)
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    )
  }
}