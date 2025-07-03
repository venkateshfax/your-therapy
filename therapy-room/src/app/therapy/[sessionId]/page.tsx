'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  isFromUser: boolean
  timestamp: string
}

interface Session {
  id: string
  title: string
  status: string
  startTime: string
  duration: number
  mood?: string
  goals?: string
}

export default function TherapyRoom() {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  useEffect(() => {
    if (sessionId) {
      fetchSession()
      fetchMessages()
    }
  }, [sessionId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isSessionActive])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/therapy/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
        setIsSessionActive(data.session.status === 'IN_PROGRESS')
        
        if (data.session.status === 'IN_PROGRESS') {
          const startTime = new Date(data.session.startTime).getTime()
          const currentTime = new Date().getTime()
          setSessionDuration(Math.floor((currentTime - startTime) / 1000))
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/therapy/sessions/${sessionId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startSession = async () => {
    try {
      const response = await fetch(`/api/therapy/sessions/${sessionId}/start`, {
        method: 'POST'
      })
      if (response.ok) {
        setIsSessionActive(true)
        setSessionDuration(0)
        // Send initial AI greeting
        await sendInitialGreeting()
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const sendInitialGreeting = async () => {
    const greeting = {
      content: "Hello! I'm your AI therapy companion. I'm here to provide a safe, non-judgmental space where you can share your thoughts and feelings. How are you feeling today?",
      isFromUser: false,
      timestamp: new Date().toISOString()
    }
    
    try {
      await fetch(`/api/therapy/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(greeting)
      })
      fetchMessages()
    } catch (error) {
      console.error('Failed to send greeting:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const userMessage = newMessage.trim()
    setNewMessage('')

    try {
      // Send user message
      await fetch(`/api/therapy/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage,
          isFromUser: true,
          timestamp: new Date().toISOString()
        })
      })

      // Get AI response
      const response = await fetch(`/api/therapy/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          conversationHistory: messages
        })
      })

      if (response.ok) {
        const data = await response.json()
        await fetch(`/api/therapy/sessions/${sessionId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: data.response,
            isFromUser: false,
            timestamp: new Date().toISOString()
          })
        })
      }

      fetchMessages()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const endSession = async () => {
    try {
      const response = await fetch(`/api/therapy/sessions/${sessionId}/end`, {
        method: 'POST'
      })
      if (response.ok) {
        setIsSessionActive(false)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading therapy room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {session?.title || 'Therapy Session'}
              </h1>
              {isSessionActive && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {formatDuration(sessionDuration)}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {!isSessionActive && session?.status === 'SCHEDULED' && (
                <button
                  onClick={startSession}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Start Session
                </button>
              )}
              {isSessionActive && (
                <button
                  onClick={endSession}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  End Session
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isSessionActive && session?.status === 'SCHEDULED' && (
            <div className="text-center py-8">
              <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Your Safe Space</h3>
                <p className="text-gray-600 mb-6">
                  You're about to enter a private, secure conversation with your AI therapy companion. 
                  Take your time, and remember that this is your space to share and heal.
                </p>
                <button
                  onClick={startSession}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Begin Session
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isFromUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isFromUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {isSessionActive && (
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your conversation is private and secure. Press Enter to send.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}