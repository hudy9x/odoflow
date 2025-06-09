import { useNodeDebugStore } from "./store"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NodeStatus({nodeId}: {nodeId: string}) {
    const nodes = useNodeDebugStore(state => state.nodes)
    const node = nodes[nodeId]
    if (!node) return null

    const isCompleted = node.status === 'COMPLETED'

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className={`absolute -top-3 right-0 w-8 h-8 border-4 border-white shadow-md rounded-full cursor-pointer
              ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}
          />
        </PopoverTrigger>
        {isCompleted && (
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Output Data</h4>
              <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-[300px]">
                {JSON.stringify(node.outputData, null, 2)}
              </pre>
            </div>
          </PopoverContent>
        )}
      </Popover>
    )
}