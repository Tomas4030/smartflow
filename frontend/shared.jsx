
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

function useT() {
  const [lang, setLang] = useState(() => localStorage.getItem("sf_lang") || "pt");
  useEffect(() => {
    localStorage.setItem("sf_lang", lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("sf:lang", { detail: lang }));
  }, [lang]);
  useEffect(() => {
    const onChange = (e) => setLang(e.detail);
    window.addEventListener("sf:lang", onChange);
    return () => window.removeEventListener("sf:lang", onChange);
  }, []);
  const t = window.SF_I18N[lang];
  return [t, lang, setLang];
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("sf_theme") || "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sf_theme", theme);
    window.dispatchEvent(new CustomEvent("sf:theme", { detail: theme }));
  }, [theme]);
  useEffect(() => {
    const onChange = (e) => setTheme(e.detail);
    window.addEventListener("sf:theme", onChange);
    return () => window.removeEventListener("sf:theme", onChange);
  }, []);
  return [theme, setTheme];
}

function Reveal({ as: Tag = "div", children, className = "", style, delay = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

function useScrollProgress(ref, { start = 0, end = 1 } = {}) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, r.height - vh);
      const seen = -r.top;
      let v = seen / total;
      v = Math.max(0, Math.min(1, v));
      v = Math.max(0, Math.min(1, (v - start) / (end - start)));
      setP(v);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, start, end]);
  return p;
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = {
  inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
};

Object.assign(window, { useT, useTheme, Reveal, useScrollProgress, lerp, clamp, ease });
