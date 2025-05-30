import { useState } from "react";

export default function Dropdown({ options = ["Option 1", "Option 2", "Option 3"], placeholder, style, className, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
        style={style}
      >
        {selected || placeholder || "Select option"}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
                if (onSelect) onSelect(option);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
