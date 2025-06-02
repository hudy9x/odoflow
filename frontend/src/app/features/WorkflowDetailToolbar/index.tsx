import  SaveWorkflow  from './SaveWorkflow'
import AddNewNode from './AddNewNode'

export default function WorkflowToolbar() {


  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-gray-100 bg-white px-3 py-2 rounded-md shadow-lg">
      <SaveWorkflow />
      <AddNewNode />
    </div>
  )
}