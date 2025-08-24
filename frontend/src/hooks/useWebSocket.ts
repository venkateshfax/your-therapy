import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage, ToolUsage, WebSocketMessage } from '@/types';

interface UseWebSocketProps {
  url: string;
  userId: string;
  onMessage?: (message: ChatMessage) => void;
  onToolExecution?: (toolUsage: ToolUsage) => void;
}

export const useWebSocket = ({ url, userId, onMessage, onToolExecution }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toolExecutions, setToolExecutions] = useState<ToolUsage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = useCallback(() => {
    try {
      const wsUrl = `${url}/${userId}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', wsMessage);

          switch (wsMessage.type) {
            case 'chat_message':
              const chatMessage = wsMessage.data as ChatMessage;
              setMessages(prev => [...prev, chatMessage]);
              onMessage?.(chatMessage);
              break;
              
            case 'tool_execution_start':
            case 'tool_execution_complete':
            case 'tool_execution_error':
              const toolUsage = wsMessage.data as ToolUsage;
              setToolExecutions(prev => {
                const existingIndex = prev.findIndex(t => t.id === toolUsage.id);
                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = toolUsage;
                  return updated;
                } else {
                  return [...prev, toolUsage];
                }
              });
              onToolExecution?.(toolUsage);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Attempting to reconnect in ${delay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  }, [url, userId, onMessage, onToolExecution, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'Manual disconnect');
    }
    
    setIsConnected(false);
    setReconnectAttempts(0);
  }, []);

  const sendMessage = useCallback((message: string, username: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        message,
        username,
        timestamp: new Date().toISOString()
      };
      
      wsRef.current.send(JSON.stringify(messageData));
      return true;
    }
    
    console.error('WebSocket is not connected');
    return false;
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    messages,
    toolExecutions,
    sendMessage,
    connect,
    disconnect,
    reconnectAttempts,
    maxReconnectAttempts
  };
};