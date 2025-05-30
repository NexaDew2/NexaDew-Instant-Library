"use client"

import { useState, useEffect } from "react"
import ComponentItem from "./ComponentItem"
import ComponentRegistry from "../utils/ComponentRegistry"

export default function ComponentLibrary({ availableComponents, selectedComponent }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [customComponents, setCustomComponents] = useState([])

  const categories = ["all", "layout", "navigation", "form", "content", "custom"]

  const layoutComponents = [
    { type: "navbar", name: "Navigation Bar", category: "navigation", icon: "🧭" },
    { type: "hero", name: "Hero Section", category: "layout", icon: "🎯" },
    { type: "card", name: "Card", category: "layout", icon: "🃏" },
    { type: "container", name: "Container", category: "layout", icon: "📦" },
    { type: "grid", name: "Grid Layout", category: "layout", icon: "⚏" },
    { type: "footer", name: "Footer", category: "layout", icon: "⬇️" },
  ]

  const childComponents = [
    { type: "button", name: "Button", category: "form", icon: "🔘" },
    { type: "input", name: "Input Field", category: "form", icon: "📝" },
    { type: "dropdown", name: "Dropdown", category: "form", icon: "📋" },
    { type: "searchbar", name: "Search Bar", category: "form", icon: "🔍" },
    { type: "text", name: "Text", category: "content", icon: "📄" },
    { type: "image", name: "Image", category: "content", icon: "🖼️" },
    { type: "logo", name: "Logo", category: "content", icon: "🏷️" },
    { type: "icon", name: "Icon", category: "content", icon: "⭐" },
  ]

  useEffect(() => {
    const loadCustomComponents = () => {
      const saved = localStorage.getItem("nexadew-custom-components")
      if (saved) {
        setCustomComponents(JSON.parse(saved))
      }
    }
    loadCustomComponents()
  }, [])

  const allComponents = [...layoutComponents, ...childComponents, ...customComponents]

  const filteredComponents = allComponents.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || comp.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddCustomComponent = () => {
    const name = prompt("Enter component name:")
    if (name) {
      const newComponent = {
        type: name.toLowerCase().replace(/\s+/g, "-"),
        name: name,
        category: "custom",
        icon: "🔧",
        id: Date.now(),
      }

      const updated = [...customComponents, newComponent]
      setCustomComponents(updated)
      localStorage.setItem("nexadew-custom-components", JSON.stringify(updated))

      // Register the component
      ComponentRegistry.registerComponent(newComponent.type, {
        name: newComponent.name,
        category: newComponent.category,
        defaultProps: {
          bgColor: "#ffffff",
          textColor: "#000000",
          padding: "16px",
          borderRadius: "8px",
        },
      })
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Library</h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Add Custom Component */}
        <button
          // onClick={handleAddCustomComponent}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-4"
        >
         Select the components
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Layout Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Layout Components</h3>
          {filteredComponents
            .filter((comp) => ["layout", "navigation"].includes(comp.category))
            .map((comp) => (
              <ComponentItem key={comp.type} type={comp.type} name={comp.name} category="layout" icon={comp.icon} />
            ))}
        </div>

        {/* Child Components */}
        {selectedComponent && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Child Components</h3>
            <div className="text-xs text-gray-500 mb-3">Drop these into your {selectedComponent.type}</div>
            {filteredComponents
              .filter((comp) => ["form", "content"].includes(comp.category))
              .map((comp) => (
                <ComponentItem
                  key={comp.type}
                  type={comp.type}
                  name={comp.name}
                  category="component"
                  icon={comp.icon}
                />
              ))}
          </div>
        )}

        {/* Custom Components */}
        {filteredComponents.filter((comp) => comp.category === "custom").length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Custom Components</h3>
            {filteredComponents
              .filter((comp) => comp.category === "custom")
              .map((comp) => (
                <ComponentItem key={comp.type} type={comp.type} name={comp.name} category="layout" icon={comp.icon} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
