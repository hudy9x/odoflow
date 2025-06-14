import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ListFilter, X, Plus, Trash2, Equal, Search, SearchX, AlignLeft, AlignRight, ChevronRight, ChevronLeft, Ban, CircleDot, SlashSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
  
import { useState } from "react";
import { WorkflowNodeFilter } from "@/app/services/node.filter.service";
import { useFilterStore } from "./store";
import FilterConditionPreview from "./FilterConditionPreview";
  
  
interface FilterCondition {
    field: string;
    operator: string;
    value: string;
}
  
interface FilterConditionFormProps {
  filterData: WorkflowNodeFilter;
}

export default function FilterConditionForm({ filterData }: FilterConditionFormProps) {
  const { updateFilter } = useFilterStore();
  const defaultConditions = filterData?.conditions.length ? filterData?.conditions : [[{ field: '', operator: 'equals', value: '' }]];
  const [conditions, setConditions] = useState<FilterCondition[][]>(defaultConditions);
  const [label, setLabel] = useState(filterData?.label || '');
  const [visible, setVisible] = useState(false);

  const onSetVisible = () => {
    setVisible(true)
  }

  const onHide = () => {
    setVisible(false)
  }

  const handleAddOr = () => {
    setConditions([...conditions, [{ field: '', operator: 'equals', value: '' }]]);
  };

  const handleAddAnd = (orIndex: number) => {
    const newConditions = [...conditions];
    newConditions[orIndex] = [...newConditions[orIndex], { field: '', operator: 'equals', value: '' }];
    setConditions(newConditions);
  };

  const handleDeleteCondition = (orIndex: number, andIndex: number) => {
    const newConditions = [...conditions];
    
    // If it's the last item in an OR group
    if (newConditions[orIndex].length === 1) {
      // If it's the only OR group, reset it to empty condition
      if (newConditions.length === 1) {
        setConditions([[{ field: '', operator: 'equals', value: '' }]]);
        return;
      }
      // Otherwise, remove the entire OR group
      newConditions.splice(orIndex, 1);
    } else {
      // Remove the specific AND condition
      newConditions[orIndex].splice(andIndex, 1);
    }
    
    setConditions(newConditions);
  };

  const updateCondition = (orIndex: number, andIndex: number, field: keyof FilterCondition, value: string) => {
    const newConditions = [...conditions];
    newConditions[orIndex][andIndex] = {
        ...newConditions[orIndex][andIndex],
        [field]: value
    };
    setConditions(newConditions);
  };

  const removeEmptyCondition = () => {
    const filteredConditions: FilterCondition[][] = []

    conditions.forEach(group => {
      const filteredGroup = group.filter(condition => condition.field)
      if (filteredGroup.length > 0) {
        filteredConditions.push(filteredGroup)
      }
    })
    return filteredConditions
  }

  const saveFilter = async () => {
    try {
      if (filterData) {
        await updateFilter(filterData.id, { conditions: removeEmptyCondition(), label });
      }
      onHide();
    } catch (error) {
      console.error('Failed to save filter:', error);
    }
  };


    
  return (
    <div className="flex justify-center" style={{ pointerEvents: 'all' }}>
      <Popover open={visible} onOpenChange={onSetVisible}>
        <PopoverTrigger asChild>
          <ListFilter className="h-5 w-5 cursor-pointer hover:bg-gray-300 bg-gray-200 border-2 border-white shadow-lg rounded-full p-0.5 text-gray-500" />
        </PopoverTrigger>
        <PopoverContent side="right" className="w-[400px] rounded-xl bg-gray-100/40 backdrop-blur-lg p-1 border border-gray-200 relative">
          <div>
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <h4 className="font-medium leading-none">Edge Filter</h4>
              <Button
                  onClick={onHide}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 cursor-pointer"
              >
                  <X className="h-4 w-4" />
              </Button>
              </div>
            <div className="bg-white px-3 py-3 max-h-[80vh] overflow-y-auto rounded-lg border border-gray-200 shadow-lg space-y-4">
              <div className="space-y-2">
                  <Label>Label</Label>
                  <Input 
                    type="text" 
                    placeholder="Enter label" 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
              </div>

              <FilterConditionPreview conditions={conditions}/>

              <div className="space-y-2 pb-[50px]">
                  <Label>Condition</Label>
                  <div className="space-y-4">
                  {conditions.map((orGroup, orIndex) => (
                      <div key={orIndex} className="space-y-4 bg-zinc-100 rounded-md p-2">
                      {orIndex > 0 && (
                          <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-muted-foreground">OR</span>
                          </div>
                          </div>
                      )}
                      {orGroup.map((condition, andIndex) => (
                          <div key={`${orIndex}-${andIndex}`} className="space-y-2">
                          {andIndex > 0 && (
                              <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                  <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-white px-2 text-muted-foreground">AND</span>
                              </div>
                              </div>
                          )}
                          <div className="flex gap-2">
                              <Input 
                                type="text" 
                                placeholder="Field name" 
                                value={condition.field}
                                onChange={(e) => updateCondition(orIndex, andIndex, 'field', e.target.value)}
                                className="flex-1 bg-white"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-red-500"
                                onClick={() => handleDeleteCondition(orIndex, andIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                          <Select 
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(orIndex, andIndex, 'operator', value)}
                          >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Text operators" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="equals" className="flex items-center gap-2">
                                  <Equal className="h-4 w-4" /> Equal to
                              </SelectItem>
                              <SelectItem value="notEquals" className="flex items-center gap-2">
                                  <SlashSquare className="h-4 w-4" /> Not equal to
                              </SelectItem>
                              <SelectItem value="contains" className="flex items-center gap-2">
                                  <Search className="h-4 w-4" /> Contains
                              </SelectItem>
                              <SelectItem value="notContains" className="flex items-center gap-2">
                                  <SearchX className="h-4 w-4" /> Does not contain
                              </SelectItem>
                              <SelectItem value="startsWith" className="flex items-center gap-2">
                                  <AlignLeft className="h-4 w-4" /> Starts with
                              </SelectItem>
                              <SelectItem value="endsWith" className="flex items-center gap-2">
                                  <AlignRight className="h-4 w-4" /> Ends with
                              </SelectItem>
                              <SelectItem value="greaterThan" className="flex items-center gap-2">
                                  <ChevronRight className="h-4 w-4" /> Greater than
                              </SelectItem>
                              <SelectItem value="greaterThanOrEqual" className="flex items-center gap-2">
                                  <ChevronRight className="h-4 w-4 font-bold" /> Greater than or equal
                              </SelectItem>
                              <SelectItem value="lessThan" className="flex items-center gap-2">
                                  <ChevronLeft className="h-4 w-4" /> Less than
                              </SelectItem>
                              <SelectItem value="lessThanOrEqual" className="flex items-center gap-2">
                                  <ChevronLeft className="h-4 w-4 font-bold" /> Less than or equal
                              </SelectItem>
                              <SelectItem value="empty" className="flex items-center gap-2">
                                  <Ban className="h-4 w-4" /> Is empty
                              </SelectItem>
                              <SelectItem value="notEmpty" className="flex items-center gap-2">
                                  <CircleDot className="h-4 w-4" /> Is not empty
                              </SelectItem>
                              </SelectContent>
                          </Select>
                          <Input 
                              type="text" 
                              className="bg-white"
                              placeholder="Value" 
                              value={condition.value}
                              onChange={(e) => updateCondition(orIndex, andIndex, 'value', e.target.value)}
                          />
                          </div>
                      ))}
                      <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleAddAnd(orIndex)}
                          >
                          <Plus className="h-4 w-4" /> Add AND rule
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={handleAddOr}
                          >
                          <Plus className="h-4 w-4" /> Add OR rule
                          </Button>
                      </div>
                      </div>
                  ))}
                  </div>
              </div>

              <div className="grid grid-cols-2 space-x-2  bg-white/10 backdrop-blur-sm rounded-b-lg absolute bottom-[5px] left-[5px] p-4 w-[calc(100%-10px)]">
                <Button variant="outline" onClick={onHide} size="sm">Cancel</Button>
                <Button onClick={saveFilter} size="sm">Save</Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );  
}