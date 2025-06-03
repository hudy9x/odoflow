'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { put } from '@/app/services/api.service'
import { Workflow } from '@/types/workflow'
import { toast } from 'sonner'

interface WorkflowTitleProps {
  workflow: Workflow
  onUpdate?: (workflow: Workflow) => void
}

export default function WorkflowTitle({ workflow, onUpdate }: WorkflowTitleProps) {
  const router = useRouter()
  const [name, setName] = useState(workflow.name)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateName = async () => {
    if (name.trim() === workflow.name) return
    
    setIsUpdating(true)
    try {
      const { success, workflow: updatedWorkflow, error } = await put<{ workflow: Workflow }>(`/workflow/${workflow.id}`, {
        name: name.trim()
      })

      if (success && updatedWorkflow) {
        toast.success('Workflow name updated')
        onUpdate?.(updatedWorkflow)
      } else {
        toast.error(error || 'Failed to update workflow name')
        setName(workflow.name) // Reset to original name
      }
    } catch {
      toast.error('Failed to update workflow name')
      setName(workflow.name) // Reset to original name
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/workflow')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleUpdateName}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur() // This will trigger onBlur
          }
        }}
        className="max-w-[300px] text-lg font-medium"
        disabled={isUpdating}
      />
    </div>
  )
}
