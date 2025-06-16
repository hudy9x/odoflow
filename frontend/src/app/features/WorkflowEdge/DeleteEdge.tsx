import { Unlink } from "lucide-react";
import { useWorkflowStore } from '../WorkflowDetail/store';
import { Button } from "../../../components/ui/button";
import { useFilterStore } from '../WorkflowFilterCondition/store';

interface DeleteEdgeProps {
  edgeId: string;
}

export function DeleteEdge({ edgeId }: DeleteEdgeProps) {
  const updateEdges = useWorkflowStore(state => state.updateEdges);
  const edges = useWorkflowStore(state => state.edges);
  const { findFilterByNodes, deleteFilter } = useFilterStore();
  
  const handleDeleteEdge = async () => {
    // Find the edge to get source and target nodes
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;

    // Find and delete associated filter if it exists
    const filter = findFilterByNodes(edge.source, edge.target);
    if (filter) {
      await deleteFilter(filter.id);
    }

    // Delete the edge
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
