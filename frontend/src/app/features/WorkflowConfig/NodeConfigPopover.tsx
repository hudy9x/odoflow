import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, createContext, useContext, ReactNode } from "react";

// 1. Define Context and Custom Hook
interface PopoverContextType {
  hidePopover: () => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error("usePopoverContext must be used within a NodeConfigPopover (PopoverProvider)");
  }
  return context;
};

// Props for NodeConfigPopover
export interface NodeConfigPopoverProps {
  trigger: ReactNode;
  title: string;
  width?: string;
  children?: ReactNode; // Children prop remains the same
}

export const NodeConfigPopover = ({
  trigger,
  title,
  width = 'max-w-[500px]',
  children
}: NodeConfigPopoverProps) => {
  const [open, setOpen] = useState(false);

  const hidePopover = () => {
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    console.log('isOpen', isOpen);
    setOpen(true);
    // // Allow opening via onOpenChange, but explicit close actions are preferred.
    // // If isOpen is false, it means it was closed by outside click or escape key.
    // if (isOpen) {
    //   setOpen(true);
    // } else {
    //   // If you want to prevent closing on outside click entirely,
    //   // you might need to adjust this logic or rely solely on explicit close buttons.
    //   // For now, let's allow ShadCN's default behavior for onOpenChange for closing.
    //   setOpen(false);
    // }
  };

  const handleTriggerClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    setOpen(true);
  };

  const contextValue = { hidePopover };

  return (
    // 2. Provide the context
    <PopoverContext.Provider value={contextValue}>
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild onClick={handleTriggerClick}> 
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
                onClick={hidePopover} // Use the defined hidePopover function
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white px-3 py-3 rounded-lg border border-gray-200 shadow-lg">
              {children} {/* Children are rendered as before */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </PopoverContext.Provider>
  );
};
