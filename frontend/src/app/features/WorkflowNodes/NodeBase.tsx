import { Handle, Position } from '@xyflow/react';
import { NodeTypeSelect } from '../WorkflowConfig/NodeTypeSelect';
import { NodeTrigger } from '../WorkflowConfig/NodeTrigger';
import { NodeContextMenu } from "../WorkflowConfig/NodeContextMenu";
import NodeStatus from '../WorkflowNodeDebug/NodeStatus';
import { NodeConfigPopover } from '../WorkflowConfig/NodeConfigPopover';

interface NodeBaseProps {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badgeNumber?: number;
  onClick?: () => void;
  color: string;
  noEdges?: boolean;
  type?: string;
  shortId?: string;
  popoverContent?: React.ReactNode;
  popoverTitle?: string;
}

export function NodeBase({ id, title, description, icon, onClick, color, noEdges, type, shortId, popoverContent, popoverTitle }: NodeBaseProps) {
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
      {popoverContent ? (
        <NodeConfigPopover
          trigger={
            <div className={`relative rounded-[40px] border-4 border-white hover:border-gray-200/30 p-6 transition-all duration-200 shadow-lg cursor-pointer`}
                 style={{ backgroundColor: color }}>
              <div className="text-white w-12 h-12 flex items-center justify-center">
                {icon}
              </div>
              {id && <NodeTypeSelect nodeId={id} color={color} />}
            </div>
          }
          title={popoverTitle || title}
        >
          {popoverContent}
        </NodeConfigPopover>
      ) : (
        <div className={`relative rounded-[40px] border-4 border-white hover:border-gray-200/30 p-6 transition-all duration-200 shadow-lg`}
             style={{ backgroundColor: color }}>
          <div className="text-white w-12 h-12 flex items-center justify-center">
            {icon}
          </div>
          {id && <NodeTypeSelect nodeId={id} color={color} />}
        </div>
      )}
      
      {id && <NodeTrigger nodeId={id} nodeType={type || ''} />}

      {/* Node label */}
      <div className="mt-2 text-center absolute -bottom-[70px] left-0 w-full">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{description}</p>
        {shortId && <p className="text-xs text-muted-foreground whitespace-nowrap mt-1 font-mono">#{shortId}</p>}
      </div>

      {id && shortId && <NodeStatus nodeId={id} shortId={shortId}/> }
    </div>
  )

  return id ? (
    <NodeContextMenu id={id}>
      {content}
    </NodeContextMenu>
  ) : content;
}
