export default function Container({ 
  bgColor = "bg-gray-50",
  padding = "p-0",
  borderRadius = "rounded-lg",
  border = "border border-gray-200",
  children,
  className,
  style 
}) {
  return (
    <div 
      className={`${bgColor} ${padding} ${borderRadius} ${border} ${className || ""}`} 
      style={style}
    >
      {children}
    </div>
  );
}
