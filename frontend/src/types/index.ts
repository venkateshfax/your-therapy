export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  message_type: 'user' | 'system' | 'tool';
}

export interface ToolUsage {
  id: string;
  tool_name: string;
  parameters: Record<string, any>;
  result: Record<string, any>;
  timestamp: string;
  execution_time: number;
  status: 'success' | 'error' | 'pending';
}

export interface Tool {
  description: string;
  usage_count: number;
}

export interface ToolStats {
  tools: Record<string, Tool>;
  total_executions: number;
  last_updated: string;
}

export interface WebSocketMessage {
  type: 'chat_message' | 'tool_execution_start' | 'tool_execution_complete' | 'tool_execution_error';
  data: ChatMessage | ToolUsage;
}

export interface User {
  id: string;
  username: string;
  isConnected: boolean;
}