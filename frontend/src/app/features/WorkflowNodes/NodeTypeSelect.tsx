import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Globe, MessageSquare, Plus, Webhook } from "lucide-react"

interface Props {
  onSelect: (type: string) => void
}

const nodeTypes = [
  { 
    type: 'webhook',
    title: 'Webhook',
    description: 'Trigger events',
    icon: <Webhook className="w-4 h-4" />,
  },
  {
    type: 'http',
    title: 'HTTP Request',
    description: 'Make a request',
    icon: <Globe className="w-4 h-4" />,
  },
  {
    type: 'discord',
    title: 'Discord',
    description: 'Send a Message',
    icon: <MessageSquare className="w-4 h-4" />,
  }
]

export function NodeTypeSelect({ onSelect }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {nodeTypes.map((node) => (
            <Button
              key={node.type}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(node.type)
              }}
            >
              {node.icon}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{node.title}</span>
                <span className="text-xs text-muted-foreground">{node.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
