import { useRef } from 'react'
import { useT, useScrollProgress, clamp } from '../shared'

function ambulanceXForP(p) {
  const checkpoints = [[0.00,-220],[0.18,-120],[0.40,280],[0.60,560],[0.72,780],[0.80,940],[0.90,1260],[1.00,1820]]
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const [p0, x0] = checkpoints[i]
    const [p1, x1] = checkpoints[i + 1]
    if (p <= p1) {
      const local = (p - p0) / (p1 - p0)
      return x0 + (x1 - x0) * Math.max(0, Math.min(1, local))
    }
  }
  return checkpoints[checkpoints.length - 1][1]
}

function Wheel({ cx, cy }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle cx="0" cy="0" r="14" fill="oklch(0.10 0.01 285)" stroke="oklch(0.40 0.01 285)" strokeWidth="1"/>
      <circle cx="0" cy="0" r="6" fill="oklch(0.55 0.01 285)"/>
      <g>
        <line x1="-6" y1="0" x2="6" y2="0" stroke="oklch(0.30 0.01 285)" strokeWidth="1"/>
        <line x1="0" y1="-6" x2="0" y2="6" stroke="oklch(0.30 0.01 285)" strokeWidth="1"/>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"/>
      </g>
    </g>
  )
}

function Ambulance({ x, y, active }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g style={{ animation: "sf-amb-bob 0.8s ease-in-out infinite" }}>
        <ellipse cx="0" cy="60" rx="118" ry="9" fill="black" opacity="0.5"/>
        {active && <ellipse cx="0" cy="50" rx="130" ry="14" fill="var(--accent)" opacity="0.18" filter="url(#hero-glow)"/>}
        <rect x="-110" y="-44" width="170" height="86" rx="10" fill="#fafafa" stroke="oklch(0.40 0.02 285)" strokeWidth="1.4"/>
        <rect x="-110" y="-44" width="170" height="14" rx="10" fill="oklch(0.92 0.005 285)"/>
        <path d="M 60 -44 L 110 -44 L 110 42 L 60 42 Z" fill="#f5f3ee" stroke="oklch(0.40 0.02 285)" strokeWidth="1.4"/>
        <path d="M 66 -36 L 104 -36 L 104 -2 L 66 -2 Z" fill="oklch(0.55 0.06 230)" stroke="oklch(0.30 0.04 230)" strokeWidth="0.8"/>
        <rect x="-90" y="-32" width="50" height="22" rx="2" fill="oklch(0.55 0.06 230)" stroke="oklch(0.30 0.04 230)" strokeWidth="0.8"/>
        <line x1="-65" y1="-32" x2="-65" y2="-10" stroke="oklch(0.30 0.04 230)" strokeWidth="0.6"/>
        <rect x="-110" y="2" width="170" height="6" fill="var(--red)" opacity="0.85"/>
        <g transform="translate(-20, 14)">
          <rect x="-12" y="-3" width="24" height="6" fill="var(--red)"/>
          <rect x="-3" y="-12" width="6" height="24" fill="var(--red)"/>
        </g>
        <text x="-50" y="-14" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.18em" fill="oklch(0.30 0.02 285)">AMBULÂNCIA</text>
        <rect x="-46" y="-58" width="92" height="14" rx="2" fill="oklch(0.30 0.02 285)"/>
        <rect x="-44" y="-56" width="42" height="10" fill="var(--cyan)">
          <animate attributeName="fill" values="var(--cyan);oklch(0.30 0.02 285);var(--cyan)" dur="0.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="2" y="-56" width="42" height="10" fill="var(--red)">
          <animate attributeName="fill" values="var(--red);oklch(0.30 0.02 285);var(--red)" dur="0.5s" repeatCount="indefinite" begin="0.25s"/>
        </rect>
        <rect x="106" y="34" width="6" height="8" fill="oklch(0.30 0.02 285)"/>
        <Wheel cx={-72} cy={48}/>
        <Wheel cx={72} cy={48}/>
      </g>
    </g>
  )
}

function Lamp({ cx, cy, color, on }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="9" fill="oklch(0.10 0.01 285)" stroke="oklch(0.30 0.01 285)" strokeWidth="0.6"/>
      <circle cx={cx} cy={cy} r="6.5" fill={on ? color : "oklch(0.18 0.01 285)"} opacity={on ? 1 : 0.8} filter={on ? "url(#hero-glow)" : undefined} style={on ? { animation: "sf-light-pulse 1.6s ease-in-out infinite" } : undefined}/>
      {on && <circle cx={cx - 1.5} cy={cy - 1.5} r="2" fill="white" opacity="0.5"/>}
    </g>
  )
}

function TrafficLight({ cx, groundY, green }) {
  const lampY = groundY - 130
  const headW = 30, headH = 78
  return (
    <g>
      <ellipse cx={cx} cy={groundY + 4} rx="60" ry="8" fill={green ? "url(#grnGlow)" : "url(#redGlow)"}/>
      <rect x={cx - 2} y={lampY + headH} width="4" height={groundY - (lampY + headH) + 2} fill="oklch(0.42 0.012 285)"/>
      <rect x={cx - 10} y={groundY - 4} width="20" height="6" rx="1" fill="oklch(0.30 0.012 285)" stroke="var(--hairline-2)" strokeWidth="0.5"/>
      <rect x={cx - headW/2} y={lampY} width={headW} height={headH} rx="6" fill="oklch(0.16 0.012 285)" stroke="oklch(0.34 0.012 285)" strokeWidth="1"/>
      <rect x={cx - headW/2 - 4} y={lampY + (green ? headH - 30 : 4)} width={headW + 8} height="6" rx="2" fill="oklch(0.20 0.012 285)"/>
      <Lamp cx={cx} cy={lampY + 14} color="var(--red)" on={!green}/>
      <Lamp cx={cx} cy={lampY + 38} color="var(--amber)" on={false}/>
      <Lamp cx={cx} cy={lampY + 62} color="var(--green)" on={green}/>
      <text x={cx + 22} y={lampY + 6} fontSize="9" fontFamily="var(--font-mono)" fill={green ? "var(--green)" : "var(--red)"} letterSpacing="0.14em">{green ? "GO" : "STOP"}</text>
    </g>
  )
}

function Camera({ cx, groundY, active, ambX, ambY }) {
  const lampY = groundY - 150
  return (
    <g>
      <rect x={cx - 2} y={lampY + 18} width="4" height={groundY - lampY - 16} fill="oklch(0.42 0.012 285)"/>
      <rect x={cx - 10} y={groundY - 4} width="20" height="6" rx="1" fill="oklch(0.30 0.012 285)" stroke="var(--hairline-2)" strokeWidth="0.5"/>
      <rect x={cx - 28} y={lampY + 6} width="30" height="3" fill="oklch(0.42 0.012 285)"/>
      <rect x={cx - 44} y={lampY - 4} width="20" height="14" rx="2" fill={active ? "oklch(0.30 0.04 300)" : "oklch(0.26 0.012 285)"} stroke={active ? "var(--accent)" : "var(--hairline-2)"} strokeWidth="1"/>
      <circle cx={cx - 38} cy={lampY + 3} r="3.4" fill="oklch(0.10 0.01 285)" stroke={active ? "var(--accent)" : "oklch(0.40 0.01 285)"} strokeWidth="0.8"/>
      <circle cx={cx - 38} cy={lampY + 3} r="1.4" fill={active ? "var(--accent)" : "oklch(0.50 0.01 285)"}/>
      <rect x={cx - 20} y={lampY - 18} width="34" height="12" rx="6" fill="color-mix(in oklch, var(--surface) 80%, transparent)" stroke={active ? "var(--accent)" : "var(--hairline-2)"} strokeWidth="0.6"/>
      <text x={cx - 3} y={lampY - 9} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.16em" fill={active ? "var(--accent)" : "var(--fg-muted)"}>AI · CAM</text>
      {active && ambX < cx + 30 && ambX > cx - 700 && (
        <g opacity="0.6">
          <path d={`M ${cx - 38} ${lampY + 3} L ${ambX - 30} ${ambY - 24} L ${ambX - 30} ${ambY + 24} Z`} fill="var(--accent)" opacity="0.12"/>
          <line x1={cx - 38} y1={lampY + 3} x2={ambX - 30} y2={ambY - 24} stroke="var(--accent)" strokeWidth="1" opacity="0.7"/>
          <line x1={cx - 38} y1={lampY + 3} x2={ambX - 30} y2={ambY + 24} stroke="var(--accent)" strokeWidth="1" opacity="0.7"/>
          <circle cx={cx - 38} cy={lampY + 3} r="6" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.6">
            <animate attributeName="r" from="6" to="20" dur="1.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.7" to="0" dur="1.4s" repeatCount="indefinite"/>
          </circle>
        </g>
      )}
    </g>
  )
}

function Zebra({ cx, top, bottom }) {
  return (
    <g opacity="0.55">
      {[0,1,2,3,4,5,6].map(i => <rect key={i} x={cx - 30 + i * 9} y={top + 4} width="6" height={bottom - top - 8} fill="oklch(0.85 0.005 285)" opacity="0.6"/>)}
    </g>
  )
}

function Skyline({ W, baseY }) {
  const pts = []
  let x = 0
  while (x < W) { const h = 30 + ((x * 13) % 90); const w = 40 + ((x * 7) % 60); pts.push({ x, h, w }); x += w }
  return (
    <g opacity="0.35">
      {pts.map((p, i) => <rect key={i} x={p.x} y={baseY - p.h} width={p.w - 2} height={p.h} fill="oklch(0.18 0.02 285)"/>)}
    </g>
  )
}

function BuildingsRow({ W, y, variant }) {
  const items = []
  let x = -40, i = 0
  while (x < W + 60) {
    const seed = (i * (variant === 1 ? 23 : 41) + variant * 7) & 7
    const w = 80 + seed * 18; const h = 60 + ((seed * 13) % 100) + (variant === 1 ? 30 : 0)
    items.push({ x, w, h, accent: seed % 5 === 0 }); x += w + 14; i++
  }
  return (
    <g>
      {items.map((b, k) => (
        <g key={k}>
          <rect x={b.x} y={y - b.h} width={b.w} height={b.h} fill="url(#building)" stroke="var(--hairline)" strokeWidth="0.5"/>
          {Array.from({ length: Math.floor(b.h / 14) }).map((_, r) => (
            <rect key={r} x={b.x + 6} y={y - b.h + 8 + r * 14} width={b.w - 12} height="3" fill={b.accent && r === 0 ? "var(--accent)" : "oklch(0.55 0.04 80)"} opacity={b.accent && r === 0 ? 0.85 : 0.18}/>
          ))}
          <line x1={b.x} y1={y - b.h} x2={b.x + b.w} y2={y - b.h} stroke="oklch(0.45 0.02 285)" strokeWidth="0.6" opacity="0.6"/>
        </g>
      ))}
    </g>
  )
}

function RoadScene({ scrollP, detectionActive, step }) {
  const W = 1600, H = 700, ROAD_TOP = 440, ROAD_BOTTOM = 560, GROUND_Y = 580
  const ambX = ambulanceXForP(scrollP)
  const ambY = (ROAD_TOP + ROAD_BOTTOM) / 2
  const light1X = 700, light2X = 1180, PREEMPT = 220
  const l1Green = detectionActive && ambX > light1X - PREEMPT
  const l2Green = detectionActive && ambX > light2X - PREEMPT

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.20 0.04 295)"/><stop offset="100%" stopColor="oklch(0.16 0.025 285)"/></linearGradient>
        <linearGradient id="ground2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.24 0.018 285)"/><stop offset="100%" stopColor="oklch(0.18 0.015 285)"/></linearGradient>
        <linearGradient id="road" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.32 0.012 285)"/><stop offset="100%" stopColor="oklch(0.24 0.012 285)"/></linearGradient>
        <linearGradient id="building" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.28 0.020 285)"/><stop offset="100%" stopColor="oklch(0.22 0.018 285)"/></linearGradient>
        <radialGradient id="redGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stopColor="var(--red)" stopOpacity="0.7"/><stop offset="100%" stopColor="var(--red)" stopOpacity="0"/></radialGradient>
        <radialGradient id="grnGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stopColor="var(--green)" stopOpacity="0.7"/><stop offset="100%" stopColor="var(--green)" stopOpacity="0"/></radialGradient>
        <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="0" y="0" width={W} height={GROUND_Y} fill="url(#sky)"/>
      {Array.from({ length: 26 }).map((_, i) => { const x = (i * 137) % W; const y = 60 + (i * 41) % 200; const r = (i % 5 === 0) ? 1.6 : 0.8; return <circle key={i} cx={x} cy={y} r={r} fill="oklch(0.85 0.03 285)" opacity={0.25 + (i % 3) * 0.1}/> })}
      <Skyline W={W} baseY={GROUND_Y - 220}/>
      <BuildingsRow W={W} y={GROUND_Y - 180} variant={1}/>
      <BuildingsRow W={W} y={GROUND_Y - 130} variant={2}/>
      <rect x="0" y={GROUND_Y - 20} width={W} height="20" fill="oklch(0.30 0.012 285)"/>
      <line x1="0" y1={GROUND_Y - 20} x2={W} y2={GROUND_Y - 20} stroke="var(--hairline-2)" strokeWidth="1"/>
      <rect x="0" y={GROUND_Y} width={W} height={H - GROUND_Y} fill="url(#ground2)"/>
      <rect x="0" y={ROAD_TOP} width={W} height={ROAD_BOTTOM - ROAD_TOP} fill="url(#road)"/>
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={i * 80 - 20} y={(ROAD_TOP + ROAD_BOTTOM)/2 - 2} width="48" height="3" fill="oklch(0.78 0.02 285)" opacity="0.55"/>)}
      <rect x="0" y={ROAD_TOP - 4} width={W} height="4" fill="oklch(0.14 0.012 285)" opacity="0.6"/>
      <Zebra cx={light1X - 80} top={ROAD_TOP} bottom={ROAD_BOTTOM}/>
      <Zebra cx={light2X - 80} top={ROAD_TOP} bottom={ROAD_BOTTOM}/>
      <Camera cx={(light1X + light2X) / 2} groundY={GROUND_Y - 20} active={detectionActive} ambX={ambX} ambY={ambY}/>
      <TrafficLight cx={light1X} groundY={GROUND_Y - 20} green={l1Green}/>
      <TrafficLight cx={light2X} groundY={GROUND_Y - 20} green={l2Green}/>
      <Ambulance x={ambX} y={ambY} active={step >= 1}/>
    </svg>
  )
}

function StepCaption({ step, lang }) {
  const captions = lang === "en" ? [null, { eyebrow: "STEP 01 — THE PROBLEM", title: "An ambulance hits red lights.", body: "Every red light costs precious seconds — sometimes lives." }, { eyebrow: "STEP 02 — DETECTION", title: "The AI camera sees it coming.", body: "Sirens, lights, vehicle silhouette — recognised in real time." }, { eyebrow: "STEP 03 — ACTIVATION", title: "Lights flip green ahead.", body: "The intersection opens the ambulance's axis just before arrival." }, { eyebrow: "STEP 04 — FREE PASSAGE", title: "Time recovered. Lives saved.", body: "5–7 minutes to the scene. 10–15 to the hospital." }] : [null, { eyebrow: "PASSO 01 — O PROBLEMA", title: "A ambulância encontra vermelhos.", body: "Cada semáforo custa segundos preciosos — às vezes vidas." }, { eyebrow: "PASSO 02 — DETEÇÃO", title: "A câmara IA vê-a chegar.", body: "Sirene, luzes, silhueta — reconhecidas em tempo real." }, { eyebrow: "PASSO 03 — ATIVAÇÃO", title: "Os semáforos abrem à frente.", body: "O cruzamento abre o eixo da ambulância antes da sua chegada." }, { eyebrow: "PASSO 04 — PASSAGEM LIVRE", title: "Tempo recuperado. Vidas salvas.", body: "5–7 minutos até ao acidente. 10–15 até ao hospital." }]
  const c = captions[step]
  if (!c) return null
  return (
    <div key={step} className="container" style={{ position: "absolute", left: 0, right: 0, top: "14vh", zIndex: 4, pointerEvents: "none" }}>
      <div style={{ maxWidth: 540, padding: 24, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "color-mix(in oklch, var(--surface) 86%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", animation: "sf-cap-in .35s ease both" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 12 }}>{c.eyebrow}</div>
        <div className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1.1, fontWeight: 500 }}>{c.title}</div>
        <p style={{ marginTop: 14, color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.55 }}>{c.body}</p>
      </div>
      <style>{`@keyframes sf-cap-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  )
}

function ProgressDots({ step }) {
  return (
    <div style={{ position: "absolute", right: "var(--pad)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 14, zIndex: 4 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= step ? 1 : 0.35, transition: "opacity .25s ease" }}>
          <span style={{ width: i === step ? 14 : 8, height: i === step ? 14 : 8, borderRadius: "50%", background: i <= step ? "var(--accent)" : "var(--hairline-2)", boxShadow: i === step ? "0 0 14px var(--accent)" : "none", transition: "all .25s ease" }}/>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-muted)", letterSpacing: "0.14em" }}>0{i}</span>
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  const [t, lang] = useT()
  const wrapRef = useRef(null)
  const p = useScrollProgress(wrapRef, { start: 0, end: 1 })
  const titleP = clamp((0.16 - p) / 0.16, 0, 1)
  const sceneIn = clamp((p - 0.05) / 0.18, 0, 1)
  let step = 0
  if (p >= 0.18) step = 1
  if (p >= 0.40) step = 2
  if (p >= 0.60) step = 3
  if (p >= 0.80) step = 4
  const detectionActive = step >= 2

  return (
    <section id="top" ref={wrapRef} style={{ position: "relative", height: "360vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "radial-gradient(ellipse at 50% 30%, color-mix(in oklch, var(--accent-soft) 28%, var(--bg)) 0%, var(--bg) 65%)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.25, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }}/>
        <div className="container" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", opacity: titleP, pointerEvents: titleP < 0.05 ? "none" : "auto", zIndex: 3 }}>
          <div className="tag urgent" style={{ alignSelf: "flex-start", marginBottom: 24 }}><span className="dot" /><span>{t.hero.tag}</span></div>
          <h1 className="display" style={{ fontSize: "clamp(56px, 9vw, 132px)", maxWidth: 980, margin: 0, fontWeight: 500 }}>{t.hero.title_a}<br /><span style={{ color: "var(--accent)" }}>{t.hero.title_b}</span></h1>
          <p style={{ fontSize: "clamp(16px, 1.4vw, 20px)", color: "var(--fg-dim)", maxWidth: 620, marginTop: 28, lineHeight: 1.55 }}>{t.hero.sub}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <a href="#solution" className="btn btn-primary">{t.hero.cta_primary} <span style={{ fontSize: 16 }}>→</span></a>
            <a href="#solution" className="btn btn-ghost">{t.hero.cta_ghost}</a>
          </div>
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: sceneIn, transform: `translateY(${(1 - sceneIn) * 24}px)`, transition: "opacity .15s linear, transform .15s linear" }}>
          <RoadScene scrollP={p} detectionActive={detectionActive} step={step}/>
        </div>
        {step >= 1 && <StepCaption step={step} lang={lang}/>}
        {step >= 1 && <ProgressDots step={step}/>}
        <div aria-hidden style={{ position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)", opacity: titleP * 0.8, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--fg-muted)" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>{t.hero.scroll}</div>
          <div style={{ width: 1, height: 36, background: "var(--fg-muted)", animation: "sf-scroll 1.6s ease-in-out infinite" }} />
        </div>
        <style>{`
          @keyframes sf-scroll { 0%,100% { transform: scaleY(0.4); transform-origin: top; opacity: .3 } 50% { transform: scaleY(1); opacity: 1 } }
          @keyframes sf-amb-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1px) } }
          @keyframes sf-light-pulse { 0%,100% { opacity: 1 } 50% { opacity: .55 } }
        `}</style>
      </div>
    </section>
  )
}
