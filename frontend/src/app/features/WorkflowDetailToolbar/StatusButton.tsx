"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { statusWsService, type StatusMessage } from "@/app/services/status.ws.service"
import { useNodeDebugStore } from "../WorkflowNodeDebug/store"
import { useWorkflowStore } from "../WorkflowDetail/store"
import { Play, Square } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function StatusButton() {
  const [isConnected, setIsConnected] = useState(false)
  const setNodeStatus = useNodeDebugStore(state => state.set)
  const isWorkflowActive = useWorkflowStore(state => state.isActive)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (statusWsService.isConnected()) {
        statusWsService.disconnect()
      }
    }
  }, [])

  const handleToggle = () => {
    if (!isWorkflowActive && !isConnected) {
      toast.warning("Cannot run test mode on inactive workflow. Please activate the workflow first.")
      return
    }

    if (isConnected) {
      statusWsService.disconnect()
      setIsConnected(false)
      toast.info("Status WebSocket disconnected")
    } else {
      statusWsService.connect((msg: StatusMessage) => {
        // console.log(msg.channel, msg.message)
        const {channel, message} = msg
        if (channel === 'node-run-log') {
          const payload = JSON.parse(message) as {nodeId: string, status: string, timestamp: number, outputData: Record<string, unknown>, workflowRunId: string, error?: string}
          console.log(payload)
          if (payload.status === 'ALL_COMPLETED') {
            toast.success("Workflow completed")
            // statusWsService.disconnect()
            // setIsConnected(false)
          }

          setNodeStatus(payload.nodeId, {
            status: payload.status,
            outputData: payload.outputData || {},
            error: payload.error || undefined
          })
        }
        // toast.info(`Status: ${msg.status} (Tick: ${msg.tick}) (${msg.channel}: ${msg.message})`)
      })
      setIsConnected(true)
      toast.success("Status WebSocket connected")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"link"}
          size={"icon"}
          onClick={handleToggle}
          className="ml-2"
        >
          {isConnected ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isConnected ? 'Stop test mode' : 'Run test mode'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
