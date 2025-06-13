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

import EdgeFilter from './EdgeFilter';
import AddFilter from './AddFilter';


import './style.css'
import { DeleteEdge } from './DeleteEdge';

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
    }

    return () => {
      if (svg) {
        svg.removeEventListener('contextmenu', handleContextMenu)
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
          className="button-edge__label nodrag nopan"
          style={styleDiv}
        >
          <EdgeFilter edgeId={id} />

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="w-1 h-1 overflow-hidden invisible">
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1">
              <div className="flex flex-col gap-1">
                <AddFilter edgeId={id} />
                <DeleteEdge edgeId={id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
