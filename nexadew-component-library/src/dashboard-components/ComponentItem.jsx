import { useDrag } from "react-dnd"

export default function ComponentItem({ type, name, category = "layout", icon = "🔧" }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: category,
    item: { type, name, category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "layout":
        return "bg-blue-100 border-blue-200 hover:border-blue-400"
      case "component":
        return "bg-green-100 border-green-200 hover:border-green-400"
      case "custom":
        return "bg-purple-100 border-purple-200 hover:border-purple-400"
      default:
        return "bg-gray-100 border-gray-200 hover:border-gray-400"
    }
  }

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 rounded-lg cursor-move transition-all duration-200 border-2 hover:shadow-md ${getCategoryColor(category)} ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="font-medium text-sm text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 capitalize">{category}</div>
        </div>
        <div className="text-xs text-gray-400">⋮⋮</div>
      </div>
    </div>
  )
}
