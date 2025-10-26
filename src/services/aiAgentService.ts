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
  private connectionAttempted: boolean = false;

  constructor() {
    // Don't auto-connect in constructor, let components initiate connection
    console.log('AIAgentService initialized');
  }

  /**
   * Connect to the AI agent WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('Already connected to AI agent');
      // Notify that we're already connected
      this.notifyStatus('connected');
      return;
    }

    if (this.connectionAttempted && this.socket) {
      console.log('Connection already attempted, socket exists');
      return;
    }

    console.log('Connecting to AI agent at:', this.AGENT_URL);
    this.connectionAttempted = true;
    
    // Notify that we're attempting to connect
    this.notifyStatus('connecting');

    // Use the exact same configuration as the working HTML version
    this.socket = io('http://localhost:3002', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    console.log('Socket.IO instance created with HTML config, attempting connection...');

    this.setupListeners();
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to AI agent successfully');
      this.connected = true;
      this.notifyStatus('connected');
      
      // Test the connection with a simple ping
      setTimeout(() => {
        console.log('🏓 Testing connection with ping...');
        this.socket?.emit('ping', { timestamp: Date.now() });
      }, 1000);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Disconnected from AI agent. Reason:', reason);
      this.connected = false;
      this.notifyStatus('disconnected');
    });

    this.socket.on('status', (data: any) => {
      console.log('📊 Agent status:', data);
      console.log('📊 Status data structure:', JSON.stringify(data, null, 2));
      this.notifyStatus('ready');
    });

    this.socket.on('chat_response', (data: any) => {
      console.log('🤖 Agent response raw:', data);
      console.log('🔍 Response structure:', JSON.stringify(data, null, 2));
      
      try {
        // Handle different response formats more robustly
        let transformedResponse: ChatResponse;
        
        // Check if this is the nested format: { type: 'chat_response', data: { success: true, data: {...} } }
        if (data.data && typeof data.data === 'object') {
          if (data.data.success) {
            // Handle nested successful response
            const responseData = data.data.data || {};
            transformedResponse = {
              success: true,
              data: {
                response: responseData.response || 'No response text',
                toolCalls: responseData.toolCalls || [],
                iterations: responseData.iterations
              },
              timestamp: new Date(data.timestamp || data.data.timestamp || Date.now())
            };
          } else {
            // Handle nested error response  
            transformedResponse = {
              success: false,
              error: data.data.error || 'Unknown error occurred',
              timestamp: new Date(data.timestamp || data.data.timestamp || Date.now())
            };
          }
        }
        // Check if this is direct format: { success: true, data: {...} }
        else if (data.success !== undefined) {
          transformedResponse = {
            success: data.success,
            data: data.success ? {
              response: data.data?.response || data.response || 'No response text',
              toolCalls: data.data?.toolCalls || data.toolCalls || [],
              iterations: data.data?.iterations || data.iterations
            } : undefined,
            error: !data.success ? (data.error || 'Unknown error occurred') : undefined,
            timestamp: new Date(data.timestamp || Date.now())
          };
        }
        // Fallback: treat as simple response
        else {
          transformedResponse = {
            success: true,
            data: {
              response: data.message || data.response || JSON.stringify(data),
              toolCalls: data.toolCalls || [],
              iterations: data.iterations
            },
            timestamp: new Date(data.timestamp || Date.now())
          };
        }
        
        console.log('📤 Transformed response:', transformedResponse);
        this.messageCallbacks.forEach(callback => {
          try {
            callback(transformedResponse);
          } catch (callbackError) {
            console.error('❌ Error in message callback:', callbackError);
          }
        });
      } catch (error) {
        console.error('❌ Error processing chat response:', error);
        console.error('❌ Raw data that caused error:', data);
        const errorResponse: ChatResponse = {
          success: false,
          error: `Failed to process server response: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        };
        this.messageCallbacks.forEach(callback => {
          try {
            callback(errorResponse);
          } catch (callbackError) {
            console.error('❌ Error in error callback:', callbackError);
          }
        });
      }
    });

    this.socket.on('error', (data: any) => {
      console.error('❌ Agent error:', data);
      this.messageCallbacks.forEach(callback => callback({
        success: false,
        error: data.data?.error || data.error || 'Unknown error',
        timestamp: new Date(data.timestamp || Date.now()),
      }));
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ WebSocket connection error:', error.message);
      console.error('Error details:', error);
      this.connected = false;
      this.notifyStatus('error');
    });

    this.socket.on('reconnect_error', (error: Error) => {
      console.error('❌ WebSocket reconnection error:', error.message);
      this.connected = false;
      this.notifyStatus('error');
    });

    this.socket.on('reconnecting', (attemptNumber: number) => {
      console.log(`🔄 WebSocket reconnecting attempt ${attemptNumber}...`);
      this.notifyStatus('connecting');
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
      this.connected = true;
      this.notifyStatus('connected');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed - max attempts reached');
      this.connected = false;
      this.notifyStatus('error');
    });

    this.socket.on('pong', (data: any) => {
      console.log('🏓 Received pong from server:', data);
    });

    // Add generic event listener to catch any other events for debugging
    this.socket.onAny((eventName: string, ...args: any[]) => {
      if (!['connect', 'disconnect', 'chat_response', 'error', 'status', 'pong'].includes(eventName)) {
        console.log(`🔍 Unknown event received: ${eventName}`, args);
      }
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
    console.log('📊 Socket state - connected:', this.socket?.connected, 'id:', this.socket?.id);
    
    // Ensure we have a clean string without any extra characters
    const cleanMessage = typeof message === 'string' ? message.trim() : String(message).trim();
    
    const messagePayload = { message: cleanMessage };
    console.log('📤 Message payload being sent:', JSON.stringify(messagePayload));
    
    // Add a small delay to ensure the server is ready (like HTML version timing)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use exact same format as working HTML version
    this.socket.emit('chat_message', messagePayload);
    
    console.log('✅ Message emitted successfully');
  }

  /**
   * Notify agent of wallet connection (like HTML version)
   */
  notifyWalletConnection(address: string): void {
    if (this.socket?.connected) {
      console.log('📝 Notifying agent of wallet connection:', address);
      this.socket.emit('wallet_connect', { address });
    }
  }

  /**
   * Send a simple test message to verify the connection
   */
  async sendTestMessage(): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Not connected to AI agent.');
    }

    console.log('🧪 Sending test message...');
    this.socket.emit('chat_message', { message: 'hello' });
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
    
    // Immediately notify the callback of current status
    if (this.connected && this.socket?.connected) {
      callback('connected');
    } else if (this.socket) {
      callback('connecting');
    }
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
    const socketConnected = !!this.socket?.connected;
    console.log('Connection status check - internal connected:', this.connected, 'socket connected:', socketConnected);
    return this.connected && socketConnected;
  }

  /**
   * Get detailed connection status for debugging
   */
  getConnectionStatus(): { connected: boolean; socketConnected: boolean; socketExists: boolean } {
    return {
      connected: this.connected,
      socketConnected: !!this.socket?.connected,
      socketExists: !!this.socket
    };
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
      console.log('Checking health at:', `${this.AGENT_URL}/health`);
      const response = await fetch(`${this.AGENT_URL}/health`);
      console.log('Health check response status:', response.status);
      
      if (!response.ok) {
        console.error('Health check failed with status:', response.status);
        return false;
      }
      
      const data = await response.json();
      console.log('Health check data:', data);
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed with error:', error);
      return false;
    }
  }

  /**
   * Test basic connectivity
   */
  async testConnectivity(): Promise<{ canReach: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.AGENT_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      return { canReach: response.ok };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Connectivity test failed:', errorMessage);
      return { canReach: false, error: errorMessage };
    }
  }

  /**
   * Test different message formats to debug the backend issue
   */
  testMessageFormats(message: string): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected for testing');
      return;
    }

    console.log('🧪 Testing different message formats...');
    
    // Format 1: Original format
    console.log('🧪 Format 1: { message: string }');
    this.socket.emit('test_message_1', { message });
    
    // Format 2: Direct string
    console.log('🧪 Format 2: Direct string');
    this.socket.emit('test_message_2', message);
    
    // Format 3: With additional metadata
    console.log('🧪 Format 3: With metadata');
    this.socket.emit('test_message_3', { 
      message, 
      timestamp: Date.now(),
      source: 'react-app' 
    });

    // Format 4: Try the exact working format from HTML
    console.log('🧪 Format 4: HTML format');
    this.socket.emit('chat_message', { message: message });
  }

  /**
   * Send a simple test ping
   */
  sendTestPing(): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected for ping test');
      return;
    }
    
    console.log('🏓 Sending test ping to server...');
    this.socket.emit('ping', { timestamp: Date.now(), test: true });
  }

  /**
   * Send message using exact HTML approach
   */
  sendMessageHTML(message: string): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('🌐 Sending message using HTML approach...');
    console.log('📝 Message:', message);
    console.log('🔗 Socket connected:', this.socket.connected);
    console.log('🆔 Socket ID:', this.socket.id);
    
    // Exactly as in the HTML version
    this.socket.emit('chat_message', {
      message: message
    });
  }
}

// Export singleton instance
export const aiAgentService = new AIAgentService();