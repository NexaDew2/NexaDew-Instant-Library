export default function Input({ 
  placeholder = "Enter text...",
  type = "text",
  bgColor = "bg-black",
  textColor = "text-white-900",
  border = "border border-gray-300",
  borderRadius = "rounded",
  padding = "px-3 py-2",
  className,
  style 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${bgColor} ${textColor} ${border} ${borderRadius} ${padding} focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
      style={style}
    />
  );
}
