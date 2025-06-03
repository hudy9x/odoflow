import { post, get, del, ApiResponse } from './api.service'

export interface Webhook {
  id: string
  name: string
  url: string
  userId: string
  createdAt: string
  updatedAt: string
}

type WebhookApiResponse = ApiResponse<{
  webhook: Webhook
}>

type WebhooksApiResponse = ApiResponse<{
  webhooks: Webhook[]
}>

export async function createWebhook(name: string): Promise<WebhookApiResponse> {
  return post('/webhooks', { name })
}

export async function listWebhooks(): Promise<WebhooksApiResponse> {
  return get('/webhooks')
}

export async function deleteWebhook(id: string): Promise<ApiResponse<{ message: string }>> {
  return del(`/webhooks/${id}`)
}

// Helper function to extract webhooks from API response
export function extractWebhooks(response: WebhooksApiResponse): Webhook[] {
  if (!response.success || !response.webhooks) {
    return []
  }
  return response.webhooks
}
