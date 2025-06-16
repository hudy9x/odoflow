import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useWorkflowStore } from "../WorkflowDetail/store"

interface Props {
  nodeId: string
  color?: string
}

import { nodeTypeConfig } from "../WorkflowNodes"

interface NodeType {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function NodeTypeSelect({ nodeId, color = '#fff' }: Props) {
  const { isLeafNode, addConnectedNode } = useWorkflowStore()
  const isLeaf = isLeafNode(nodeId)

  if (!isLeaf) return null
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          style={{backgroundColor: color}}
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg shadow-md -z-10 group/node-type opacity-80 hover:opacity-100 hover:darken-40 hover:translate-x-1 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="!h-3 !w-3 text-white translate-x-1.5 group-hover/node-type:translate-x-0.5 transition-all" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="space-y-1">
          {nodeTypeConfig.map((node: NodeType) => (
            <Button
              key={node.type}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={(e) => {
                e.stopPropagation()
                addConnectedNode(nodeId, node.type)
              }}
            >
              {node.icon}
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium">{node.title}</span>
                <span className="text-xs text-muted-foreground">{node.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
