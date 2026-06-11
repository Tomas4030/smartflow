
function CityScene({ activeP = 0, ambP = 0 }) {
  const focusX = 500;
  const focusY = 400;

  const eastWestGreen = activeP > 0.4;
  const northSouthGreen = !eastWestGreen;

  const ambX = lerp(focusX - 260, focusX + 260, ambP);
  const ambY = focusY;
  const ringScale = clamp(activeP * 1.2, 0, 1);

  return (
    <svg viewBox="0 0 1000 700" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
    
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="oklch(0.30 0.025 285)"/>
          <stop offset="100%" stopColor="oklch(0.20 0.020 285)"/>
        </linearGradient>

        <linearGradient id="asphalt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.36 0.015 285)"/>
          <stop offset="100%" stopColor="oklch(0.28 0.015 285)"/>
        </linearGradient>
    
        <linearGradient id="wallTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.46 0.020 285)"/>
          <stop offset="100%" stopColor="oklch(0.36 0.020 285)"/>
        </linearGradient>
        <linearGradient id="wallSide" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.34 0.020 285)"/>
          <stop offset="100%" stopColor="oklch(0.26 0.020 285)"/>
        </linearGradient>
        <linearGradient id="wallFront" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.40 0.020 285)"/>
          <stop offset="100%" stopColor="oklch(0.32 0.020 285)"/>
        </linearGradient>
        <linearGradient id="wallAccent" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.16 300)"/>
          <stop offset="100%" stopColor="oklch(0.40 0.18 300)"/>
        </linearGradient>
        <radialGradient id="focusGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </radialGradient>
        <filter id="iso-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.4"/>
        </filter>
        <filter id="iso-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="1000" height="700" fill="url(#ground)"/>
      <ellipse cx="500" cy="380" rx="500" ry="260" fill="oklch(0.34 0.04 295)" opacity="0.35"/>

      <path d="M 0 200 L 80 180 L 120 200 L 200 170 L 260 195 L 320 165 L 400 195 L 480 175 L 560 195 L 640 170 L 720 195 L 800 175 L 880 200 L 1000 180 L 1000 260 L 0 260 Z"
            fill="oklch(0.20 0.02 285)" opacity="0.6"/>

      <IsoCity focusX={focusX} focusY={focusY}/>

      <circle cx={focusX} cy={focusY} r="220" fill="url(#focusGlow)" opacity={0.5 + activeP * 0.5}/>

      <FocusIso
        cx={focusX}
        cy={focusY}
        ewGreen={eastWestGreen}
        nsGreen={northSouthGreen}
        ringScale={ringScale}
        activeP={activeP}
      />

      {activeP > 0.05 && (
        <IsoAmbulance x={ambX} y={ambY} opacity={clamp(activeP * 2, 0, 1)}/>
      )}

      <SceneLabels focusX={focusX} focusY={focusY} activeP={activeP}/>

      <g style={{ opacity: clamp(activeP * 1.6, 0, 1) }}>
        <text x={focusX + 90} y={focusY - 110} fontSize="11"
          fontFamily="var(--font-mono)" fill="var(--accent)" letterSpacing="0.18em">
          NODE · 01
        </text>
        <line x1={focusX + 35} y1={focusY - 50} x2={focusX + 90} y2={focusY - 106}
          stroke="var(--accent)" strokeWidth="1" opacity="0.8"/>
        <circle cx={focusX + 35} cy={focusY - 50} r="2" fill="var(--accent)"/>
      </g>
    </svg>
  );
}

function IsoCity({ focusX, focusY }) {
  const cells = [];
  const size = 90;          
  const halfH = 45;       
  const cx = focusX, cy = focusY;

  function iso(col, row, h = 0) {
    return [
      cx + (col - row) * size,
      cy + (col + row) * halfH - h,
    ];
  }

  const tiles = [];
  for (let row = -2; row <= 2; row++) {
    for (let col = -2; col <= 2; col++) {
      tiles.push({ col, row });
    }
  }
  tiles.sort((a, b) => (a.row + a.col) - (b.row + b.col));

  return (
    <g>
      {tiles.map(({ col, row }, i) => {
        const isCenter = col === 0 && row === 0;
        const isCross = (col === 0 || row === 0);
        return (
          <IsoTile
            key={`t${i}`}
            iso={iso}
            col={col}
            row={row}
            isRoad={isCross}
            isCenter={isCenter}
          />
        );
      })}
      {tiles.map(({ col, row }, i) => {
        if (col === 0 || row === 0) return null; 
        const seed = (col * 31 + row * 17) & 7;
        const hPx = 40 + seed * 14; 
        const accent = (Math.abs(col) === 2 && Math.abs(row) === 2) || seed === 5;
        return (
          <IsoBuilding key={`b${i}`} iso={iso} col={col} row={row} h={hPx} accent={accent}/>
        );
      })}
    </g>
  );
}

function IsoTile({ iso, col, row, isRoad, isCenter }) {
  const inset = 0.5; 
  const a = iso(col - 0.5 + inset/100, row - 0.5 + inset/100);
  const b = iso(col + 0.5 - inset/100, row - 0.5 + inset/100);
  const c = iso(col + 0.5 - inset/100, row + 0.5 - inset/100);
  const d = iso(col - 0.5 + inset/100, row + 0.5 - inset/100);
  const fill = isRoad
    ? "url(#asphalt)"
    : "oklch(0.24 0.018 285)";
  return (
    <polygon
      points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`}
      fill={fill}
      stroke={isCenter ? "var(--hairline-2)" : "var(--hairline)"}
      strokeWidth="0.6"
      opacity={isRoad ? 1 : 0.95}
    />
  );
}

function IsoBuilding({ iso, col, row, h, accent }) {
  const s = 0.42; 
  const baseTL = iso(col - s, row - s);
  const baseTR = iso(col + s, row - s);
  const baseBR = iso(col + s, row + s);
  const baseBL = iso(col - s, row + s);
  const topTL = [baseTL[0], baseTL[1] - h];
  const topTR = [baseTR[0], baseTR[1] - h];
  const topBR = [baseBR[0], baseBR[1] - h];
  const topBL = [baseBL[0], baseBL[1] - h];
  return (
    <g filter="url(#iso-soft)">
      <polygon points={`${baseTR[0]},${baseTR[1]} ${baseBR[0]},${baseBR[1]} ${topBR[0]},${topBR[1]} ${topTR[0]},${topTR[1]}`}
        fill="url(#wallSide)" stroke="oklch(0.22 0.02 285)" strokeWidth="0.4"/>
      <polygon points={`${baseBR[0]},${baseBR[1]} ${baseBL[0]},${baseBL[1]} ${topBL[0]},${topBL[1]} ${topBR[0]},${topBR[1]}`}
        fill="url(#wallFront)" stroke="oklch(0.22 0.02 285)" strokeWidth="0.4"/>
      <polygon points={`${topTL[0]},${topTL[1]} ${topTR[0]},${topTR[1]} ${topBR[0]},${topBR[1]} ${topBL[0]},${topBL[1]}`}
        fill={accent ? "url(#wallAccent)" : "url(#wallTop)"}
        stroke={accent ? "var(--accent)" : "oklch(0.40 0.02 285)"}
        strokeWidth={accent ? "0.8" : "0.5"}
        opacity={accent ? 0.92 : 1}/>
      <rect
        x={Math.min(topBL[0], topBR[0]) + 4}
        y={topBR[1] + 6}
        width={Math.abs(topBR[0] - topBL[0]) - 8}
        height="2"
        fill="oklch(0.78 0.10 80)"
        opacity={accent ? 0.7 : 0.35}
      />
    </g>
  );
}

function IsoLabel({ x, y, text, anchor }) {
  return (
    <g>
      {anchor && (
        <line x1={anchor[0]} y1={anchor[1]} x2={x + 4} y2={y + 8}
          stroke="var(--fg-muted)" strokeWidth="0.6" opacity="0.55"/>
      )}
      <rect x={x - 6} y={y - 8} width={text.length * 7.6 + 12} height="18" rx="4"
        fill="color-mix(in oklch, var(--surface) 80%, transparent)" stroke="var(--hairline-2)" strokeWidth="0.5"/>
      <text x={x} y={y + 4} fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.14em" fill="var(--fg-dim)">
        {text}
      </text>
    </g>
  );
}

function FocusIso({ cx, cy, ewGreen, nsGreen, ringScale, activeP }) {
  const off = 36;
  return (
    <g>
      <g opacity="0.5">
        {[-22, -10, 2, 14].map((d, i) => (
          <rect key={`cw-h${i}`} x={cx + d} y={cy - 38} width="6" height="14" fill="oklch(0.85 0.005 285)" opacity="0.55"/>
        ))}
        {[-22, -10, 2, 14].map((d, i) => (
          <rect key={`cw-h2${i}`} x={cx + d} y={cy + 24} width="6" height="14" fill="oklch(0.85 0.005 285)" opacity="0.55"/>
        ))}
        {[-22, -10, 2, 14].map((d, i) => (
          <rect key={`cw-v${i}`} x={cx - 38} y={cy + d} width="14" height="6" fill="oklch(0.85 0.005 285)" opacity="0.55"/>
        ))}
        {[-22, -10, 2, 14].map((d, i) => (
          <rect key={`cw-v2${i}`} x={cx + 24} y={cy + d} width="14" height="6" fill="oklch(0.85 0.005 285)" opacity="0.55"/>
        ))}
      </g>

      <TLPost cx={cx + off} cy={cy - off} green={ewGreen}/>
      <TLPost cx={cx - off} cy={cy + off} green={ewGreen}/>
      <TLPost cx={cx - off} cy={cy - off} green={nsGreen}/>
      <TLPost cx={cx + off} cy={cy + off} green={nsGreen}/>

      <IsoCamera cx={cx - off - 18} cy={cy - off - 18} active={activeP > 0.05}/>

      {activeP > 0.05 && (
        <circle cx={cx - off - 18} cy={cy - off - 18}
          r={20 + ringScale * 80}
          fill="none" stroke="var(--accent)"
          strokeWidth={1.2}
          opacity={(1 - ringScale) * 0.9}
        />
      )}
    </g>
  );
}

function TLPost({ cx, cy, green }) {
  const color = green ? "var(--green)" : "var(--red)";
  return (
    <g filter="url(#iso-glow)">
      <rect x={cx - 0.7} y={cy} width="1.4" height="14" fill="oklch(0.50 0.01 285)"/>
      <rect x={cx - 4} y={cy - 8} width="8" height="10" rx="2" fill="oklch(0.18 0.02 285)" stroke={color} strokeWidth="0.6"/>
      <circle cx={cx} cy={cy - 3} r="2.4" fill={color}/>
    </g>
  );
}

function IsoCamera({ cx, cy, active }) {
  return (
    <g>
      <rect x={cx - 0.7} y={cy} width="1.4" height="22" fill="oklch(0.45 0.01 285)"/>
      <rect x={cx - 7} y={cy - 6} width="14" height="8" rx="2"
        fill="oklch(0.30 0.02 285)" stroke={active ? "var(--accent)" : "var(--hairline-2)"} strokeWidth="1"/>
      <circle cx={cx} cy={cy - 2} r="2.2" fill={active ? "var(--accent)" : "var(--fg-muted)"}/>
      {active && (
        <circle cx={cx} cy={cy - 2} r="3" fill="none" stroke="var(--accent)" strokeWidth="0.6">
          <animate attributeName="r" from="3" to="9" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.7" to="0" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      )}
    </g>
  );
}

function IsoAmbulance({ x, y, opacity = 1 }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <ellipse cx="0" cy="6" rx="22" ry="5" fill="oklch(0 0 0)" opacity="0.4"/>
      <ellipse cx="0" cy="0" rx="24" ry="9" fill="var(--accent)" opacity="0.25" filter="url(#iso-glow)"/>
      <rect x="-18" y="-10" width="36" height="16" rx="3" fill="#fafafa" stroke="oklch(0.40 0.02 285)" strokeWidth="0.8"/>
      <rect x="-18" y="-10" width="36" height="4" rx="3" fill="oklch(0.92 0.005 285)"/>
      <rect x="9" y="-9" width="8" height="14" rx="2" fill="oklch(0.78 0.02 285)"/>
      <rect x="-9" y="-2" width="6" height="3" fill="var(--red)"/>
      <rect x="-7.5" y="-3.5" width="3" height="6" fill="var(--red)"/>
      <rect x="-3" y="-11" width="6" height="2" fill="var(--cyan)">
        <animate attributeName="fill" values="var(--cyan);var(--red);var(--cyan)" dur="0.6s" repeatCount="indefinite"/>
      </rect>
    </g>
  );
}

function SceneLabels({ focusX, focusY, activeP }) {
  const lang = (typeof localStorage !== "undefined" && localStorage.getItem("sf_lang")) || "pt";
  const labels = lang === "en"
    ? { intersection: "INTERSECTION", building: "BUILDING", road: "ROAD" }
    : { intersection: "CRUZAMENTO",   building: "EDIFÍCIO",  road: "ESTRADA" };
  return (
    <g style={{ opacity: clamp(1.2 - activeP * 2.2, 0, 1) }}>
      <IsoLabel x={focusX - 130} y={focusY - 180} text={labels.intersection} anchor={[focusX - 30, focusY - 30]}/>
      <IsoLabel x={focusX + 210} y={focusY - 80} text={labels.building} anchor={[focusX + 150, focusY - 60]}/>
      <IsoLabel x={focusX - 280} y={focusY + 140} text={labels.road} anchor={[focusX - 140, focusY + 30]}/>
    </g>
  );
}

window.CityScene = CityScene;
