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

    return NextResponse.json({ session })

  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}