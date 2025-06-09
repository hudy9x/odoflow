"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { statusWsService, type StatusMessage } from "@/app/services/status.ws.service"
import { useNodeDebugStore } from "../WorkflowNodeDebug/store"

export default function StatusButton() {
  const [isConnected, setIsConnected] = useState(false)
  const setNodeStatus = useNodeDebugStore(state => state.set)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (statusWsService.isConnected()) {
        statusWsService.disconnect()
      }
    }
  }, [])

  const handleToggle = () => {
    if (isConnected) {
      statusWsService.disconnect()
      setIsConnected(false)
      toast.info("Status WebSocket disconnected")
    } else {
      statusWsService.connect((msg: StatusMessage) => {
        // console.log(msg.channel, msg.message)
        const {channel, message} = msg
        if (channel === 'node-run-log') {
          const payload = JSON.parse(message) as {nodeId: string, status: string, timestamp: number, outputData: Record<string, unknown>, workflowRunId: string}
          console.log(payload)
          if (payload.status === 'ALL_COMPLETED') {
            toast.success("Workflow completed")
            // statusWsService.disconnect()
            // setIsConnected(false)
          }

          setNodeStatus(payload.nodeId, {
            status: payload.status,
            outputData: payload.outputData || {}
          })
        }
        // toast.info(`Status: ${msg.status} (Tick: ${msg.tick}) (${msg.channel}: ${msg.message})`)
      })
      setIsConnected(true)
      toast.success("Status WebSocket connected")
    }
  }

  return (
    <Button
      variant={isConnected ? "secondary" : "default"}
      onClick={handleToggle}
      className="ml-2"
    >
      {isConnected ? "Disconnect Status" : "Connect Status"}
    </Button>
  )
}
