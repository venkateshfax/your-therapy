import nodemailer from 'nodemailer'

interface EmailConfig {
  to: string
  subject: string
  text?: string
  html?: string
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send a single email
export async function sendEmail({ to, subject, text, html }: EmailConfig) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured - skipping email send')
      return { success: false, message: 'Email service not configured' }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Follow-up email templates
export const emailTemplates = {
  welcomeEmail: (name: string) => ({
    subject: 'Welcome to TherapyRoom - Your Mental Wellness Journey Begins',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to TherapyRoom</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your safe space for mental wellness</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining TherapyRoom. We're honored to be part of your mental wellness journey.
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">Getting Started:</h3>
            <ul style="color: #4B5563; line-height: 1.6;">
              <li>Start your first therapy session anytime</li>
              <li>Our AI therapist is available 24/7</li>
              <li>All conversations are private and secure</li>
              <li>Track your progress in your dashboard</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}/dashboard" 
               style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Start Your First Session
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Remember: TherapyRoom is designed to provide support and resources. If you're experiencing a mental health crisis, please contact emergency services or your local mental health professional.
          </p>
        </div>
      </div>
    `,
    text: `Welcome to TherapyRoom, ${name}! Your mental wellness journey begins here. Start your first therapy session anytime - our AI therapist is available 24/7. Visit ${process.env.APP_URL}/dashboard to get started.`
  }),

  checkInEmail: (name: string, daysSinceLastSession: number) => ({
    subject: 'How are you doing? - TherapyRoom Check-in',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">How are you feeling today?</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1F2937;">Hi ${name},</h2>
          
          <p style="color: #4B5563; line-height: 1.6;">
            It's been ${daysSinceLastSession} days since your last therapy session. We wanted to check in and see how you're doing.
          </p>
          
          <div style="background: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #4338CA; margin: 0; font-weight: 500;">
              💙 Taking care of your mental health is a continuous journey. Even a short conversation can make a difference.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start a Session
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Your conversations are always private and secure. We're here whenever you need support.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, it's been ${daysSinceLastSession} days since your last therapy session. How are you feeling? Start a new session at ${process.env.APP_URL}/dashboard`
  }),

  weeklyReflection: (name: string, sessionsThisWeek: number) => ({
    subject: 'Weekly Reflection - Your Mental Wellness Progress',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Weekly Reflection</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your mental wellness journey</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1F2937;">Hi ${name},</h2>
          
          <p style="color: #4B5563; line-height: 1.6;">
            This week you had ${sessionsThisWeek} therapy session${sessionsThisWeek !== 1 ? 's' : ''}. 
            ${sessionsThisWeek > 0 ? 'Great job taking care of your mental health!' : "We'd love to support you this week."}
          </p>
          
          <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0;">
            <h3 style="color: #065F46; margin-top: 0;">Reflection Questions:</h3>
            <ul style="color: #064E3B; line-height: 1.6;">
              <li>What positive changes have you noticed this week?</li>
              <li>What challenges did you face, and how did you handle them?</li>
              <li>What would you like to focus on in the coming week?</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}/dashboard" 
               style="background: #8B5CF6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Continue Your Journey
            </a>
          </div>
        </div>
      </div>
    `,
    text: `Hi ${name}, this week you had ${sessionsThisWeek} therapy sessions. Take a moment to reflect on your progress and continue your mental wellness journey at ${process.env.APP_URL}/dashboard`
  })
}

// Send follow-up emails based on user preferences
export async function sendFollowUpEmail(
  userEmail: string,
  userName: string,
  followUpType: 'welcome' | 'checkin' | 'weekly',
  additionalData?: any
) {
  let emailContent

  switch (followUpType) {
    case 'welcome':
      emailContent = emailTemplates.welcomeEmail(userName)
      break
    case 'checkin':
      emailContent = emailTemplates.checkInEmail(userName, additionalData?.daysSinceLastSession || 7)
      break
    case 'weekly':
      emailContent = emailTemplates.weeklyReflection(userName, additionalData?.sessionsThisWeek || 0)
      break
    default:
      throw new Error('Invalid follow-up type')
  }

  return await sendEmail({
    to: userEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  })
}