export function Logomark({ size = 24 }) {
  return (
    <img
      src="/sf-logo.webp"
      alt="Smart Flow"
      width={size}
      height={size}
      style={{ display: "inline-block", objectFit: "contain", verticalAlign: "middle" }}
    />
  );
}
