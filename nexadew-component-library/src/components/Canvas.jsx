import { useRef } from "react";
import { useDrop } from "react-dnd";
import DraggableChildComponent from "./DraggableChildComponent";

export default function Canvas({
    components,
    setComponents,
    setSelectedProps,
    selectedComponent,
    setSelectedComponent,
    selectedChild,
    setSelectedChild,
}) {
    const dropRef = useRef(null);

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ["layout", "component", "existing-child"],
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            const canvasRect = dropRef.current?.getBoundingClientRect();

            if (offset && canvasRect) {
                const x = offset.x - canvasRect.left;
                const y = offset.y - canvasRect.top;

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
                        };
                        setComponents([...components, newNavbar]);
                        setSelectedProps(newNavbar.props);
                        setSelectedComponent(newNavbar);
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
                        };
                        setComponents([...components, newCard]);
                        setSelectedProps(newCard.props);
                        setSelectedComponent(newCard);
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
                        };
                        setComponents([...components, newContainer]);
                        setSelectedProps(newContainer.props);
                        setSelectedComponent(newContainer);
                    }
                }
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const handleAddChild = (parentId, childType, position = { x: 0, y: 0 }) => {
        const newChild = createChildComponent(childType, position);
        setComponents((prev) =>
            prev.map((comp) => (comp.id === parentId ? { ...comp, children: [...comp.children, newChild] } : comp))
        );
        setSelectedChild(newChild);
        setSelectedProps(newChild.props);
    };

    const handleUpdateChildPosition = (parentId, childId, position) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === parentId
                    ? {
                        ...comp,
                        children: comp.children.map((child) => (child.id === childId ? { ...child, position } : child)),
                    }
                    : comp
            )
        );
        if (selectedChild?.id === childId) {
            setSelectedChild((prev) => ({ ...prev, position }));
        }
    };

    const handleDeleteChild = (childId) => {
        setComponents((prev) =>
            prev.map((comp) => ({
                ...comp,
                children: comp.children.filter((child) => child.id !== childId),
            }))
        );
        setSelectedChild(null);
        setSelectedProps(null);
    };

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
        };

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
        };

        return {
            id: Date.now() + Math.random(),
            type,
            props: { ...baseProps, ...typeSpecificProps[type] },
            position,
        };
    };

    const renderComponent = (comp) => {
        const LayoutDropZone = ({ children, layoutType }) => {
            const layoutDropRef = useRef(null);

            const [{ isOver: isLayoutOver }, layoutDrop] = useDrop(() => ({
                accept: ["component", "existing-child"],
                drop: (item, monitor) => {
                    const offset = monitor.getClientOffset();
                    const layoutRect = layoutDropRef.current?.getBoundingClientRect();

                    if (offset && layoutRect) {
                        const x = offset.x - layoutRect.left;
                        const y = offset.y - layoutRect.top;

                        if (item.id) {
                            handleUpdateChildPosition(comp.id, item.id, { x, y });
                        } else if (item.category === "component") {
                            handleAddChild(comp.id, item.type, { x, y });
                        }
                    }
                },
                collect: (monitor) => ({
                    isOver: !!monitor.isOver(),
                }),
            }));

            return (
                <div
                    ref={(node) => {
                        layoutDrop(node);
                        layoutDropRef.current = node;
                    }}
                    className={`relative ${isLayoutOver ? "bg-green-100 bg-opacity-50" : ""}`}
                    style={{ minHeight: layoutType === "navbar" ? "64px" : "200px" }}
                >
                    {children}
                    {selectedComponent?.id === comp.id && (
                        <div className="absolute -inset-5 pointer-events-none opacity-20">
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
                    {comp.children.length === 0 && (
                        <div className="absolute inset-10 flex items-center justify-center text-gray-400 pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl mb-2">📍</div>
                                <span className="text-sm">Drop components anywhere</span>
                            </div>
                        </div>
                    )}
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
            );
        };

        if (comp.type === "navbar") {
            return (
                <div
                    className={`w-full mb-6 rounded cursor-pointer transition-all ${selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
                        }`}
                    style={{
                        backgroundColor: comp.props.bgColor,
                        color: comp.props.textColor,
                        padding: comp.props.padding,
                        height: comp.props.height,
                        borderRadius: comp.props.borderRadius,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProps(comp.props);
                        setSelectedComponent(comp);
                        setSelectedChild(null);
                    }}
                >
                    <LayoutDropZone layoutType="navbar">
                        <div className="flex items-center h-full">
                            <span className="font-bold mr-4">Navbar</span>
                        </div>
                    </LayoutDropZone>
                </div>
            );
        }

        if (comp.type === "card") {
            return (
                <div
                    className={`mb-6 rounded cursor-pointer transition-all ${selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
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
                        e.stopPropagation();
                        setSelectedProps(comp.props);
                        setSelectedComponent(comp);
                        setSelectedChild(null);
                    }}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">{comp.props.title}</h3>
                    </div>
                    <LayoutDropZone layoutType="card" />
                </div>
            );
        }

        if (comp.type === "container") {
            return (
                <div
                    className={`mb-6 cursor-pointer transition-all ${selectedComponent?.id === comp.id ? "ring-2 ring-blue-500 ring-offset-4" : ""
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
                        e.stopPropagation();
                        setSelectedProps(comp.props);
                        setSelectedComponent(comp);
                        setSelectedChild(null);
                    }}
                >
                    <LayoutDropZone layoutType="container" />
                </div>
            );
        }

        return null;
    };

    return (
        <div
            ref={(node) => {
                drop(node);
                dropRef.current = node;
            }}
            className={`flex-1 h-[500px] bg-gray-100 p-4 rounded-lg border-2 transition-all ${isOver && canDrop ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
            onClick={() => {
                setSelectedComponent(null);
                setSelectedChild(null);
                setSelectedProps(null);
            }}
        >
            {components.length === 0 ? (
                <div className="flex items-center justify-center bg h-full text-gray-400">
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
    );
}