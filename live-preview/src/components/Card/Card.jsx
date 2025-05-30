export default function Card({ 
  title = "Card Title", 
  description = "Card description",
  bgColor = "bg-white",
  textColor = "text-gray-900",
  borderRadius = "rounded-lg",
  shadow = "shadow-md",
  padding = "p-6",
  children,
  className,
  style 
}) {
  return (
    <div 
      className={`${bgColor} ${textColor} ${borderRadius} ${shadow} ${padding} ${className || ""}`} 
      style={style}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="opacity-80 mb-4">{description}</p>
      {children}
    </div>
  );
}
