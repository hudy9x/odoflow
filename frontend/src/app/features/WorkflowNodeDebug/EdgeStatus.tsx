import { useNodeDebugStore } from '../WorkflowNodeDebug/store'
import { memo } from "react";

function EdgeStatus({ edgeId }: { edgeId: string }) {
  const nodeStatus = useNodeDebugStore(state => state.nodes[`edge-${edgeId}`])

  if (!nodeStatus || nodeStatus.status === 'COMPLETED') return null

  return (
    <div className={`w-3 h-3 border-2 border-white shadow-md rounded-full cursor-pointer 
      ${nodeStatus.status === 'COMPLETED' ? 'bg-green-500' : nodeStatus.status === 'FAILED' ? 'bg-red-500 animate-ping duration-700' : 'bg-yellow-500'}`}>
    </div>
  )
}

export default memo(EdgeStatus)