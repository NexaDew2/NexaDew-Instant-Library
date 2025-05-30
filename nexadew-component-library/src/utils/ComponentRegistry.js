class ComponentRegistry {
  constructor() {
    this.components = new Map()
    this.initializeDefaultComponents()
  }

  initializeDefaultComponents() {
    const defaultComponents = [
      {
        type: "navbar",
        name: "Navigation Bar",
        category: "navigation",
        componentPath: "components/Navbar/Navbar",
        defaultProps: {
          brandName: "Brand",
          bgColor: "blue-600",
          textColor: "text-white",
          height: "h-12",
          layout: "right",
          hasSearch: false,
          links: [
            { label: "Home", href: "#" },
            { label: "About", href: "#" },
            { label: "Contact", href: "#" }
          ],
          buttons: [
            { label: "Login", onClick: "() => console.log('Login')", style: "bg-blue-500 text-white" }
          ],
          dropdowns: []
        },
      },
      {
        type: "hero",
        name: "Hero Section",
        category: "layout",
        componentPath: "components/Hero/Hero",
        defaultProps: {
          title: "Welcome to Our Website",
          subtitle: "Build amazing experiences with our platform",
          bgColor: "bg-gray-50",
          textColor: "text-gray-900",
          padding: "py-20",
          alignment: "center"
        },
      },
      {
        type: "card",
        name: "Card",
        category: "layout",
        componentPath: "components/Card/Card",
        defaultProps: {
          title: "Card Title",
          description: "Card description goes here",
          bgColor: "bg-white",
          textColor: "text-gray-900",
          borderRadius: "rounded-lg",
          shadow: "shadow-md",
          padding: "p-6"
        },
      },
      {
        type: "container",
        name: "Container",
        category: "layout",
        componentPath: "components/Container/Container",
        defaultProps: {
          bgColor: "bg-gray-50",
          padding: "p-8",
          borderRadius: "rounded-lg",
          border: "border border-gray-200"
        },
      },
      {
        type: "button",
        name: "Button",
        category: "form",
        componentPath: "components/Button",
        defaultProps: {
          text: "Button",
          variant: "primary",
          size: "md",
          bgColor: "bg-blue-500",
          textColor: "text-white",
          padding: "px-4 py-2",
          borderRadius: "rounded"
        },
      },
      {
        type: "input",
        name: "Input Field",
        category: "form",
        componentPath: "components/Input/Input",
        defaultProps: {
          placeholder: "Enter text...",
          type: "text",
          bgColor: "bg-white",
          textColor: "text-gray-900",
          border: "border border-gray-300",
          borderRadius: "rounded",
          padding: "px-3 py-2"
        },
      },
      {
        type: "text",
        name: "Text",
        category: "content",
        componentPath: "components/Text/Text",
        defaultProps: {
          content: "Text content",
          tag: "p",
          fontSize: "text-base",
          fontWeight: "font-normal",
          textColor: "text-gray-900"
        },
      },
      {
        type: "image",
        name: "Image",
        category: "content",
        componentPath: "components/Image/Image",
        defaultProps: {
          src: "/placeholder.svg?height=200&width=300",
          alt: "Image",
          width: "w-auto",
          height: "h-auto",
          borderRadius: "rounded"
        },
      }
    ]

    defaultComponents.forEach((comp) => {
      this.components.set(comp.type, comp)
    })
  }

  registerComponent(type, config) {
    this.components.set(type, {
      type,
      ...config,
      registeredAt: new Date().toISOString(),
    })

    this.saveToStorage()
    return true
  }

  getComponent(type) {
    return this.components.get(type)
  }

  getAllComponents() {
    return Array.from(this.components.values())
  }

  getComponentsByCategory(category) {
    return Array.from(this.components.values()).filter(comp => comp.category === category)
  }

  unregisterComponent(type) {
    const result = this.components.delete(type)
    if (result) {
      this.saveToStorage()
    }
    return result
  }

  saveToStorage() {
    const componentsArray = Array.from(this.components.entries())
    localStorage.setItem("nexadew-component-registry", JSON.stringify(componentsArray))
  }

  loadFromStorage() {
    const stored = localStorage.getItem("nexadew-component-registry")
    if (stored) {
      const componentsArray = JSON.parse(stored)
      this.components = new Map(componentsArray)
    }
  }

  exportComponents() {
    return {
      components: Array.from(this.components.entries()),
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }
  }

  importComponents(data) {
    if (data.components && Array.isArray(data.components)) {
      data.components.forEach(([type, config]) => {
        this.components.set(type, config)
      })
      this.saveToStorage()
      return true
    }
    return false
  }
}

export default new ComponentRegistry()
