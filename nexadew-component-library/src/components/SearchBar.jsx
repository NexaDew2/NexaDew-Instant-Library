export default function SearchBar({ placeholder, style, className, onSearch }) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder={placeholder || "rady..."}
        className={`px-3 py-2 border rounded-l focus:outline-none bg-black focus:ring-2 focus:ring-blue-500 ${className || ""}`}
        style={style}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <button className="px-3 py-2 bg-black text-black rounded-r hover:bg-black">
        🔍
      </button>
    </div>
  );
}
