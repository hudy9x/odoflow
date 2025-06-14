import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useEdgeFilter } from './hooks/useEdgeFilter';

export default function DeleteFilter({ edgeId }: { edgeId: string }) {
  const { existingFilter, handleRemoveFilter } = useEdgeFilter(edgeId);

  if (!existingFilter) return null;

  return (
    <Button
      onClick={handleRemoveFilter}
      variant="ghost"
      size="sm"
      className="w-full justify-start"
    >
      <Trash2 className="h-4 w-4" />
      Delete Filter
    </Button>
  );
}