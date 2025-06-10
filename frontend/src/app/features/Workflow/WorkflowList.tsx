'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createWorkflow, getWorkflows } from '@/app/services/workflow.service'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Workflow } from '@/types/workflow'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText } from 'lucide-react'
import { format } from 'date-fns'

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
        console.log('workflows', workflows)
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
          <div className="space-y-2">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id}
                className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/workflow/${workflow.id}`)}
              >
                <CardContent className="px-8 py-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-grow space-y-2">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Due {format(new Date(workflow.createdAt), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={workflow.isActive}
                        onCheckedChange={(checked: boolean) => {
                          // TODO: Implement status toggle
                          console.log('Toggle status:', checked)
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
