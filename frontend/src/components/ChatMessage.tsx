import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn = false }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatToolResult = (result: any) => {
    if (typeof result === 'object') {
      return JSON.stringify(result, null, 2);
    }
    return String(result);
  };

  const getMessageIcon = () => {
    switch (message.message_type) {
      case 'system':
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            S
          </div>
        );
      case 'tool':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
            🔧
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {message.username.charAt(0).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'flex gap-3 mb-4',
        isOwn && message.message_type === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {(!isOwn || message.message_type !== 'user') && (
        <div className="flex-shrink-0">
          {getMessageIcon()}
        </div>
      )}
      
      <div 
        className={clsx(
          'max-w-[70%] rounded-lg p-4 shadow-sm',
          {
            'bg-primary-500 text-white': isOwn && message.message_type === 'user',
            'bg-white text-gray-900 border border-gray-200': !isOwn || message.message_type !== 'user',
            'bg-green-50 border-green-200 border-l-4 border-l-green-500': message.message_type === 'tool',
            'bg-gray-50 border-gray-200': message.message_type === 'system'
          }
        )}
      >
        {(!isOwn || message.message_type !== 'user') && (
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {message.username}
            </span>
            <span className="text-xs opacity-70">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}
        
        <div className="whitespace-pre-wrap break-words">
          {message.message_type === 'tool' ? (
            <div>
              <div className="font-medium mb-2 text-green-800">
                Tool Execution Result
              </div>
              <pre className="text-sm bg-white p-3 rounded border overflow-x-auto text-gray-800">
                {formatToolResult(message.message)}
              </pre>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.message}</p>
          )}
        </div>
        
        {(isOwn && message.message_type === 'user') && (
          <div className="text-xs opacity-70 mt-2 text-right">
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>

      {(isOwn && message.message_type === 'user') && (
        <div className="flex-shrink-0">
          {getMessageIcon()}
        </div>
      )}
    </motion.div>
  );
};