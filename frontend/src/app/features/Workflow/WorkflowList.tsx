'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createWorkflow, getWorkflows } from '@/app/services/workflow.service'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Workflow } from '@/types/workflow'

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
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading workflows...</div>
      ) : workflows.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No workflows found. Click the Create Workflow button to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id}
              onClick={() => router.push(`/workflow/${workflow.id}`)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{workflow.name}</h3>
                  <span className={`text-sm ${workflow.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {workflow.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {workflow.description && (
                  <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
