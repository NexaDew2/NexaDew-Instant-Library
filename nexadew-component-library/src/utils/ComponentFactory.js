import { background } from "storybook/internal/theming"

export default class ComponentFactory {
  static createComponent(type, position = { x: 0, y: 0 }) {
    const baseComponent = {
      id: Date.now() + Math.random(),
      type,
      position,
      children: [],
      props: this.getDefaultProps(type),
    }

    return baseComponent
  }

  static createChildComponent(type, position = { x: 0, y: 0 }) {
    const baseChild = {
      id: Date.now() + Math.random(),
      type,
      position,
      props: this.getDefaultChildProps(type),
    }

    return baseChild
  }

  static getDefaultProps(type) {
    const commonProps = {
      bgColor: "#ffffff",
      textColor: "#000000",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      width: "100%",
      height: "auto",
    }

    const typeSpecificProps = {
      navbar: {
        ...commonProps,
        bgColor: "#1f2937",
        textColor: "#ffffff",
        height: "64px",
        padding: "0 24px",
        
      },
      hero: {
        ...commonProps,
        bgColor: "#f8fafc",
        padding: "80px 24px",
        textAlign: "center",
        title: "Welcome to Our Website",
        subtitle: "Build amazing experiences with our platform",
      },
      card: {
        ...commonProps,
        width: "300px",
        height: "200px",
        padding: "24px",
        title: "Card Title",
        description: "Card description goes here",
      },
      container: {
        ...commonProps,
        bgColor: "#f9fafb",
        border: "2px dashed #d1d5db",
        minHeight: "200px",
        padding: "32px",
      },
      grid: {
        ...commonProps,
        minHeight: "300px",
        padding: "24px",
      },
      footer: {
        ...commonProps,
        bgColor: "#374151",
        textColor: "#ffffff",
        padding: "32px 24px",
        text: "© 2024 Your Company. All rights reserved.",
      },
    }

    return { ...commonProps, ...typeSpecificProps[type] }
  }

  static getDefaultChildProps(type) {
    const commonProps = {
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
        ...commonProps,
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        text: "Button",
        padding: "12px 24px",
        fontWeight: "500",
      },
      input: {
        ...commonProps,
        border: "1px solid #d1d5db",
        placeholder: "Enter text...",
        width: "200px",
      },
      dropdown: {
        ...commonProps,
        border: "1px solid #d1d5db",
        width: "150px",
        placeholder: "Select option",
      },
      searchbar: {
        ...commonProps,
        border: "1px solid #d1d5db",
        width: "250px",
    
        placeholder: "ready.",
      },
      text: {
        ...commonProps,
        bgColor: "transparent",
        text: "Text Element",
        border: "none",
      },
      image: {
        ...commonProps,
        bgColor: "#f3f4f6",
        border: "1px solid #d1d5db",
        width: "200px",
        height: "150px",
        src: "/placeholder.svg?height=150&width=200",
        alt: "Placeholder image",
      },
      logo: {
        ...commonProps,
        bgColor: "transparent",
        text: "LOGO",
        fontWeight: "bold",
        fontSize: "18px",
        border: "none",
      },
      icon: {
        ...commonProps,
        bgColor: "transparent",
        text: "⭐",
        fontSize: "24px",
        border: "none",
        width: "32px",
        height: "32px",
      },
    }

    return { ...commonProps, ...typeSpecificProps[type] }
  }
}
