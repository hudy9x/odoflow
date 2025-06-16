import { useNodeDebugStore } from './store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NodeOutputData } from './NodeOutputData'
import { Button } from '@/components/ui/button'
import { memo, useState } from 'react'
import { X } from 'lucide-react'

function NodeStatus({nodeId, shortId}: {nodeId: string, shortId: string}) {
    const nodes = useNodeDebugStore(state => state.nodes)
    const [open, setOpen] = useState(false);
    
    const hidePopover = () => {
      setOpen(false);
    };
    
    const node = nodes[nodeId]
    if (!node) return null

    const isCompleted = node.status === 'COMPLETED'
    const isFailed = node.status === 'FAILED'

    const handleOpenChange = () => {
      // always open because we want to user to see multiple popovers at once
      // that will make them easy to copy data to configuration popover
      setOpen(true);
    };
  
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div 
            className={`absolute -top-3 right-0 w-8 h-8 border-4 border-white shadow-md rounded-full cursor-pointer
              ${isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-yellow-500'}`}
          />
        </PopoverTrigger>        
        <PopoverContent className={`w-[350px] rounded-xl bg-gray-100/40 backdrop-blur-lg p-1 border border-gray-200`}>
          <div className="">
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <h4 className="font-medium leading-none">Response data: <code>{shortId}</code></h4>
              <Button
                variant="ghost"
                size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={hidePopover} // Use the defined hidePopover function
            >
              <X className="h-4 w-4" />
            </Button>
            </div>
            <div className="bg-white px-3 py-3 rounded-lg border border-gray-200 shadow-lg">
              <NodeOutputData shortId={shortId} outputData={node.outputData} error={node?.error as unknown as string} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
}

export default memo(NodeStatus)
