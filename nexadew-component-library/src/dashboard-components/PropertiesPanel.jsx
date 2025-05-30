"use client"

export default function PropertiesPanel({
  selectedProps,
  setSelectedProps,
  components,
  setComponents,
  selectedComponent,
  selectedChild,
  setSelectedChild,
}) {
  if (!selectedProps) {
    return (
      <div className="h-full p-6 bg-white">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium mb-2">Properties Panel</h3>
          <p className="text-sm text-gray-400">Select a component or element to edit its properties</p>
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
          children: (comp.children || []).map((child) => (child.id === selectedChild.id ? updatedChild : child)),
        })),
      )
    } else if (selectedComponent) {
      // Update parent component
      setComponents((prev) =>
        prev.map((comp) => (comp.id === selectedComponent.id ? { ...comp, props: updatedProps } : comp)),
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
          children: (comp.children || []).map((child) => (child.id === selectedChild.id ? updatedChild : child)),
        })),
      )
    }
  }

  const renderPropertyInput = (key, label, type = "text", options = null) => {
    const value = selectedProps[key] || ""

    if (type === "color") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )
    }

    if (type === "select" && options) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <select
            value={value}
            onChange={(e) => updateProp(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (type === "textarea") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <textarea
            value={value}
            onChange={(e) => updateProp(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => updateProp(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={type === "number" ? "0" : "Enter value..."}
        />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Properties
          {selectedChild && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Child: {selectedChild.type}</span>
          )}
          {selectedComponent && !selectedChild && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Component: {selectedComponent.type}
            </span>
          )}
        </h3>
      </div>

      <div className="p-4">
        {/* Position controls for child components */}
        {selectedChild && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Position</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">X Position</label>
                <input
                  type="number"
                  value={selectedChild.position?.x || 0}
                  onChange={(e) => updateChildPosition("x", e.target.value)}
                  className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Y Position</label>
                <input
                  type="number"
                  value={selectedChild.position?.y || 0}
                  onChange={(e) => updateChildPosition("y", e.target.value)}
                  className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick position buttons */}
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  updateChildPosition("x", 1232)
                  updateChildPosition("y", 0)
                }}
                className="text-xs bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
              >
                Top Left
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 150)
                  updateChildPosition("y", 0)
                }}
                className="text-xs bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
              >
                Top Center
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 300)
                  updateChildPosition("y", 0)
                }}
                className="text-xs bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
              >
                Top Right
              </button>
            </div>
          </div>
        )}

        {/* Common properties */}
        <div className="space-y-1">
          {/* Text content */}
          {selectedProps.text !== undefined && renderPropertyInput("text", "Text Content")}

          {selectedProps.title !== undefined && renderPropertyInput("title", "Title")}

          {selectedProps.subtitle !== undefined && renderPropertyInput("subtitle", "Subtitle")}

          {selectedProps.description !== undefined && renderPropertyInput("description", "Description", "textarea")}

          {selectedProps.placeholder !== undefined && renderPropertyInput("placeholder", "Placeholder")}

          {/* Styling properties */}
          {renderPropertyInput("bgColor", "Background Color", "color")}
          {renderPropertyInput("textColor", "Text Color", "color")}
          {renderPropertyInput("padding", "Padding")}
          {renderPropertyInput("borderRadius", "Border Radius")}
          {renderPropertyInput("border", "Border")}

          {/* Size properties */}
          {renderPropertyInput("width", "Width")}
          {renderPropertyInput("height", "Height")}
          {selectedProps.minHeight !== undefined && renderPropertyInput("minHeight", "Min Height")}

          {/* Typography */}
          {selectedProps.fontSize !== undefined && renderPropertyInput("fontSize", "Font Size")}

          {selectedProps.fontWeight !== undefined &&
            renderPropertyInput("fontWeight", "Font Weight", "select", [
              { value: "normal", label: "Normal" },
              { value: "bold", label: "Bold" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semi Bold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extra Bold" },
            ])}

          {/* Image specific properties */}
          {selectedProps.src !== undefined && renderPropertyInput("src", "Image Source URL")}

          {selectedProps.alt !== undefined && renderPropertyInput("alt", "Alt Text")}
        </div>

        {/* Component specific properties */}
        {selectedComponent && selectedComponent.type === "grid" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Grid Settings</h4>
            {renderPropertyInput("gridCols", "Grid Columns", "select", [
              { value: "1", label: "1 Column" },
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" },
              { value: "6", label: "6 Columns" },
            ])}
            {renderPropertyInput("gap", "Gap")}
          </div>
        )}

        {/* Reset button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (selectedChild) {
                const defaultProps = {
                  bgColor: "#ffffff",
                  textColor: "#000000",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }
                setSelectedProps(defaultProps)
                const updatedChild = { ...selectedChild, props: defaultProps }
                setSelectedChild(updatedChild)
                setComponents((prev) =>
                  prev.map((comp) => ({
                    ...comp,
                    children: (comp.children || []).map((child) =>
                      child.id === selectedChild.id ? updatedChild : child,
                    ),
                  })),
                )
              }
            }}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
