export default function Logo({ children, style, className, ...props }) {
  return (
    <div className={`font-bold ${className || ""}`} style={style} {...props}>
      {children || "LOGO"}
    </div>
  );
}
