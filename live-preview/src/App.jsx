"use client"

import { useState, useEffect } from "react"

const App = () => {
  const [designData, setDesignData] = useState(null)
  const [generatedCode, setGeneratedCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Live Preview App initialized")

    const handleMessage = (event) => {
      try {
        console.log("Received message:", event.data)

        if (event.origin !== "http://localhost:5173") {
          console.log("Origin mismatch. Expected: http://localhost:5173, Got:", event.origin)
          return
        }

        if (event.data.type === "updateDesign") {
          const { components, generatedCode } = event.data.data
          console.log("Updating design with components:", components)

          setDesignData(event.data.data)
          setGeneratedCode(generatedCode)
          setIsLoading(false)
          setError(null)
        } else {
          console.log("Unexpected message type:", event.data.type)
        }
      } catch (err) {
        console.error("Error handling message:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handleMessage)

    // Send ready signal to parent
    if (window.opener) {
      console.log("Sending ready signal to NexaDew Dashboard")
      window.opener.postMessage({ type: "previewWindowReady" }, "http://localhost:5173")
    }

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Preview Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reload Preview
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Preview...</h2>
          <p className="text-gray-500 mt-2">Waiting for design data from NexaDew Designer</p>
        </div>
      </div>
    )
  }

  if (!designData || !designData.components || designData.components.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Live Preview</h2>
          <p className="text-gray-600 mb-6">
            Your designed components will appear here in real-time. Start building in NexaDew Designer to see your
            creation come to life!
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">
              💡 Tip: Add components to the canvas and click "Live Preview" to see them here
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Live Preview</h1>
            <span className="text-sm bg-green-500 px-2 py-1 rounded">
              {designData.components.length} Component{designData.components.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const blob = new Blob([generatedCode], { type: "text/javascript" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "App.jsx"
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Download App.jsx
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode)
                alert("Code copied to clipboard!")
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Copy Code
            </button>
            <span className="text-xs text-gray-300">
              Last updated: {new Date(designData.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Rendered Components */}
      <div className="p-0">
        <PreviewRenderer components={designData.components} />
      </div>
    </div>
  )
}

// Component to render the actual design using imported components
const PreviewRenderer = ({ components }) => {
  // Import actual components
  const Navbar = ({ brandName, logoUrl, bgColor, textColor, height, links, buttons, dropdowns, layout, hasSearch, searchPlaceholder, searchstyle }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const tailwindSpacingToPx = {
      "h-10": 40, "h-11": 44, "h-12": 48, "h-14": 56, "h-16": 64,
      "h-20": 80, "h-24": 96, "h-28": 112, "h-32": 128, "h-36": 144,
      "h-40": 160, "h-44": 176, "h-48": 192, "h-52": 208, "h-56": 224,
    }

    const topPx = tailwindSpacingToPx[height] || 48

    const Dropdown = ({ label, items, onSelect, isMobile = false }) => {
      const [isOpen, setIsOpen] = useState(false)
      const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null)

      return (
        <div className={isMobile ? "w-full" : "relative"}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-center px-3 py-2 rounded-md hover:bg-gray-900 focus:outline-none font-medium ${
              isMobile ? "text-gray-800" : ""
            }`}
          >
            {label} ▼
          </button>
          {isOpen && (
            <div className={`${
              isMobile
                ? "w-full pl-4 bg-gray-50 rounded-md"
                : "absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10"
            }`}>
              {items?.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href || "#"}
                    onClick={() => {
                      setIsOpen(false)
                      onSelect?.(item.label)
                    }}
                    className={`block px-4 py-2 ${
                      isMobile ? "text-gray-800 hover:bg-gray-100" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <nav className={`w-full ${bgColor} ${textColor} shadow-md px-6 flex items-center ${height}`}>
        <div className="flex items-center space-x-3">
          {logoUrl ? (
            <img src={logoUrl || "/placeholder.svg"} alt={brandName} className="h-8" />
          ) : (
            <span className="text-xl font-bold">{brandName}</span>
          )}
        </div>

        <button
          className="md:hidden ml-auto p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div className={`hidden md:flex ml-2 ${
          layout === 'center' ? 'justify-center flex-1' : 
          layout === 'space-between' ? 'justify-between flex-1' : 
          layout === "left" ? 'justify-start' : 'ml-auto'
        } items-center`}>
          <div className={`flex ${layout === 'center' ? 'ml-auto gap-3' : 'space-x-6'} items-center`}>
            {links?.map((link, index) => (
              <a key={index} href={link.href || "#"} className="hover:underline font-medium transition-colors">
                {link.label}
              </a>
            ))}
            {dropdowns?.map((dropdown, index) => (
              <Dropdown
                key={index}
                label={dropdown.label}
                items={dropdown.items}
                onSelect={dropdown.onSelect}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {buttons?.map((button, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${button.style} font-medium hover:opacity-90 transition`}
              >
                {button.label}
              </button>
            ))}
            {hasSearch && (
              <input
                type="text"
                placeholder={searchPlaceholder}
                className={`px-4 py-2 ${searchstyle} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              />
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute left-0 w-full bg-white shadow-md z-20" style={{ top: `${topPx}px` }}>
            <div className="flex flex-col p-4">
              {links?.map((link, index) => (
                <a
                  key={index}
                  href={link.href || "#"}
                  className="py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    )
  }

  const Button = ({ children, className, style, variant, size }) => (
    <button className={`px-4 py-2 rounded transition-colors ${className || ""}`} style={style}>
      {children}
    </button>
  )

  const Hero = ({ title, subtitle, alignment, children, style, className }) => (
    <section className={`py-20 ${alignment === 'center' ? 'text-center' : ''} ${className || ""}`} style={style}>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
      {children}
    </section>
  )

  const Card = ({ title, description, children, style, className }) => (
    <div className={`rounded-lg shadow-md p-6 ${className || ""}`} style={style}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  )

  const Container = ({ children, style, className }) => (
    <div className={`relative ${className || ""}`} style={style}>
      {children}
    </div>
  )

  const Input = ({ placeholder, type = "text", style, className }) => (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
      style={style}
    />
  )

  const Text = ({ children, as = "p", style, className }) => {
    const Component = as
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    )
  }

  const Image = ({ src, alt, style, className }) => (
    <img
      src={src || "/placeholder.svg?height=200&width=300"}
      alt={alt || "Image"}
      className={className}
      style={style}
    />
  )

  const renderChild = (child, parent) => {
    const style = {
      ...child.props,
      position: child.position ? "absolute" : "relative",
      left: child.position?.x || 0,
      top: child.position?.y || 0,
    }

    const key = `${parent.id}-${child.id}`

    switch (child.type) {
      case "button":
        return <Button key={key} style={style}>{child.props?.text || "Button"}</Button>
      case "input":
        return <Input key={key} placeholder={child.props?.placeholder} type={child.props?.type} style={style} />
      case "text":
        return <Text key={key} as={child.props?.tag} style={style}>{child.props?.content || "Text"}</Text>
      case "image":
        return <Image key={key} src={child.props?.src || "/placeholder.svg"} alt={child.props?.alt} style={style} />
      default:
        return <div key={key} style={style}>{child.props?.text || child.type}</div>
    }
  }

  const renderComponent = (comp) => {
    const style = {
      backgroundColor: comp.props?.bgColor?.replace('bg-', '') || undefined,
      color: comp.props?.textColor?.replace('text-', '') || undefined,
      padding: comp.props?.padding || undefined,
      borderRadius: comp.props?.borderRadius || undefined,
      border: comp.props?.border || undefined,
      width: comp.props?.width || undefined,
      height: comp.props?.height || undefined,
      minHeight: comp.props?.minHeight || undefined,
    }

    const children = comp.children?.map((child) => renderChild(child, comp)) || []

    switch (comp.type) {
      case "navbar":
        return <Navbar key={comp.id} {...comp.props} />

      case "hero":
        return (
          <Hero key={comp.id} {...comp.props} style={style}>
            {children}
          </Hero>
        )

      case "card":
        return (
          <Card key={comp.id} {...comp.props} style={style}>
            {children}
          </Card>
        )

      case "container":
        return (
          <Container key={comp.id} style={style}>
            {children}
          </Container>
        )

      default:
        return (
          <div key={comp.id} style={style}>
            {children}
          </div>
        )
    }
  }

  return <div className="min-h-screen">{components.map((comp) => renderComponent(comp))}</div>
}

export default App
