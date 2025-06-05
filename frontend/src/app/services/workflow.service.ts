import { Workflow } from '@/types/workflow'
import { get, post, put, ApiResponse } from './api.service'
import { TriggerType } from '../features/WorkflowConfig/WorkflowTrigger/types'

type WorkflowApiResponse = ApiResponse<{ workflow: Workflow }>
type WorkflowsApiResponse = ApiResponse<{ workflows: Workflow[] }>

export const createWorkflow = async (): Promise<WorkflowApiResponse> => {
  return post('/workflow', {
    name: 'Untitled Workflow'
  })
}

export const getWorkflows = async (): Promise<WorkflowsApiResponse> => {
  return get('/workflow')
}

export const getWorkflow = async (id: string): Promise<WorkflowApiResponse> => {
  return get(`/workflow/${id}`)
}

export const updateWorkflow = async (id: string, data: Partial<Workflow>): Promise<WorkflowApiResponse> => {
  return put(`/workflow/${id}`, data)
}

// TriggerType is now imported from types.ts

export const toggleWorkflowActive = async (params: {
  workflowId: string;
  active: boolean;
}): Promise<WorkflowApiResponse> => {
  const { workflowId, active } = params;
  return put(`/workflow/${workflowId}/active`, { active });
};

export const updateWorkflowStartingNode = async (params: {
  workflowId: string;
  startingNodeId: string | null;
  triggerType?: TriggerType;
  triggerValue?: string | null;
}): Promise<WorkflowApiResponse> => {
  const { workflowId, startingNodeId, triggerType, triggerValue } = params;
  return put(`/workflow/${workflowId}/starting-node`, { 
    startingNodeId,
    triggerType,
    triggerValue
  })
}
