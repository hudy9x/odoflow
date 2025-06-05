export enum TriggerType {
  WEBHOOK = 'WEBHOOK',
  REGULAR = 'REGULAR',
  DAILY = 'DAILY'
}

export interface TriggerConfig {
  type: TriggerType;
  minutes?: number;
  time?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  startingNodeId?: string;
  triggerType?: TriggerType;
  triggerValue?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  workflowId: string;
  type: 'webhook' | 'http' | 'discord'; // Restricting to our current node types
  name: string;
  positionX: number;
  positionY: number;
  data: NodeData[keyof NodeData]; // Type-safe node configuration
  createdAt: string;
  updatedAt: string;
  outgoingEdges?: WorkflowEdge[];
  incomingEdges?: WorkflowEdge[];
}

export interface WorkflowEdge {
  id: string;
  workflowId: string;
  sourceId: string;
  targetId: string;
  createdAt: string;
  updatedAt: string;
  sourceNode?: WorkflowNode;
  targetNode?: WorkflowNode;
}

// Type for node data based on node type
export interface NodeData {
  webhook: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, string | number | boolean | null>;
  };
  http: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, string | number | boolean | null>;
  };
  discord: {
    webhookUrl: string;
    message: string;
    username?: string;
    avatarUrl?: string;
  };
}
