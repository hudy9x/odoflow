import { PrismaClient } from '../generated/prisma/index.js'
import type { WorkflowNode, WorkflowEdge } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

// Function to find next nodes
const findNextNodes = (currentNodeId: string, edges: WorkflowEdge[]): string[] => {
  return edges
    .filter(edge => edge.sourceId === currentNodeId)
    .map(edge => edge.targetId)
}

// Function to create run log for a node
const createNodeRunLog = async (nodeId: string, nodes: WorkflowNode[], workflowRunId: string, inputData: any = null) => {
  const node = nodes.find(n => n.id === nodeId)
  if (!node) {
    console.log(`⚠️ Node not found: ${nodeId}`)
    return
  }

  console.log(`📝 Creating run log for node: ${node.name} (${node.type})`)
  
  await prisma.workflowRunLog.create({
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

// Main traversal function
export const traverseWorkflowNodes = async (
  startingNodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  workflowRunId: string,
  initialInputData: any = null
) => {
  console.log('🚀 Starting workflow traversal ===========================================')
  console.log(`📊 Total nodes: ${nodes.length}, Total edges: ${edges.length}`)

  // Create run log for starting node
  console.log(`🎬 Processing starting node: ${startingNodeId}`)
  await createNodeRunLog(startingNodeId, nodes, workflowRunId, initialInputData)

  // Process subsequent nodes
  let currentNodes = [startingNodeId]
  const processedNodes = new Set([startingNodeId])

  while (currentNodes.length > 0) {
    const nextNodes: string[] = []
    console.log(`
👉 Processing level with ${currentNodes.length} nodes`)
    
    for (const nodeId of currentNodes) {
      const nextNodeIds = findNextNodes(nodeId, edges)
      console.log(`🔍 Found ${nextNodeIds.length} next nodes for node ${nodeId}`)
      
      for (const nextNodeId of nextNodeIds) {
        if (!processedNodes.has(nextNodeId)) {
          console.log(`⏭️ Processing next node: ${nextNodeId}`)
          await createNodeRunLog(nextNodeId, nodes, workflowRunId)
          nextNodes.push(nextNodeId)
          processedNodes.add(nextNodeId)
        } else {
          console.log(`⏩ Skipping already processed node: ${nextNodeId}`)
        }
      }
    }
    
    currentNodes = nextNodes
    console.log(`✨ Level complete. Next level has ${nextNodes.length} nodes`)
  }

  console.log(`
🏁 Workflow traversal complete. Processed ${processedNodes.size} nodes total.
`)
  return processedNodes.size // Return number of nodes processed
}
