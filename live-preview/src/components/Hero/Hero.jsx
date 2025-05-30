export default function Hero({ 
  title = "Hero Title", 
  subtitle = "Hero subtitle", 
  alignment = "center",
  bgColor = "bg-gray-50",
  textColor = "text-gray-900",
  padding = "py-20",
  children,
  className,
  style 
}) {
  return (
    <section 
      className={`${padding} ${bgColor} ${textColor} ${alignment === 'center' ? 'text-center' : ''} ${className || ""}`} 
      style={style}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg opacity-80 mb-8">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
