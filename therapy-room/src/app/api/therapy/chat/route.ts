import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) throw new Error('No token')
  
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
  return decoded.userId
}

// Simple AI response generator for demo purposes
// In production, this would connect to OpenAI or another AI service
function generateTherapyResponse(userMessage: string, conversationHistory: any[]): string {
  const responses = [
    "I hear what you're saying. Can you tell me more about how that makes you feel?",
    "Thank you for sharing that with me. It sounds like you're going through a challenging time. What do you think might help you feel better?",
    "That's a very valid feeling. Many people experience similar emotions. What strategies have you tried before to cope with this?",
    "I appreciate your openness. How long have you been feeling this way?",
    "It takes courage to talk about these things. What would you like to focus on in our conversation today?",
    "I understand this might be difficult to discuss. What kind of support do you feel you need right now?",
    "That sounds overwhelming. Let's take this one step at a time. What feels most manageable to address first?",
    "Your feelings are completely valid. How has this been affecting your daily life?",
    "Thank you for trusting me with this. What would it look like if this situation improved?",
    "I can sense this is important to you. What do you think would be the first small step toward feeling better?"
  ]

  // Simple keyword-based responses for a more contextual feel
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
    return "I can hear the sadness in your words. Depression can feel overwhelming, but you're not alone in this. What's been the hardest part of your day today?"
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('stress')) {
    return "Anxiety can be really challenging to manage. It sounds like you're carrying a lot of worry right now. What thoughts tend to come up when you're feeling most anxious?"
  }
  
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
    return "It sounds like you're feeling really frustrated. Anger often comes from feeling unheard or powerless. What's been triggering these feelings for you?"
  }
  
  if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
    return "Loneliness can be one of the most painful feelings. Thank you for sharing this with me. When do you feel most connected to others?"
  }
  
  if (lowerMessage.includes('work') || lowerMessage.includes('job')) {
    return "Work stress can really impact our overall wellbeing. What aspects of your work situation are causing you the most difficulty?"
  }
  
  if (lowerMessage.includes('relationship') || lowerMessage.includes('family') || lowerMessage.includes('friend')) {
    return "Relationships can be complex and challenging. It sounds like this is weighing on you. What would you like to see change in this relationship?"
  }
  
  // Return a random supportive response
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    await getUserFromToken(request) // Verify authentication
    const body = await request.json()
    const { message, conversationHistory } = body

    let aiResponse: string

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      // If OpenAI API key is configured, use it
      try {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })

        const messages = [
          {
            role: "system" as const,
            content: `You are a compassionate AI therapy companion. Your role is to:
            - Provide empathetic, non-judgmental support
            - Ask thoughtful questions to help users reflect
            - Validate their feelings and experiences
            - Suggest healthy coping strategies when appropriate
            - Maintain professional boundaries
            - Always recommend professional help for serious mental health concerns
            - Keep responses concise but meaningful (2-3 sentences max)
            
            Remember: You are not a replacement for professional therapy, but a supportive companion for mental wellness.`
          },
          ...conversationHistory.slice(-10).map((msg: any) => ({
            role: msg.isFromUser ? "user" as const : "assistant" as const,
            content: msg.content
          })),
          {
            role: "user" as const,
            content: message
          }
        ]

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
        })

        aiResponse = completion.choices[0].message.content || generateTherapyResponse(message, conversationHistory)
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        aiResponse = generateTherapyResponse(message, conversationHistory)
      }
    } else {
      // Use simple response generator if no OpenAI key
      aiResponse = generateTherapyResponse(message, conversationHistory)
    }

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}