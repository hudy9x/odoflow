import type { WorkflowNode, WorkflowEdge } from '../../../generated/prisma/index.js';
import { WorkflowTraversalService } from '../../node.traversal.service.js';

export enum TraversalStrategy {
  COLUMN_FIRST = 'COLUMN_FIRST',
  ROW_FIRST = 'ROW_FIRST'
}

export interface ITraversalStrategy {
  traverse(params: {
    startingNodeId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    workflowRunId: string,
    initialInputData: any,
    service: WorkflowTraversalService
  }): Promise<number>;
}
