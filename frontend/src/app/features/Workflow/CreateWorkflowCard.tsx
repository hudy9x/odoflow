import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateWorkflowCardProps {
  onClick: () => void;
}

export function CreateWorkflowCard({ onClick }: CreateWorkflowCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer bg-gray-100 p-1 transition-colors hover:bg-gray-200"
      onClick={onClick}
    >
      <CardContent className="rounded-md p-4 h-full bg-gray-50 shadow-md hover:shadow-lg hover:shadow-gray-300 transition-all duration-200 flex flex-col justify-center">
        <div className="w-12 h-12 mb-2 rounded-2xl flex items-center justify-center border-2 border-dashed bg-gray-100 text-gray-400">
          <Plus className="h-6 w-6" />
        </div>
        <span className="text-base font-semibold text-gray-500">Create Workflow</span>
        <p className="text-xs text-gray-500 mt-1">
          Design and automate a custom process
        </p>
      </CardContent>
    </Card>
  );
}
