'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createWorkflow, getWorkflows } from '@/app/services/workflow.service'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Workflow } from '@/types/workflow'
import { WorkflowListItem } from './WorkflowListItem'
import { CreateWorkflowCard } from './CreateWorkflowCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackgroundGradient } from './BackgroundGradient'

function WorkflowLoading({loading}: {loading:boolean}) {
  if (!loading) return null
  
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {[1, 2, 3].map((i) => (
    <Card key={i} className="animate-pulse">
      <CardContent className="py-8">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </CardContent>
    </Card>
  ))}
</div>
}

export default function WorkflowList() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [noWorkflows, setNoWorkflows] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'recently' | 'active' | 'inactive' | 'all'>('recently');

  const fetchWorkflows = async (filter?: 'recently' | 'active' | 'inactive' | 'all') => {
    try {
      setLoading(true)
      setError(null)
      const { success, workflows, error } = await getWorkflows(filter)
      if (success) {
        setWorkflows(workflows)
        setNoWorkflows(workflows.length === 0)
      } else {
        setError(error || 'Failed to load workflows')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 250);
    }
  }

  useEffect(() => {
    fetchWorkflows(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const handleCreateWorkflow = async () => {
    try {
      const { success, workflow, error } = await createWorkflow()
      if (success) {
        router.push(`/workflow/${workflow.id}`)
      } else {
        setError(error || 'Failed to create workflow')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow')
    }
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl mt-8">
        <CardContent className="pt-6">
          <div className="text-red-500">{error}</div>
          <Button onClick={() => fetchWorkflows(tab)} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-[150px] relative">

      <BackgroundGradient />

      <div className="container mx-auto max-w-4xl px-4 z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Workflows</h1>
        </div>
        
        {noWorkflows ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No workflows found. Click the Add task button to get started.
            </CardContent>
          </Card>
        ) : null }
        
          <>
            <div className="mb-12 grid grid-cols-3 gap-4">
              <CreateWorkflowCard onClick={handleCreateWorkflow} />
            </div>

            <Tabs value={tab} onValueChange={v => setTab(v as 'recently' | 'active' | 'inactive' | 'all')} className="mb-4">
              <TabsList>
                <TabsTrigger value="recently">Recently</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="all">All workflows</TabsTrigger>
              </TabsList>
            </Tabs>

            <WorkflowLoading loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.length > 0 && !loading && workflows.map((workflow) => (
                <WorkflowListItem
                  key={workflow.id}
                  workflow={workflow}
                  onClick={() => router.push(`/workflow/${workflow.id}`)}
                />
              ))}
            </div>
          </>
      </div>
    </div>
  )
}
