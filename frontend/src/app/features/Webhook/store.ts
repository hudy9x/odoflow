import { create } from 'zustand';
import { listWebhooks, createWebhook, extractWebhooks, type Webhook } from '@/app/services/webhook';

interface WebhookState {
  webhooks: Webhook[];
  isLoading: boolean;
  error: string | null;
  loadWebhooks: () => Promise<void>;
  createWebhook: (name: string) => Promise<boolean>;
}

export const useWebhookStore = create<WebhookState>((set, get) => ({
  webhooks: [],
  isLoading: false,
  error: null,

  loadWebhooks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await listWebhooks();
      const webhookList = extractWebhooks(response);
      set({ webhooks: webhookList });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load webhooks';
      set({ error: message });
      console.error('Failed to load webhooks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createWebhook: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createWebhook(name);
      if (response.success && response.webhook) {
        // Reload webhooks to get the updated list
        await get().loadWebhooks();
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create webhook';
      set({ error: message });
      console.error('Failed to create webhook:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
