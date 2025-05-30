export default function Grid({ 
  cols = "3",
  gap = "gap-4",
  bgColor = "bg-transparent",
  padding = "p-4",
  children,
  className,
  style 
}) {
  const gridCols = `grid-cols-${cols}`;
  
  return (
    <div 
      className={`grid ${gridCols} ${gap} ${bgColor} ${padding} ${className || ""}`} 
      style={style}
    >
      {children}
    </div>
  );
}
