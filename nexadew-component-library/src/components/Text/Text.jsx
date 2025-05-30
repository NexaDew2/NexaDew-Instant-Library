export default function Text({ 
  content = "Text content",
  as = "p",
  fontSize = "text-base",
  fontWeight = "font-normal",
  textColor = "text-gray-900",
  children,
  className,
  style 
}) {
  const Component = as;
  
  return (
    <Component 
      className={`${fontSize} ${fontWeight} ${textColor} ${className || ""}`} 
      style={style}
    >
      {children || content}
    </Component>
  );
}
