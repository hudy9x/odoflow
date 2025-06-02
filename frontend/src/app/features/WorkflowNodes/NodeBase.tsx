import { Handle, Position } from '@xyflow/react';
import { NodeTypeSelect } from "./NodeTypeSelect";
import { NodeContextMenu } from "./NodeContextMenu";

interface NodeBaseProps {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badgeNumber?: number;
  onClick?: () => void;
  color: string;
  noEdges?: boolean;
}

export function NodeBase({ id, title, description, icon, onClick, color, noEdges }: NodeBaseProps) {
  const content = (
    <div className="group relative cursor-pointer" onClick={onClick}>

      {/* Input handle */}
      {!noEdges && <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-200 !w-6 !h-6 !rounded-full !border-2 !hover:bg-gray-300 !-z-20"
      />}

      {/* Output handle */}
      {!noEdges && <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-200 !w-6 !h-6 !rounded-full !border-2 !hover:bg-gray-300 !-z-20"
      />}

      {/* Main node content */}
      <div className={`relative rounded-[40px] border-4 border-white hover:border-gray-200/30 p-6 transition-all duration-200 shadow-lg`}
           style={{ backgroundColor: color }}>
        <div className="text-white w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        {id && <NodeTypeSelect nodeId={id} color={color} />}
      </div>

      {/* Node label */}
      <div className="mt-2 text-center absolute -bottom-1/2 left-0 w-full">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{description}</p>
      </div>
    </div>
  )

  return id ? (
    <NodeContextMenu id={id}>
      {content}
    </NodeContextMenu>
  ) : content;
}
