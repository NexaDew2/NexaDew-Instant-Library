export default function Input({ placeholder, style, className, type = "text", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
      style={style}
      {...props}
    />
  );
}
