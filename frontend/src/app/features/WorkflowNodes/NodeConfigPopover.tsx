import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export interface NodeConfigPopoverProps {
  trigger: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export const NodeConfigPopover = ({ trigger, title, children }: NodeConfigPopoverProps) => {
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
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">{title}</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
}
