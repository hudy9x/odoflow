import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Flag, Pencil, Settings, Trash2 } from "lucide-react"
import { useWorkflowStore } from "../WorkflowDetail/store"

interface Props {
  id: string
  children: React.ReactNode
}

export function NodeContextMenu({ id, children }: Props) {
  const { removeNode, setStartingNodeId } = useWorkflowStore()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => {
            // TODO: Implement rename dialog
            console.log('rename', id)
          }}
        >
          <Pencil className="h-4 w-4" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => {
            // TODO: Implement configure dialog
            console.log('configure', id)
          }}
        >
          <Settings className="h-4 w-4" />
          <span>Configure</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => setStartingNodeId(id)}
        >
          <Flag className="h-4 w-4" />
          <span>Set as Starting Node</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="flex items-center gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => removeNode(id)}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
