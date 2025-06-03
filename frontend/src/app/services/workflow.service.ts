import { Workflow } from '@/types/workflow'
import { get, post, put, ApiResponse } from './api.service'

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
