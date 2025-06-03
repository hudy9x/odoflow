import { WorkflowNode, WorkflowEdge } from '@/types/workflow'
import { post, del, ApiResponse, put, get } from './api.service'

type NodeApiResponse = ApiResponse<{
  node: WorkflowNode
  edge?: WorkflowEdge
}>

type DeleteNodeApiResponse = ApiResponse<{
  message: string
}>

interface CreateNodeParams {
  workflowId: string
  type: string
  name: string
  positionX: number
  positionY: number
  data: Record<string, unknown>
  edge?: {
    sourceId?: string
    targetId?: string
  }
}

export const createNode = async (params: CreateNodeParams): Promise<NodeApiResponse> => {
  return post('/node', params as unknown as Record<string, unknown>)
}

export const deleteNode = async (nodeId: string): Promise<DeleteNodeApiResponse> => {
  return del(`/node/${nodeId}`)
}

type CreateEdgeParams = {
  workflowId: string
  sourceId: string
  targetId: string
}

type EdgeApiResponse = ApiResponse<{
  edge: WorkflowEdge
}>

export const createEdge = async (params: CreateEdgeParams): Promise<EdgeApiResponse> => {
  return post('/node/edge', params)
}

type UpdateNodePositionParams = {
  workflowId: string
  nodeId: string
  positionX: number
  positionY: number
}

type UpdateNodePositionResponse = ApiResponse<{
  node: WorkflowNode
}>

export const updateNodePosition = async (params: UpdateNodePositionParams): Promise<UpdateNodePositionResponse> => {
  return put('/node/position', params)
}

type NodeConfig = Record<string, string | number | boolean | null | undefined>

type UpdateNodeConfigParams = {
  nodeId: string
  [key: string]: string | number | boolean | null | undefined
}

type NodeConfigResponse = ApiResponse<{
  config: NodeConfig
}>

export const updateNodeConfig = async (params: UpdateNodeConfigParams): Promise<NodeConfigResponse> => {
  const { nodeId, ...data } = params
  return put(`/node/${nodeId}/config`, data)
}

export const getNodeConfig = async (nodeId: string): Promise<NodeConfigResponse> => {
  return get(`/node/${nodeId}/config`)
}
