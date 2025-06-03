import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { memo, useState } from 'react'
import { NodeTypeList } from '@/app/features/WorkflowConfig/NodeTypeList'

const AddNewNode = memo(() => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="link" size={'icon'}>
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2" align="start" side="bottom">
        <NodeTypeList onAdd={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
})

AddNewNode.displayName = 'AddNewNode'

export default AddNewNode