# TherapyRoom - AI-Powered Therapy Platform

A comprehensive virtual therapy room application where users can have AI-powered therapy sessions, track their mental wellness journey, and receive personalized follow-ups.

## Features

### 🧠 AI-Powered Therapy Sessions
- Real-time conversations with an empathetic AI therapist
- Contextual responses based on conversation history
- Support for hour-long therapy sessions with session timers
- Secure and private conversations

### 👤 User Management
- User registration and authentication
- Secure password hashing and JWT-based sessions
- User profiles with emergency contacts and preferences
- Session history and progress tracking

### 📱 Responsive Design
- Beautiful, modern UI that works on all devices
- Mobile-first responsive design with Tailwind CSS
- Accessible and intuitive user interface
- Real-time chat interface with typing indicators

### 📊 Session Management
- Create and manage therapy sessions
- Track session duration and status
- View conversation history
- Session summaries and mood tracking

### 📧 Follow-up System (Planned)
- Automated follow-up emails
- Customizable reminder frequencies
- Progress check-ins and wellness resources

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based session management
- **AI Integration**: OpenAI GPT-3.5-turbo (with fallback responses)
- **Email**: Nodemailer (for follow-ups)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd therapy-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env` file and update with your configurations:
   ```bash
   # Required
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-unique-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Optional - for AI conversations (without this, uses fallback responses)
   OPENAI_API_KEY="your-openai-api-key"

   # Optional - for email follow-ups
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Getting Started
1. **Register**: Create a new account with your email and password
2. **Login**: Sign in to access your dashboard
3. **Start Session**: Click "Start New Session" to begin a therapy conversation
4. **Chat**: Have a real-time conversation with the AI therapist
5. **Track Progress**: View your session history and progress in the dashboard

### Features Overview

#### Dashboard
- Overview of recent therapy sessions
- Quick actions to start new sessions
- Progress tracking and statistics
- User profile management

#### Therapy Room
- Real-time chat interface with AI therapist
- Session timer and status tracking
- Private and secure conversations
- Mobile-responsive design

#### AI Conversations
- Contextual responses based on your messages
- Support for various mental health topics
- Empathetic and professional responses
- Crisis detection and professional referrals

## Configuration

### OpenAI Integration
To enable advanced AI conversations:
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file as `OPENAI_API_KEY`
3. Restart the application

Without an OpenAI key, the app uses intelligent fallback responses.

### Email Follow-ups
To enable email follow-ups:
1. Configure email settings in `.env`
2. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
3. Update the email configuration variables

## Development

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Security Features

- 🔒 Password hashing with bcrypt
- 🍪 HTTP-only JWT cookies for authentication
- 🛡️ SQL injection protection with Prisma
- 🔐 Environment variable protection
- 📱 CSRF protection with SameSite cookies

## Privacy & Ethics

- All conversations are stored securely and privately
- No conversation data is shared with third parties
- Users have full control over their data
- The AI is designed to provide support, not replace professional therapy
- Crisis detection encourages professional help when needed

## Roadmap

- [ ] Video/voice chat capabilities
- [ ] Group therapy sessions
- [ ] Advanced analytics and mood tracking
- [ ] Integration with healthcare providers
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Crisis intervention features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. For urgent matters, contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

⚠️ **Important**: This application is designed to provide supportive conversations and mental wellness resources. It is not a substitute for professional mental health treatment. If you're experiencing a mental health crisis, please contact:

- **Emergency Services**: 911 (US) or your local emergency number
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- Your local mental health professional

---

Built with ❤️ for mental wellness and accessibility.
