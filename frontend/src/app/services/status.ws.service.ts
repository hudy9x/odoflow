/**
 * WebSocket service for real-time status updates
 */

export interface StatusMessage {
  status: string;
  tick: number;
  channel: string;
  message: string;
}

export class StatusWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly wsUrl: string;

  constructor() {
    // Use relative WebSocket URL which will be handled by Next.js
    // const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3003/ws';
  }

  connect(onMessage: (msg: StatusMessage) => void): void {
    if (this.ws) {
      console.warn('WebSocket connection already exists');
      return;
    }

    this.ws = new WebSocket(this.wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const data: StatusMessage = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.ws = null;
      
      // Try to reconnect after 3 seconds
      this.reconnectTimeout = setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.connect(onMessage);
      }, 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export a singleton instance
export const statusWsService = new StatusWebSocketService();
