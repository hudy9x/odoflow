import { get } from './api.service'
import type { WorkflowLogsResponse, WorkflowLatestLogResponse } from '@/app/types/workflow-logs'

export const getWorkflowLogs = async (workflowId: string): Promise<WorkflowLogsResponse> => {
  return get(`/workflow-logs/${workflowId}`)
}

export const getLatestWorkflowLog = async (workflowId: string): Promise<WorkflowLatestLogResponse> => {
  return get(`/workflow-logs/${workflowId}/latest`)
}
