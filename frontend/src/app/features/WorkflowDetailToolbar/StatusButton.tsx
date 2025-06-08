"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { statusWsService, type StatusMessage } from "@/app/services/status.ws.service"

export default function StatusButton() {
  const [isConnected, setIsConnected] = useState(false)

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
        toast.info(`Status: ${msg.status} (Tick: ${msg.tick})`)
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
