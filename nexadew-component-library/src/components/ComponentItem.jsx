import { useDrag } from "react-dnd";

export default function ComponentItem({ type, name, component: Component, category = "layout" }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: category,
    item: { type, name, category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 rounded-lg cursor-move transition-all duration-200 ${
        category === "layout"
          ? "bg-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md"
          : "bg-green-100 border border-green-200 hover:border-green-400 hover:bg-green-50"
      } ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
            category === "layout" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-gray-500">{category}</div>
        </div>
      </div>
    </div>
  );
}