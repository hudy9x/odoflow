import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { ListFilter, X } from "lucide-react";

export default function EdgeFilter({ edgeId }: { edgeId: string }) {
    const saveFilter = () => {
        console.log('save filter', edgeId)
    }
  return (
    <div style={{ pointerEvents: 'all' }}>
      <Popover>
        <PopoverTrigger asChild>
          <ListFilter className="h-7 w-7 cursor-pointer hover:bg-gray-300 bg-gray-200 border-4 border-white shadow-lg rounded-full p-1 text-gray-500" />
        </PopoverTrigger>
        <PopoverContent className="w-48 rounded-xl bg-gray-100/40 backdrop-blur-lg p-1 border border-gray-200">
          <div>
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <h4 className="font-medium leading-none">Edge Filter</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white px-3 py-3 rounded-lg border border-gray-200 shadow-lg">
              Nothing here
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}