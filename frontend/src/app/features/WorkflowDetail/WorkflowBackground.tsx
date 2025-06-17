import { useWorkflowStore } from "./store"

export default function WorkflowBackground() {
  const { background } = useWorkflowStore()
  if (!background) return null
  return (
    <div 
      className="absolute inset-0 opacity-10" 
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        backgroundRepeat: 'repeat',
        pointerEvents: 'none'
      }}
    />
  )
}