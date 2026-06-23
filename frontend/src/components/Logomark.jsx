export function Logomark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="6"
        fill="var(--accent)"
        fillOpacity="0.12"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeOpacity="0.65"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontWeight="700"
        fontSize="9.5"
        fill="var(--accent)"
      >
        SF
      </text>
    </svg>
  );
}
