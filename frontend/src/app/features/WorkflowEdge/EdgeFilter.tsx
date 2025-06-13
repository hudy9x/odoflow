import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { ListFilter, X, Plus } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { useState } from "react";


interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export default function EdgeFilter({ edgeId }: { edgeId: string }) {
    const [conditions, setConditions] = useState<FilterCondition[][]>([]);
    const saveFilter = () => {
        console.log('save filter', edgeId)
    }
    return (
    <div style={{ pointerEvents: 'all' }}>
      <Popover>
        <PopoverTrigger asChild>
          <ListFilter className="h-7 w-7 cursor-pointer hover:bg-gray-300 bg-gray-200 border-4 border-white shadow-lg rounded-full p-1 text-gray-500" />
        </PopoverTrigger>
        <PopoverContent className="w-[400px] rounded-xl bg-gray-100/40 backdrop-blur-lg p-1 border border-gray-200">
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
            <div className="bg-white px-3 py-3 rounded-lg border border-gray-200 shadow-lg space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input type="text" placeholder="Enter label" />
              </div>

              <div className="space-y-2">
                <Label>Set the route as a fallback</Label>
                <div className="text-sm text-gray-500 mb-2">
                  A fallback route is a backup route that is used if the source data didn&apos;t go through any other route. One router can have only one fallback route.
                </div>
                <RadioGroup defaultValue="no" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input type="text" placeholder="Field name" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Text operators" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equal to</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts with</SelectItem>
                        <SelectItem value="endsWith">Ends with</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="text" placeholder="Value" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add AND rule
                    </Button>
                    <Button variant="secondary" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add OR rule
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button onClick={saveFilter} size="sm">Save</Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}