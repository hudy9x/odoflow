/**
 * Row First Strategy processes nodes row by row, left to right.
 * Example workflow with processing order (1->2->3->4->5->6->7->8->9->10):
 *
 * [1:Start]----[2:HTTP]----[3:Email]----[4:Slack]----[5:Discord]
 *      |          
 *      |         
 *      |-------[6:API]----[7:Log]----[8:Notify]
 *      |          
 *      |          
 *      |-------[9:SMS]----[10:DB]
 *
 * The strategy processes each row from left to right before moving down:
 * Row 1: Start (1) -> HTTP (2) -> Email (3) -> Slack (4) -> Discord (5)
 * Row 2: API (6) -> Log (7) -> Notify (8)
 * Row 3: SMS (9) -> DB (10)
 */

import type { ITraversalStrategy } from './types.js';
import type { WorkflowNode, WorkflowEdge } from '../../../generated/prisma/index.js';
import type { WorkflowTraversalService } from '../../node.traversal.service.js';

export class RowFirstStrategy implements ITraversalStrategy {

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

    // console.log('nodes', nodes)
    // console.log('edges', edges)

    const recursiveLooop = async (sourceId: string) => {
      const foundEdges = edges.filter(edge => edge.sourceId === sourceId)
      if (foundEdges.length === 0) return

      for (const edge of foundEdges) {
        const targetNode = nodes.find(node => node.id === edge.targetId)
        if (!targetNode) continue

        const logId = service.createNodeRunLog(targetNode.id, nodes, workflowRunId, null);

        const result = await service.runNode({
          node: targetNode,
          workflowRunId
        });
        
        // Fire and forget - don't await
        service.updateNodeLog(logId, result)

        if (!result.success) {
          console.log(`Failed to run node ${targetNode.id}: ${result.error}`)
        }

        await recursiveLooop(edge.targetId)
      }
    }

    await recursiveLooop(startingNodeId)

    return service.getProcessedNodesCount();
  }
}
