import { Plus } from 'lucide-react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarShortcut,
  MenubarTrigger,
  MenubarMenu
} from "@/components/ui/menubar"
import { useWorkflowStore } from './store'

export default function WorkflowToolbar() {
  const { addNode } = useWorkflowStore()

  const handleAddNode = (type: string) => {
    // Create a new node with a unique ID and random position
    const newNode = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: Math.random() * 100 + 300, // Random X between 300-400
        y: Math.random() * 100 + 100, // Random Y between 100-200
      },
      data: {}
    }

    addNode(newNode)
  }

  return (
    <Menubar className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <MenubarMenu>
        <MenubarTrigger>
          <Plus className="w-4 h-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleAddNode('webhook')}>
            Webhook
            <MenubarShortcut>Trigger events</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAddNode('http')}>
            HTTP Request
            <MenubarShortcut>Make requests</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAddNode('discord')}>
            Discord
            <MenubarShortcut>Send messages</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}