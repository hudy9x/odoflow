'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getWorkflow } from '@/app/services/workflow.service'
import type { Workflow } from '@/types/workflow'

export default function WorkflowDetail({ id }: { id: string }) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await getWorkflow(id)
        if (response.success) {
          setWorkflow(response.workflow)
        } else {
          setError(response.error || 'Failed to load workflow')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchWorkflow()
  }, [id])

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
        <CardHeader>
        <CardTitle>{workflow.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {workflow.description && (
          <p className="text-gray-600 mb-4">{workflow.description}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <span className={workflow.isActive ? 'text-green-600' : 'text-gray-600'}>
            {workflow.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
