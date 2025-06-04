import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface WebhookUrlDisplayProps {
  url: string
}

export function WebhookUrlDisplay({ url }: WebhookUrlDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEBHOOK_TRIGGER_URL}/${url}`)
    toast.success("Webhook URL copied to clipboard")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <label className="text-sm font-medium">Webhook url</label>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground hover:underline whitespace-nowrap truncate flex-1">
          {url}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
