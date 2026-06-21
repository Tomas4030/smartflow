import { useRef } from "react";
import { useT, Reveal, useScrollProgress, clamp } from "../../shared";
import { SF_I18N } from "../../i18n";
import { SectionHead } from "./SectionHead";

export function TimeSaved() {
  const [t] = useT();
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.85 });
  const withSF = clamp(p * 1.3, 0, 1);
  const withoutSF = clamp(p * 0.55, 0, 1);
  return (
    <section
      ref={ref}
      style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container">
        <Reveal>
          <SectionHead
            eyebrow={t.timesaved.eyebrow}
            title={t.timesaved.title}
            sub={t.timesaved.body}
          />
        </Reveal>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: 40,
          }}
        >
          <RaceTrack
            label={t === SF_I18N.pt ? "SEM Smart Flow" : "WITHOUT Smart Flow"}
            time="00:18:42"
            color="var(--red)"
            progress={withoutSF}
          />
          <RaceTrack
            label={t === SF_I18N.pt ? "COM Smart Flow" : "WITH Smart Flow"}
            time="00:11:28"
            color="var(--green)"
            progress={withSF}
            highlight
          />
        </div>
      </div>
    </section>
  );
}

export function RaceTrack({ label, time, color, progress, highlight }) {
  return (
    <div
      style={{
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        background: highlight
          ? "color-mix(in oklch, var(--accent) 6%, var(--surface))"
          : "var(--surface)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            color: highlight ? "var(--accent)" : "var(--fg-dim)",
          }}
        >
          {label}
        </div>
        <div className="mono" style={{ fontSize: 22, color }}>
          {time}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 6,
          background: "var(--hairline)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: color,
            transformOrigin: "left",
            transform: `scaleX(${progress})`,
            transition: "transform .15s linear",
            borderRadius: 999,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
      </div>
      <div style={{ position: "relative", marginTop: 10, height: 22 }}>
        <div
          className="mono"
          style={{
            position: "absolute",
            left: `calc(${progress * 100}% - 14px)`,
            fontSize: 16,
            transition: "left .15s linear",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
          }}
        >
          🚑
        </div>
      </div>
    </div>
  );
}
