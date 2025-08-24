import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, CommandLineIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const TOOL_COMMANDS = [
  { name: 'web_search', description: 'Search the web for information', example: '/tool web_search query=react hooks' },
  { name: 'code_analyzer', description: 'Analyze code patterns', example: '/tool code_analyzer language=typescript' },
  { name: 'data_processor', description: 'Process and transform data', example: '/tool data_processor format=json' },
  { name: 'text_summarizer', description: 'Summarize long text content', example: '/tool text_summarizer length=short' },
  { name: 'image_generator', description: 'Generate images from text', example: '/tool image_generator style=modern' },
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message or use /tool to execute tools..."
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(TOOL_COMMANDS);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (message.startsWith('/tool')) {
      const searchTerm = message.replace('/tool', '').trim();
      const filtered = TOOL_COMMANDS.filter(cmd => 
        cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommands(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const selectCommand = (command: string) => {
    setMessage(command);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const adjustHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  return (
    <div className="relative">
      <AnimatePresence>
        {showSuggestions && filteredCommands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
          >
            <div className="p-2 border-b border-gray-100 text-sm text-gray-600 font-medium flex items-center gap-2">
              <CommandLineIcon className="w-4 h-4" />
              Tool Commands
            </div>
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.name}
                onClick={() => selectCommand(cmd.example)}
                className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <div className="font-medium text-sm text-gray-900">{cmd.name}</div>
                <div className="text-xs text-gray-600 mb-1">{cmd.description}</div>
                <div className="text-xs text-primary-600 font-mono bg-primary-50 px-2 py-1 rounded">
                  {cmd.example}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm leading-relaxed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {message.startsWith('/tool') && (
            <div className="absolute right-3 top-3 text-primary-500">
              <CommandLineIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-primary-500 text-white rounded-lg px-4 py-3 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[48px]"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
      
      {message.startsWith('/tool') && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <CommandLineIcon className="w-3 h-3" />
          Tool command mode - type to see available tools
        </div>
      )}
    </div>
  );
};