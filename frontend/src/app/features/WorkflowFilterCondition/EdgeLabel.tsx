import { useEdges } from '@xyflow/react';
import { useFilterStore } from "./store";
import type { Edge } from '@xyflow/react';
import { memo } from 'react';

function EdgeLabel({ edgeId, onClick }: { edgeId: string, onClick: () => void }) {
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
  if (!existingFilter.label) return null;

  return (
    <div style={{ pointerEvents: 'all' }} 
      onClick={onClick}
      className="text-[10px] text-gray-600 relative hover:bg-gray-200 transition-colors cursor-pointer bg-gray-100 border-2 border-white shadow-lg backdrop-blur-sm px-2 py-1 rounded-md">
      {existingFilter.label} 
    </div>
  );
}

export default memo(EdgeLabel)