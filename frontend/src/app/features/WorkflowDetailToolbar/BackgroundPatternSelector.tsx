import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useWorkflowStore } from "../WorkflowDetail/store"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

const BACKGROUND_PATTERNS: (string | null)[] = [
  '/background/pattern-1.jpg',
  '/background/pattern-2.jpg',
  '/background/pattern-3.jpg',
  '/background/pattern-4.jpg',
  '/background/pattern-5.png',
  '/background/pattern-6.png',
  null // for no background
]

export default function BackgroundPatternSelector() {
  const { setBackground } = useWorkflowStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-3 gap-2">
          {BACKGROUND_PATTERNS.map((pattern) => (
            <button
              key={pattern ?? 'no-bg'}
              className="aspect-square rounded-md overflow-hidden border hover:border-primary transition-colors"
              onClick={() => setBackground(pattern)}
            >
              {pattern ? (
                <Image
                  src={pattern}
                  alt="Background pattern"
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
