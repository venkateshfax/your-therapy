'use client';

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  WifiIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ToolUsageChart } from '@/components/ToolUsageChart';
import { ToolStats, ToolUsage, ChatMessage as ChatMessageType } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export default function Home() {
  const [user] = useState({
    id: uuidv4(),
    username: `User_${Math.random().toString(36).substr(2, 6)}`
  });
  
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics'>('chat');
  const [toolStats, setToolStats] = useState<ToolStats | null>(null);
  const [toolUsageHistory, setToolUsageHistory] = useState<ToolUsage[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    connectionError,
    messages,
    toolExecutions,
    sendMessage,
    reconnectAttempts,
    maxReconnectAttempts
  } = useWebSocket({
    url: WS_BASE_URL,
    userId: user.id,
    onMessage: (message) => {
      // Scroll to bottom when new message arrives
      setTimeout(scrollToBottom, 100);
    },
    onToolExecution: (toolUsage) => {
      if (toolUsage.status === 'success') {
        toast.success(`Tool "${toolUsage.tool_name}" executed successfully`);
        fetchToolStats(); // Refresh stats after tool execution
      } else if (toolUsage.status === 'error') {
        toast.error(`Tool "${toolUsage.tool_name}" execution failed`);
      }
    }
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchToolStats = async () => {
    setIsLoadingStats(true);
    try {
      const [statsResponse, usageResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tools/stats`),
        axios.get(`${API_BASE_URL}/tools/usage`)
      ]);
      
      setToolStats(statsResponse.data);
      setToolUsageHistory(usageResponse.data.usage_history || []);
    } catch (error) {
      console.error('Error fetching tool stats:', error);
      toast.error('Failed to fetch tool statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history`);
      // Chat history is now managed by WebSocket hook
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = (message: string) => {
    const success = sendMessage(message, user.username);
    if (!success) {
      toast.error('Failed to send message. Please check your connection.');
    }
  };

  useEffect(() => {
    fetchToolStats();
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update tool usage history with real-time data
  useEffect(() => {
    if (toolExecutions.length > 0) {
      setToolUsageHistory(prev => {
        const newHistory = [...prev];
        toolExecutions.forEach(execution => {
          const existingIndex = newHistory.findIndex(item => item.id === execution.id);
          if (existingIndex >= 0) {
            newHistory[existingIndex] = execution;
          } else {
            newHistory.push(execution);
          }
        });
        return newHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
    }
  }, [toolExecutions]);

  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isConnected ? (
        <>
          <WifiIcon className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Connected</span>
        </>
      ) : connectionError ? (
        <>
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <span className="text-red-600">
            Connection Error {reconnectAttempts > 0 && `(${reconnectAttempts}/${maxReconnectAttempts})`}
          </span>
        </>
      ) : (
        <>
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-yellow-600">Connecting...</span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Strands Chat App</h1>
              </div>
              <ConnectionStatus />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Chat</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>Tool Analytics</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
                style={{ height: 'calc(100% - 120px)' }}
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Welcome to Strands Chat!</p>
                      <p className="text-sm mt-2">
                        Start a conversation or try tool commands like <code className="bg-gray-100 px-2 py-1 rounded">/tool web_search query=hello</code>
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isOwn={message.user_id === user.id}
                    />
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-6">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={!isConnected}
                  placeholder={
                    isConnected
                      ? "Type your message or use /tool to execute tools..."
                      : "Connecting to chat..."
                  }
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ToolUsageChart
                toolStats={toolStats}
                recentUsage={toolUsageHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}