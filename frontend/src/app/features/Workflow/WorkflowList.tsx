'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createWorkflow, getWorkflows } from '@/app/services/workflow.service'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Workflow } from '@/types/workflow'
import { Checkbox } from '@/components/ui/checkbox'
import { nodeIconMap, defaultNodeIconMeta } from '../WorkflowNodes/NodeIcons'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id}
                className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/workflow/${workflow.id}`)}
              >
                <CardContent className="">
                  <div className="space-y-4">
                    {/* Node Icons */}
                    <div className="flex gap-2">
                      {Array.from(new Set(workflow.nodes.map(node => node.type))).map((type) => {
                        const { icon: IconComponent, bg, color } = nodeIconMap[type] || defaultNodeIconMeta;
                        return (
                          <div
                            key={type}
                            style={{ backgroundColor: bg }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className={`h-4 w-4`} style={{stroke: color}} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {format(new Date(workflow.createdAt), 'dd MMM yyyy')}
                      </p>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">Status</span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={workflow.isActive}
                          onCheckedChange={(checked: boolean) => {
                            // TODO: Implement status toggle
                            console.log('Toggle status:', checked)
                          }}
                        />
                      </div>
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
