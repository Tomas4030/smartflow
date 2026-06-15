export function StatCards({ intersections = [], events = [] }) {
  const total = intersections.length;
  const idle = intersections.filter((i) => i.status === "idle").length;
  const priority = intersections.filter((i) => i.status === "priority").length;
  const offline = intersections.filter((i) => i.status === "offline").length;

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const validEvents = (events || []).filter((e) => e.detectedAt);

  const thisMonth = validEvents.filter(
    (e) => new Date(e.detectedAt) >= startOfThisMonth
  );

  const lastMonth = validEvents.filter((e) => {
    const d = new Date(e.detectedAt);
    return d >= startOfLastMonth && d < startOfThisMonth;
  });

  function trend(curr, prev) {
    if (prev === 0 && curr === 0) return null;
    if (prev === 0) return { pct: 100, up: true };

    const pct = Math.round(((curr - prev) / prev) * 100);

    return {
      pct: Math.abs(pct),
      up: pct >= 0,
    };
  }

  function trendLabel(t) {
    if (!t) {
      return {
        text: "sem dados anteriores",
        color: "var(--fg-muted)",
        showCompare: false,
      };
    }

    return {
      text: `${t.up ? "↗" : "↘"} ${t.pct}%`,
      color: t.up ? "var(--green)" : "var(--red)",
      showCompare: true,
    };
  }

  const priorityThis = thisMonth.filter((e) => !e.resolvedAt).length;
  const priorityLast = lastMonth.filter((e) => !e.resolvedAt).length;
  const resolvedThis = thisMonth.filter((e) => e.resolvedAt).length;
  const resolvedLast = lastMonth.filter((e) => e.resolvedAt).length;

  const tTotal = trendLabel(trend(thisMonth.length, lastMonth.length));

  const tIdle = trendLabel(trend(resolvedThis, resolvedLast));
  const tPriority = trendLabel(trend(priorityThis, priorityLast));

  const tOffline =
    offline === 0
      ? {
          text: "100% operacional",
          color: "var(--green)",
          showCompare: false,
        }
      : {
          text: `${offline} sem comunicação`,
          color: "var(--red)",
          showCompare: false,
        };

  const cards = [
    {
      label: "Total Interseções",
      value: total,
      color: "var(--cyan)",
      trend: tTotal,
      iconColor: "var(--accent-2)",
      iconBg: "color-mix(in srgb, var(--accent-2) 14%, transparent)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="7" y="2" width="10" height="20" rx="4" />
          <circle cx="12" cy="7" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="12" cy="17" r="1.7" fill="currentColor" stroke="none" />
          <path d="M5 8h2" />
          <path d="M17 8h2" />
          <path d="M5 16h2" />
          <path d="M17 16h2" />
        </svg>
      ),
    },
    {
      label: "Ativas",
      value: idle,
      color: "var(--fg)",
      trend: tIdle,
      iconColor: "var(--accent-2)",
      iconBg: "color-mix(in srgb, var(--accent-2) 14%, transparent)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8.2 12.4l2.4 2.4 5.2-5.6" />
        </svg>
      ),
    },
    {
      label: "Prioridade",
      value: priority,
      color: "var(--fg)",
      trend: tPriority,
      iconColor: "var(--accent-2)",
      iconBg: "color-mix(in srgb, var(--accent-2) 14%, transparent)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3.5 21 19a1.8 1.8 0 0 1-1.55 2.7H4.55A1.8 1.8 0 0 1 3 19L12 3.5z" />
          <path d="M12 9v5" />
          <path d="M12 18h.01" />
        </svg>
      ),
    },
    {
      label: "Offline",
      value: offline,
      color: "var(--fg)",
      trend: tOffline,
      iconColor: "var(--accent-2)",
      iconBg: "color-mix(in srgb, var(--accent-2) 14%, transparent)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3l18 18" />
          <path d="M9.5 18.5a3.5 3.5 0 0 1 5 0" />
          <path d="M7 15.5a7 7 0 0 1 4.2-1.45" />
          <path d="M5 12.5a11 11 0 0 1 3.3-1.7" />
          <path d="M12 6.2A16 16 0 0 1 21 10" />
          <path d="M15.5 10.2A11 11 0 0 1 19 12.5" />
          <path d="M12 21h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            minHeight: 128,
            padding: "20px 76px 20px 18px",
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            {c.label}
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
              color: c.color,
              letterSpacing: "-0.04em",
            }}
          >
            {c.value}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: c.trend.color }}>{c.trend.text}</span>

            {c.trend.showCompare && (
              <span style={{ color: "var(--fg-muted)" }}>vs mês passado</span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              right: 18,
              top: "50%",
              transform: "translateY(-50%)",
              width: 42,
              height: 42,
              borderRadius: 12,
              background: c.iconBg,
              color: c.iconColor,
              border: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}