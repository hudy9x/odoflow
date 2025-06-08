import SaveWorkflow from './SaveWorkflow'
import AddNewNode from './AddNewNode'
import ToggleWorkflowActive from './ToggleWorkflowActive'
import StatusButton from './StatusButton'

export default function WorkflowToolbar() {


  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-gray-100 bg-white px-3 py-2 rounded-md shadow-lg flex items-center space-x-4">
      <ToggleWorkflowActive />
      <div className="h-6 w-px bg-gray-200" />
      <SaveWorkflow />
      <AddNewNode />
      <div className="h-6 w-px bg-gray-200" />
      <StatusButton />
    </div>
  )
}