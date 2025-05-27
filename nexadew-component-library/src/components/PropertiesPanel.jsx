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
            <div className="p-4 bg-white border-t">
                <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">⚙️</div>
                    <h3 className="font-medium mb-1">No Selection</h3>
                    <p className="text-sm">Select a component to edit properties</p>
                </div>
            </div>
        );
    }

    const updateProp = (key, value) => {
        const updatedProps = { ...selectedProps, [key]: value };
        setSelectedProps(updatedProps);

        if (selectedChild) {
            const updatedChild = { ...selectedChild, props: updatedProps };
            setSelectedChild(updatedChild);
            setComponents((prev) =>
                prev.map((comp) => ({
                    ...comp,
                    children: comp.children.map((child) => (child.id === selectedChild.id ? updatedChild : child)),
                }))
            );
        } else {
            setComponents((prev) =>
                prev.map((comp) => {
                    if (comp.props === selectedProps) {
                        return { ...comp, props: updatedProps };
                    }
                    return comp;
                })
            );
        }
    };

    const updateChildPosition = (axis, value) => {
        if (selectedChild) {
            const newPosition = {
                ...selectedChild.position,
                [axis]: Number.parseInt(value) || 0,
            };
            const updatedChild = { ...selectedChild, position: newPosition };
            setSelectedChild(updatedChild);
            setComponents((prev) =>
                prev.map((comp) => ({
                    ...comp,
                    children: comp.children.map((child) => (child.id === selectedChild.id ? updatedChild : child)),
                }))
            );
        }
    };

    return (
        <div className="p-4 bg-white border-t w-full max-h-96 overflow-y-auto">
<div className="">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Properties
        {selectedChild && <span className="text-sm bg-blue-100 px-2 py-1 rounded">Child Component</span>}
      </h3>

      {selectedChild && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">X Position</label>
              <input
                type="number"
                value={selectedChild.position?.x || 0}
                onChange={(e) => updateChildPosition("x", e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Y Position</label>
              <input
                type="number"
                value={selectedChild.position?.y || 0}
                onChange={(e) => updateChildPosition("y", e.target.value)}
                className="w-full p-1 border rounded text-sm"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Quick Position</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  updateChildPosition("x", 10);
                  updateChildPosition("y", 10);
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Left
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 150);
                  updateChildPosition("y", 10);
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Center
              </button>
              <button
                onClick={() => {
                  updateChildPosition("x", 300);
                  updateChildPosition("y", 10);
                }}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Top Right
              </button>
            </div>
          </div>
        </div>
      )} 

      <div className=" flex gap-5 flex-wrap overflow-y-auto max-h-72">
        <div>
          <label className="block text-sm font-medium">Background Color</label>
          <input
            type="color"
            value={selectedProps.bgColor || "#ffffff"}
            onChange={(e) => updateProp("bgColor", e.target.value)}
            className="w-20 h-8 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedProps.textColor || "#000000"}
            onChange={(e) => updateProp("textColor", e.target.value)}
            className="w-full h-8 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Padding</label>
          <input
            type="text"
            value={selectedProps.padding || ""}
            onChange={(e) => updateProp("padding", e.target.value)}
            placeholder="16px"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Border Radius</label>
          <input
            type="text"
            value={selectedProps.borderRadius || ""}
            onChange={(e) => updateProp("borderRadius", e.target.value)}
            placeholder="4px"
            className="w-full p-2 border rounded"
          />
        </div>
        {selectedProps.text !== undefined && (
          <div>
            <label className="block text-sm font-medium">Text</label>
            <input
              type="text"
              value={selectedProps.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedProps.placeholder !== undefined && (
          <div>
            <label className="block text-sm font-medium">Placeholder</label>
            <input
              type="text"
              value={selectedProps.placeholder || ""}
              onChange={(e) => updateProp("placeholder", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedProps.title !== undefined && (
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={selectedProps.title || ""}
              onChange={(e) => updateProp("title", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedProps.width !== undefined && (
          <div>
            <label className="block text-sm font-medium">Width</label>
            <input
              type="text"
              value={selectedProps.width || ""}
              onChange={(e) => updateProp("width", e.target.value)}
              placeholder="auto"
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedProps.fontSize !== undefined && (
          <div>
            <label className="block text-sm font-medium">Font Size</label>
            <input
              type="text"
              value={selectedProps.fontSize || ""}
              onChange={(e) => updateProp("fontSize", e.target.value)}
              placeholder="14px"
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedProps.className !== undefined && (
          <div>
            <label className="block text-sm font-medium">Class Name</label>
            <input
              type="text"
              value={selectedProps.className || ""}
              onChange={(e) => updateProp("className", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        
      </div>
      <div className=""></div>
    
</div>

        </div>
    );
}