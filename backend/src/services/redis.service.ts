import { Redis } from 'ioredis';
import type { Redis as RedisType } from 'ioredis';

/**
 * A Singleton class for Redis connections.
 * The class provides a publisher and subscriber instance.
 * Use the getInstance() method to get the instance of the class.
 * The constructor is private, so you can't create an instance of the class directly.
 * The class handles connection events and logs them to the console.
 * The class is used in the NodeService to publish messages to the Redis channel.
 * 
 * Example of how to use the class:
 * 
 * const redisService = RedisService.getInstance();
 * const message = 'Hello from NodeService!';
 * redisService.publish('node-service', message);
 * 
 * const subscriber = redisService.getSubscriber();
 * subscriber.subscribe('node-service', (err, count) => {
 *   if (err) {
 *     console.error('Error subscribing to Redis channel:', err);
 *   } else {
 *     console.log(`Subscribed to Redis channel. Received ${count} messages.`);
 *   }
 * });
 * 
 * subscriber.on('message', (channel, message) => {
 *   console.log(`Received message from Redis channel ${channel}: ${message}`);
 * });
 */

export class RedisService {
  private static instance: RedisService;
  private publisher: RedisType;
  private subscriber: RedisType;

  private constructor() {
    // Initialize Redis connections
    this.publisher = new Redis({ port: 6378 });
    this.subscriber = new Redis({ port: 6378 });

    // Handle connection events
    this.handleConnectionEvents(this.publisher, 'Publisher');
    this.handleConnectionEvents(this.subscriber, 'Subscriber');
  }

  private handleConnectionEvents(client: RedisType, type: string) {
    client.on('connect', () => {
      console.log(`Redis ${type} connected`);
    });

    client.on('error', (err: Error) => {
      console.error(`Redis ${type} Error:`, err);
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * Subscribe to a channel or multiple channels
   * @param channels - One or more channels to subscribe to
   * @param callback - Callback function to handle received messages
   */
  public async subscribe(channels: string | string[], callback: (channel: string, message: string) => void): Promise<void> {
    try {
      if (Array.isArray(channels)) {
        await this.subscriber.subscribe(...channels);
      } else {
        await this.subscriber.subscribe(channels);
      }

      this.subscriber.on('message', callback);
      console.log(`Subscribed to channel(s): ${Array.isArray(channels) ? channels.join(', ') : channels}`);
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to channels matching a pattern
   * @param pattern - Pattern to match channel names
   * @param callback - Callback function to handle received messages
   */
  public async psubscribe(pattern: string, callback: (pattern: string, channel: string, message: string) => void): Promise<void> {
    try {
      await this.subscriber.psubscribe(pattern);
      this.subscriber.on('pmessage', callback);
      console.log(`Subscribed to pattern: ${pattern}`);
    } catch (error) {
      console.error('Pattern subscription error:', error);
      throw error;
    }
  }

  /**
   * Publish a message to a channel
   * @param channel - Channel to publish to
   * @param message - Message to publish (will be stringified if object)
   */
  public async publish(channel: string, message: any): Promise<number> {
    try {
      const messageString = typeof message === 'object' ? JSON.stringify(message) : message;
      const result = await this.publisher.publish(channel, messageString);
      return result;
    } catch (error) {
      console.error('Publish error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from specific channels
   * @param channels - Channels to unsubscribe from
   */
  public async unsubscribe(...channels: string[]): Promise<void> {
    try {
      await this.subscriber.unsubscribe(...channels);
      console.log(`Unsubscribed from channel(s): ${channels.join(', ')}`);
    } catch (error) {
      console.error('Unsubscribe error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from pattern subscriptions
   * @param patterns - Patterns to unsubscribe from
   */
  public async punsubscribe(...patterns: string[]): Promise<void> {
    try {
      await this.subscriber.punsubscribe(...patterns);
      console.log(`Unsubscribed from pattern(s): ${patterns.join(', ')}`);
    } catch (error) {
      console.error('Pattern unsubscribe error:', error);
      throw error;
    }
  }

  /**
   * Close Redis connections
   */
  public async disconnect(): Promise<void> {
    await this.publisher.quit();
    await this.subscriber.quit();
    console.log('Redis connections closed');
  }
}

// Export a singleton instance
export const redisService = RedisService.getInstance();
