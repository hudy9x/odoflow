import { Unlink } from "lucide-react";
import { DropdownMenuItem } from "../../../components/ui/dropdown-menu";
import { useWorkflowStore } from '../WorkflowDetail/store';

interface DeleteEdgeMenuItemProps {
  edgeId: string;
}

export function DeleteEdgeMenuItem({ edgeId }: DeleteEdgeMenuItemProps) {
  const { updateEdges } = useWorkflowStore();
  
  const handleDeleteEdge = () => {
    updateEdges([{ id: edgeId, type: 'remove' }]);
  };

  return (
    <DropdownMenuItem
      className="flex items-center gap-2 text-red-600"
      onClick={handleDeleteEdge}
    >
      <Unlink className="h-4 w-4" />
      <span>Unlink</span>
    </DropdownMenuItem>
  );
}
