export function SectionHead({ eyebrow, title, sub, align = "left" }) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 56,
        maxWidth: align === "center" ? 820 : 900,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        {eyebrow}
      </div>
      <h2
        className="display"
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          margin: 0,
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: 20,
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--fg-dim)",
            maxWidth: 720,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
