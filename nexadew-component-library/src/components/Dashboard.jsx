"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./Canvas";
import ComponentItem from "./ComponentItem";
import PropertiesPanel from "./PropertiesPanel";
import Button from "./Button";

export default function Dashboard() {
    const [components, setComponents] = useState([]);
    const [selectedProps, setSelectedProps] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [showCode, setShowCode] = useState(false);

    const layoutComponents = [
        { type: "navbar", name: "Navbar", category: "layout" },
        { type: "card", name: "Card", category: "layout" },
        { type: "container", name: "Container", category: "layout" },
    ];

    const childComponents = [
        { type: "button", name: "Button", component: Button, category: "component" },
        { type: "dropdown", name: "Dropdown", category: "component" },
        { type: "searchbar", name: "Search Bar", category: "component" },
        { type: "text", name: "Text", category: "component" },
        { type: "logo", name: "Logo", category: "component" },
    ];

    const generateCode = () => {
        if (components.length === 0) return "// No components added";

        let code = `// Generated Layout Components\n`;
        code += `import React from 'react';\n`;
        code += `import Button from '../Button/Button';\n\n`;
        code += `export default function GeneratedLayout() {\n`;
        code += `  return (\n`;
        code += `    <div className="min-h-screen bg-gray-50 p-6">\n`;

        components.forEach((comp) => {
            if (comp.type === "navbar") {
                code += `      <nav style={{\n`;
                code += `        backgroundColor: '${comp.props.bgColor}',\n`;
                code += `        color: '${comp.props.textColor}',\n`;
                code += `        padding: '${comp.props.padding}',\n`;
                code += `        height: '${comp.props.height}',\n`;
                code += `        borderRadius: '${comp.props.borderRadius}',\n`;
                code += `        position: 'relative',\n`;
                code += `        marginBottom: '24px'\n`;
                code += `      }}>\n`;

                comp.children.forEach((child) => {
                    code += `        <div style={{\n`;
                    code += `          position: 'absolute',\n`;
                    code += `          left: '${child.position?.x || 0}px',\n`;
                    code += `          top: '${child.position?.y || 0}px'\n`;
                    code += `        }}>\n`;

                    if (child.type === "button") {
                        code += `          <Button className="${child.props.className}">\n`;
                        code += `            ${child.props.text}\n`;
                        code += `          </Button>\n`;
                    } else if (child.type === "text") {
                        code += `          <span style={{ color: '${child.props.textColor}' }}>\n`;
                        code += `            ${child.props.text}\n`;
                        code += `          </span>\n`;
                    }

                    code += `        </div>\n`;
                });

                code += `      </nav>\n`;
            }

            if (comp.type === "card") {
                code += `      <div style={{\n`;
                code += `        backgroundColor: '${comp.props.bgColor}',\n`;
                code += `        padding: '${comp.props.padding}',\n`;
                code += `        borderRadius: '${comp.props.borderRadius}',\n`;
                code += `        border: '${comp.props.border}',\n`;
                code += `        width: '${comp.props.width}',\n`;
                code += `        height: '${comp.props.height}',\n`;
                code += `        position: 'relative',\n`;
                code += `        marginBottom: '24px'\n`;
                code += `      }}>\n`;
                code += `        <h3>${comp.props.title}</h3>\n`;

                comp.children.forEach((child) => {
                    code += `        <div style={{\n`;
                    code += `          position: 'absolute',\n`;
                    code += `          left: '${child.position?.x || 0}px',\n`;
                    code += `          top: '${child.position?.y || 0}px'\n`;
                    code += `        }}>\n`;

                    if (child.type === "button") {
                        code += `          <Button>${child.props.text}</Button>\n`;
                    }

                    code += `        </div>\n`;
                });

                code += `      </div>\n`;
            }
        });

        code += `    </div>\n`;
        code += `  );\n`;
        code += `}`;

        return code;
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row-reverse h-screen bg-white">
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
                        <div className="flex">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                onClick={() => setShowCode(!showCode)}
                            >
                                {showCode ? "Hide Code" : "Show Code"}
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                onClick={() => {
                                    setComponents([]);
                                    setSelectedProps(null);
                                    setSelectedComponent(null);
                                    setSelectedChild(null);
                                }}
                            >
                                Clear All
                            </button>
                        </div>

                    </div>
 {showCode && (
                        <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded overflow-auto h-auto text-sm">
                            <code>{generateCode()}</code>
                        </pre>
                    )}
                   {showCode ? (
                    <div className="hidden"> <Canvas
                        components={components}
                        setComponents={setComponents}
                        setSelectedProps={setSelectedProps}
                        selectedComponent={selectedComponent}
                        setSelectedComponent={setSelectedComponent}
                        selectedChild={selectedChild}
                        setSelectedChild={setSelectedChild}
                    /></div>
                   ): <Canvas
                        components={components}
                        setComponents={setComponents}
                        setSelectedProps={setSelectedProps}
                        selectedComponent={selectedComponent}
                        setSelectedComponent={setSelectedComponent}
                        selectedChild={selectedChild}
                        setSelectedChild={setSelectedChild}
                    />}


                    <div className="mt-4 flex gap-2">
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

                <div className="w-96 bg-white overflow-auto p-4 border-l">
                    <h2 className="text-xl font-bold mb-4">Components</h2>
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


        </DndProvider>
    );
}