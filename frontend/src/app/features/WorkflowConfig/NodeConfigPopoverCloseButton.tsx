import React from 'react';
import { Button } from '@/components/ui/button';
import { usePopoverContext } from './NodeConfigPopover'; // Assuming it's in the same folder or adjust path

/**
 * A simple button that closes the NodeConfigPopover when clicked.
 * It uses the usePopoverContext hook to access the hidePopover function.
 * This button accepts no props.
 */
export const NodeConfigPopoverCloseButton: React.FC = () => {
  const { hidePopover } = usePopoverContext();

  return (
    <Button variant="outline" onClick={hidePopover}>
      Cancel
    </Button>
  );
};
