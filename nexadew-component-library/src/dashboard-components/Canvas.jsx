"use client"

import { useRef } from "react"
import { useDrop } from "react-dnd"
import DraggableChildComponent from "./DraggableChildComponent"
import ComponentFactory from "../utils/ComponentFactory"

export default function Canvas({
  components,
  setComponents,
  setSelectedProps,
  selectedComponent,
  setSelectedComponent,
  selectedChild,
  setSelectedChild,
}) {
  const dropRef = useRef(null)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["layout", "component", "existing-child"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = dropRef.current?.getBoundingClientRect()

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top

        if (item.category === "layout") {
          const newComponent = ComponentFactory.createComponent(item.type, { x, y })
          if (newComponent) {
            setComponents([...components, newComponent])
            setSelectedProps(newComponent.props)
            setSelectedComponent(newComponent)
            setSelectedChild(null)
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  const handleAddChild = (parentId, childType, position = { x: 0, y: 0 }) => {
    const newChild = ComponentFactory.createChildComponent(childType, position)
    if (newChild) {
      setComponents((prev) =>
        prev.map((comp) => (comp.id === parentId ? { ...comp, children: [...(comp.children || []), newChild] } : comp)),
      )
      setSelectedChild(newChild)
      setSelectedProps(newChild.props)
    }
  }

  const handleUpdateChildPosition = (parentId, childId, position) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === parentId
          ? {
              ...comp,
              children: (comp.children || []).map((child) => (child.id === childId ? { ...child, position } : child)),
            }
          : comp,
      ),
    )
    if (selectedChild?.id === childId) {
      setSelectedChild((prev) => ({ ...prev, position }))
    }
  }

  const handleDeleteChild = (childId) => {
    setComponents((prev) =>
      prev.map((comp) => ({
        ...comp,
        children: (comp.children || []).filter((child) => child.id !== childId),
      })),
    )
    setSelectedChild(null)
    setSelectedProps(null)
  }

  const handleDeleteComponent = (componentId) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== componentId))
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null)
      setSelectedProps(null)
    }
    setSelectedChild(null)
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
              handleUpdateChildPosition(comp.id, item.id, { x, y })
            } else if (item.category === "component") {
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

          {/* Grid overlay when component is selected */}
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
          {(!comp.children || comp.children.length === 0) && (
            <div className="absolute inset-4 flex items-center justify-center text-gray-400 pointer-events-none border-2 border-dashed border-gray-300 rounded">
              <div className="text-center">
                <div className="text-3xl mb-2">📍</div>
                <span className="text-sm">Drop components here</span>
              </div>
            </div>
          )}

          {/* Render children */}
          {comp.children?.map((child) => (
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

    const componentStyle = {
      backgroundColor: comp.props?.bgColor || "#ffffff",
      color: comp.props?.textColor || "#000000",
      padding: comp.props?.padding || "16px",
      borderRadius: comp.props?.borderRadius || "8px",
      border: comp.props?.border || "1px solid #e5e7eb",
      width: comp.props?.width || "100%",
      height: comp.props?.height || "auto",
      minHeight: comp.props?.minHeight || "100px",
    }

    return (
      <div
        key={comp.id}
        className={`mb-6 relative group cursor-pointer transition-all ${
          selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
        }`}
        style={componentStyle}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedProps(comp.props)
          setSelectedComponent(comp)
          setSelectedChild(null)
        }}
      >
        {/* Component header */}
        <div className="absolute -top-8 left-0 bg-white border rounded shadow-sm px-2 py-1 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {comp.type} #{comp.id}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteComponent(comp.id)
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          ✕
        </button>

        {/* Component content */}
        {comp.type === "navbar" && (
          <LayoutDropZone layoutType="navbar">
            <div className="flex items-center h-full">
              <span className="font-bold">Navigation Bar</span>
            </div>
          </LayoutDropZone>
        )}

        {comp.type === "hero" && (
          <LayoutDropZone layoutType="hero">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">{comp.props?.title || "Hero Title"}</h1>
              <p className="text-lg text-gray-600">{comp.props?.subtitle || "Hero subtitle goes here"}</p>
            </div>
          </LayoutDropZone>
        )}

        {comp.type === "card" && (
          <LayoutDropZone layoutType="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{comp.props?.title || "Card Title"}</h3>
              <p className="text-gray-600">{comp.props?.description || "Card description"}</p>
            </div>
          </LayoutDropZone>
        )}

        {comp.type === "container" && <LayoutDropZone layoutType="container" />}

        {comp.type === "grid" && (
          <LayoutDropZone layoutType="grid">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="bg-gray-100 rounded p-4 text-center text-gray-500">Grid Item 1</div>
              <div className="bg-gray-100 rounded p-4 text-center text-gray-500">Grid Item 2</div>
              <div className="bg-gray-100 rounded p-4 text-center text-gray-500">Grid Item 3</div>
            </div>
          </LayoutDropZone>
        )}

        {comp.type === "footer" && (
          <LayoutDropZone layoutType="footer">
            <div className="text-center py-8">
              <p className="text-gray-600">{comp.props?.text || "Footer content goes here"}</p>
            </div>
          </LayoutDropZone>
        )}
      </div>
    )
  }

  return (
    <div
      ref={(node) => {
        drop(node)
        dropRef.current = node
      }}
      className={`h-full bg-white rounded-lg border-2 transition-all overflow-auto ${
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
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium mb-2">Start Building Your Website</h3>
            <p className="text-gray-500">Drag layout components from the sidebar to begin</p>
          </div>
        </div>
      ) : (
        <div className="p-6">{components.map((comp) => renderComponent(comp))}</div>
      )}
    </div>
  )
}
