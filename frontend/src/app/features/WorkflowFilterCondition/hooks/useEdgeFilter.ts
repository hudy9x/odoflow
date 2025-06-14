import { useCallback, useMemo } from 'react';
import { useEdges } from '@xyflow/react';
import { useWorkflowStore } from '../../WorkflowDetail/store';
import { useFilterStore } from '../store';
import type { WorkflowState } from '@/app/features/WorkflowFilterCondition/types';
import type { WorkflowNodeFilter } from '@/app/services/node.filter.service';

export const useEdgeFilter = (edgeId: string) => {

  const workflowId = useWorkflowStore((state: WorkflowState) => state.workflowId);
  const edges = useEdges();
  const addFilter = useFilterStore(state => state.addFilter);
  const removeFilter = useFilterStore(state => state.deleteFilter)
  const filters = useFilterStore(state => state.filters);

  const edge = useMemo(() => edges.find(e => e.id === edgeId), [edges, edgeId]);
  const existingFilter = useMemo(() => edge?.source && edge?.target 
    ? filters.find(
        (filter: WorkflowNodeFilter) =>
          filter.sourceNodeId === edge.source &&
          filter.targetNodeId === edge.target
      )
    : null, [filters, edge]);

  const handleAddFilter = useCallback(async () => {
    if (!workflowId || !edge?.source || !edge?.target) return;

    try {
      await addFilter({
        workflowId,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        conditions: [[]]
      });
    } catch (error) {
      console.error('Failed to add filter:', error);
    }
  }, [workflowId, edge?.source, edge?.target, addFilter]);

  const handleRemoveFilter = useCallback(async () => {
    if (!existingFilter?.id) return;
    removeFilter(existingFilter?.id)
  }, [existingFilter?.id, removeFilter]);

  return {
    existingFilter,
    handleAddFilter,
    handleRemoveFilter,
    edge
  };
};
