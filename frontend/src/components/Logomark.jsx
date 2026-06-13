export function Logomark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" stroke="var(--accent)" strokeOpacity="0.55"/>
      <path d="M5 15 C 8 15, 8 9, 12 9 C 16 9, 16 15, 19 15"
            stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="12" r="1.6" fill="var(--accent)"/>
    </svg>
  )
}
