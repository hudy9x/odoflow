import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddFilter({ edgeId }: { edgeId: string }){
    console.log('edgeId', edgeId)
    return <Button
    onClick={() => {
      console.log('add filter');
    }}
    variant="ghost"
    size="sm"
    className="w-full justify-start"
  >
    <Plus className="h-4 w-4" />
    Add Filter
  </Button>
}