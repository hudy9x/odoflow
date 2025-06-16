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
import type { WorkflowNode, WorkflowEdge, WorkflowNodeFilter } from '../../../generated/prisma/index.js';

type WorkflowNodeWithFilter = WorkflowNode & { filter?: WorkflowNodeFilter | null };
import type { WorkflowTraversalService } from '../../node.traversal.service.js';
import { RedisService } from '../../../services/redis.service.js';
import { filterProcessor } from '../filter/FilterProcessor.js';
import { nodeOutput } from '../NodeOutput.js';

const redisService = RedisService.getInstance();

export class RowFirstStrategy implements ITraversalStrategy {

  async traverse(params: {
    startingNodeId: string,
    nodes: WorkflowNodeWithFilter[],
    edges: WorkflowEdge[],
    workflowRunId: string,
    initialInputData: any,
    service: WorkflowTraversalService
  }): Promise<number | { statusCode: number; headers: Record<string, string>; body: unknown }> {
    const { startingNodeId, nodes, edges, workflowRunId, initialInputData, service } = params;
    await service.processStartingNode(startingNodeId, nodes, workflowRunId, initialInputData);

    // console.log('nodes', nodes)
    // console.log('edges', edges)

    let stop = false;
    let responseData:any = null
    
    const recursiveLooop = async (sourceId: string) => {
      if (stop) return;

      const foundEdges = edges.filter(edge => edge.sourceId === sourceId)
      if (foundEdges.length === 0) return

      for (const edge of foundEdges) {
        const targetNode = nodes.find(node => node.id === edge.targetId)
        if (!targetNode) continue

        // Process filter conditions if they exist
        const isMatchCondition = this.matchCondition(targetNode)
        
        this.notifyConditionResult(targetNode, isMatchCondition, edge.id);
        if (!isMatchCondition) {
          continue;
        }

        const logId = service.createNodeRunLog(targetNode.id, nodes, workflowRunId, null);

        const result = await service.runNode({
          node: targetNode,
          workflowRunId
        });

        if (result.success && targetNode.shortId) {
          nodeOutput.setOutput(targetNode.shortId, result.output);
        }
        
        // Fire and forget - don't await
        service.updateNodeLog(logId, result)

        if (!result.success) {
          console.log(`Failed to run node ${targetNode.id} (${targetNode.shortId}): ${result.error}`)
        } 
        
        // response data when node's type is reponse
        if (targetNode.type === 'response' && result.output && result.output.customResponse) {
          stop = true;
          responseData = result.output;
          return;
        }

        await recursiveLooop(edge.targetId)
      }
    }

    await recursiveLooop(startingNodeId)

    redisService.publish('node-run-log', {
      workflowRunId,
      status: 'ALL_COMPLETED',
      timestamp: Date.now()
    });

    // If result is from a response node, return it
    if (responseData) {
      return responseData;
    }

    return service.getProcessedNodesCount();
  }

  matchCondition(targetNode: WorkflowNodeWithFilter){
    const conditions = targetNode.filter?.conditions as any [][];
    if (!conditions || conditions.length === 0) return true;
    
    console.log(`Node ${targetNode.id} filter conditions:`, conditions);
      
    // Process filter conditions using TemplateParser
    const isConditionMet = filterProcessor.process(
      conditions
    );

    console.log(`Node ${targetNode.id} filter conditions met:`, isConditionMet);

    if (!isConditionMet) {
      console.log(`Node ${targetNode.id} filtered out - conditions not met`);
      return false;
    }
    return true;
  }

  notifyConditionResult(targetNode: WorkflowNodeWithFilter, isConditionMet: boolean, edgeId: string){
    redisService.publish('node-run-log', {
      edgeId,
      workflowRunId: targetNode.workflowId,
      nodeId: targetNode.id,
      status: isConditionMet ? 'COMPLETED' : 'FAILED',
      outputData: null,
      error: null,
      timestamp: Date.now()
    });
  }
}
