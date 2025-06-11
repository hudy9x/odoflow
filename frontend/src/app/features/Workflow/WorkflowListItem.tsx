import { Card, CardContent } from '@/components/ui/card';
import { nodeIconMap, defaultNodeIconMeta } from '../WorkflowNodes/NodeIcons';
import { format } from 'date-fns';
import { Workflow } from '@/types/workflow';
import { CircleCheck, CircleSlash } from 'lucide-react';

interface WorkflowListItemProps {
  workflow: Workflow;
  onClick: () => void;
}

export function WorkflowListItem({ workflow, onClick }: WorkflowListItemProps) {

  function renderNodeIcons() {
    const uniqueTypes = Array.from(new Set(workflow.nodes.map(node => node.type)));
    if (uniqueTypes.length === 0) {
      // No nodes: show a plus icon
      return (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-dashed bg-gray-100 text-gray-400">
          <CircleSlash className="h-6 w-6" />
        </div>
      );
    }
    const displayTypes = uniqueTypes.slice(0, 3);
    const remaining = uniqueTypes.length - 3;
    return (
      <>
        {displayTypes.map((type) => {
          const { icon: IconComponent, bg, color } = nodeIconMap[type] || defaultNodeIconMeta;
          return (
            <div
              key={type}
              style={{ backgroundColor: bg }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <IconComponent className="h-6 w-6" style={{ stroke: color }} />
            </div>
          );
        })}
        {remaining > 0 && (
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-200 text-gray-600 font-semibold text-base"
          >
            +{remaining}
          </div>
        )}
      </>
    );
  }

  return (
    <Card
      key={workflow.id}
      className={`overflow-hidden cursor-pointer bg-gray-100 hover:bg-white p-1 hover:shadow-2xl active:shadow active:shadow-zinc-100 hover:shadow-zinc-400 transition-all duration-150`}
      onClick={onClick}
    >
      <CardContent className="rounded-md p-4 bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-zinc-100 shadow-md hover:shadow-zinc-300 transition-all duration-200">
        <div className="space-y-4">
          {/* Node Icons */}
          <div className="flex gap-1 hover:gap-2 transition-all duration-200">
            {renderNodeIcons()}
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-2">
              {workflow.isActive ? (
                <CircleCheck size={18} className="text-green-500" />
              ) : (
                <CircleSlash size={18} className="text-gray-300" />
              )}
              <h3 className="font-medium text-gray-900">{workflow.name}</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created {format(new Date(workflow.createdAt), 'dd MMM yyyy')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
