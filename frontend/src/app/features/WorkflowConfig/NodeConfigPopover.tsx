import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export interface NodeConfigPopoverProps {
  trigger: React.ReactNode;
  title: string;
  width?: string;
  children?: React.ReactNode;
}

export const NodeConfigPopover = ({ trigger, title, width = 'max-w-[500px]', children }: NodeConfigPopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow opening, prevent closing on outside click
        if (isOpen) setOpen(true);
      }}
    >
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={`${width} rounded-xl bg-gray-100/40 backdrop-blur-lg p-1 border border-gray-200`}>
        <div className="">
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white px-3 py-3 rounded-xl border border-gray-200 shadow-lg">
            {children}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
