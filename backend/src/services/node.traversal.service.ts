import { PrismaClient, TriggerType } from '../generated/prisma/index.js'
import type { WorkflowNode, WorkflowEdge } from '../generated/prisma/index.js'
import { NodeExecutorFactory } from './nodes/NodeExecutorFactory.js'
import type { NodeExecutionResult } from './nodes/types.js'
import { nodeOutput } from './nodes/NodeOutput.js'
import type { ITraversalStrategy } from './nodes/traversal/types.js';
import { TraversalStrategy } from './nodes/traversal/types.js';
import { ColumnFirstStrategy } from './nodes/traversal/ColumnFirstStrategy.js'
import { RowFirstStrategy } from './nodes/traversal/RowFirstStrategy.js'

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
  private processedNodes: Set<string>;
  private strategies: Map<TraversalStrategy, ITraversalStrategy>;

  constructor() {
    this.prisma = new PrismaClient();
    this.nodeMap = new Map();
    this.processedNodes = new Set();
    
    // Initialize strategies
    this.strategies = new Map([
      [TraversalStrategy.COLUMN_FIRST, new ColumnFirstStrategy()],
      [TraversalStrategy.ROW_FIRST, new RowFirstStrategy()]
    ]);
  }

  public findNextNodes(currentNodeId: string, edges: WorkflowEdge[]): string[] {
    return edges
      .filter(edge => edge.sourceId === currentNodeId)
      .map(edge => edge.targetId)
  }

  public async createNodeRunLog(nodeId: string, nodes: WorkflowNode[], workflowRunId: string, inputData: any = null) {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) {
      console.log(`⚠️ Node not found: ${nodeId}`)
      return
    }
    
    await this.prisma.workflowRunLog.create({
      data: {
        workflowRunId,
        nodeId: node.id,
        nodeType: node.type,
        nodeName: node.name,
        status: 'STARTED',
        inputData: inputData || null
      }
    })
    
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
    
    // Update the run log with the execution result
    const runLog = await this.prisma.workflowRunLog.findFirst({
      where: {
        nodeId: node.id,
        status: 'STARTED',
        workflowRunId
      }
    });

    if (!runLog) {
      throw new Error(`Run log not found for node ${node.id}`);
    }

    await this.prisma.workflowRunLog.update({
      where: {
        id: runLog.id
      },
      data: {
        status: result.success ? 'COMPLETED' : 'FAILED',
        outputData: result.output ? JSON.parse(JSON.stringify(result.output)) : null,
        error: result.error ? JSON.parse(JSON.stringify(result.error)) : null,
        completedAt: new Date(),
        durationMs: Date.now() - new Date().getTime()
      }
    });

    return result;
  } catch (error) {
    console.error(`❌ Error running node ${node.name}:`, error);
    const runLog = await this.prisma.workflowRunLog.findFirst({
      where: {
        nodeId: node.id,
        status: 'STARTED',
        workflowRunId
      }
    });

    if (!runLog) {
      throw new Error(`Run log not found for node ${node.id}`);
    }

    await this.prisma.workflowRunLog.update({
      where: {
        id: runLog.id
      },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error' },
        completedAt: new Date(),
        durationMs: Date.now() - new Date().getTime()
      }
    });
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
    
    this.createNodeRunLog(startingNodeId, nodes, workflowRunId, initialInputData);
    
    const startNode = this.nodeMap.get(startingNodeId);
    console.log(`🎬 Processing starting node: ${startNode?.shortId}`);
    if (startNode?.type === 'webhook' && startNode.shortId) {
      nodeOutput.setOutput(startNode.shortId, initialInputData);
    }
  }

  public async processNode(
    node: WorkflowNode,
    currentNodeOutput: any,
    workflowRunId: string,
    edges: WorkflowEdge[],
    nodes: WorkflowNode[]
  ): Promise<string[]> {
    if (!node.shortId) {
      return [];
    }

    const nextNodeIds = this.findNextNodes(node.id, edges);
    const nextNodes: string[] = [];

    for (const nextNodeId of nextNodeIds) {
      const nextNode = this.nodeMap.get(nextNodeId);
      if (!nextNode?.shortId) {
        console.log(`⚠️ Next node ${nextNodeId} has no shortId, skipping...`);
        continue;
      }

      if (!this.processedNodes.has(nextNodeId)) {
        this.createNodeRunLog(nextNodeId, nodes, workflowRunId, currentNodeOutput);
        const result = await this.runNode({ node: nextNode, workflowRunId });
        if (result.success) {
          nodeOutput.setOutput(nextNode.shortId, result.output);
        }
        nextNodes.push(nextNodeId);
        this.processedNodes.add(nextNodeId);
      }
    }

    return nextNodes;
  }

  public getNode(nodeId: string): WorkflowNode | undefined {
    return this.nodeMap.get(nodeId);
  }

  public getProcessedNodesCount(): number {
    return this.processedNodes.size;
  }

  public async traverse({
    startingNodeId, 
    nodes, edges, workflowRunId, 
    initialInputData = null, 
    strategy = TraversalStrategy.COLUMN_FIRST
  }: TraversalParams): Promise<number> {
    console.log('🚀 Starting workflow traversal ===========================================');
    console.log(`📊 Total nodes: ${nodes.length}, Total edges: ${edges.length}`);
    
    this.initializeWorkflow(nodes);
    this.processedNodes = new Set([startingNodeId]);

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
🏁 Workflow traversal complete. Processed ${this.processedNodes.size} nodes total.
`);
    return result;
  }
}
