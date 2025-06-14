import type { WorkflowNodeFilter, FilterCondition } from '@/app/services/node.filter.service';

export interface WorkflowState {
  workflowId: string | null;
}

export interface FilterStoreState {
  filters: WorkflowNodeFilter[];
  addFilter: (data: {
    workflowId: string;
    sourceNodeId: string;
    targetNodeId: string;
    label?: string;
    conditions: FilterCondition[][];
  }) => Promise<void>;
}
