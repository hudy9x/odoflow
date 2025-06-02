import { Plus } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { memo, useState } from 'react';
import { NodeTypeList } from './NodeTypeList';

export const NodeCreate = memo(() => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <NodeBase
            noEdges={true}
            title="Add Node"
            description="Click to add"
            icon={<Plus className="w-8 h-8" />}
            color="#4B5563"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2" align="start">
        <NodeTypeList onAdd={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
});

NodeCreate.displayName = 'NodeCreate';
