"use client"

import { useState, useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Button from "../Button/Button"

// Component Library Item
const ComponentItem = ({ type, name, component: Component, category = "layout" }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: category,
    item: { type, name, category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 rounded-lg cursor-move transition-all duration-200 ${
        category === "layout"
          ? "bg-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md"
          : "bg-green-100 border border-green-200 hover:border-green-400 hover:bg-green-50"
      } ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
            category === "layout" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-gray-500">{category}</div>
        </div>
      </div>
    </div>
  )
}

// Draggable Child Component with Free Positioning
const DraggableChildComponent = ({ component, isSelected, onSelect, onDelete, onUpdatePosition, parentId }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "existing-child",
    item: { id: component.id, parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const renderComponent = () => {
    const { type, props } = component

    switch (type) {
      case "button":
        return (
          <Button
            className={props.className}
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: "none",
              fontSize: props.fontSize || "14px",
              fontWeight: props.fontWeight || "normal",
              width: props.width || "auto",
              height: props.height || "auto",
            }}
          >
            {props.text || "Button"}
          </Button>
        )

      case "dropdown":
        return (
          <select
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: "1px solid #d1d5db",
              fontSize: props.fontSize || "14px",
              width: props.width || "150px",
            }}
          >
            <option>{props.placeholder || "Select option"}</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        )

      case "searchbar":
        return (
          <div className="flex items-center gap-2" style={{ width: props.width || "250px" }}>
            <input
              type="text"
              placeholder={props.placeholder || "Search..."}
              style={{
                backgroundColor: props.bgColor,
                color: props.textColor,
                padding: props.padding,
                borderRadius: props.borderRadius,
                border: "1px solid #d1d5db",
                fontSize: props.fontSize || "14px",
                flex: 1,
              }}
            />
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "8px",
                borderRadius: props.borderRadius,
                border: "none",
                cursor: "pointer",
              }}
            >
              🔍
            </button>
          </div>
        )

      case "text":
        return (
          <span
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              fontSize: props.fontSize || "14px",
              fontWeight: props.fontWeight || "normal",
            }}
          >
            {props.text || "Text Element"}
          </span>
        )

      case "logo":
        return (
          <div
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              fontSize: props.fontSize || "18px",
              fontWeight: "bold",
            }}
          >
            {props.text || "LOGO"}
          </div>
        )

      default:
        return <div>Unknown Component</div>
    }
  }

  return (
    <div
      ref={drag}
      className={`absolute cursor-move group ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${
        isDragging ? "opacity-50 z-50" : "z-10"
      }`}
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

      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-white border rounded shadow-lg p-1 z-20">
          <button className="w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100 rounded" title="Move">
            ↔
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-red-50 rounded"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(component.id)
            }}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}

      {/* Position indicator */}
      <div className="absolute -bottom-6 left-0 text-xs text-gray-400 bg-white px-1 rounded border">
        {Math.round(component.position?.x || 0)}, {Math.round(component.position?.y || 0)}
      </div>
    </div>
  )
}

// Enhanced Canvas with Free Positioning
const Canvas = ({
  components,
  setComponents,
  setSelectedProps,
  selectedComponent,
  setSelectedComponent,
  selectedChild,
  setSelectedChild,
}) => {
  const dropRef = useRef(null)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["layout", "component", "existing-child"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = dropRef.current?.getBoundingClientRect()

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top

        // Handle layout components
        if (item.category === "layout") {
          if (item.type === "navbar" && !components.some((c) => c.type === "navbar")) {
            const newNavbar = {
              id: Date.now(),
              type: "navbar",
              props: {
                bgColor: "#1f2937",
                textColor: "#ffffff",
                padding: "16px",
                height: "64px",
                width: "100%",
                borderRadius: "8px",
              },
              children: [],
            }
            setComponents([...components, newNavbar])
            setSelectedProps(newNavbar.props)
            setSelectedComponent(newNavbar)
          } else if (item.type === "card") {
            const newCard = {
              id: Date.now(),
              type: "card",
              props: {
                bgColor: "#ffffff",
                textColor: "#000000",
                padding: "24px",
                width: "300px",
                height: "200px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                title: "Card Title",
              },
              children: [],
            }
            setComponents([...components, newCard])
            setSelectedProps(newCard.props)
            setSelectedComponent(newCard)
          } else if (item.type === "container") {
            const newContainer = {
              id: Date.now(),
              type: "container",
              props: {
                bgColor: "#f9fafb",
                textColor: "#6b7280",
                padding: "32px",
                width: "400px",
                height: "300px",
                borderRadius: "8px",
                border: "2px dashed #d1d5db",
              },
              children: [],
            }
            setComponents([...components, newContainer])
            setSelectedProps(newContainer.props)
            setSelectedComponent(newContainer)
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  // Handle adding child components to layouts
  const handleAddChild = (parentId, childType, position = { x: 0, y: 0 }) => {
    const newChild = createChildComponent(childType, position)

    setComponents((prev) =>
      prev.map((comp) => (comp.id === parentId ? { ...comp, children: [...comp.children, newChild] } : comp)),
    )
    setSelectedChild(newChild)
    setSelectedProps(newChild.props)
  }

  // Handle updating child position
  const handleUpdateChildPosition = (parentId, childId, position) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === parentId
          ? {
              ...comp,
              children: comp.children.map((child) => (child.id === childId ? { ...child, position } : child)),
            }
          : comp,
      ),
    )

    if (selectedChild?.id === childId) {
      setSelectedChild((prev) => ({ ...prev, position }))
    }
  }

  // Handle deleting child components
  const handleDeleteChild = (childId) => {
    setComponents((prev) =>
      prev.map((comp) => ({
        ...comp,
        children: comp.children.filter((child) => child.id !== childId),
      })),
    )
    setSelectedChild(null)
    setSelectedProps(null)
  }

  const createChildComponent = (type, position) => {
    const baseProps = {
      bgColor: "#ffffff",
      textColor: "#000000",
      padding: "8px 16px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "normal",
      width: "auto",
      height: "auto",
    }

    const typeSpecificProps = {
      button: {
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        text: "Button",
        className: "bg-blue-500 text-white px-4 py-2 rounded",
      },
      dropdown: {
        bgColor: "#ffffff",
        width: "150px",
        placeholder: "Select option",
      },
      searchbar: {
        bgColor: "#ffffff",
        width: "250px",
        placeholder: "Search...",
      },
      text: {
        bgColor: "transparent",
        text: "Text Element",
      },
      logo: {
        bgColor: "transparent",
        text: "LOGO",
        fontWeight: "bold",
        fontSize: "18px",
      },
    }

    return {
      id: Date.now() + Math.random(),
      type,
      props: { ...baseProps, ...typeSpecificProps[type] },
      position,
    }
  }

  const renderComponent = (comp) => {
    const LayoutDropZone = ({ children, layoutType }) => {
      const layoutDropRef = useRef(null)

      const [{ isOver: isLayoutOver }, layoutDrop] = useDrop(() => ({
        accept: ["component", "existing-child"],
        drop: (item, monitor) => {
          const offset = monitor.getClientOffset()
          const layoutRect = layoutDropRef.current?.getBoundingClientRect()

          if (offset && layoutRect) {
            const x = offset.x - layoutRect.left
            const y = offset.y - layoutRect.top

            if (item.id) {
              // Moving existing child
              handleUpdateChildPosition(comp.id, item.id, { x, y })
            } else if (item.category === "component") {
              // Adding new child
              handleAddChild(comp.id, item.type, { x, y })
            }
          }
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }))

      return (
        <div
          ref={(node) => {
            layoutDrop(node)
            layoutDropRef.current = node
          }}
          className={`relative ${isLayoutOver ? "bg-green-100 bg-opacity-50" : ""}`}
          style={{ minHeight: layoutType === "navbar" ? "64px" : "200px" }}
        >
          {children}

          {/* Grid overlay when selected */}
          {selectedComponent?.id === comp.id && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #3b82f6 1px, transparent 1px),
                    linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
          )}

          {/* Empty state */}
          {comp.children.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
              <div className="text-center">
                <div className="text-2xl mb-2">📍</div>
                <span className="text-sm">Drop components anywhere</span>
              </div>
            </div>
          )}

          {/* Render child components */}
          {comp.children.map((child) => (
            <DraggableChildComponent
              key={child.id}
              component={child}
              isSelected={selectedChild?.id === child.id}
              onSelect={setSelectedChild}
              onDelete={handleDeleteChild}
              onUpdatePosition={handleUpdateChildPosition}
              parentId={comp.id}
            />
          ))}
        </div>
      )
    }

    if (comp.type === "navbar") {
      return (
        <div
          className={`w-full mb-6 rounded cursor-pointer transition-all ${
            selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
          }`}
          style={{
            backgroundColor: comp.props.bgColor,
            color: comp.props.textColor,
            padding: comp.props.padding,
            height: comp.props.height,
            borderRadius: comp.props.borderRadius,
          }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedProps(comp.props)
            setSelectedComponent(comp)
            setSelectedChild(null)
          }}
        >
          <LayoutDropZone layoutType="navbar">
            <div className="flex items-center h-full">
              <span className="font-bold mr-4">Navbar</span>
            </div>
          </LayoutDropZone>
        </div>
      )
    }

    if (comp.type === "card") {
      return (
        <div
          className={`mb-6 rounded cursor-pointer transition-all ${
            selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
          }`}
          style={{
            backgroundColor: comp.props.bgColor,
            color: comp.props.textColor,
            padding: comp.props.padding,
            width: comp.props.width,
            height: comp.props.height,
            borderRadius: comp.props.borderRadius,
            border: comp.props.border,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedProps(comp.props)
            setSelectedComponent(comp)
            setSelectedChild(null)
          }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{comp.props.title}</h3>
          </div>
          <LayoutDropZone layoutType="card" />
        </div>
      )
    }

    if (comp.type === "container") {
      return (
        <div
          className={`mb-6 cursor-pointer transition-all ${
            selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
          }`}
          style={{
            backgroundColor: comp.props.bgColor,
            color: comp.props.textColor,
            padding: comp.props.padding,
            width: comp.props.width,
            height: comp.props.height,
            borderRadius: comp.props.borderRadius,
            border: comp.props.border,
          }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedProps(comp.props)
            setSelectedComponent(comp)
            setSelectedChild(null)
          }}
        >
          <LayoutDropZone layoutType="container" />
        </div>
      )
    }

    return null
  }

  return (
    <div
      ref={(node) => {
        drop(node)
        dropRef.current = node
      }}
      className={`flex-1 h-[500px] bg-gray-100 p-4 rounded-lg border-2 transition-all ${
        isOver && canDrop ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
      onClick={() => {
        setSelectedComponent(null)
        setSelectedChild(null)
        setSelectedProps(null)
      }}
    >
      {components.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-medium mb-2">Start Building</h3>
            <p>Drag layout components here to begin</p>
          </div>
        </div>
      ) : (
        components.map((comp, index) => <div key={comp.id || index}>{renderComponent(comp)}</div>)
      )}
    </div>
  )
}

// Enhanced Properties Panel
const PropertiesPanel = ({
  selectedProps,
  setSelectedProps,
  components,
  setComponents,
  selectedComponent,
  selectedChild,
  setSelectedChild,
}) => {
  if (!selectedProps) {
    return (
      <div className="p-4 bg-white border-t">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">⚙️</div>
          <h3 className="font-medium mb-1">No Selection</h3>
          <p className="text-sm">Select a component to edit properties</p>
        </div>
      </div>
    )
  }

  const updateProp = (key, value) => {
    const updatedProps = { ...selectedProps, [key]: value }
    setSelectedProps(updatedProps)

    if (selectedChild) {
      // Update child component
      const updatedChild = { ...selectedChild, props: updatedProps }
      setSelectedChild(updatedChild)

      setComponents((prev) =>
        prev.map((comp) => ({
          ...comp,
          children: comp.children.map((child) => (child.id === selectedChild.id ? updatedChild : child)),
        })),
      )
    } else {
      // Update layout component
      setComponents((prev) =>
        prev.map((comp) => {
          if (comp.props === selectedProps) {
            return { ...comp, props: updatedProps }
          }
          return comp
        }),
      )
    }
  }

  const updateChildPosition = (axis, value) => {
    if (selectedChild) {
      const newPosition = {
        ...selectedChild.position,
        [axis]: Number.parseInt(value) || 0,
      }

      const updatedChild = { ...selectedChild, position: newPosition }
      setSelectedChild(updatedChild)

      setComponents((prev) =>
        prev.map((comp) => ({
          ...comp,
          children: comp.children.map((child) => (child.id === selectedChild.id ? updatedChild : child)),
        })),
      )
    }
  }

  return (
    <div className="p-4 bg-white border-t max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Properties
        {selectedChild && <span className="text-sm bg-blue-100 px-2 py-1 rounded">Child Component</span>}
      </h3>

      {/* Position Controls for Child Components */}
      {selectedChild && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">X Position</label>
              <input
                type="number"
                value={selectedChild.position?.x || 0}
                onChange={(e) => updateChildPosition("x", e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Y Position</label>
              <input
                type="number"
                value={selectedChild.position?.y || 0}
                onChange={(e) => updateChildPosition("y", e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </div>
          </div>

          {/* Quick Position Buttons */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Quick Position</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  updateChildPosition("x", 10)
                  updateChildPosition("y", 10)
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Left
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 150)
                  updateChildPosition("y", 10)
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Center
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 300)
                  updateChildPosition("y", 10)
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Right
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Common Properties */}
      <div className="space-y-3">
        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium">Background Color</label>
          <input
            type="color"
            value={selectedProps.bgColor || "#ffffff"}
            onChange={(e) => updateProp("bgColor", e.target.value)}
            className="w-full h-8 border rounded"
          />
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedProps.textColor || "#000000"}
            onChange={(e) => updateProp("textColor", e.target.value)}
            className="w-full h-8 border rounded"
          />
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm font-medium">Padding</label>
          <input
            type="text"
            value={selectedProps.padding || ""}
            onChange={(e) => updateProp("padding", e.target.value)}
            placeholder="16px"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium">Border Radius</label>
          <input
            type="text"
            value={selectedProps.borderRadius || ""}
            onChange={(e) => updateProp("borderRadius", e.target.value)}
            placeholder="4px"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Component-specific properties */}
        {selectedProps.text !== undefined && (
          <div>
            <label className="block text-sm font-medium">Text</label>
            <input
              type="text"
              value={selectedProps.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedProps.placeholder !== undefined && (
          <div>
            <label className="block text-sm font-medium">Placeholder</label>
            <input
              type="text"
              value={selectedProps.placeholder || ""}
              onChange={(e) => updateProp("placeholder", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedProps.title !== undefined && (
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={selectedProps.title || ""}
              onChange={(e) => updateProp("title", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedProps.width !== undefined && (
          <div>
            <label className="block text-sm font-medium">Width</label>
            <input
              type="text"
              value={selectedProps.width || ""}
              onChange={(e) => updateProp("width", e.target.value)}
              placeholder="auto"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedProps.fontSize !== undefined && (
          <div>
            <label className="block text-sm font-medium">Font Size</label>
            <input
              type="text"
              value={selectedProps.fontSize || ""}
              onChange={(e) => updateProp("fontSize", e.target.value)}
              placeholder="14px"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedProps.className !== undefined && (
          <div>
            <label className="block text-sm font-medium">Class Name</label>
            <input
              type="text"
              value={selectedProps.className || ""}
              onChange={(e) => updateProp("className", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Dashboard
const Dashboard = () => {
  const [components, setComponents] = useState([])
  const [selectedProps, setSelectedProps] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [selectedChild, setSelectedChild] = useState(null)
  const [showCode, setShowCode] = useState(false)

  const layoutComponents = [
    { type: "navbar", name: "Navbar", category: "layout" },
    { type: "card", name: "Card", category: "layout" },
    { type: "container", name: "Container", category: "layout" },
  ]

  const childComponents = [
    { type: "button", name: "Button", component: Button, category: "component" },
    { type: "dropdown", name: "Dropdown", category: "component" },
    { type: "searchbar", name: "Search Bar", category: "component" },
    { type: "text", name: "Text", category: "component" },
    { type: "logo", name: "Logo", category: "component" },
  ]

  const generateCode = () => {
    if (components.length === 0) return "// No components added"

    let code = `// Generated Layout Components\n`
    code += `import React from 'react';\n`
    code += `import Button from '../Button/Button';\n\n`
    code += `export default function GeneratedLayout() {\n`
    code += `  return (\n`
    code += `    <div className="min-h-screen bg-gray-50 p-6">\n`

    components.forEach((comp, index) => {
      if (comp.type === "navbar") {
        code += `      <nav style={{\n`
        code += `        backgroundColor: '${comp.props.bgColor}',\n`
        code += `        color: '${comp.props.textColor}',\n`
        code += `        padding: '${comp.props.padding}',\n`
        code += `        height: '${comp.props.height}',\n`
        code += `        borderRadius: '${comp.props.borderRadius}',\n`
        code += `        position: 'relative',\n`
        code += `        marginBottom: '24px'\n`
        code += `      }}>\n`

        comp.children.forEach((child) => {
          code += `        <div style={{\n`
          code += `          position: 'absolute',\n`
          code += `          left: '${child.position?.x || 0}px',\n`
          code += `          top: '${child.position?.y || 0}px'\n`
          code += `        }}>\n`

          if (child.type === "button") {
            code += `          <Button className="${child.props.className}">\n`
            code += `            ${child.props.text}\n`
            code += `          </Button>\n`
          } else if (child.type === "text") {
            code += `          <span style={{ color: '${child.props.textColor}' }}>\n`
            code += `            ${child.props.text}\n`
            code += `          </span>\n`
          }

          code += `        </div>\n`
        })

        code += `      </nav>\n`
      }

      if (comp.type === "card") {
        code += `      <div style={{\n`
        code += `        backgroundColor: '${comp.props.bgColor}',\n`
        code += `        padding: '${comp.props.padding}',\n`
        code += `        borderRadius: '${comp.props.borderRadius}',\n`
        code += `        border: '${comp.props.border}',\n`
        code += `        width: '${comp.props.width}',\n`
        code += `        height: '${comp.props.height}',\n`
        code += `        position: 'relative',\n`
        code += `        marginBottom: '24px'\n`
        code += `      }}>\n`
        code += `        <h3>${comp.props.title}</h3>\n`

        comp.children.forEach((child) => {
          code += `        <div style={{\n`
          code += `          position: 'absolute',\n`
          code += `          left: '${child.position?.x || 0}px',\n`
          code += `          top: '${child.position?.y || 0}px'\n`
          code += `        }}>\n`

          if (child.type === "button") {
            code += `          <Button>${child.props.text}</Button>\n`
          }

          code += `        </div>\n`
        })

        code += `      </div>\n`
      }
    })

    code += `    </div>\n`
    code += `  );\n`
    code += `}`

    return code
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Design Canvas</h2>
            <div className="flex items-center gap-2">
              {selectedComponent && (
                <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">
                  Editing: {selectedComponent.type} ({selectedComponent.children?.length || 0} children)
                </span>
              )}
              {selectedChild && (
                <span className="text-sm bg-green-100 px-3 py-1 rounded-full">Child: {selectedChild.type}</span>
              )}
            </div>
          </div>

          <Canvas
            components={components}
            setComponents={setComponents}
            setSelectedProps={setSelectedProps}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            selectedChild={selectedChild}
            setSelectedChild={setSelectedChild}
          />

          <div className="mt-4 flex gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? "Hide Code" : "Show Code"}
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={() => {
                setComponents([])
                setSelectedProps(null)
                setSelectedComponent(null)
                setSelectedChild(null)
              }}
            >
              Clear All
            </button>
          </div>

          {showCode && (
            <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded overflow-auto max-h-64 text-sm">
              <code>{generateCode()}</code>
            </pre>
          )}
        </div>

        {/* Component Library Sidebar */}
        <div className="w-64 bg-white p-4 border-l">
          <h2 className="text-xl font-bold mb-4">Components</h2>

          {/* Layout Components */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Layout Components</h3>
            {layoutComponents.map((comp) => (
              <ComponentItem
                key={comp.type}
                type={comp.type}
                name={comp.name}
                component={comp.component}
                category={comp.category}
              />
            ))}
          </div>

          {/* Child Components - Only show when layout is selected */}
          {selectedComponent && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Child Components</h3>
              <div className="text-xs text-gray-500 mb-2">Drop these anywhere in your {selectedComponent.type}</div>
              {childComponents.map((comp) => (
                <ComponentItem
                  key={comp.type}
                  type={comp.type}
                  name={comp.name}
                  component={comp.component}
                  category={comp.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <PropertiesPanel
        selectedProps={selectedProps}
        setSelectedProps={setSelectedProps}
        components={components}
        setComponents={setComponents}
        selectedComponent={selectedComponent}
        selectedChild={selectedChild}
        setSelectedChild={setSelectedChild}
      />
    </DndProvider>
  )
}

export default Dashboard
