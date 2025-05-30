export default function Icon({ children, style, className, ...props }) {
  return (
    <span className={className} style={style} {...props}>
      {children || "⭐"}
    </span>
  );
}
