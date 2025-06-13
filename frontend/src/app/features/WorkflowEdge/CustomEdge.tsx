import React, { useId } from 'react';
import { ListFilter } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import './style.css'
import { DeleteEdgeMenuItem } from './DeleteEdgeMenuItem';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const _id = useId();
  const randomId = `workflow-edge-id-${_id}`

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });



  return (
    <>
      <BaseEdge path={edgePath} id={randomId} className='workflow-edge' markerEnd={markerEnd} style={style}  />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'all' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ListFilter className="h-7 w-7 cursor-pointer hover:bg-gray-300 bg-gray-200 border-4 border-white shadow-lg rounded-full p-1 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {/* <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => {}}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Filter</span>
                </DropdownMenuItem> */}
                <DeleteEdgeMenuItem edgeId={id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
