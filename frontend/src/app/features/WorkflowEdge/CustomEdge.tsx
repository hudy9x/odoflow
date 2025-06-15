import React, { useEffect, useId } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import AddFilter from '@/app/features/WorkflowFilterCondition/AddFilter';

import './style.css'
import { DeleteEdge } from './DeleteEdge';
import WorkflowFilterCondition from '../WorkflowFilterCondition';
import EdgeLabel from '../WorkflowFilterCondition/EdgeLabel';
import DeleteFilter from '../WorkflowFilterCondition/DeleteFilter';
import EdgeStatus from '../WorkflowNodeDebug/EdgeStatus';

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
  const [isOpen, setIsOpen] = React.useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    console.log('context menu')
    setIsOpen(true)
  }

  useEffect(() => {
    const path = document.getElementById(randomId)
    const svg = path?.closest('svg')
    
    if (svg) {
      svg.addEventListener('contextmenu', handleContextMenu)
      svg.addEventListener('click', handleContextMenu)
    }

    return () => {
      if (svg) {
        svg.removeEventListener('contextmenu', handleContextMenu)
        svg.removeEventListener('click', handleContextMenu)
      }
    }
    
  }, [randomId])

  const styleDiv = {
    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
    pointerEvents: 'none' as const,
  }

  return (
    <>
      <BaseEdge path={edgePath} id={randomId} className='workflow-edge' markerEnd={markerEnd} style={style}  />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan flex flex-col justify-center items-center gap-1"
          style={styleDiv}
        >
          
          <EdgeLabel edgeId={id} onClick={() => setIsOpen(true)} />
          <WorkflowFilterCondition edgeId={id} />
          <EdgeStatus edgeId={id} />

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="w-1 h-1 overflow-hidden invisible">
              </div>
            </PopoverTrigger>
            <PopoverContent side="bottom" align='center' className="w-48 p-1">
              <div className="flex flex-col gap-1">
                <AddFilter edgeId={id} />
                <DeleteFilter edgeId={id} />
                <DeleteEdge edgeId={id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
