import { useDrag } from "react-dnd";
import Button from "./Button";

export default function DraggableChildComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
  parentId,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "existing-child",
    item: { id: component.id, parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const renderComponent = () => {
    const { type, props } = component;

    switch (type) {
      case "button":
        return (
          <Button
            className={props.className}
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: "none",
              fontSize: props.fontSize || "14px",
              fontWeight: props.fontWeight || "normal",
              width: props.width || "auto",
              height: props.height || "auto",
            }}
          >
            {props.text || "Button"}
          </Button>
        );

      case "dropdown":
        return (
          <select
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              border: "1px solid #d1d5db",
              fontSize: props.fontSize || "14px",
              width: props.width || "150px",
            }}
          >
            <option>{props.placeholder || "Select option"}</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        );

      case "searchbar":
        return (
          <div className="flex items-center gap-2" style={{ width: props.width || "250px" }}>
            <input
              type="text"
              placeholder={props.placeholder || "Search..."}
              style={{
                backgroundColor: props.bgColor,
                color: props.textColor,
                padding: props.padding,
                borderRadius: props.borderRadius,
                border: "1px solid #d1d5db",
                fontSize: props.fontSize || "14px",
                flex: 1,
              }}
            />
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "8px",
                borderRadius: props.borderRadius,
                border: "none",
                cursor: "pointer",
              }}
            >
              🔍
            </button>
          </div>
        );

      case "text":
        return (
          <span
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              fontSize: props.fontSize || "14px",
              fontWeight: props.fontWeight || "normal",
            }}
          >
            {props.text || "Text Element"}
          </span>
        );

      case "logo":
        return (
          <div
            style={{
              backgroundColor: props.bgColor,
              color: props.textColor,
              padding: props.padding,
              borderRadius: props.borderRadius,
              fontSize: props.fontSize || "18px",
              fontWeight: "bold",
            }}
          >
            {props.text || "LOGO"}
          </div>
        );
        

      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute cursor-move group ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${
        isDragging ? "opacity-50 z-50" : "z-10"
      }`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        transform: isDragging ? "rotate(2deg)" : "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
    >
      {renderComponent()}

      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-white border rounded shadow-lg p-1 z-20">
          <button className="w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100 rounded" title="Move">
            ↔
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-red-50 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}

      <div className="absolute -bottom-6 left-0 text-xs text-gray-400 bg-white px-1 rounded border">
        {Math.round(component.position?.x || 0)}, {Math.round(component.position?.y || 0)}
      </div>
    </div>
  );
}