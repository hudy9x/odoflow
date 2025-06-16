import * as React from "react"
import { Input } from "./input"

interface Props {
  value: string
  onChange: (value: string) => void
  items: readonly string[]
  placeholder?: string
  className?: string
  allowCustomValue?: boolean
}

export function Combobox({ value, onChange, items, placeholder, className, allowCustomValue = false }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (allowCustomValue) {
      onChange(newValue)
    }
  }

  const handleItemClick = (item: string) => {
    onChange(item)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="py-1">
            {filteredItems.map((item) => (
              <div
                key={item}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleItemClick(item)
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
