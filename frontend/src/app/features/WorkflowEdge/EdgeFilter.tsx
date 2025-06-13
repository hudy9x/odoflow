import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "../../../components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

export default function EdgeFilter({ edgeId }: { edgeId: string }) {
    console.log('edge filter', edgeId)
    return <div style={{ pointerEvents: 'all' }}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ListFilter className="h-7 w-7 cursor-pointer hover:bg-gray-300 bg-gray-200 border-4 border-white shadow-lg rounded-full p-1 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {/* <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4" />
          <span>Add Filter</span>
        </DropdownMenuItem> */}

        {/* <DeleteEdgeMenuItem edgeId={id} /> */}

      </DropdownMenuContent>
    </DropdownMenu>
  </div>
}