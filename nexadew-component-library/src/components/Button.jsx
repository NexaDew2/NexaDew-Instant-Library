export default function Button({ children, className, style }) {
  return (
    <button className={`px-4 py-2 rounded ${className}`} style={style}>
      {children}
    </button>
  );
}