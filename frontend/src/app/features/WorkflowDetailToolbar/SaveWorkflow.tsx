import { Save } from 'lucide-react'
import { useWorkflowStore } from '@/app/features/WorkflowDetail/store'
import { Button } from "@/components/ui/button"

export default function SaveWorkflow() {
  const { nodes, edges } = useWorkflowStore()

  const handleSave = () => {
    console.log('Current Workflow State:')
    console.log('Nodes:', nodes)
    console.log('Edges:', edges)
  }

  return (
    <Button variant="link" size={'icon'} onClick={handleSave}>
      <Save className="w-4 h-4" />
    </Button>
  )
}
