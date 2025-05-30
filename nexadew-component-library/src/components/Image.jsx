export default function Image({ src, alt, style, className, ...props }) {
  return (
    <img
      src={src || "/placeholder.svg?height=150&width=200"}
      alt={alt || "Image"}
      className={className}
      style={style}
      {...props}
    />
  );
}
