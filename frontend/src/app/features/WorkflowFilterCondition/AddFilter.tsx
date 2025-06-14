import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEdgeFilter } from './hooks/useEdgeFilter';

export default function AddFilter({ edgeId }: { edgeId: string }) {
  const { existingFilter, handleAddFilter } = useEdgeFilter(edgeId);

  if (existingFilter) return null;

  return (
    <Button
      onClick={handleAddFilter}
      variant="ghost"
      size="sm"
      className="w-full justify-start"
    >
      <Plus className="h-4 w-4" />
      Add Filter
    </Button>
  );
}