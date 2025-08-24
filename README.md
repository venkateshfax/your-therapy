# Strands Chat App

A modern, real-time chat application with AI tool integration powered by the Strands SDK, built with Python FastAPI backend and Next.js frontend.

## 🚀 Features

- **Real-time Chat**: WebSocket-based instant messaging with multiple users
- **AI Tool Integration**: Execute various AI tools through chat commands
- **Tool Analytics**: Comprehensive visualization of tool usage statistics
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Tool Commands**: Use `/tool` commands to execute AI tools with parameters
- **Real-time Updates**: Live updates for tool executions and chat messages
- **Connection Management**: Automatic reconnection with connection status indicators

## 🛠 Available Tools

- **Web Search**: Search the web for information
- **Code Analyzer**: Analyze code patterns and complexity
- **Data Processor**: Process and transform data in various formats
- **Text Summarizer**: Summarize long text content
- **Image Generator**: Generate images from text descriptions

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🏃‍♂️ Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Start the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your backend URL
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

### Chat Interface

1. Open `http://localhost:3000` in your browser
2. You'll be assigned a random username
3. Start chatting with other users in real-time
4. Use tool commands to execute AI tools

### Tool Commands

Execute tools using the `/tool` command format:

```
/tool web_search query=react hooks
/tool code_analyzer language=typescript
/tool data_processor format=json
/tool text_summarizer length=short
/tool image_generator style=modern
```

### Analytics Dashboard

- Switch to the "Tool Analytics" tab to view:
  - Total executions and available tools
  - Tool usage statistics with interactive charts
  - Execution time analysis
  - Recent tool execution history

## 🏗 Architecture

### Backend (FastAPI)

- **WebSocket Support**: Real-time communication
- **RESTful API**: Tool management and statistics
- **Mock Strands SDK**: Simulated AI tool execution
- **CORS Configuration**: Cross-origin support for frontend

### Frontend (Next.js)

- **React Components**: Modular and reusable UI components
- **WebSocket Hook**: Custom hook for WebSocket management
- **Tailwind CSS**: Modern, responsive styling
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualization

## 📁 Project Structure

```
/workspace/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                # Environment variables
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx   # Root layout
    │   │   ├── page.tsx     # Main page component
    │   │   └── globals.css  # Global styles
    │   ├── components/
    │   │   ├── ChatMessage.tsx      # Chat message component
    │   │   ├── ChatInput.tsx        # Chat input component
    │   │   └── ToolUsageChart.tsx   # Analytics charts
    │   ├── hooks/
    │   │   └── useWebSocket.ts      # WebSocket hook
    │   └── types/
    │       └── index.ts             # TypeScript definitions
    ├── package.json         # Node.js dependencies
    ├── tailwind.config.js   # Tailwind configuration
    └── .env.local          # Environment variables
```

## 🔧 Configuration

### Backend Environment Variables

```env
STRANDS_API_KEY=your_strands_api_key_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
DEBUG=True
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## 🚀 Deployment

### Backend Deployment

1. Set up a Python environment on your server
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables for production
4. Run with a production ASGI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to platforms like Vercel, Netlify, or your own server
3. Update environment variables for production URLs

## 🔌 API Endpoints

### REST API

- `GET /` - API information
- `GET /chat/history` - Get chat message history
- `GET /tools/available` - List available tools
- `GET /tools/stats` - Get tool usage statistics
- `GET /tools/usage` - Get tool usage history
- `POST /tools/{tool_name}/execute` - Execute a tool
- `GET /health` - Health check

### WebSocket

- `WS /ws/{user_id}` - Real-time chat and tool execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console logs for error messages
2. Ensure both backend and frontend are running
3. Verify environment variables are set correctly
4. Check that ports 3000 and 8000 are not in use by other applications

## 🔮 Future Enhancements

- User authentication and profiles
- Persistent chat history with database
- File upload and sharing
- Advanced tool parameter validation
- Real-time typing indicators
- Message threading and reactions
- Integration with actual Strands SDK
- Mobile-responsive design improvements