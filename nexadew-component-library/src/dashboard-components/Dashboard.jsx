"use client"

import { useState, useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Canvas from "./Canvas"
import ComponentLibrary from "./ComponentLibrary"
import PropertiesPanel from "./PropertiesPanel"
import CodeGenerator from "../utils/CodeGenerator"
import ComponentRegistry from "../utils/ComponentRegistry"

export default function Dashboard() {
  const [components, setComponents] = useState([])
  const [selectedProps, setSelectedProps] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [selectedChild, setSelectedChild] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const [availableComponents, setAvailableComponents] = useState([])
  const previewWindowRef = useRef(null)
  const [isPreviewWindowReady, setIsPreviewWindowReady] = useState(false)

  // Load available components from registry
  useEffect(() => {
    const loadComponents = async () => {
      const registeredComponents = await ComponentRegistry.getAllComponents()
      setAvailableComponents(registeredComponents)
    }
    loadComponents()
  }, [])

  // Handle messages from live preview
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:3000") {
        return
      }

      if (event.data.type === "previewWindowReady") {
        console.log("Preview window is ready")
        setIsPreviewWindowReady(true)
        sendToPreview()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [components])

  const sendToPreview = () => {
    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      const generatedCode = CodeGenerator.generateReactCode(components)
      const componentData = {
        components,
        generatedCode,
        timestamp: Date.now(),
      }

      previewWindowRef.current.postMessage({ type: "updateDesign", data: componentData }, "http://localhost:3000")
    }
  }

  const handlePreview = () => {
    if (components.length === 0) {
      alert("No components to preview. Add some components to the canvas first.")
      return
    }

    try {
      const previewWindow = window.open("http://localhost:3000", "_blank", "width=1200,height=800")
      if (!previewWindow) {
        alert("Failed to open preview window. Please allow pop-ups for this site.")
        return
      }

      previewWindowRef.current = previewWindow
      setIsPreviewWindowReady(false)

      // Fallback: Send data after delay if ready signal not received
      setTimeout(() => {
        if (!isPreviewWindowReady && !previewWindow.closed) {
          sendToPreview()
        }
      }, 3000)
    } catch (err) {
      console.error("Error opening preview:", err)
      alert(`Failed to open preview: ${err.message}`)
    }
  }

  const handleExportCode = () => {
    const generatedCode = CodeGenerator.generateReactCode(components)
    const blob = new Blob([generatedCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-component.jsx"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveDesign = () => {
    const designData = {
      components,
      timestamp: Date.now(),
      version: "1.0",
    }
    localStorage.setItem("nexadew-design", JSON.stringify(designData))
    alert("Design saved successfully!")
  }

  const handleLoadDesign = () => {
    const savedDesign = localStorage.getItem("nexadew-design")
    if (savedDesign) {
      const designData = JSON.parse(savedDesign)
      setComponents(designData.components || [])
      setSelectedComponent(null)
      setSelectedChild(null)
      setSelectedProps(null)
      alert("Design loaded successfully!")
    } else {
      alert("No saved design found!")
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-white">
        {/* Component Library Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-auto">
          <ComponentLibrary availableComponents={availableComponents} selectedComponent={selectedComponent} />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">NexaDew Designer</h1>
                {selectedComponent && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Editing: {selectedComponent.type}
                  </span>
                )}
                {selectedChild && (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Child: {selectedChild.type}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDesign}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Save Design
                </button>
                <button
                  onClick={handleLoadDesign}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Load Design
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  {showCode ? "Hide Code" : "Show Code"}
                </button>
                <button
                  onClick={handleExportCode}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Export Code
                </button>
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Live Preview
                </button>
                <button
                  onClick={() => {
                    setComponents([])
                    setSelectedProps(null)
                    setSelectedComponent(null)
                    setSelectedChild(null)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Canvas and Code View */}
          <div className="flex-1 flex">
            <div className="flex-1 p-4">
              {showCode ? (
                <div className="h-full">
                  <h3 className="text-lg font-semibold mb-4">Generated React Code</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-full text-sm">
                    <code>{CodeGenerator.generateReactCode(components)}</code>
                  </pre>
                </div>
              ) : (
                <Canvas
                  components={components}
                  setComponents={setComponents}
                  setSelectedProps={setSelectedProps}
                  selectedComponent={selectedComponent}
                  setSelectedComponent={setSelectedComponent}
                  selectedChild={selectedChild}
                  setSelectedChild={setSelectedChild}
                />
              )}
            </div>

            {/* Properties Panel */}
            <div className="w-80 bg-gray-50 border-l border-gray-200">
              <PropertiesPanel
                selectedProps={selectedProps}
                setSelectedProps={setSelectedProps}
                components={components}
                setComponents={setComponents}
                selectedComponent={selectedComponent}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
