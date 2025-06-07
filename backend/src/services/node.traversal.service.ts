import { PrismaClient, TriggerType } from '../generated/prisma/index.js'
import type { WorkflowNode, WorkflowEdge } from '../generated/prisma/index.js'
import { NodeExecutorFactory } from './nodes/NodeExecutorFactory.js'
import type { NodeExecutionResult } from './nodes/types.js'
import { nodeOutput } from './nodes/NodeOutput.js'

export class WorkflowTraversalService {
  private prisma: PrismaClient;
  private nodeMap: Map<string, WorkflowNode>;
  private processedNodes: Set<string>;

  constructor() {
    this.prisma = new PrismaClient();
    this.nodeMap = new Map();

    this.processedNodes = new Set();
  }

  private findNextNodes(currentNodeId: string, edges: WorkflowEdge[]): string[] {
    return edges
      .filter(edge => edge.sourceId === currentNodeId)
      .map(edge => edge.targetId)
  }

  private async createNodeRunLog(nodeId: string, nodes: WorkflowNode[], workflowRunId: string, inputData: any = null) {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) {
      console.log(`⚠️ Node not found: ${nodeId}`)
      return
    }

    console.log(`📝 Creating run log for node: ${node.name} (${node.type})`)
    
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
    
    console.log(`✅ Run log created for node: ${node.name}`)
  }

  private createNodeMap(nodes: WorkflowNode[]) {
    this.nodeMap = new Map<string, WorkflowNode>()
    nodes.forEach(node => this.nodeMap.set(node.id, node))
  }

  private async runNode(params: {
    node: WorkflowNode;
    workflowRunId: string;
  }): Promise<NodeExecutionResult> {
    const { node, workflowRunId } = params;
    if (!node) {
      return { success: false, error: 'Node not found' };
    }

  try {
    console.log(`🔄 Running node: ${node.name} (${node.type})`);
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

  private initializeWorkflow(nodes: WorkflowNode[]) {
    this.createNodeMap(nodes);
    nodeOutput.clear();
    
    // Map node IDs to shortIds for the entire workflow
    this.nodeMap.forEach((node) => {
      if (node.shortId) {
        nodeOutput.mapId(node.shortId, node.id);
      }
    });
  }

  private async processStartingNode(
    startingNodeId: string,
    nodes: WorkflowNode[],
    workflowRunId: string,
    initialInputData: any
  ) {
    console.log(`🎬 Processing starting node: ${startingNodeId}`);
    await this.createNodeRunLog(startingNodeId, nodes, workflowRunId, initialInputData);
    
    const startNode = this.nodeMap.get(startingNodeId);
    if (startNode?.type === 'webhook' && startNode.shortId) {
      console.log('Setting webhook node initial output:', initialInputData);
      nodeOutput.setOutput(startNode.shortId, initialInputData);
    } else {
      console.log('Starting node is not webhook, no initial output set');
    }
  }

  private async processNode(
    node: WorkflowNode,
    currentNodeOutput: any,
    workflowRunId: string,
    edges: WorkflowEdge[],
    nodes: WorkflowNode[]
  ): Promise<string[]> {
    if (!node.shortId) {
      console.log(`⚠️ Node ${node.id} has no shortId, skipping...`);
      return [];
    }

    const nextNodeIds = this.findNextNodes(node.id, edges);
    console.log(`🔍 Found ${nextNodeIds.length} next nodes for node ${node.shortId}`);
    const nextNodes: string[] = [];

    for (const nextNodeId of nextNodeIds) {
      const nextNode = this.nodeMap.get(nextNodeId);
      if (!nextNode?.shortId) {
        console.log(`⚠️ Next node ${nextNodeId} has no shortId, skipping...`);
        continue;
      }

      if (!this.processedNodes.has(nextNodeId)) {
        console.log(`⏭️ Processing next node: ${nextNode.shortId}`);
        await this.createNodeRunLog(nextNodeId, nodes, workflowRunId, currentNodeOutput);
        const result = await this.runNode({ node: nextNode, workflowRunId });
        if (result.success) {
          nodeOutput.setOutput(nextNode.shortId, result.output);
        }
        nextNodes.push(nextNodeId);
        this.processedNodes.add(nextNodeId);
      } else {
        console.log(`⏩ Skipping already processed node: ${nextNode.shortId}`);
      }
    }

    return nextNodes;
  }

  public async traverse(
    startingNodeId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    workflowRunId: string,
    initialInputData: any = null
  ): Promise<number> {
    console.log('🚀 Starting workflow traversal ===========================================');
    console.log(`📊 Total nodes: ${nodes.length}, Total edges: ${edges.length}`);
    
    this.initializeWorkflow(nodes);
    this.processedNodes = new Set([startingNodeId]);
    
    await this.processStartingNode(startingNodeId, nodes, workflowRunId, initialInputData);

    // Process subsequent nodes level by level
    let currentNodes = [startingNodeId];
    while (currentNodes.length > 0) {
      console.log(`
👉 Processing level with ${currentNodes.length} nodes`);
      
      const nextLevelNodes: string[] = [];
      for (const nodeId of currentNodes) {
        const node = this.nodeMap.get(nodeId);
        if (!node) continue;

        const currentOutput = node.shortId ? nodeOutput.getOutput(node.shortId) : null;
        const nextNodes = await this.processNode(
          node,
          currentOutput,
          workflowRunId,
          edges,
          nodes
        );
        nextLevelNodes.push(...nextNodes);
      }
      
      currentNodes = nextLevelNodes;
      console.log(`✨ Level complete. Next level has ${nextLevelNodes.length} nodes`);
    }

    console.log(`
🏁 Workflow traversal complete. Processed ${this.processedNodes.size} nodes total.
`);
    return this.processedNodes.size;
  }
}
