import { useEdges } from '@xyflow/react';
import { useFilterStore } from "./store";
import type { Edge } from '@xyflow/react';
import FilterConditionPreview from "./FilterConditionPreview";
import { memo } from 'react';

function EdgePreviewCondition({ edgeId, className }: {  edgeId: string, className?: string }) {
  const edges = useEdges();
  const filters = useFilterStore((state) => state.filters);

  const edge = edges.find((e: Edge) => e.id === edgeId);
  if (!edge?.source || !edge?.target) return null;

  const existingFilter = filters.find(
    (filter) =>
      filter.sourceNodeId === edge.source &&
      filter.targetNodeId === edge.target
  );

  if (!existingFilter) return null;
  if (!existingFilter.conditions || existingFilter.conditions.length === 0) return null;

  return (
    <div style={{ pointerEvents: 'all' }} 
      className={`text-[10px] text-gray-600 cursor-pointer border-white rounded-md ${className}`}>
      <FilterConditionPreview conditions={existingFilter.conditions}/>
    </div>
  );
}

export default memo(EdgePreviewCondition)