"use client"

import { useDrag } from "react-dnd"

export default function DraggableChildComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
  parentId,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "existing-child",
    item: { id: component.id, parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const renderComponent = () => {
    const { type, props } = component
    const baseStyle = {
      backgroundColor: props?.bgColor || "#ffffff",
      color: props?.textColor || "#000000",
      padding: props?.padding || "8px 16px",
      borderRadius: props?.borderRadius || "4px",
      border: props?.border || "1px solid #d1d5db",
      fontSize: props?.fontSize || "14px",
      fontWeight: props?.fontWeight || "normal",
      width: props?.width || "auto",
      height: props?.height || "auto",
    }

    switch (type) {
      case "button":
        return (
          <button style={baseStyle} className="cursor-pointer hover:opacity-80 transition-opacity">
            {props?.text || "Button"}
          </button>
        )

      case "input":
        return (
          <input
            type="text"
            placeholder={props?.placeholder || "Enter text..."}
            style={baseStyle}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case "dropdown":
        return (
          <select style={baseStyle} className="cursor-pointer">
            <option>{props?.placeholder || "Select option"}</option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        )

      case "searchbar":
        return (
          <div className="flex items-center gap-2" style={{ width: props?.width || "250px" }}>
            <input
              type="text"
              placeholder={props?.placeholder || "Search..."}
              style={{ ...baseStyle, flex: 1 }}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "8px 12px",
                borderRadius: props?.borderRadius || "4px",
                border: "none",
                cursor: "pointer",
              }}
              className="hover:bg-blue-600 transition-colors"
            >
              🔍
            </button>
          </div>
        )

      case "text":
        return <span style={baseStyle}>{props?.text || "Text Element"}</span>

      case "image":
        return (
          <img
            src={props?.src || "/placeholder.svg?height=150&width=200"}
            alt={props?.alt || "Image"}
            style={baseStyle}
            className="object-cover"
          />
        )

      case "logo":
        return (
          <div style={{ ...baseStyle, fontWeight: "bold", fontSize: props?.fontSize || "18px" }}>
            {props?.text || "LOGO"}
          </div>
        )

      case "icon":
        return <span style={{ ...baseStyle, fontSize: props?.fontSize || "24px" }}>{props?.text || "⭐"}</span>

      default:
        return <div style={baseStyle}>{props?.text || `${type} component`}</div>
    }
  }

  return (
    <div
      ref={drag}
      className={`absolute cursor-move group transition-all ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-20" : "z-10"
      } ${isDragging ? "opacity-50 scale-95" : ""}`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        transform: isDragging ? "rotate(2deg)" : "none",
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(component)
      }}
    >
      {renderComponent()}

      {/* Control buttons when selected */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-white border rounded shadow-lg p-1 z-30">
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">{component.type}</div>
          <button
            className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(component.id)
            }}
            title="Delete component"
          >
            ✕
          </button>
        </div>
      )}

      {/* Position indicator */}
      <div className="absolute -bottom-6 left-0 text-xs text-gray-400 bg-white px-1 rounded border opacity-0 group-hover:opacity-100 transition-opacity">
        x: {Math.round(component.position?.x || 0)}, y: {Math.round(component.position?.y || 0)}
      </div>
    </div>
  )
}
