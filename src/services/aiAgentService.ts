// src/services/aiAgentService.ts

import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  tool: string;
  args: any;
  result: any;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
    toolCalls?: ToolCall[];
    iterations?: number;
  };
  error?: string;
  timestamp: Date;
}

class AIAgentService {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private messageCallbacks: Array<(response: ChatResponse) => void> = [];
  private statusCallbacks: Array<(status: string) => void> = [];
  private readonly AGENT_URL = 'http://localhost:3002';

  constructor() {
    this.connect();
  }

  /**
   * Connect to the AI agent WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('Already connected to AI agent');
      return;
    }

    console.log('Connecting to AI agent at:', this.AGENT_URL);

    this.socket = io(this.AGENT_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to AI agent');
      this.connected = true;
      this.notifyStatus('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from AI agent');
      this.connected = false;
      this.notifyStatus('disconnected');
    });

    this.socket.on('status', (data: any) => {
      console.log('📊 Agent status:', data);
      this.notifyStatus('ready');
    });

    this.socket.on('chat_response', (data: ChatResponse) => {
      console.log('🤖 Agent response:', data);
      this.messageCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('error', (data: any) => {
      console.error('❌ Agent error:', data);
      this.messageCallbacks.forEach(callback => callback({
        success: false,
        error: data.data?.error || 'Unknown error',
        timestamp: new Date(data.timestamp),
      }));
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.notifyStatus('error');
    });
  }

  /**
   * Send a chat message to the AI agent
   */
  async sendMessage(message: string): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to AI agent. Please wait for connection.');
    }

    console.log('💬 Sending message to agent:', message);
    this.socket.emit('chat_message', { message });
  }

  /**
   * Send a chat message via HTTP (fallback)
   */
  async sendMessageHTTP(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.AGENT_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...data,
        timestamp: new Date(data.timestamp),
      };
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }

  /**
   * Register a callback for chat responses
   */
  onMessage(callback: (response: ChatResponse) => void): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Register a callback for status updates
   */
  onStatus(callback: (status: string) => void): void {
    this.statusCallbacks.push(callback);
  }

  /**
   * Notify all status callbacks
   */
  private notifyStatus(status: string): void {
    this.statusCallbacks.forEach(callback => callback(status));
  }

  /**
   * Clear conversation history
   */
  async clearHistory(): Promise<void> {
    if (this.socket?.connected) {
      this.socket.emit('clear_history');
    } else {
      await fetch(`${this.AGENT_URL}/api/clear-history`, {
        method: 'POST',
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && !!this.socket?.connected;
  }

  /**
   * Disconnect from the agent
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Check server health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.AGENT_URL}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiAgentService = new AIAgentService();