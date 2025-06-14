import FilterConditionForm from "./FilterConditionForm";
import { useWorkflowStore } from "../WorkflowDetail/store";
import type { Edge } from '@xyflow/react';
import { useFilterStore } from './store';

export default function WorkflowFilterCondition({ edgeId }: { edgeId: string }) {
  const edges = useWorkflowStore((state) => state.edges);
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const { findFilterByNodes } = useFilterStore();
  
  if (!workflowId) {
    console.error('No workflow ID available');
    return null;
  }
  
  const edge = edges.find((e: Edge) => e.id === edgeId);
  
  if (!edge) {
    console.error('Edge not found:', edgeId);
    return null;
  }

  const existingFilter = findFilterByNodes(edge.source, edge.target);

  if (!existingFilter) {
    return null;
  }

  return (
    <FilterConditionForm 
      filterData={existingFilter}
    />
  );
}