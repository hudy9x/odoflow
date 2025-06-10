import AddNewNode from './AddNewNode'
import ToggleWorkflowActive from './ToggleWorkflowActive'
import StatusButton from './StatusButton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function WorkflowToolbar() {


  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-gray-100 bg-white px-3 py-2 rounded-md shadow-lg flex items-center space-x-4">
        <StatusButton />

        <Tooltip>
          <TooltipTrigger asChild>
            <div><AddNewNode /></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new node</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-gray-200" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div><ToggleWorkflowActive /></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Active workflow</p>
          </TooltipContent>
        </Tooltip>
    </div>
  )
}