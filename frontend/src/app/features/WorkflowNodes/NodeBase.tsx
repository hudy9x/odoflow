import { Handle, Position } from '@xyflow/react';
import { useWorkflowStore } from "../WorkflowDetail/store";
import { NodeTypeSelect } from "./NodeTypeSelect";

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
  const { isLeafNode, addConnectedNode } = useWorkflowStore()
  const isLeaf = id ? isLeafNode(id) : false

  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Input handle */}
      {!noEdges && <Handle
        type="target"
        position={Position.Left}
        className="!bg-muted-foreground"
      />}

      {/* Output handle */}
      {!noEdges && <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground"
      />}

      {/* Main node content */}
      <div className={`relative rounded-full p-6 transition-all group-hover:shadow-lg`}
           style={{ backgroundColor: color }}>
        <div className="text-white w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        {isLeaf && id && (
          <NodeTypeSelect onSelect={(type) => addConnectedNode(id, type)} />
        )}
      </div>

      {/* Node label */}
      <div className="mt-2 text-center absolute -bottom-1/2 left-0 w-full">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
}
