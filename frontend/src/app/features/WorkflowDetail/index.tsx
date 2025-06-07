'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getWorkflow } from '@/app/services/workflow.service'
import { TriggerType, type Workflow } from '@/types/workflow'
import WorkflowNodes from './WorkflowNodes'
import { useWorkflowStore } from './store'
import WorkflowToolbar from '@/app/features/WorkflowDetailToolbar'
import WorkflowTitle from './WorkflowTitle'

export default function WorkflowDetail({ id }: { id: string }) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { setWorkflowId, setInitialData } = useWorkflowStore()

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await getWorkflow(id)
        if (response.success) {
          setWorkflow(response.workflow)
          setWorkflowId(id)

          const startingNodeId = response.workflow.startingNodeId || ''
          const triggerType = response.workflow.triggerType || TriggerType.WEBHOOK
          const triggerValue = response.workflow.triggerValue || null
          const isActive = response.workflow.isActive || false
          // Transform backend nodes to React Flow format or create initial node
          const initialNodes = response.workflow.nodes?.length ? 
            response.workflow.nodes.map(node => ({
              id: node.id,
              type: node.type,
              position: { x: node.positionX, y: node.positionY },
              data: {
                ...node.data,
                shortId: node.shortId
              }
            })) : 
            [{
              id: `create-${Math.random().toString(36).substr(2, 9)}`,
              type: 'create',
              position: { x: 250, y: 200 },
              data: {}
            }]

          // Transform edges to React Flow format
          const initialEdges = (response.workflow.edges || []).map(edge => ({
            id: edge.id,
            source: edge.sourceId,
            target: edge.targetId
          }))

          setInitialData(initialNodes, initialEdges, startingNodeId, triggerType, triggerValue, isActive)
        } else {
          setError(response.error || 'Failed to load workflow')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchWorkflow()
  }, [id, setWorkflowId, setInitialData])

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/workflow')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/workflow')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div>Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen">
      <div className='fixed top-4 left-4 z-50'>
        <WorkflowTitle workflow={workflow} onUpdate={setWorkflow} />
      </div>
     
     <WorkflowNodes/>
     <WorkflowToolbar/>
    </div>
  )
}
