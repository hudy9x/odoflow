import { ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NodeConfigPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  title: string;
  width?: string;
}

export function NodeConfigPopover({ trigger, children, title, width = "w-[400px]" }: NodeConfigPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={`${width} p-4`} align="start">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
