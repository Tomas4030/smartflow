

function SectionHead({ eyebrow, title, sub, align = "left" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 56, maxWidth: align === "center" ? 820 : 900, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>
      <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0, fontWeight: 500 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.55, color: "var(--fg-dim)", maxWidth: 720 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Intro() {
  const [t] = useT();
  return (
    <section style={{ padding: "140px 0 80px" }}>
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", boxShadow: "0 0 12px var(--red)" }}/>
            {t.intro.eyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6.4vw, 88px)", lineHeight: 1.05, fontWeight: 500, margin: 0, maxWidth: 1100 }}>
            {t.intro.headline}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ marginTop: 36, fontSize: 19, lineHeight: 1.6, color: "var(--fg-dim)", maxWidth: 760 }}>
            {t.intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Problem() {
  const [t] = useT();
  return (
    <section id="problem" style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.problem.eyebrow} title={t.problem.title}/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {t.problem.stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ padding: "44px 32px", background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="bignum" style={{ color: i === 3 ? "var(--red)" : "var(--fg)" }}>{s.v}</div>
                <div style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.5 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const [t] = useT();
  return (
    <section id="solution" style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.solution.eyebrow} title={t.solution.title}/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center" }} className="sf-solution-grid">
          <Reveal>
            <SystemDiagram/>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {t.solution.points.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, border: "1px solid var(--hairline)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", background: "color-mix(in oklch, var(--accent) 8%, transparent)" }}>
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, marginBottom: 8 }}>{p.t}</h3>
                    <p style={{ margin: 0, color: "var(--fg-dim)", lineHeight: 1.55, fontSize: 15 }}>{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 920px) { .sf-solution-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

function SystemDiagram() {
  return (
    <div style={{ position: "relative", aspectRatio: "1 / 1", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "color-mix(in oklch, var(--surface) 50%, transparent)", overflow: "hidden" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }}/>
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/>
          </marker>
        </defs>

        <DiagramNode cx="80" cy="120" label="CÂMARA · IA" sub="detection"/>
        <DiagramNode cx="200" cy="200" label="CONTROLADOR" sub="edge node" emphasized/>
        <DiagramNode cx="320" cy="120" label="SEMÁFORO" sub="actuator"/>
        <DiagramNode cx="200" cy="320" label="AMBULÂNCIA" sub="vehicle" />

        <path d="M 110 130 Q 150 165 175 195" stroke="var(--accent)" strokeWidth="1.4" fill="none" markerEnd="url(#arrow)" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <path d="M 225 195 Q 270 165 290 130" stroke="var(--accent)" strokeWidth="1.4" fill="none" markerEnd="url(#arrow)" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <path d="M 200 230 L 200 290" stroke="var(--cyan)" strokeWidth="1.2" fill="none" opacity="0.6"/>
        <path d="M 95 145 Q 130 230 180 305" stroke="var(--fg-muted)" strokeWidth="1" fill="none" strokeDasharray="2 6" opacity="0.5"/>
      </svg>
    </div>
  );
}

function DiagramNode({ cx, cy, label, sub, emphasized }) {
  return (
    <g>
      <rect x={cx - 56} y={cy - 22} width="112" height="44" rx="6"
        fill={emphasized ? "color-mix(in oklch, var(--accent) 14%, var(--surface))" : "var(--surface)"}
        stroke={emphasized ? "var(--accent)" : "var(--hairline-2)"}/>
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.14em" fill="var(--fg)">{label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--fg-muted)">{sub}</text>
    </g>
  );
}

function TimeSaved() {
  const [t] = useT();
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.85 });
  const withSF = clamp(p * 1.3, 0, 1);  
  const withoutSF = clamp(p * 0.55, 0, 1);

  return (
    <section ref={ref} style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.timesaved.eyebrow} title={t.timesaved.title} sub={t.timesaved.body}/></Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 40 }}>
          <RaceTrack
            label={t === window.SF_I18N.pt ? "SEM Smart Flow" : "WITHOUT Smart Flow"}
            time={t === window.SF_I18N.pt ? "00:18:42" : "00:18:42"}
            color="var(--red)"
            progress={withoutSF}
          />
          <RaceTrack
            label={t === window.SF_I18N.pt ? "COM Smart Flow" : "WITH Smart Flow"}
            time={t === window.SF_I18N.pt ? "00:11:28" : "00:11:28"}
            color="var(--green)"
            progress={withSF}
            highlight
          />
        </div>
      </div>
    </section>
  );
}

function RaceTrack({ label, time, color, progress, highlight }) {
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 24, background: highlight ? "color-mix(in oklch, var(--accent) 6%, var(--surface))" : "var(--surface)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: highlight ? "var(--accent)" : "var(--fg-dim)" }}>{label}</div>
        <div className="mono" style={{ fontSize: 22, color }}>{time}</div>
      </div>
      <div style={{ position: "relative", height: 6, background: "var(--hairline)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: color, transformOrigin: "left", transform: `scaleX(${progress})`, transition: "transform .15s linear", borderRadius: 999, boxShadow: `0 0 18px ${color}` }}/>
      </div>
      <div style={{ position: "relative", marginTop: 10, height: 22 }}>
        <div className="mono" style={{ position: "absolute", left: `calc(${progress * 100}% - 14px)`, fontSize: 16, transition: "left .15s linear", filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))" }}>🚑</div>
      </div>
    </div>
  );
}

function Market() {
  const [t] = useT();
  return (
    <section id="market" style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.market.eyebrow} title={t.market.title}/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {t.market.cards.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ padding: 32, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--surface)", height: "100%", display: "flex", flexDirection: "column", gap: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--accent) 10%, transparent), transparent 50%)" }}/>
                <div className="tag" style={{ alignSelf: "flex-start", position: "relative" }}>{c.k}</div>
                <div className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 500, lineHeight: 1.1, position: "relative" }}>
                  {c.v}
                </div>
                <div style={{ color: "var(--fg-dim)", fontSize: 14, lineHeight: 1.55, position: "relative", marginTop: "auto" }}>{c.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  const [t] = useT();
  return (
    <section id="roadmap" style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.roadmap.eyebrow} title={t.roadmap.title}/></Reveal>
        <div style={{ position: "relative", marginTop: 40 }}>
          <div style={{ position: "absolute", left: 24, top: 12, bottom: 12, width: 1, background: "linear-gradient(var(--accent), var(--hairline))" }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {t.roadmap.steps.map((s, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--accent)", background: "var(--bg)", display: "grid", placeItems: "center", color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", boxShadow: "0 0 24px color-mix(in oklch, var(--accent) 35%, transparent)" }}>
                    {s.y}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <h3 className="display" style={{ fontSize: 24, fontWeight: 500, margin: 0, marginBottom: 6 }}>{s.t}</h3>
                    <p style={{ margin: 0, color: "var(--fg-dim)", lineHeight: 1.55, fontSize: 15, maxWidth: 640 }}>{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const [t] = useT();
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.compare.eyebrow} title={t.compare.title} align="center"/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }} className="sf-compare-grid">
          <Reveal>
            <CompareSide name={t.compare.a_name} pts={t.compare.a_pts} dim/>
          </Reveal>
          <Reveal delay={120}>
            <CompareSide name={t.compare.b_name} pts={t.compare.b_pts} highlight/>
          </Reveal>
        </div>
        <style>{`@media (max-width: 760px) { .sf-compare-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

function CompareSide({ name, pts, dim, highlight }) {
  return (
    <div style={{
      padding: 40,
      background: highlight ? "color-mix(in oklch, var(--accent) 8%, var(--surface))" : "var(--surface)",
      borderRight: "1px solid var(--hairline)",
      height: "100%",
      position: "relative",
    }}>
      <div className="display" style={{ fontSize: 28, fontWeight: 500, marginBottom: 4, color: highlight ? "var(--accent)" : "var(--fg)" }}>
        {name}
      </div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--fg-muted)", marginBottom: 28 }}>
        {highlight ? "RECOMMENDED" : "ALTERNATIVE"}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        {pts.map((p, i) => (
          <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", color: dim ? "var(--fg-dim)" : "var(--fg)", fontSize: 15, lineHeight: 1.45 }}>
            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", marginTop: 1, background: highlight ? "var(--accent)" : "transparent", border: highlight ? "0" : "1px solid var(--hairline-2)", color: "#fff", fontSize: 11 }}>
              {highlight ? "✓" : "·"}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  const [t] = useT();
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title}/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="sf-pricing-grid">
          <Reveal>
            <PricingCard lines={t.pricing.lines} total={t.pricing.total}
              title={t === window.SF_I18N.pt ? "Custo por cruzamento" : "Cost per intersection"}/>
          </Reveal>
          <Reveal delay={120}>
            <PricingCard lines={t.pricing.invest_lines}
              total={t === window.SF_I18N.pt ? "€55.000 total" : "€55,000 total"}
              title={t.pricing.invest_title} secondary/>
          </Reveal>
        </div>
        <style>{`@media (max-width: 760px) { .sf-pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

function PricingCard({ title, lines, total, secondary }) {
  return (
    <div style={{ padding: 32, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: secondary ? "var(--surface)" : "color-mix(in oklch, var(--accent) 6%, var(--surface))", height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--fg-muted)", marginBottom: 8 }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: 0 }}>
        {lines.map((l, i) => (
          <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: i === 0 ? "1px solid var(--hairline)" : "1px dashed var(--hairline)", fontSize: 15 }}>
            <span style={{ color: "var(--fg-dim)" }}>{l.k}</span>
            <span className="mono" style={{ color: "var(--fg)" }}>{l.v}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--fg-muted)" }}>TOTAL</span>
        <span className="display" style={{ fontSize: 28, color: secondary ? "var(--fg)" : "var(--accent)", fontWeight: 500 }}>{total}</span>
      </div>
    </div>
  );
}

function Team() {
  const [t] = useT();
  return (
    <section id="team" style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal><SectionHead eyebrow={t.team.eyebrow} title={t.team.title}/></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 800 }}>
          {t.team.members.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ padding: 28, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--surface)", display: "flex", gap: 20, alignItems: "center" }}>
                <Avatar name={m.n} idx={i}/>
                <div>
                  <div className="display" style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{m.n}</div>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--fg-muted)", marginTop: 6, textTransform: "uppercase" }}>{m.r}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Avatar({ name, idx }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  const palette = [
    ["oklch(0.50 0.22 300)", "oklch(0.30 0.15 300)"],
    ["oklch(0.55 0.16 200)", "oklch(0.30 0.12 200)"],
  ];
  const [a, b] = palette[idx % palette.length];
  return (
    <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${a}, ${b})`, display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", border: "1px solid var(--hairline-2)" }}>
      {initials}
    </div>
  );
}

function Contact() {
  const [t] = useT();
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 80%, color-mix(in oklch, var(--accent) 28%, transparent), transparent 65%)" }}/>
      <div className="container" style={{ position: "relative", textAlign: "center" }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>{t.contact.eyebrow}</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 500, margin: 0, maxWidth: 920, marginInline: "auto" }}>
            {t.contact.title}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ marginTop: 24, fontSize: 18, color: "var(--fg-dim)" }}>{t.contact.sub}</p>
        </Reveal>
        <Reveal delay={220}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
            <a href={`mailto:${t.contact.email}`} className="btn btn-primary">{t.contact.cta} →</a>
            <a href="simulator.html" className="btn btn-ghost">{t.nav.simulator}</a>
          </div>
          <div className="mono" style={{ marginTop: 28, fontSize: 13, color: "var(--fg-muted)" }}>
            {t.contact.email}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const [t] = useT();
  return (
    <footer style={{ padding: "40px 0 60px", borderTop: "1px solid var(--hairline)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Logomark size={18}/>
          <span className="mono" style={{ fontSize: 12, color: "var(--fg-muted)", letterSpacing: "0.08em" }}>{t.footer_note}</span>
        </div>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-muted)" }}>
          {t.contact.email}
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Intro, Problem, Solution, TimeSaved, Market, Roadmap, Compare, Pricing, Team, Contact, Footer });
