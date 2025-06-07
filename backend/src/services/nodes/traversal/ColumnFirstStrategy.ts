/**
 * Column First Strategy processes nodes column by column, top to bottom.
 * Example workflow with processing order (1->2->6->9->3->7->10->4->8->5):
 *
 * [1:Start]----[2:HTTP]----[5:Email]----[8:Slack]----[10:Discord]
 *                |
 *                |
 *             [3:API]----[6:Log]----[9:Notify]
 *                |
 *                |
 *             [4:SMS]----[7:DB]
 *
 * The strategy processes each column from top to bottom before moving right:
 * Column 1: Start (1)
 * Column 2: HTTP (2) -> API (6) -> SMS (9)
 * Column 3: Email (3) -> Log (7) -> DB (10)
 * Column 4: Slack (4) -> Notify (8)
 * Column 5: Discord (5)
 */

import type { ITraversalStrategy } from './types.js';
import type { WorkflowNode, WorkflowEdge } from '../../../generated/prisma/index.js';
import type { WorkflowTraversalService } from '../../node.traversal.service.js';
import { nodeOutput } from '../NodeOutput.js';

export class ColumnFirstStrategy implements ITraversalStrategy {
  async traverse(params: {
    startingNodeId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    workflowRunId: string,
    initialInputData: any,
    service: WorkflowTraversalService
  }): Promise<number> {
    const { startingNodeId, nodes, edges, workflowRunId, initialInputData, service } = params;
    await service.processStartingNode(startingNodeId, nodes, workflowRunId, initialInputData);

    let currentNodes = [startingNodeId];
    while (currentNodes.length > 0) {
      const nextLevelNodes: string[] = [];
      
      for (const nodeId of currentNodes) {
        const node = service.getNode(nodeId);
        if (!node) continue;

        const currentOutput = node.shortId ? nodeOutput.getOutput(node.shortId) : null;
        const nextNodes = await service.processNode(
          node,
          currentOutput,
          workflowRunId,
          edges,
          nodes
        );
        nextLevelNodes.push(...nextNodes);
      }
      
      currentNodes = nextLevelNodes;
    }

    return service.getProcessedNodesCount();
  }
}
