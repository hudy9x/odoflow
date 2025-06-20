import { ApiResponse } from '@/app/services/api.service'

export interface WorkflowRunLog {
  id: string
  workflowRunId: string
  nodeId: string
  nodeType: string
  nodeName?: string
  status: string
  message?: string
  inputData?: Record<string, unknown>
  outputData?: Record<string, unknown>
  error?: Record<string, unknown> | null
  startedAt: string
  completedAt?: string
  durationMs?: number
}

export type WorkflowLogsResponse = ApiResponse<{
  logs: WorkflowRunLog[]
}>

export type WorkflowLatestLogResponse = ApiResponse<{
  logs: WorkflowRunLog[]
}>
