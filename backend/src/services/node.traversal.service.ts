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

  private async runNode(
    node: WorkflowNode | undefined,
    inputData: any = null,
    workflowRunId: string
  ): Promise<NodeExecutionResult> {
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

  public async traverse(
    startingNodeId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    workflowRunId: string,
    initialInputData: any = null
  ): Promise<number> {
  console.log('🚀 Starting workflow traversal ===========================================');
  console.log(`📊 Total nodes: ${nodes.length}, Total edges: ${edges.length}`);
  this.createNodeMap(nodes);
  nodeOutput.clear();
  this.processedNodes = new Set([startingNodeId]);

  // Create run log for starting node
  console.log(`🎬 Processing starting node: ${startingNodeId}`);
  await this.createNodeRunLog(startingNodeId, nodes, workflowRunId, initialInputData);
  
  const startNode = this.nodeMap.get(startingNodeId);
  if (startNode?.type === 'webhook') {
    console.log('first node output', initialInputData)
    nodeOutput.setOutput(startingNodeId, initialInputData);
  } else {
    console.log('DO NOTING, start node is not webhook')
    // const startResult = await runNode(startNode, initialInputData, workflowRunId);
    // if (startResult.success) {
    //   nodeOutputs.set(startingNodeId, startResult.output);
    // }  
  }

  // Process subsequent nodes
  let currentNodes = [startingNodeId];
  while (currentNodes.length > 0) {
    const nextNodes: string[] = [];
    console.log(`
👉 Processing level with ${currentNodes.length} nodes`);
    
    for (const nodeId of currentNodes) {
      const nextNodeIds = this.findNextNodes(nodeId, edges);
      console.log(`🔍 Found ${nextNodeIds.length} next nodes for node ${nodeId}`);
      const currentNodeOutput = nodeOutput.getOutput(nodeId);
      
      for (const nextNodeId of nextNodeIds) {
        if (!this.processedNodes.has(nextNodeId)) {
          console.log(`⏭️ Processing next node: ${nextNodeId}`);
          await this.createNodeRunLog(nextNodeId, nodes, workflowRunId, currentNodeOutput);
          const result = await this.runNode(this.nodeMap.get(nextNodeId), currentNodeOutput, workflowRunId);
          if (result.success) {
            nodeOutput.setOutput(nextNodeId, result.output);
          }
          nextNodes.push(nextNodeId);
          this.processedNodes.add(nextNodeId);
        } else {
          console.log(`⏩ Skipping already processed node: ${nextNodeId}`);
        }
      }
    }
    
    currentNodes = nextNodes;
    console.log(`✨ Level complete. Next level has ${nextNodes.length} nodes`);
  }

  console.log(`
🏁 Workflow traversal complete. Processed ${this.processedNodes.size} nodes total.
`);
  return this.processedNodes.size; // Return number of nodes processed
  }
}
