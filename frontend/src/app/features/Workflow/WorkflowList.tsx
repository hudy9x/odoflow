'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createWorkflow, getWorkflows } from '@/app/services/workflow.service'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Workflow } from '@/types/workflow'
import { WorkflowListItem } from './WorkflowListItem'

export default function WorkflowList() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      setError(null)
      const { success, workflows, error } = await getWorkflows()
      if (success) {
        setWorkflows(workflows)
      } else {
        setError(error || 'Failed to load workflows')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

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
          <Button onClick={fetchWorkflows} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-[150px]">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <Button onClick={handleCreateWorkflow}>Add workflow</Button>
        </div>
          
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Loading workflows...
            </CardContent>
          </Card>
        ) : workflows.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No workflows found. Click the Add task button to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {workflows.map((workflow) => (
  <WorkflowListItem
    key={workflow.id}
    workflow={workflow}
    onClick={() => router.push(`/workflow/${workflow.id}`)}
  />
))}
          </div>
        )}
      </div>
    </div>
  )
}
