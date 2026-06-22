import { useRef, useState, useEffect } from "react";
import { useT, Reveal } from "../../shared";
import { SF_I18N } from "../../i18n";
import { SectionHead } from "./SectionHead";

const isPt = (t) => t === SF_I18N.pt;

function useAutoPlay(sectionRef) {
  const [sfActive, setSfActive]     = useState([false, false, false, false]);
  const [tradActive, setTradActive] = useState([false, false, false, false]);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timers = [];
    let running = false;

    const reset = () => {
      running = false;
      timers.forEach(clearTimeout);
      timers = [];
      setSfActive([false, false, false, false]);
      setTradActive([false, false, false, false]);
      setBannerVisible(false);
    };

    const play = () => {
      if (running) return;
      running = true;
      [100, 750, 1450, 2150].forEach((d, i) =>
        timers.push(setTimeout(
          () => setSfActive(p => { const n = [...p]; n[i] = true; return n; }), d
        ))
      );
      [100, 1250, 2100, 3300].forEach((d, i) =>
        timers.push(setTimeout(
          () => setTradActive(p => { const n = [...p]; n[i] = true; return n; }), d
        ))
      );
      timers.push(setTimeout(() => setBannerVisible(true), 2500));
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) play();
        else reset();
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [sectionRef]);

  return { sfActive, tradActive, bannerVisible };
}

export function TimeSaved() {
  const [t] = useT();
  const ref = useRef(null);
  const pt = isPt(t);
  const { sfActive, tradActive, bannerVisible } = useAutoPlay(ref);

  const sfSteps = [
    { label: pt ? "Alerta recebido"   : "Alert dispatched",  sub: "0:00" },
    { label: pt ? "1.º cruzamento"    : "1st intersection",  sub: pt ? "3:42 · verde imediato"    : "3:42 · instant green" },
    { label: pt ? "2.º cruzamento"    : "2nd intersection",  sub: pt ? "7:15 · corredor livre"    : "7:15 · corridor clear" },
    { label: pt ? "Chegada ao local"  : "On scene",          sub: "11:28", final: true },
  ];

  const tradSteps = [
    { label: pt ? "Alerta recebido"   : "Alert dispatched",  sub: "0:00" },
    { label: pt ? "1.º cruzamento"    : "1st intersection",  sub: pt ? "5:10 · espera no semáforo" : "5:10 · waiting at light" },
    { label: pt ? "2.º cruzamento"    : "2nd intersection",  sub: pt ? "11:30 · trânsito bloqueado": "11:30 · traffic blocked" },
    { label: pt ? "Chegada ao local"  : "On scene",          sub: "18:42", final: true },
  ];

  return (
    <section
      ref={ref}
      style={{ padding: "48px 0", borderTop: "1px solid var(--hairline)" }}
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
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            columnGap: 40,
            marginTop: 36,
            alignItems: "start",
          }}
        >
          <ScenarioCard
            label={pt ? "SEM Smart Flow" : "WITHOUT Smart Flow"}
            time="18:42"
            color="var(--red)"
            steps={tradSteps}
            active={tradActive}
          />
          <div style={{ background: "var(--hairline)", alignSelf: "stretch" }} />
          <ScenarioCard
            label={pt ? "COM Smart Flow" : "WITH Smart Flow"}
            time="11:28"
            color="var(--green)"
            steps={sfSteps}
            active={sfActive}
            winner
            winnerLabel={pt ? "7 min 14 s mais rápido" : "7 min 14 s faster"}
          />
        </div>

        <TimeSavedBanner pt={pt} visible={bannerVisible} />
      </div>
    </section>
  );
}

function ScenarioCard({ label, time, color, steps, active, winner, winnerLabel }) {
  const arrived = active[steps.length - 1];
  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: winner ? color : "var(--fg-dim)",
            }}
          >
            {label}
          </div>
          {winner && winnerLabel && arrived && (
            <div
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                color: color,
                background: "color-mix(in oklch, var(--green) 12%, var(--surface))",
                padding: "2px 7px",
                borderRadius: 4,
                display: "inline-block",
              }}
            >
              ✓ {winnerLabel}
            </div>
          )}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 28,
            color: arrived ? color : "var(--fg-dim)",
            transition: "color 0.5s ease",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {time}
        </div>
      </div>

      <div>
        {steps.map((step, i) => (
          <TimelineStep
            key={i}
            label={step.label}
            sub={step.sub}
            color={color}
            active={active[i]}
            connectorActive={i < steps.length - 1 && active[i + 1]}
            isLast={i === steps.length - 1}
            isWinnerFinal={winner && step.final}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineStep({ label, sub, color, active, connectorActive, isLast, isWinnerFinal }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: isWinnerFinal ? 14 : 10,
            height: isWinnerFinal ? 14 : 10,
            borderRadius: "50%",
            background: active ? color : "var(--hairline)",
            boxShadow: active
              ? isWinnerFinal
                ? `0 0 0 3px color-mix(in oklch, ${color} 20%, transparent), 0 0 14px ${color}`
                : `0 0 8px color-mix(in oklch, ${color} 55%, transparent)`
              : "none",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
            flexShrink: 0,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 30,
              marginTop: 3,
              background: connectorActive ? color : "var(--hairline)",
              opacity: connectorActive ? 0.4 : 1,
              transition: "background 0.35s ease, opacity 0.35s ease",
            }}
          />
        )}
      </div>

      <div
        style={{
          paddingBottom: isLast ? 0 : 18,
          opacity: active ? 1 : 0.28,
          transition: "opacity 0.35s ease",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: active ? "var(--fg)" : "var(--fg-dim)",
            fontWeight: active ? 600 : 400,
            transition: "color 0.35s, font-weight 0.35s",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {label}
          {isWinnerFinal && active && (
            <span
              style={{
                fontSize: 8,
                letterSpacing: "0.14em",
                background: color,
                color: "#fff",
                padding: "2px 6px",
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          )}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: active ? color : "var(--fg-dim)",
            marginTop: 3,
            transition: "color 0.35s",
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function TimeSavedBanner({ pt, visible }) {
  return (
    <div
      style={{
        marginTop: 28,
        padding: "18px 28px",
        border: "1px solid color-mix(in oklch, var(--green) 28%, var(--hairline))",
        borderRadius: "var(--radius-lg)",
        background: "color-mix(in oklch, var(--green) 5%, var(--surface))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          className="mono"
          style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--fg-dim)" }}
        >
          {pt ? "DIFERENÇA TOTAL" : "TOTAL DIFFERENCE"}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 36,
            color: "var(--green)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          −7:14
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--fg-dim)",
          maxWidth: 380,
          lineHeight: 1.6,
        }}
      >
        {pt
          ? "Num enfarte cardíaco, cada minuto sem reanimação reduz a sobrevivência em ~10%. 7 minutos podem ser decisivos."
          : "In cardiac arrest, every minute without CPR reduces survival by ~10%. 7 minutes can be the deciding factor."}
      </div>
    </div>
  );
}

// Kept for any legacy imports
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
    </div>
  );
}
