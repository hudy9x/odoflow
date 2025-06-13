import { Unlink } from "lucide-react";
import { useWorkflowStore } from '../WorkflowDetail/store';
import { Button } from "../../../components/ui/button";

interface DeleteEdgeProps {
  edgeId: string;
}

export function DeleteEdge({ edgeId }: DeleteEdgeProps) {
  const { updateEdges } = useWorkflowStore();
  
  const handleDeleteEdge = () => {
    updateEdges([{ id: edgeId, type: 'remove' }]);
  };

  return (
    <Button
      onClick={handleDeleteEdge}
      variant="ghost"
      size="sm"
      className="w-full justify-start text-red-600"
    >
      <Unlink className="h-4 w-4" />
      Unlink
    </Button>
  );
}
