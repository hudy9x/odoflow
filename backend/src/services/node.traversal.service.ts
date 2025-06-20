import { PrismaClient } from '../generated/prisma/index.js'
import type { WorkflowNode, WorkflowEdge } from '../generated/prisma/index.js'
import { NodeExecutorFactory } from './nodes/NodeExecutorFactory.js'
import type { NodeExecutionResult } from './nodes/types.js'
import { nodeOutput } from './nodes/NodeOutput.js'
import type { ITraversalStrategy } from './nodes/traversal/types.js';
import { TraversalStrategy } from './nodes/traversal/types.js';
import { ColumnFirstStrategy } from './nodes/traversal/ColumnFirstStrategy.js'
import { RowFirstStrategy } from './nodes/traversal/RowFirstStrategy.js'
import { NodeRunLogger } from './nodes/NodeRunLogger.js'
import { RedisService } from './redis.service.js';

const redisService = RedisService.getInstance();

type TraversalParams = {
  startingNodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  workflowRunId: string,
  initialInputData: any,
  strategy: TraversalStrategy
}

export class WorkflowTraversalService {
  private prisma: PrismaClient;
  private nodeMap: Map<string, WorkflowNode>;
  private strategies: Map<TraversalStrategy, ITraversalStrategy>;
  private nodeLogger: NodeRunLogger;

  constructor() {
    this.prisma = new PrismaClient();
    this.nodeMap = new Map();
    this.nodeLogger = new NodeRunLogger(this.prisma);
    
    // Initialize strategies
    this.strategies = new Map<TraversalStrategy, ITraversalStrategy>([
      [TraversalStrategy.COLUMN_FIRST, new ColumnFirstStrategy()],
      [TraversalStrategy.ROW_FIRST, new RowFirstStrategy()]
    ]);
  }

  public findNextNodes(currentNodeId: string, edges: WorkflowEdge[]): string[] {
    return edges
      .filter(edge => edge.sourceId === currentNodeId)
      .map(edge => edge.targetId)
  }

  public createNodeRunLog(nodeId: string, nodes: WorkflowNode[], workflowRunId: string, inputData: any = null): string {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.log(`⚠️ Node not found: ${nodeId}`);
      return '';
    }
    
    const logId = this.nodeLogger.generateLogId();
    // Fire and forget - don't await
    this.nodeLogger.createLog({ logId, workflowRunId, node, inputData });
    return logId;
  }

  public createNodeMap(nodes: WorkflowNode[]) {
    this.nodeMap = new Map<string, WorkflowNode>()
    nodes.forEach(node => this.nodeMap.set(node.id, node))
  }

  public async runNode(params: {
    node: WorkflowNode;
    workflowRunId: string;
  }): Promise<NodeExecutionResult> {
    const { node, workflowRunId } = params;
    if (!node) {
      return { success: false, error: 'Node not found' };
    }

  try {
    console.log(` Running node: ${node.shortId} (${node.type}) ////////////////////////////`);
    const executor = NodeExecutorFactory.getExecutor(node.type);
    const result = await executor.execute(node);
    
    return result;
  } catch (error) {
    console.error(`❌ Error running node ${node.name}:`, error);
    return { success: false, error };

  }
}

  public initializeWorkflow(nodes: WorkflowNode[]) {
    this.createNodeMap(nodes);
    nodeOutput.clear();
    
    // Map node IDs to shortIds for the entire workflow
    this.nodeMap.forEach((node) => {
      if (node.shortId) {
        nodeOutput.mapId(node.shortId, node.id);
      }
    });
  }

  public async processStartingNode(
    startingNodeId: string,
    nodes: WorkflowNode[],
    workflowRunId: string,
    initialInputData: any
  ) {
    
    // this.createNodeRunLog(startingNodeId, nodes, workflowRunId, initialInputData);
    
    const startNode = this.nodeMap.get(startingNodeId);
    console.log(`🎬 Processing starting node: ${startNode?.shortId}`);
    if (startNode?.type === 'webhook' && startNode.shortId) {
      nodeOutput.setOutput(startNode.shortId, initialInputData);
      this.nodeLogger.createLogForFirstNode({
        workflowRunId,
        node: startNode,
        status: 'COMPLETED',
        inputData: null,
        outputData: initialInputData
      });
    }
  }



  public getNode(nodeId: string): WorkflowNode | undefined {
    return this.nodeMap.get(nodeId);
  }

  public updateNodeLog(logId: string, result: NodeExecutionResult): void {
    // Fire and forget - don't await
    this.nodeLogger.updateLog({ logId, result });
  }

  public getProcessedNodesCount(): number {
    const strategy = this.strategies.get(TraversalStrategy.COLUMN_FIRST) as ColumnFirstStrategy;
    return strategy?.processedNodesCount || 0;
  }

  public async traverse({
    startingNodeId, 
    nodes, edges, workflowRunId, 
    initialInputData = null, 
    strategy = TraversalStrategy.COLUMN_FIRST
  }: TraversalParams): Promise<number | { statusCode: number; headers: Record<string, string>; body: unknown }> {
    console.log('🚀 Starting workflow traversal ===========================================');
    console.log(`📊 Total nodes: ${nodes.length}, Total edges: ${edges.length}`);
    
    this.initializeWorkflow(nodes);


    const selectedStrategy = this.strategies.get(strategy);
    if (!selectedStrategy) {
      throw new Error(`Invalid traversal strategy: ${strategy}`);
    }

    const result = await selectedStrategy.traverse({
      startingNodeId,
      nodes,
      edges,
      workflowRunId,
      initialInputData,
      service: this
    });

    console.log(`
🏁 Workflow traversal complete. Processed ${this.getProcessedNodesCount()} nodes total.
`);
    // If result is from a response node, return it directly
    if (result && typeof result === 'object' && 'customResponse' in result) {
      return result;
    }
    return result as number;
  }
}
