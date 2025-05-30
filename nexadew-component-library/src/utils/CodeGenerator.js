"use client"

export default class CodeGenerator {
  static generateReactCode(components) {
    if (!components || components.length === 0) {
      return this.getEmptyAppCode()
    }

    const imports = this.generateImports(components)
    const appCode = this.generateAppCode(components)

    return `${imports}\n\n${appCode}`
  }

  static getEmptyAppCode() {
    return `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to Your Website
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Start designing by adding components in NexaDew Designer
        </p>
      </div>
    </div>
  );
}`
  }

  static generateImports(components) {
    const imports = new Set(["React"])
    const componentImports = new Set()

    // Collect all unique component types
    components.forEach((comp) => {
      componentImports.add(comp.type)
      
      // Add child component types
      if (comp.children) {
        comp.children.forEach((child) => {
          componentImports.add(child.type)
        })
      }
    })

    // Generate import statements
    let importStatements = `import React from 'react';\n`
    
    // Import layout components
    componentImports.forEach(type => {
      const componentPath = this.getComponentPath(type)
      if (componentPath) {
        const componentName = this.getComponentName(type)
        importStatements += `import ${componentName} from './${componentPath}';\n`
      }
    })

    return importStatements
  }

  static getComponentPath(type) {
    const componentPaths = {
      navbar: "components/Navbar/Navbar",
      hero: "components/Hero/Hero",
      card: "components/Card/Card",
      container: "components/Container/Container",
      button: "components/Button",
      input: "components/Input/Input",
      text: "components/Text/Text",
      image: "components/Image/Image",
      footer: "components/Footer/Footer",
      grid: "components/Grid/Grid"
    }
    return componentPaths[type]
  }

  static getComponentName(type) {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  static generateAppCode(components) {
    const componentElements = components.map((comp) => this.generateComponentElement(comp)).join("\n      ")

    return `export default function App() {
  return (
    <div className="min-h-screen">
      ${componentElements}
    </div>
  );
}`
  }

  static generateComponentElement(comp) {
    const ComponentName = this.getComponentName(comp.type)
    const props = this.generatePropsString(comp.props, comp.type)
    const children = comp.children ? this.generateChildrenElements(comp.children) : ""

    switch (comp.type) {
      case "navbar":
        return `<${ComponentName}${props} />`

      case "hero":
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`

      case "card":
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`

      case "container":
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`

      case "grid":
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`

      case "footer":
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`

      default:
        return `<${ComponentName}${props}>
        ${children}
      </${ComponentName}>`
    }
  }

  static generateChildrenElements(children) {
    return children.map(child => {
      const ComponentName = this.getComponentName(child.type)
      const props = this.generatePropsString(child.props, child.type)
      const style = child.position ? ` style={{position: 'absolute', left: '${child.position.x}px', top: '${child.position.y}px'}}` : ""
      
      return `        <${ComponentName}${props}${style} />`
    }).join("\n")
  }

  static generatePropsString(props, componentType) {
    if (!props) return ""

    const propsArray = []

    // Handle different component types with their specific props
    switch (componentType) {
      case "navbar":
        if (props.brandName) propsArray.push(`brandName="${props.brandName}"`)
        if (props.logoUrl) propsArray.push(`logoUrl="${props.logoUrl}"`)
        if (props.bgColor) propsArray.push(`bgColor="${props.bgColor}"`)
        if (props.textColor) propsArray.push(`textColor="${props.textColor}"`)
        if (props.height) propsArray.push(`height="${props.height}"`)
        if (props.layout) propsArray.push(`layout="${props.layout}"`)
        if (props.hasSearch) propsArray.push(`hasSearch={${props.hasSearch}}`)
        if (props.searchPlaceholder) propsArray.push(`searchPlaceholder="${props.searchPlaceholder}"`)
        if (props.searchstyle) propsArray.push(`searchstyle="${props.searchstyle}"`)
        if (props.links) propsArray.push(`links={${JSON.stringify(props.links)}}`)
        if (props.buttons) propsArray.push(`buttons={${JSON.stringify(props.buttons)}}`)
        if (props.dropdowns) propsArray.push(`dropdowns={${JSON.stringify(props.dropdowns)}}`)
        break

      case "button":
        if (props.text) propsArray.push(`children="${props.text}"`)
        if (props.variant) propsArray.push(`variant="${props.variant}"`)
        if (props.size) propsArray.push(`size="${props.size}"`)
        break

      case "input":
        if (props.placeholder) propsArray.push(`placeholder="${props.placeholder}"`)
        if (props.type) propsArray.push(`type="${props.type}"`)
        break

      case "text":
        if (props.content) propsArray.push(`children="${props.content}"`)
        if (props.tag) propsArray.push(`as="${props.tag}"`)
        break

      case "image":
        if (props.src) propsArray.push(`src="${props.src}"`)
        if (props.alt) propsArray.push(`alt="${props.alt}"`)
        break

      case "hero":
        if (props.title) propsArray.push(`title="${props.title}"`)
        if (props.subtitle) propsArray.push(`subtitle="${props.subtitle}"`)
        if (props.alignment) propsArray.push(`alignment="${props.alignment}"`)
        break

      case "card":
        if (props.title) propsArray.push(`title="${props.title}"`)
        if (props.description) propsArray.push(`description="${props.description}"`)
        break
    }

    // Add common styling props
    const styleProps = []
    if (props.bgColor && !propsArray.some(p => p.includes('bgColor'))) styleProps.push(`backgroundColor: '${props.bgColor}'`)
    if (props.textColor && !propsArray.some(p => p.includes('textColor'))) styleProps.push(`color: '${props.textColor}'`)
    if (props.padding && !propsArray.some(p => p.includes('padding'))) styleProps.push(`padding: '${props.padding}'`)
    if (props.borderRadius && !propsArray.some(p => p.includes('borderRadius'))) styleProps.push(`borderRadius: '${props.borderRadius}'`)
    if (props.border && !propsArray.some(p => p.includes('border'))) styleProps.push(`border: '${props.border}'`)

    if (styleProps.length > 0) {
      propsArray.push(`style={{${styleProps.join(', ')}}}`)
    }

    // Add className for Tailwind classes
    const tailwindClasses = []
    if (props.fontSize) tailwindClasses.push(props.fontSize)
    if (props.fontWeight) tailwindClasses.push(props.fontWeight)
    if (props.shadow) tailwindClasses.push(props.shadow)
    if (props.width) tailwindClasses.push(props.width)
    if (props.height) tailwindClasses.push(props.height)

    if (tailwindClasses.length > 0) {
      propsArray.push(`className="${tailwindClasses.join(' ')}"`)
    }

    return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : ""
  }
}
