'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { getWorkflow } from '@/app/services/workflow.service'
import { TriggerType, type Workflow } from '@/types/workflow'
import WorkflowNodes from './WorkflowNodes'
import { useWorkflowStore } from './store'
import WorkflowToolbar from '@/app/features/WorkflowDetailToolbar'
import WorkflowTitle from './WorkflowTitle'
import LoadFilterCondition from '../WorkflowFilterCondition/LoadFilterCondition'
import DisplayLatestLog from '../WorkflowNodeDebug/DisplayLatestLog'

function BackToWorkflow() {
  const router = useRouter()
  return <div className='fixed top-4 left-4 z-50'>
    <Button
      variant="ghost"
      className="mb-4"
      onClick={() => router.push('/workflow')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Workflows
    </Button>
  </div>
}

function ErrorDisplay({ error }: { error: string | null }) {
  if (!error) return null
  return <>
    <BackToWorkflow/>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center justify-center gap-4"> 
        {error}
      </div>
    </div>
  </>
}

function LoadingDisplay({ visible }: { visible: boolean }) {
  const [display, setDisplay] = useState(true)
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setDisplay(false)
      }, 300);
    } 
  }, [visible])

  return <div className={`fixed top-0 left-0 right-0 bottom-0 z-[99] w-screen h-screen transition-all bg-white duration-700 ${display ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <BackToWorkflow/>
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
      <div className="flex items-center justify-center gap-4"> 
        <Loader2 className="h-6 w-6 animate-spin duration-75" />
        Loading...
      </div>
    </div>
  </div>
}

function WorkflowDetail({ id }: { id: string }) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { setWorkflowId, setInitialData } = useWorkflowStore()

  useEffect(() => {
    const fetchWorkflow = async () => {
      console.log('WorkflowDetail.fetchWorkflow')
      try {
        const response = await getWorkflow(id)
        if (!response.success) {
          setError(response.error || 'Failed to load workflow')
          return
        }
        
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
            id: `create-${Math.random().toString(36).substring(2, 9)}`,
            type: 'create',
            position: { x: 250, y: 200 },
            data: {}
          }]

        // Transform edges to React Flow format
        const initialEdges = (response.workflow.edges || []).map(edge => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          type: 'customedge'
        }))

        setInitialData(initialNodes, initialEdges, startingNodeId, triggerType, triggerValue, isActive)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflow()
  }, [id, setWorkflowId, setInitialData])

  const view = useMemo(() => {
    if (!workflow) {
      return null
    }

    return (<>
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen">
      <div className='fixed top-4 left-4 z-50'>
        <WorkflowTitle workflow={workflow} onUpdate={setWorkflow} />
      </div>
      
      <WorkflowNodes/>
      <WorkflowToolbar/>
      <LoadFilterCondition workflowId={id} />
      <DisplayLatestLog workflowId={workflow.id} />
    </div>
   </>)}, [workflow, id])

  return (
    <>
      <ErrorDisplay error={error}/>
      <LoadingDisplay visible={loading}/>
      {view}
    </>
   
  )
}
export default memo(WorkflowDetail)