/**
 * Landing.jsx — Logoplacers — B&W dark professional redesign
 * SEO/AIO first: semantic HTML, structured data, keyword-rich headings
 */
import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { useLang, useT } from "./i18n.jsx";

// ─────────────────────────────────────────────
// NEW LOGO — black rounded square + white C + slash
// ─────────────────────────────────────────────
const DarkModeContext = createContext(true);
const useDarkMode = () => useContext(DarkModeContext);

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#000"/>
      <path d="M72 18 L28 18 Q14 18 14 32 L14 68 Q14 82 28 82 L72 82" stroke="white" strokeWidth="9" fill="none" strokeLinecap="square"/>
      <line x1="52" y1="28" x2="80" y2="58" stroke="white" strokeWidth="9" strokeLinecap="round"/>
    </svg>
  );
}
// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const Icon = {
  bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8l10 7 10-7" /></svg>,
  target: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  box: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  upload: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  users: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  move: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></svg>,
  send: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  arrowRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
};

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ─────────────────────────────────────────────
// CD SHIMMER TEXT — iridescent like a compact disc
// ─────────────────────────────────────────────
function CDShimmerText({ children, style = {}, dark = true }) {
  const lightGrad = "linear-gradient(105deg, #000 0%, #3a1a5e 18%, #1a3a5e 30%, #3a1a3a 42%, #1a2a3a 54%, #2a1a3a 66%, #1a1a00 78%, #000 88%, #3a1a5e 100%)";
  const darkGrad = "linear-gradient(105deg, #fff 0%, #e8c8ff 18%, #b8e8ff 30%, #ffe8f8 42%, #c8f8ff 54%, #f8c8ff 66%, #fff8e8 78%, #fff 88%, #e8c8ff 100%)";
  return (
    <span style={{
      background: dark ? darkGrad : lightGrad,
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "cdShimmer 4s linear infinite",
      display: "inline",
      ...style,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────
// HERO SCENE — subtle logo watermark
// ─────────────────────────────────────────────
function HeroScene() {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      rafRef.current = requestAnimationFrame(tick);
      setPhase(((now - startRef.current) / 1000));
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const opacity = 0.03 + Math.sin(phase * 0.25) * 0.008;
  const scale = 1 + Math.sin(phase * 0.18) * 0.01;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
      {/* Subtle radial gradient center glow */}
      <div style={{
        position: "absolute",
        width: "60vmin", height: "60vmin",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,255,255,${0.025 + Math.sin(phase * 0.3) * 0.008}) 0%, transparent 70%)`,
        filter: "blur(60px)",
      }} />
      {/* Large faint logo mark */}
      <svg viewBox="0 0 100 100" fill="none"
        style={{
          position: "relative", width: "clamp(280px, 44vmin, 520px)", height: "clamp(280px, 44vmin, 520px)",
          opacity, transform: `scale(${scale})`, transition: "opacity .5s",
        }}>
        <rect width="100" height="100" rx="22" fill="white" opacity="0.06" />
        <path d="M72 18 L28 18 Q14 18 14 32 L14 68 Q14 82 28 82 L72 82" stroke="white" strokeWidth="9" fill="none" strokeLinecap="square" />
        <line x1="52" y1="28" x2="80" y2="58" stroke="white" strokeWidth="9" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROLLING NAMES — hero section
// ─────────────────────────────────────────────
const DEMO_NAMES = ["Marcus", "Emma", "Johan", "Sarah", "Erik", "Lena", "Oscar", "Maja", "Felix", "Astrid"];
const DEMO_COMPANIES = ["Pied Piper", "Initech", "Globodyne", "Vandelay Ind.", "Bluth Co", "Hooli", "Aviato", "Dinoco", "Umbrella Corp", "Weyland Corp"];

function RollingName({ items, interval = 2200 }) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setOut(true);
      setTimeout(() => { setIdx(i => (i + 1) % items.length); setOut(false); }, 300);
    }, interval);
    return () => clearInterval(t);
  }, [items.length, interval]);
  return (
    <span style={{
      display: "inline-block",
      opacity: out ? 0 : 1,
      transform: out ? "translateY(-8px)" : "translateY(0)",
      transition: "opacity .28s, transform .28s",
      color: "#fff",
    }}>{items[idx]}</span>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PREVIEW CARDS — below hero
// ─────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "", prefix = "", duration = 1200, vis, delay = 0 }) {
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!vis || hasRun.current) return;
    hasRun.current = true;
    const t = setTimeout(() => {
      // parse numeric target
      const raw = String(target).replace(/[^0-9.]/g, "");
      const end = parseFloat(raw);
      const isFloat = String(target).includes("%") || String(raw).includes(".");
      const start = Date.now();
      const tick = () => {
        const prog = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        const cur = isFloat ? (end * ease).toFixed(0) : Math.round(end * ease);
        // reformat with spaces for large numbers
        const fmt = String(cur).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        setDisplay(prefix + fmt + suffix);
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [vis]);
  return <span>{display}</span>;
}

function AnimatedSparkline({ chart, vis, delay = 0, gradId }) {
  const [progress, setProgress] = useState(0);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!vis || hasRun.current) return;
    hasRun.current = true;
    const t = setTimeout(() => {
      const start = Date.now();
      const dur = 900;
      const tick = () => {
        const prog = Math.min((Date.now() - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 2.5);
        setProgress(ease);
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [vis]);

  // Build partial points based on progress
  const n = chart.length;
  const totalPts = Math.max(2, Math.round(progress * (n - 1)) + 1);
  const partial = chart.slice(0, totalPts);
  // interpolate last point if in between
  if (totalPts < n && progress > 0) {
    const frac = progress * (n - 1) - (totalPts - 2);
    const prev = chart[totalPts - 2] ?? chart[0];
    const next = chart[totalPts - 1] ?? chart[totalPts - 2];
    partial[partial.length - 1] = prev + (next - prev) * frac;
  }

  const pts = partial.map((v, j) => {
    const x = (j / (n - 1)) * 100;
    const y = 36 - (v / 100) * 32;
    return `${x},${y}`;
  });

  const linePoints = pts.join(" ");
  const areaD = `M0,36 ${pts.map(p => `L${p}`).join(" ")} L${pts[pts.length - 1].split(",")[0]},36 Z`;

  return (
    <svg width="100%" height="36" viewBox="0 0 100 36" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <polyline points={linePoints} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardCards() {
  const [ref, vis] = useReveal(0.05);
  const { lang } = useLang();

  const cards = [
    {
      label: lang === "sv" ? "Svarsfrekvens" : "Reply rate",
      value: "34%", numTarget: "34", numSuffix: "%", numPrefix: "",
      delta: "+12%",
      positive: true,
      sub: lang === "sv" ? "vs branschsnitt 3%" : "vs industry avg 3%",
      chart: [40, 55, 48, 62, 58, 75, 80, 70, 88],
    },
    {
      label: lang === "sv" ? "Demos skickade" : "Demos sent",
      value: "2 847", numTarget: "2847", numSuffix: "", numPrefix: "",
      delta: "+247",
      positive: true,
      sub: lang === "sv" ? "den här månaden" : "this month",
      chart: [30, 40, 35, 55, 60, 52, 70, 80, 75],
    },
    {
      label: lang === "sv" ? "Tid sparad" : "Time saved",
      value: "94h", numTarget: "94", numSuffix: "h", numPrefix: "",
      delta: "vs manual",
      positive: true,
      sub: lang === "sv" ? "denna vecka" : "this week",
      chart: [60, 65, 70, 68, 75, 72, 80, 85, 90],
    },
    {
      label: lang === "sv" ? "Personaliserade" : "Personalised",
      value: "100", numTarget: "100", numSuffix: "", numPrefix: "",
      delta: "8 min",
      positive: true,
      sub: lang === "sv" ? "demos per batch" : "demos per batch",
      chart: [50, 50, 50, 80, 80, 80, 100, 100, 100],
    },
  ];

  return (
    <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
      {/* Personalised preview label */}
      <div style={{
        textAlign: "center", marginBottom: 24,
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: "opacity .6s, transform .6s",
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: ".5px" }}>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>Hi <RollingName items={DEMO_NAMES} />,</span>{" "}
          {lang === "sv" ? "jag skapade den här demon för" : "I created this demo for"}{" "}
          <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}><RollingName items={DEMO_COMPANIES} interval={2500} /></span>
        </div>
      </div>

      <div className="dashboard-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "20px 20px 16px",
            backdropFilter: "blur(12px)",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(24px)",
            transition: `opacity .6s ${i * 80}ms, transform .6s ${i * 80}ms`,
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 8, fontWeight: 500 }}>{card.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>
                <AnimatedNumber target={card.numTarget} suffix={card.numSuffix} prefix={card.numPrefix} vis={vis} delay={i * 80 + 200} duration={1000} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", marginBottom: 2, background: "rgba(34,197,94,0.1)", padding: "2px 7px", borderRadius: 100 }}>{card.delta}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>{card.sub}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.13)", marginTop: 2, fontStyle: "italic", letterSpacing: ".2px" }}>
                {lang === "sv" ? "Kvalificerad uppskattning" : "Qualified guess"}
              </div>
            </div>
            <AnimatedSparkline chart={card.chart} vis={vis} delay={i * 80 + 100} gradId={`sg${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HUBSPOT-STYLE STEP SLIDESHOW — 5 glass slides
// ─────────────────────────────────────────────
function StepSlideshow() {
  const darkMode = useDarkMode();
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState(1);
  const { lang } = useLang();
  const [ref, vis] = useReveal(0.06);
  const timerRef = useRef(null);

  const SLIDES = [
    {
      n: "01",
      title: lang === "sv" ? "Ladda upp din skärmbild" : "Upload your screenshot",
      body: lang === "sv" ? "Dra in valfri skärmbild av din produkt — dashboard, feature view eller landing page. Stöder PNG, JPG, HEIC." : "Drag in any product screenshot — dashboard, feature view or landing page. Supports PNG, JPG, HEIC.",
      icon: Icon.upload,
      visual: "upload",
    },
    {
      n: "02",
      title: lang === "sv" ? "Klistra in din prospektlista" : "Paste your prospect list",
      body: lang === "sv" ? "Lägg till företagsnamn och kontakter. Logoplacers hämtar automatiskt varje logotyp direkt — Salesforce, Spotify, vilket bolag som helst." : "Add company names and contacts. Logoplacers auto-fetches every logo instantly — Salesforce, Spotify, any company.",
      icon: Icon.users,
      visual: "list",
    },
    {
      n: "03",
      title: lang === "sv" ? "Placera logotyp och lägg till text" : "Place logo & add text",
      body: lang === "sv" ? "Dra prospektets logotyp till exakt rätt position. Lägg till ((name)) och ((company)) textlager för djup personalisering." : "Drag the prospect's logo to the exact position. Add ((name)) and ((company)) text layers for deep personalisation.",
      icon: Icon.move,
      visual: "editor",
    },
    {
      n: "04",
      title: lang === "sv" ? "Förhandsgranska alla demos" : "Preview all demos",
      body: lang === "sv" ? "Klicka igenom varje personaliserad demo innan utskick. Se exakt hur din prospekt upplever sin demo." : "Click through every personalised demo before sending. See exactly how your prospect experiences their demo.",
      icon: Icon.target,
      visual: "preview",
    },
    {
      n: "05",
      title: lang === "sv" ? "Skicka direkt från Gmail" : "Send directly from Gmail",
      body: lang === "sv" ? "Anslut Gmail med ett klick. 100 personaliserade mejl med unika bilder skickas med naturliga fördröjningar — under 10 minuter." : "Connect Gmail in one click. 100 personalised emails with unique images sent with natural delays — under 10 minutes.",
      icon: Icon.send,
      visual: "send",
    },
  ];

  const go = useCallback((next) => {
    setAnimDir(next > active ? 1 : -1);
    setActive(next);
  }, [active]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      go((active + 1) % SLIDES.length);
    }, 4200);
    return () => clearInterval(timerRef.current);
  }, [active, go, SLIDES.length]);

  // Glass visual for each slide
  const renderVisual = (type) => {
    const glassStyle = {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 16,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    };
    if (type === "upload") return (
      <div style={{ ...glassStyle, padding: "32px", display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
        <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: "40px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{Icon.upload}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Click or drag here</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 4 }}>PNG · JPG · HEIC</div>
        </div>
        <div style={{ ...glassStyle, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>product_demo.png</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>Ready to personalise</div>
          </div>
          <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
        </div>
      </div>
    );
    if (type === "list") return (
      <div style={{ ...glassStyle, padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", marginBottom: 4 }}>PROSPECT LIST</div>
        {[
          { co: "Salesforce", name: "Marcus L.", status: true },
          { co: "Spotify", name: "Emma K.", status: true },
          { co: "HubSpot", name: "Johan A.", status: true },
          { co: "Pipedrive", name: "Sarah M.", status: false },
          { co: "Notion", name: "Erik B.", status: true },
        ].map((p, i) => (
          <div key={i} style={{ ...glassStyle, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "all .2s" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.status ? "#22c55e" : "#f59e0b", flexShrink: 0, boxShadow: `0 0 6px ${p.status ? "#22c55e" : "#f59e0b"}` }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{p.co}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{p.name}</div>
            </div>
            <div style={{ fontSize: 9, color: p.status ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>{p.status ? "LOGO ✓" : "FETCHING…"}</div>
          </div>
        ))}
      </div>
    );
    if (type === "editor") return (
      <div style={{ ...glassStyle, padding: "20px", height: "100%", position: "relative" }}>
        {/* Mock product screenshot */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, height: "65%", marginBottom: 12, overflow: "hidden", position: "relative" }}>
          {/* Fake UI bars */}
          {[0.3, 0.5, 0.4, 0.7, 0.55].map((w, i) => (
            <div key={i} style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "10px 14px", width: `${w * 100}%` }} />
          ))}
          {/* Logo drop indicator */}
          <div style={{ position: "absolute", bottom: 16, right: 16, border: "1.5px dashed rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 12px", background: "rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>Salesforce<br />logo here</div>
          </div>
        </div>
        {/* Text layer indicator */}
        <div style={{ ...glassStyle, padding: "8px 12px", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
          Hi <span style={{ color: "#fff", fontWeight: 700 }}>Marcus</span>, see how <span style={{ color: "#fff", fontWeight: 700 }}>Salesforce</span> could…
        </div>
      </div>
    );
    if (type === "preview") return (
      <div style={{ ...glassStyle, padding: "16px", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "1px", marginBottom: 4 }}>PREVIEW — 5/100</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, flex: 1 }}>
          {["Salesforce", "Spotify", "HubSpot", "Pipedrive"].map((co, i) => (
            <div key={i} style={{ ...glassStyle, padding: "10px", position: "relative" }}>
              <div style={{ height: 32, background: "rgba(255,255,255,0.04)", borderRadius: 5, marginBottom: 6 }} />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{co}</div>
              {i === 0 && <div style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 8px rgba(255,255,255,0.5)" }} />}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>100 demos ready to send</div>
      </div>
    );
    if (type === "send") return (
      <div style={{ ...glassStyle, padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Gmail connected badge */}
        <div style={{ ...glassStyle, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Gmail connected — marcus@company.com</span>
        </div>
        {/* Send progress */}
        {["Salesforce — Jared D.", "Spotify — Emma K.", "HubSpot — Johan A."].map((r, i) => (
          <div key={i} style={{ ...glassStyle, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", flex: 1 }}>{r}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Sent</span>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: "auto", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
          97 / 100
          <div style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>emails sending…</div>
        </div>
      </div>
    );
    return null;
  };

  const slide = SLIDES[active];

  return (
    <div ref={ref} style={{
      maxWidth: 1100, margin: "0 auto", padding: "0 48px",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
      transition: "opacity .9s, transform .9s"
    }}>

      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>{lang === "sv" ? "Hur det fungerar" : "How it works"}</div>
        <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px", color: "#fff" }}>
          {lang === "sv" ? "Från skärmbild till 100 demos" : "From screenshot to 100 demos"}
          <br />
          <CDShimmerText dark={darkMode}>{lang === "sv" ? "på under 10 minuter." : "in under 10 minutes."}</CDShimmerText>
        </h2>
      </div>

      {/* Step tabs */}
      <div className="step-tabs" style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => { clearInterval(timerRef.current); go(i); }}
            style={{
              padding: "8px 18px", borderRadius: 100,
              background: active === i ? "#fff" : "rgba(255,255,255,0.05)",
              border: `1px solid ${active === i ? "#fff" : "rgba(255,255,255,0.1)"}`,
              color: active === i ? "#000" : "rgba(255,255,255,0.45)",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s",
              letterSpacing: ".2px",
            }}>
            <span style={{ opacity: .6, marginRight: 5 }}>{s.n}</span>{(lang === "sv" ? s.title : s.title).split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      {/* Main slide layout — HubSpot style: text left, glass visual right */}
      <div className="step-slide-grid" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
        minHeight: 360,
      }}>
        {/* Text */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 18,
          }}>Step {slide.n}</div>
          <h3 style={{
            fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-1.5px",
            color: "#fff", marginBottom: 20, lineHeight: 1.15,
          }}>{slide.title}</h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, marginBottom: 32 }}>
            {slide.body}
          </p>
          {/* Progress */}
          <div style={{ display: "flex", gap: 6 }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => { clearInterval(timerRef.current); go(i); }}
                style={{
                  height: 3, flex: active === i ? 3 : 1, background: active === i ? "#fff" : "rgba(255,255,255,0.15)",
                  borderRadius: 2, cursor: "pointer", transition: "all .3s",
                }} />
            ))}
          </div>
        </div>

        {/* Glass visual */}
        <div className="step-slide-visual" style={{
          height: 320,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, overflow: "hidden",
          background: "rgba(255,255,255,0.01)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          padding: "4px",
          transition: "all .35s",
        }}>
          {renderVisual(slide.visual)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEATURE CARD — B&W hover glow
// ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, idx, visible }) {
  const delay = idx * 70;
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, inside: false });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true });
  }, []);
  const handleMouseLeave = useCallback(() => setMouse(m => ({ ...m, inside: false })), []);

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{
        position: "relative", overflow: "hidden",
        background: mouse.inside ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${mouse.inside ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: "28px 26px",
        transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms, border-color .2s, background .2s, box-shadow .2s`,
        opacity: visible ? 1 : 0,
        transform: visible ? (mouse.inside ? "translateY(-3px)" : "translateY(0)") : "translateY(28px)",
        boxShadow: mouse.inside ? "0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
        display: "flex", flexDirection: "column", gap: 16, cursor: "default",
      }}>
      {mouse.inside && (
        <div style={{
          position: "absolute", left: mouse.x - 100, top: mouse.y - 100,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: mouse.inside ? "#fff" : "rgba(255,255,255,0.45)", transition: "color .2s",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-.3px" }}>{title}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.72 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(220,190,255,0.35)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(220,190,255,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
      style={{
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden",
        background: open ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.01)",
        transition: "background .2s, border .2s, box-shadow .2s",
      }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 22px", background: "none", border: "none", cursor: "pointer",
        color: "#fff", fontFamily: "inherit", textAlign: "left",
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.2px" }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 22px 18px", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{a}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// WAITLIST FORM
// ─────────────────────────────────────────────
function WaitlistForm({ onEnterApp }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setSending(true);
    try {
      const body = new FormData();
      body.append("form-name", "waitlist");
      body.append("email", email);
      body.append("name", name);
      await fetch("/", { method: "POST", body });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>You're on the list.</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>We'll reach out as soon as your spot is ready.</div>
      <button onClick={onEnterApp} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "10px 24px", borderRadius: 10, cursor: "pointer" }}>Try the tool now</button>
    </div>
  );

  const inpStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: "13px 16px", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color .2s" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inpStyle} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      <input type="email" placeholder="Work email" required value={email} onChange={e => setEmail(e.target.value)} style={inpStyle} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      <button onClick={handleSubmit} disabled={sending} style={{ background: "linear-gradient(105deg, #fff 0%, #e8c8ff 30%, #f8c8ff 60%, #fff 100%)", backgroundSize: "200% auto", animation: "cdShimmer 3s linear infinite", color: "#000", border: "none", borderRadius: 11, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: sending ? .6 : 1, transition: "opacity .2s, transform .1s, box-shadow .2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(220,190,255,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
        {sending ? "Sending…" : "Request access"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIAL CAROUSEL
// ─────────────────────────────────────────────
const TDATA = [
  { quote: "I sent 40 personalised demos in the same time it used to take me to build one in Figma. My reply rate went through the roof.", quoteSv: "Jag skickade 40 personaliserade demos på den tid det brukade ta att bygga en i Figma. Min svarsfrekvens sköt i höjden.", name: "Marcus L.", role: "Senior AE", roleSv: "Senior AE", company: "Scaleup SaaS" },
  { quote: "The logo auto-detection is wild. I pasted 50 companies and every single logo appeared in under 20 seconds. Then I hit send. Done.", quoteSv: "Logotypauto-detekteringen är otrolig. Jag klistrade in 50 företag och varje logotyp dök upp på under 20 sekunder.", name: "Sofia R.", role: "SDR Manager", roleSv: "SDR-chef", company: "B2B SaaS" },
  { quote: "We went from 2% reply rate to 11% in two weeks just by adding personalised demo screenshots. The tool paid for itself on day one.", quoteSv: "Vi gick från 2% till 11% svarsfrekvens på två veckor.", name: "Tobias W.", role: "Head of Sales", roleSv: "Säljchef", company: "Enterprise SaaS" },
  { quote: "Finally a tool built for SDRs, not designers. I don't need to know anything about Figma. Upload, paste, send.", quoteSv: "Äntligen ett verktyg byggt för SDR:er, inte designers.", name: "Anna M.", role: "SDR", roleSv: "SDR", company: "FinTech" },
];

function TestimonialCarousel() {
  const darkMode = useDarkMode();
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const { lang } = useLang();
  const [ref, vis] = useReveal(0.08);

  const go = useCallback((next) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setIdx(next); setFading(false); }, 250);
  }, [fading]);

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % TDATA.length), 4800);
    return () => clearInterval(t);
  }, [idx, go]);

  const cur = TDATA[idx];
  return (
    <div ref={ref} style={{
      maxWidth: 900, margin: "0 auto",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: "opacity .8s, transform .8s"
    }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 14 }}>{lang === "sv" ? "Vad folk säger" : "What people say"}</div>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-2px", margin: 0, color: "#fff" }}><CDShimmerText dark={darkMode}>{lang === "sv" ? "Säljteam älskar det." : "Sales teams love it."}</CDShimmerText></h2>
      </div>
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(28px,4vw,52px)", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", opacity: fading ? 0 : 1, transition: "opacity .25s" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
          {[...Array(5)].map((_, i) => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
        </div>
        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 28, fontStyle: "italic" }}>"{lang === "sv" && cur.quoteSv ? cur.quoteSv : cur.quote}"</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>{cur.name[0]}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cur.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{lang === "sv" && cur.roleSv ? cur.roleSv : cur.role} · {cur.company}</div>
          </div>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            {TDATA.map((_, i) => <button key={i} onClick={() => go(i)} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0, transition: "all .3s" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────
function ComparisonTable() {
  const darkMode = useDarkMode();
  const { lang } = useLang();
  const [ref, vis] = useReveal(0.08);
  const rows = [
    { f: "Auto logo detection", fSv: "Automatisk logotypdetektering", lp: 1, loom: 0, figma: 0, manual: 0 },
    { f: "Send directly from Gmail", fSv: "Skicka direkt från Gmail", lp: 1, loom: 0, figma: 0, manual: 1 },
    { f: "Bulk personalisation (100+)", fSv: "Bulkpersonalisering (100+)", lp: 1, loom: 0, figma: 0, manual: 0 },
    { f: "Under 30s per prospect", fSv: "Under 30s per prospekt", lp: 1, loom: 0, figma: 0, manual: 0 },
    { f: "No design skills needed", fSv: "Inga designkunskaper krävs", lp: 1, loom: 1, figma: 0, manual: 1 },
    { f: "Visual demo (not just text)", fSv: "Visuell demo", lp: 1, loom: 1, figma: 1, manual: 0 },
    { f: "Free to start", fSv: "Gratis att börja", lp: 1, loom: 1, figma: 1, manual: 1 },
    { f: "Works on any screenshot", fSv: "Fungerar på valfri skärmbild", lp: 1, loom: 0, figma: 0, manual: 1 },
  ];
  const Ck = (on, hi) => on
    ? hi
      ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(220,190,255,0.8))" }}>
          <defs><linearGradient id="ckgrad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#fff" /><stop offset="0.5" stopColor="#f8c8ff" /><stop offset="1" stopColor="#c8f8ff" /></linearGradient></defs>
          <polyline points="20 6 9 17 4 12" stroke="url(#ckgrad)" />
        </svg>
      </span>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
  return (
    <div ref={ref} style={{ maxWidth: 820, margin: "0 auto", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: "opacity .7s, transform .7s" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 14 }}>vs the alternatives</div>
        <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 800, letterSpacing: "-2px", margin: 0, color: "#fff" }}><CDShimmerText dark={darkMode}>{lang === "sv" ? "Varför inte Loom eller Figma?" : "Why not just use Loom or Figma?"}</CDShimmerText></h2>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600, background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{lang === "sv" ? "Funktion" : "Feature"}</th>
              {[{ l: "Logoplacers", hi: true }, { l: "Loom" }, { l: "Figma" }, { l: "Manual" }].map((c, i) => (
                <th key={i} style={{ padding: "12px 18px", textAlign: "center", fontSize: 12, fontWeight: 700, color: c.hi ? "#fff" : "rgba(255,255,255,0.3)", background: c.hi ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.015)", borderBottom: `2px solid ${c.hi ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"}` }}>
                  {c.l}{c.hi ? <span style={{ display: "block", fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginTop: 2 }}>← you're here</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td style={{ padding: "11px 18px", fontSize: 12, color: "rgba(255,255,255,0.45)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{lang === "sv" && row.fSv ? row.fSv : row.f}</td>
                {[{ v: row.lp, hi: true }, { v: row.loom }, { v: row.figma }, { v: row.manual }].map((c, ci) => (
                  <td key={ci} style={{ padding: "11px 18px", textAlign: "center", background: c.hi ? "rgba(255,255,255,0.03)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{Ck(c.v, c.hi)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FLOATING DOCK
// ─────────────────────────────────────────────
function FloatingDock({ onEnterApp, onOpenBlog }) {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const items = [
    { id: "home", label: lang === "sv" ? "Hem" : "Home", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { id: "features", label: lang === "sv" ? "Funktioner" : "Features", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, onClick: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "pricing", label: lang === "sv" ? "Priser" : "Pricing", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, onClick: () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "blog", label: "Blog", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>, onClick: onOpenBlog },
    { id: "app", label: lang === "sv" ? "Öppna verktyget" : "Open tool", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>, onClick: onEnterApp, highlight: true },
  ];

  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 100}px)`, zIndex: 500, transition: "transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s", opacity: visible ? 1 : 0, pointerEvents: visible ? "all" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 9px", background: "rgba(0,0,0,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, boxShadow: "0 8px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
        {items.map((item) => (
          <div key={item.id} style={{ position: "relative" }}>
            {hovered === item.id && <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.9)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, padding: "4px 9px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", pointerEvents: "none" }}>{item.label}</div>}
            <button onClick={item.onClick} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)} style={{ width: item.highlight ? 42 : 38, height: item.highlight ? 42 : 38, borderRadius: item.highlight ? 13 : 11, border: item.highlight ? "1px solid rgba(255,255,255,0.25)" : "none", background: item.highlight ? "#fff" : hovered === item.id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)", color: item.highlight ? "#000" : hovered === item.id ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s cubic-bezier(.34,1.56,.64,1)", transform: hovered === item.id ? "scale(1.14) translateY(-2px)" : "scale(1)", fontFamily: "inherit" }}>
              {item.icon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SOCIAL PROOF TICKER
// ─────────────────────────────────────────────
function AnimatedStat({ target, suffix, prefix, lbl, visible, delay = 0, mouseX, mouseY, idx, grad }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, target, delay]);

  return (
    <div style={{ padding: "32px 24px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(26,130,255,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, letterSpacing: "-2px", background: grad || "linear-gradient(135deg,#fff,rgba(255,255,255,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
        {prefix}{count}{suffix}
      </div>
      <div style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{lbl}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
const TICKS = ["Marcus sent 47 demos in 6 minutes", "Hooli.com logo fetched in 1.2s", "Emma's reply rate: 28%", "100 personalised emails sent", "Sofia saved 8 hours this week"];
const TICKS_SV = ["Marcus skickade 47 demos på 6 min", "Hooli.com logotyp hämtades på 1.2s", "Emmas svarsfrekvens: 28%", "100 personaliserade mejl skickade", "Sofia sparade 8 timmar den här veckan"];

function SocialProofTicker() {
  const { lang } = useLang();
  const ticks = lang === "sv" ? TICKS_SV : TICKS;
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => { setVis(false); setTimeout(() => { setI(x => (x + 1) % ticks.length); setVis(true); }, 360); }, 3600);
    return () => clearInterval(t);
  }, [ticks.length]);
  return (
    <div style={{ position: "fixed", bottom: 22, left: 22, zIndex: 400, background: "rgba(0,0,0,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "9px 14px", maxWidth: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(8px)", transition: "opacity .35s, transform .35s", display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 7px #22c55e" }} />
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{ticks[i]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXIT INTENT POPUP
// ─────────────────────────────────────────────
function ExitIntentPopup({ onEnterApp }) {
  const { lang } = useLang();
  const [show, setShow] = useState(false);
  const fired = useRef(false);
  useEffect(() => {
    const fn = (e) => { if (!fired.current && e.clientY < 16) { fired.current = true; setTimeout(() => setShow(true), 180); } };
    document.addEventListener("mousemove", fn);
    return () => document.removeEventListener("mousemove", fn);
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => e.target === e.currentTarget && setShow(false)}>
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "44px 40px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.9)" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Logo size={44} /></div>
        <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px", color: "#fff" }}>{lang === "sv" ? "Vänta — få 10 gratis krediter" : "Wait — get 10 free credits"}</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 28 }}>Try Logoplacers before you go. Send your first personalised demo in under 30 seconds — no credit card needed.</p>
        <button onClick={() => { setShow(false); onEnterApp(); }} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: 10, transition: "opacity .15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          Try it free →
        </button>
        <button onClick={() => setShow(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>No thanks, I prefer generic outreach</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIVE DEMO (preserved from previous)
// ─────────────────────────────────────────────

function LiveDemo() {
  const darkMode = useDarkMode();
  const { lang } = useLang();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);
  const [logoEl, setLogoEl] = useState(null);
  const [logoPos, setLogoPos] = useState({ x: 220, y: 108 });
  const [logoSize, setLogoSize] = useState(64);
  const [dragging, setDragging] = useState(false);
  const [accentColor, setAccentColor] = useState(null); // dominant color from logo
  const dragOffset = useRef({ ox: 0, oy: 0 });
  const debounceRef = useRef(null);

  // Extract dominant color from logo
  const extractColor = useCallback((img) => {
    try {
      const tmp = document.createElement("canvas");
      tmp.width = 40; tmp.height = 40;
      const ctx2 = tmp.getContext("2d");
      ctx2.drawImage(img, 0, 0, 40, 40);
      const data = ctx2.getImageData(0, 0, 40, 40).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 30) continue; // skip transparent
        const rv = data[i], gv = data[i + 1], bv = data[i + 2];
        // Skip near-white and near-black pixels
        const brightness = (rv + gv + bv) / 3;
        const saturation = Math.max(rv, gv, bv) - Math.min(rv, gv, bv);
        if (brightness > 230 || brightness < 25 || saturation < 20) continue;
        r += rv; g += gv; b += bv; count++;
      }
      if (count > 0) {
        setAccentColor(`rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`);
      } else {
        setAccentColor(null);
      }
    } catch { setAccentColor(null); }
  }, []);

  const W = 660, H = 420;

  // ── Draw ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ── Background ──────────────────────────────────────────────
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, W, H);

    // ── Left sidebar — dark on-brand ─────────────────────────────
    const sbW = 180;
    const sidebarColor = "#0a0a0a";
    ctx.fillStyle = sidebarColor;
    ctx.fillRect(0, 0, sbW, H);
    // Subtle orange top accent line
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, sbW, 2);

    // Sidebar logo area
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, 12, 12, sbW - 24, 36, 8);
    ctx.fill();
    // Logo placeholder
    const logoGrad = ctx.createLinearGradient(20, 0, 42, 0);
    logoGrad.addColorStop(0, "rgba(240,200,255,0.85)");
    logoGrad.addColorStop(1, "rgba(200,160,255,0.9)");
    ctx.fillStyle = logoGrad;
    roundRect(ctx, 20, 19, 22, 22, 5);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LP", 31, 33);
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'DM Sans', sans-serif";
    ctx.fillText(company ? company.slice(0, 12) : "Logoplacers", 50, 34);

    // Sidebar nav items
    const navItems = ["Dashboard", "Prospects", "Templates", "Sent", "Settings"];
    navItems.forEach((item, i) => {
      const y = 72 + i * 40;
      if (i === 1) {
        // Active item — orange highlight
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        roundRect(ctx, 10, y - 10, sbW - 20, 32, 7);
        ctx.fill();
        // Left accent bar
        ctx.fillStyle = "rgba(240,200,255,0.85)";
        roundRect(ctx, 10, y - 10, 3, 32, 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.92)";
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
      }
      ctx.font = i === 1 ? "600 12px 'DM Sans',sans-serif" : "12px 'DM Sans',sans-serif";
      ctx.fillText(item, 22, y + 11);
    });

    // Bottom user chip
    if (name || email) {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(ctx, 10, H - 54, sbW - 20, 40, 8);
      ctx.fill();
      // Avatar circle — orange gradient
      const avatarGrad = ctx.createRadialGradient(30, H - 34, 0, 30, H - 34, 12);
      avatarGrad.addColorStop(0, "rgba(240,200,255,0.85)");
      avatarGrad.addColorStop(1, "rgba(200,160,255,0.9)");
      ctx.fillStyle = avatarGrad;
      ctx.beginPath(); ctx.arc(30, H - 34, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText((name || email)[0].toUpperCase(), 30, H - 30);
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "bold 11px 'DM Sans',sans-serif";
      ctx.fillText(name || "You", 48, H - 38);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "10px 'DM Sans',sans-serif";
      const emailShort = email.length > 18 ? email.slice(0, 18) + "…" : email;
      ctx.fillText(emailShort || "logged in", 48, H - 24);
    }

    // ── Top bar ─────────────────────────────────────────────────
    ctx.fillStyle = "#fff";
    ctx.fillRect(sbW, 0, W - sbW, 52);
    ctx.fillStyle = "#e8edf2";
    ctx.fillRect(sbW, 51, W - sbW, 1);

    // Breadcrumb
    ctx.fillStyle = "#9ba3ae";
    ctx.font = "12px 'DM Sans',sans-serif";
    ctx.fillText("Portfolio  /  Assets  /", sbW + 18, 30);
    ctx.fillStyle = "#1a2744";
    ctx.font = "600 12px 'DM Sans',sans-serif";
    ctx.fillText("  Prospects", sbW + 130, 30);

    // Top right — personalised greeting chip
    if (name) {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, W - 180, 14, 162, 26, 13);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(248,220,255,0.7)";
      ctx.font = "600 11px 'DM Sans',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Hi ${name}, ready to close?`, W - 99, 31);
      ctx.textAlign = "left";
    }

    // ── Main content ─────────────────────────────────────────────
    const mx = sbW + 16, my = 68, mw = W - sbW - 32;

    // Page title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px 'DM Sans',sans-serif";
    ctx.fillText(company ? `Demo for ${company}` : "Personalised Demo", mx, my + 14);
    if (company) {
      ctx.fillStyle = "#64748b";
      ctx.font = "11px 'DM Sans',sans-serif";
      ctx.fillText(`Prepared especially for ${company} — ${new Date().toLocaleDateString("en-GB")}`, mx, my + 30);
    }

    // ── Light stat cards (2 prominent ones like [Your product]) ──────────
    const cardY = my + 46;
    const cardData = [
      { label: "Reply Rate", val: "34%", sub: "+12% this week", accent: "#3b82f6" },
      { label: "Demos Sent", val: "247", sub: "to prospects", accent: "#10b981" },
      { label: "Time Saved", val: "12h", sub: "this month", accent: "#8b5cf6" },
    ];
    const cardW = Math.floor((mw - 16) / 3);
    cardData.forEach((card, i) => {
      const cx = mx + i * (cardW + 8);
      // White card
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.07)";
      ctx.shadowBlur = 10;
      roundRect(ctx, cx, cardY, cardW, 70, 10);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Accent bar left — orange/red brand
      const barAccent = (i === 0 && accentColor) ? accentColor : ["rgba(240,200,255,0.85)", "#ff3300", "rgba(200,160,255,0.9)"][i] || "rgba(240,200,255,0.85)";
      ctx.fillStyle = barAccent;
      roundRect(ctx, cx, cardY, 4, 70, 2);
      ctx.fill();
      // Values
      ctx.fillStyle = "#64748b";
      ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText(card.label, cx + 14, cardY + 18);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 22px 'DM Sans',sans-serif";
      ctx.fillText(card.val, cx + 14, cardY + 48);
      ctx.fillStyle = card.accent;
      ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText(card.sub, cx + 14, cardY + 63);
    });

    // ── Two main light panels ────────────────────────────────────
    const panelY = cardY + 84;
    const panelH = H - panelY - 14;
    const p1W = Math.floor(mw * 0.54);
    const p2W = mw - p1W - 10;

    // Panel 1 — chart
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.06)"; ctx.shadowBlur = 10;
    roundRect(ctx, mx, panelY, p1W, panelH, 10);
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px 'DM Sans',sans-serif";
    ctx.fillText("Outreach Performance", mx + 14, panelY + 20);
    if (company) {
      ctx.fillStyle = "rgba(240,200,255,0.85)";
      ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText(`vs industry avg`, mx + 14, panelY + 34);
    }

    // Bar chart
    const barData = [0.38, 0.55, 0.44, 0.72, 0.58, 0.88, 0.65];
    const barW2 = Math.floor((p1W - 32) / barData.length) - 4;
    barData.forEach((h, i) => {
      const bh = Math.floor(h * (panelH - 60));
      const bx = mx + 14 + i * (barW2 + 4);
      const by = panelY + panelH - bh - 14;
      // Background bar
      ctx.fillStyle = "#f1f5f9";
      roundRect(ctx, bx, panelY + 44, barW2, panelH - 58, 4);
      ctx.fill();
      // Value bar — brand gradient orange→red
      const barFill = i === 5 ? (accentColor || "rgba(240,200,255,0.85)") : (accentColor ? accentColor.replace("rgb(", "rgba(").replace(")", ",0.3)") : `rgba(255,${107 - i * 10},0,0.3)`);
      ctx.fillStyle = barFill;
      roundRect(ctx, bx, by, barW2, bh, 4);
      ctx.fill();
    });

    // Panel 2 — prospect card
    const p2x = mx + p1W + 10;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.06)"; ctx.shadowBlur = 10;
    roundRect(ctx, p2x, panelY, p2W, panelH, 10);
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px 'DM Sans',sans-serif";
    ctx.fillText("Prospect", p2x + 14, panelY + 20);

    if (company) {
      // Company name big
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px 'DM Sans',sans-serif";
      ctx.fillText(company, p2x + 14, panelY + 50);
      // Contact name
      if (name) {
        ctx.fillStyle = "#475569";
        ctx.font = "12px 'DM Sans',sans-serif";
        ctx.fillText(`Contact: ${name}`, p2x + 14, panelY + 68);
      }
      // Email
      if (email) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px 'DM Sans',sans-serif";
        const em = email.length > 22 ? email.slice(0, 22) + "…" : email;
        ctx.fillText(em, p2x + 14, panelY + 84);
      }
      // Status badge
      ctx.fillStyle = "#dcfce7";
      roundRect(ctx, p2x + 14, panelY + 96, 64, 20, 10);
      ctx.fill();
      ctx.fillStyle = "#16a34a";
      ctx.font = "bold 10px 'DM Sans',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Active", p2x + 46, panelY + 110);
      ctx.textAlign = "left";

      // Send button — brand gradient
      const btnGrad = ctx.createLinearGradient(p2x + 14, 0, p2x + p2W - 14, 0);
      btnGrad.addColorStop(0, "rgba(240,200,255,0.85)");
      btnGrad.addColorStop(1, "rgba(200,160,255,0.9)");
      ctx.fillStyle = btnGrad;
      roundRect(ctx, p2x + 14, panelY + panelH - 40, p2W - 28, 28, 7);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'DM Sans',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Send personalised demo", p2x + p2W / 2, panelY + panelH - 22);
      ctx.textAlign = "left";
    } else {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "12px 'DM Sans',sans-serif";
      ctx.fillText("Type a company name", p2x + 14, panelY + 50);
      ctx.fillText("to see it here", p2x + 14, panelY + 66);
    }

    // ── Logo overlay (draggable) ─────────────────────────────────
    if (logoEl) {
      const ar = logoEl.width / logoEl.height;
      const lw = ar >= 1 ? logoSize : logoSize * ar;
      const lh = ar >= 1 ? logoSize / ar : logoSize;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 16;
      ctx.drawImage(logoEl, logoPos.x, logoPos.y, lw, lh);
      ctx.restore();
      // Drag handle border — orange
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      roundRect(ctx, logoPos.x - 4, logoPos.y - 4, lw + 8, lh + 8, 6);
      ctx.stroke();
      ctx.setLineDash([]);
      // Corner handles — orange
      [[logoPos.x - 4, logoPos.y - 4], [logoPos.x + lw + 4, logoPos.y - 4], [logoPos.x - 4, logoPos.y + lh + 4], [logoPos.x + lw + 4, logoPos.y + lh + 4]].forEach(([hx, hy]) => {
        ctx.fillStyle = "rgba(240,200,255,0.85)";
        ctx.fillRect(hx - 3, hy - 3, 6, 6);
      });
    } else {
      // Large white drop zone — always visible as invitation to place logo
      const zoneSize = 100;
      const zx = logoPos.x, zy = logoPos.y;
      // White card
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 16;
      roundRect(ctx, zx, zy, zoneSize, zoneSize, 12);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Border
      ctx.strokeStyle = "rgba(180,190,210,0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash(fetching ? [] : [5, 3]);
      roundRect(ctx, zx, zy, zoneSize, zoneSize, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      // Icon
      ctx.strokeStyle = "rgba(150,165,190,0.5)";
      ctx.lineWidth = 1.5;
      const cx2 = zx + zoneSize / 2, cy2 = zy + zoneSize / 2 - 8;
      roundRect(ctx, cx2 - 14, cy2 - 14, 28, 28, 6);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      ctx.fillStyle = "rgba(100,130,180,0.8)";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(company ? company[0].toUpperCase() : "?", cx2, cy2 + 6);
      // Label
      ctx.fillStyle = fetching ? "rgba(240,200,255,0.85)" : "rgba(80,100,140,0.7)";
      ctx.font = fetching ? "bold 9px 'DM Sans',sans-serif" : "9px 'DM Sans',sans-serif";
      ctx.fillText(fetching ? "Fetching logo…" : (company ? company : "Logo here"), cx2, zy + zoneSize - 10);
      ctx.textAlign = "left";
    }
  }, [company, name, email, logoEl, logoPos, logoSize, fetching, accentColor, W, H]);

  // Fetch logo
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!company.trim()) { setLogoEl(null); setAccentColor(null); return; }
    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      const input = company.trim();
      const isUrl = input.includes(".");
      const candidates = isUrl
        ? [input.replace(/^https?:\/\//, "").replace(/\/.*$/, "")]
        : [
          input.toLowerCase().replace(/\s+/g, "") + ".com",
          input.toLowerCase().replace(/\s+/g, "") + ".se",
          input.toLowerCase().replace(/\s+/g, "") + ".io",
        ];

      const withTimeout = (ms) => { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; };

      const tryImgSrc = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { if (img.naturalWidth >= 8) resolve(img); else resolve(null); };
        img.onerror = () => resolve(null);
        img.src = src;
      });

      let found = false;
      for (const domain of candidates) {
        // 1. Vercel proxy (production)
        try {
          const res = await fetch(`/api/logo?domain=${encodeURIComponent(domain)}`, { signal: withTimeout(4000) });
          if (res.ok) {
            const blob = await res.blob();
            if (blob.size > 100) {
              const url = URL.createObjectURL(blob);
              const img = await tryImgSrc(url);
              if (img) { setLogoEl(img); extractColor(img); setFetching(false); found = true; break; }
            }
          }
        } catch { }

        // 2. Clearbit (CORS-friendly via img tag)
        try {
          const img = await tryImgSrc(`https://logo.clearbit.com/${domain}`);
          if (img) { setLogoEl(img); extractColor(img); setFetching(false); found = true; break; }
        } catch { }

        // 3. Google Favicons (always works, no CORS)
        try {
          const img = await tryImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
          if (img) { setLogoEl(img); extractColor(img); setFetching(false); found = true; break; }
        } catch { }
      }
      if (!found) { setLogoEl(null); setFetching(false); }
    }, 700);
  }, [company]);

  // Drag handlers
  const getCanvasXY = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }, [W, H]);

  const onMouseDown = useCallback((e) => {
    if (!logoEl) return;
    const { x, y } = getCanvasXY(e);
    const ar = logoEl.width / logoEl.height;
    const lw = ar >= 1 ? logoSize : logoSize * ar;
    const lh = ar >= 1 ? logoSize / ar : logoSize;
    if (x >= logoPos.x - 8 && x <= logoPos.x + lw + 8 && y >= logoPos.y - 8 && y <= logoPos.y + lh + 8) {
      dragOffset.current = { ox: x - logoPos.x, oy: y - logoPos.y };
      setDragging(true);
      e.preventDefault();
    }
  }, [logoEl, logoPos, logoSize, getCanvasXY]);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    const { x, y } = getCanvasXY(e);
    setLogoPos({ x: Math.max(0, Math.min(W - logoSize, x - dragOffset.current.ox)), y: Math.max(0, Math.min(H - logoSize, y - dragOffset.current.oy)) });
  }, [dragging, getCanvasXY, W, H, logoSize]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
    return () => { window.removeEventListener("mouseup", onMouseUp); window.removeEventListener("touchend", onMouseUp); };
  }, [onMouseUp]);

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
    padding: "11px 14px", color: "rgba(255,255,255,0.88)", fontSize: 14,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color .2s",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>Live demo</div>
        <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px" }}><CDShimmerText dark={darkMode}>{lang === "sv" ? "Se exakt hur det fungerar." : "See exactly how it works."}</CDShimmerText></h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
          {lang === "sv" ? "Skriv ett företagsnamn och se deras logotyp dyka upp på demon — dra den sedan vart du vill." : "Type a company name and watch their logo appear on the demo — then drag it anywhere."}
        </p>
      </div>

      <div className="live-demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>
        {/* Canvas */}
        <div className="live-demo-canvas-wrap" style={{
          borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(232,0,29,0.2)",
          cursor: dragging ? "grabbing" : logoEl ? "grab" : "default",
        }}>
          <canvas ref={canvasRef} width={W} height={H}
            style={{ display: "block", width: "100%", height: "auto", userSelect: "none" }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onTouchStart={onMouseDown} onTouchMove={onMouseMove}
          />
        </div>

        {/* Controls */}
        <div style={{
          background: "rgba(255,255,255,0.025)", backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20,
          padding: "26px 22px", display: "flex", flexDirection: "column", gap: 18,
        }}>
          {/* Bulk badge */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              {lang === "sv" ? <>I det riktiga verktyget, klistra in <strong style={{ color: "rgba(255,255,255,0.95)" }}>100 företag på en gång</strong> och få 100 personaliserade demos på sekunder.</> : <>In the real tool, paste <strong style={{ color: "rgba(255,255,255,0.95)" }}>100 companies at once</strong> and get 100 personalised demos in seconds.</>}
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: ".2px" }}>
            {lang === "sv" ? "Personalisera den här demon" : "Personalise this demo"}
          </div>

          {[
            { label: lang === "sv" ? "Företag" : "Company", placeholder: "e.g. Hooli", val: company, set: setCompany, type: "text" },
            { label: lang === "sv" ? "Namn" : "Name", placeholder: "e.g. Marcus", val: name, set: setName, type: "text" },
            { label: lang === "sv" ? "E-post" : "Email", placeholder: "marcus@co.com", val: email, set: setEmail, type: "email" },
          ].map(({ label, placeholder, val, set, type }) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
              <input type={type} placeholder={placeholder} value={val} onChange={e => set(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
              />
            </div>
          ))}

          {logoEl && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
                {lang === "sv" ? `Logotypstorlek — ${logoSize}px` : `Logo size — ${logoSize}px`}
              </div>
              <input type="range" min={5} max={120} value={logoSize} onChange={e => setLogoSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "rgba(240,200,255,0.85)" }} />
            </div>
          )}

          {/* Logo drop zone */}
          <div style={{
            border: `1.5px dashed rgba(180,190,210,0.5)`,
            borderRadius: 14, padding: "18px 14px", textAlign: "center",
            background: "rgba(255,255,255,0.04)",
            transition: "all .2s",
          }}>
            {logoEl ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <img src={logoEl.src} style={{ height: 32, maxWidth: 80, objectFit: "contain" }} alt="logo" />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{lang === "sv" ? "Dra logotypen på canvasen" : "Drag the logo on the canvas"}</div>
              </div>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 8px", display: "block" }}>
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                  {fetching ? (lang === "sv" ? "Hämtar logotyp…" : "Fetching logo…") : company ? (lang === "sv" ? "Ingen logotyp hittades — prova exakt företagsnamn" : "No logo found — try exact company name") : (lang === "sv" ? "Skriv ett företag ovan för att hämta deras logotyp" : "Type a company above to auto-fetch their logo")}
                </div>
              </>
            )}
          </div>

          {accentColor && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: accentColor, flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.15)", boxShadow: `0 0 16px ${accentColor}55`
              }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {lang === "sv" ? "Varumärkesfärg upptäckt — tillämpas på demon automatiskt" : "Brand colour detected — applied to demo automatically"}
              </div>
            </div>
          )}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.65 }}>
            {lang === "sv" ? "Hela verktyget: dra var som helst · lägg till textlager · bulkexport · skicka via Gmail" : "Full tool: drag anywhere · add text layers · bulk export · send via Gmail"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper — rounded rect
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper — rounded rect

const DEMO_STEPS = [
  {
    title: "Upload your product screenshot", titleSv: "Ladda upp din produktskärmbild",
    desc: "Drag in any screenshot of your product — a dashboard, feature view, or any UI. Supports PNG, JPG, HEIC.", descSv: "Dra in valfri skärmbild av din produkt. Stöder PNG, JPG, HEIC.",
    tag: "Step 1", tagSv: "Steg 1",
    color: "rgba(255,255,255,0.7)",
  },
  {
    title: "Paste your prospect list", titleSv: "Klistra in din prospektlista",
    desc: "Drop in company names and contacts. Logoplacers auto-fetches every logo simultaneously.", descSv: "Lägg till företag och kontakter. Logotyper hämtas automatiskt.",
    tag: "Step 2", tagSv: "Steg 2",
    color: "rgba(255,255,255,0.7)",
    leads: [
      { company: "Pied Piper", name: "Jared Dunn", email: "jared@piedpiper.com", status: "ok" },
      { company: "Hooli", name: "Gavin Belson", email: "gavin@hooli.com", status: "ok" },
      { company: "Aviato", name: "Erlich Bachman", email: "erlich@aviato.com", status: "ok" },
      { company: "Initech", name: "Michael Bolton", email: "michael@initech.com", status: "ok" },
      { company: "Globodyne", name: "Richard Hendricks", email: "richard@globodyne.com", status: "ok" },
    ],
  },
  {
    title: "Position logo & add text", titleSv: "Placera logotyp och lägg till text",
    desc: "Drag your prospect's logo onto your screenshot. Add personalised name and company text layers.", descSv: "Dra prospektets logotyp till din skärmbild. Lägg till personaliserade textlager.",
    tag: "Step 3", tagSv: "Steg 3",
    color: "rgba(255,255,255,0.5)",
  },
  {
    title: "Export or send via Gmail", titleSv: "Exportera eller skicka via Gmail",
    desc: "Download all 100 demos as a ZIP, or send directly from Gmail with one click — anti-spam delays built in.", descSv: "Ladda ner alla 100 demos som en ZIP, eller skicka direkt från Gmail.",
    tag: "Step 4", tagSv: "Steg 4",
    color: "rgba(255,255,255,0.7)",
  },
];

function DemoCanvas({ step, activeLeadIdx }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const rr = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // ── App chrome — matches real app exactly ───────────────────
    // Main bg — true black
    ctx.fillStyle = "#080808"; ctx.fillRect(0, 0, W, H);
    // Header bg
    ctx.fillStyle = "#0f0f0f"; ctx.fillRect(0, 0, W, 52);
    // Header bottom border + orange gradient line
    ctx.fillStyle = "#1e1e1e"; ctx.fillRect(0, 51, W, 1);
    const headerLine = ctx.createLinearGradient(0, 0, W, 0);
    headerLine.addColorStop(0, "rgba(255,255,255,0)");
    headerLine.addColorStop(0.3, "rgba(255,255,255,0.5)");
    headerLine.addColorStop(0.7, "rgba(180,180,180,0.5)");
    headerLine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = headerLine; ctx.fillRect(0, 51, W, 1);

    // Envelope logo (simplified)
    ctx.strokeStyle = "rgba(240,200,255,0.85)"; ctx.lineWidth = 1.5;
    rr(14, 14, 26, 20, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 16); ctx.lineTo(27, 25); ctx.lineTo(40, 16);
    ctx.strokeStyle = "rgba(240,200,255,0.85)"; ctx.lineWidth = 1.2; ctx.stroke();

    ctx.fillStyle = "#f5f5f5"; ctx.font = "700 13px 'DM Sans',sans-serif";
    ctx.fillText("LogoPlacer", 48, 27);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px 'DM Sans',sans-serif";
    ctx.fillText("Personaliserade demobilder", 48, 41);

    // Header right side — credit badge + buttons
    // Credit badge (orange)
    ctx.fillStyle = "rgba(255,255,255,0.12)"; rr(W - 270, 16, 80, 22, 8); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; rr(W - 270, 16, 80, 22, 8); ctx.stroke();
    ctx.fillStyle = "rgba(248,220,255,0.7)"; ctx.font = "600 10px 'DM Sans',sans-serif"; ctx.textAlign = "center";
    ctx.fillText("⚡ 9 505", W - 230, 31); ctx.textAlign = "left";
    // Preview btn
    ctx.fillStyle = "rgba(255,255,255,0.06)"; rr(W - 185, 16, 70, 22, 8); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "600 10px 'DM Sans',sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Förhandsgr…", W - 150, 31); ctx.textAlign = "left";
    // Skicka btn (orange gradient)
    const skickaGrad = ctx.createLinearGradient(W - 110, 0, W - 30, 0);
    skickaGrad.addColorStop(0, "rgba(240,200,255,0.85)"); skickaGrad.addColorStop(1, "rgba(200,160,255,0.9)");
    ctx.fillStyle = skickaGrad; rr(W - 110, 16, 80, 22, 8); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "700 10px 'DM Sans',sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Skicka", W - 70, 31); ctx.textAlign = "left";

    // Mode tabs bar
    ctx.fillStyle = "#0f0f0f"; ctx.fillRect(0, 52, W, 36);
    ctx.fillStyle = "#1e1e1e"; ctx.fillRect(0, 87, W, 1);
    ["Bild", "Video"].forEach((tab, i) => {
      const tx = 160 + i * 300;
      ctx.fillStyle = i === 0 ? "rgba(248,220,255,0.7)" : "rgba(255,255,255,0.28)";
      ctx.font = i === 0 ? "600 13px 'DM Sans',sans-serif" : "13px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText(tab, tx, 74); ctx.textAlign = "left";
      if (i === 0) { ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.fillRect(tx - 24, 86, 48, 2); }
    });

    // Sidebar — matches app: dark #0f0f0f with sep border
    ctx.fillStyle = "#0f0f0f"; ctx.fillRect(0, 88, 240, H - 88);
    ctx.fillStyle = "#1e1e1e"; ctx.fillRect(240, 88, 1, H - 88);
    // Sidebar top orange accent
    const sidebarAccent = ctx.createLinearGradient(0, 88, 240, 88);
    sidebarAccent.addColorStop(0, "rgba(255,255,255,0)");
    sidebarAccent.addColorStop(0.5, "rgba(255,255,255,0.2)");
    sidebarAccent.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sidebarAccent; ctx.fillRect(0, 88, 240, 1);

    // Canvas area bg
    ctx.fillStyle = "#050505"; ctx.fillRect(241, 88, W - 241, H - 88);
    // Dot grid pattern
    ctx.fillStyle = "#161616";
    for (let gx = 253; gx < W; gx += 24) {
      for (let gy = 100; gy < H; gy += 24) {
        ctx.beginPath(); ctx.arc(gx, gy, 0.8, 0, Math.PI * 2); ctx.fill();
      }
    }

    // ── STEP-SPECIFIC CONTENT ──────────────────────────────────
    if (step === 0) {
      // Sidebar labels matching real app
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "700 9px 'DM Sans',sans-serif";
      ctx.letterSpacing = "1px"; ctx.fillText("BASBILD", 16, 106);

      // Upload zone — dark card
      ctx.fillStyle = "#161616"; ctx.strokeStyle = "#242424";
      ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
      rr(10, 112, 220, 90, 10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      // Upload icon
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(121, 135); ctx.lineTo(121, 155);
      ctx.moveTo(113, 143); ctx.lineTo(121, 135); ctx.lineTo(129, 143); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(108, 158); ctx.lineTo(134, 158); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "600 11px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Click or drag here", 121, 175);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.fillText("JPG · PNG · WEBP · HEIC", 121, 188); ctx.textAlign = "left";

      // Bakgrundsfärg toggle row
      ctx.fillStyle = "#161616"; rr(10, 212, 220, 30, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "12px 'DM Sans',sans-serif";
      ctx.fillText("Bakgrundsfärg", 20, 231);
      // Toggle off
      ctx.fillStyle = "#242424"; rr(202, 219, 22, 13, 6); ctx.fill();
      ctx.fillStyle = "#555"; ctx.beginPath(); ctx.arc(210, 225, 5, 0, Math.PI * 2); ctx.fill();

      // Mottagarens logotyp label
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "700 9px 'DM Sans',sans-serif";
      ctx.fillText("MOTTAGARENS LOGOTYP", 16, 260);
      ctx.fillStyle = "rgba(248,220,255,0.7)"; ctx.font = "700 10px 'DM Sans',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("+ New", 232, 260); ctx.textAlign = "left";

      // Logo 1 row
      ctx.fillStyle = "#161616"; rr(10, 268, 220, 34, 8); ctx.fill();
      ctx.strokeStyle = "#242424"; ctx.lineWidth = 1; rr(10, 268, 220, 34, 8); ctx.stroke();
      ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.beginPath(); ctx.arc(24, 285, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "600 12px 'DM Sans',sans-serif";
      ctx.fillText("Logo 1", 36, 289);
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "11px 'DM Sans',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("120px  ▾", 228, 289); ctx.textAlign = "left";

      // Textlager label
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "700 9px 'DM Sans',sans-serif";
      ctx.fillText("TEXTLAGER", 16, 320);
      ctx.fillStyle = "rgba(248,220,255,0.7)"; ctx.font = "700 10px 'DM Sans',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("+ New", 232, 320); ctx.textAlign = "left";

      // Text 1 row
      ctx.fillStyle = "#161616"; rr(10, 328, 220, 34, 8); ctx.fill();
      ctx.strokeStyle = "#242424"; ctx.lineWidth = 1; rr(10, 328, 220, 34, 8); ctx.stroke();
      ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.beginPath(); ctx.arc(24, 345, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "600 12px 'DM Sans',sans-serif";
      ctx.fillText("Text 1", 36, 349);
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "11px 'DM Sans',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("empty  ▴", 228, 349); ctx.textAlign = "left";

      // Canvas area — empty state matching real app
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      rr(320, 180, W - 380, H - 240, 16); ctx.fill();
      // Image icon
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1.5;
      const ix = W / 2 + 60, iy = H / 2 - 10;
      rr(ix - 28, iy - 28, 56, 56, 14); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.moveTo(ix - 14, iy - 5); ctx.lineTo(ix - 6, iy - 14); ctx.lineTo(ix + 2, iy - 5); ctx.lineTo(ix + 14, iy - 18); ctx.lineTo(ix + 22, iy + 10);
      ctx.lineTo(ix - 22, iy + 10); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "13px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("No image selected", ix, iy + 36);
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "11px 'DM Sans',sans-serif";
      ctx.fillText("Upload a base image on the left", ix, iy + 54); ctx.textAlign = "left";
    }

    if (step === 1) {
      // Step 2: Prospect list
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1;
      rr(16, 108, 210, 30, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(248,220,255,0.7)"; ctx.font = "600 10px 'DM Sans',sans-serif";
      ctx.fillText("RECIPIENT LOGO", 22, 127);
      ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.font = "600 10px 'DM Sans',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("+ Ny", 226, 127); ctx.textAlign = "left";

      const leads = DEMO_STEPS[1].leads;
      leads.forEach((lead, i) => {
        const ly = 146 + i * 46;
        const isActive = i === activeLeadIdx;
        ctx.fillStyle = isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.03)";
        ctx.strokeStyle = isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1; rr(16, ly, 210, 40, 8); ctx.fill(); ctx.stroke();

        // Status dot
        ctx.fillStyle = lead.status === "ok" ? "#10b981" : "#f59e0b";
        ctx.beginPath(); ctx.arc(30, ly + 20, 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = isActive ? "#fff" : "rgba(255,255,255,0.7)";
        ctx.font = "600 11px 'DM Sans',sans-serif";
        ctx.fillText(lead.company, 42, ly + 16);
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "10px 'DM Sans',sans-serif";
        ctx.fillText(lead.name, 42, ly + 30);
      });

      // Main preview area — show active lead demo
      ctx.fillStyle = "#0a1020"; ctx.fillRect(241, 88, W - 241, H - 88);
      const al = leads[Math.min(activeLeadIdx, leads.length - 1)];

      // Mock dashboard with company branding
      ctx.fillStyle = "#fff"; rr(270, 108, W - 290, H - 120, 12); ctx.fill();

      // Light sidebar
      ctx.fillStyle = "#f0f4f8"; rr(270, 108, 140, H - 120, 12); ctx.fill();
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(410, 108, 1, H - 120);
      ["Dashboard", "Assets", "Portfolio", "Settings"].forEach((item, i) => {
        const iy = 148 + i * 38;
        ctx.fillStyle = i === 1 ? "#eff6ff" : "transparent";
        if (i === 1) { rr(278, iy - 10, 124, 28, 6); ctx.fill(); }
        ctx.fillStyle = i === 1 ? "#1d4ed8" : "#64748b";
        ctx.font = i === 1 ? "600 11px 'DM Sans',sans-serif" : "11px 'DM Sans',sans-serif";
        ctx.fillText(item, 290, iy + 9);
      });

      // Main content
      ctx.fillStyle = "#1e293b"; ctx.font = "bold 14px 'DM Sans',sans-serif";
      ctx.fillText(`Demo for ${al.company}`, 422, 138);
      ctx.fillStyle = "#64748b"; ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText(`Prepared for ${al.name}`, 422, 154);

      // Stat cards
      [{ l: "Reply Rate", v: "34%", c: "#3b82f6" }, { l: "Demos", v: "247", c: "#10b981" }, { l: "Saved", v: "12h", c: "#8b5cf6" }].forEach((card, i) => {
        const cx = 422 + i * 96, cy = 168;
        ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 6;
        rr(cx, cy, 88, 50, 6); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = card.c; rr(cx, cy, 3, 50, 2); ctx.fill();
        ctx.fillStyle = "#94a3b8"; ctx.font = "9px 'DM Sans',sans-serif"; ctx.fillText(card.l, cx + 8, cy + 14);
        ctx.fillStyle = "#0f172a"; ctx.font = "bold 16px 'DM Sans',sans-serif"; ctx.fillText(card.v, cx + 8, cy + 38);
      });

      // Logo placeholder area — PROMINENT
      ctx.fillStyle = "rgba(59,130,246,0.08)"; ctx.strokeStyle = "rgba(59,130,246,0.4)";
      ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      rr(422, 230, 120, 72, 10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#3b82f6"; ctx.font = "600 10px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Logo drops here", 482, 262);
      ctx.fillStyle = "rgba(59,130,246,0.5)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.fillText(al.company, 482, 276); ctx.textAlign = "left";
    }

    if (step === 2) {
      // Step 3: Editor with logo placed
      ctx.fillStyle = "#0a1020"; ctx.fillRect(241, 88, W - 241, H - 88);
      ctx.fillStyle = "#fff"; rr(260, 100, W - 280, H - 112, 12); ctx.fill();

      // Light panels
      ctx.fillStyle = "#f8fafc"; rr(260, 100, W - 280, 52, 12); ctx.fill();
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(260, 150, W - 280, 1);

      ctx.fillStyle = "#0f172a"; ctx.font = "bold 13px 'DM Sans',sans-serif";
      ctx.fillText("Demo — Pied Piper", 275, 120);
      ctx.fillStyle = "#64748b"; ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText("Hi Jared, here's what Pied Piper could look like in your workflow", 275, 137);

      // Sidebar controls
      ctx.fillStyle = "#f8fafc"; rr(260, 152, 160, H - 164, 8); ctx.fill();
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(420, 152, 1, H - 164);

      ["TEXT LAYERS", "RECIPIENT LOGO", "STORLEK"].forEach((label, i) => {
        const ly = 174 + i * 60;
        ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.font = "bold 9px 'DM Sans',sans-serif";
        ctx.fillText(label, 272, ly);
        ctx.fillStyle = "rgba(0,0,0,0.06)"; rr(270, ly + 6, 146, 36, 6); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 1; ctx.stroke();
        if (i === 0) { ctx.fillStyle = "#334155"; ctx.font = "11px sans-serif"; ctx.fillText("Hi Emma, see how...", 278, ly + 28); }
        if (i === 1) { ctx.fillStyle = "#1d4ed8"; ctx.font = "600 11px sans-serif"; ctx.fillText("Pied Piper logo ✓", 278, ly + 28); }
        if (i === 2) {
          ctx.fillStyle = "#3b82f6"; rr(270, ly + 20, 80, 8, 4); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(350, ly + 24, 5, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Main canvas — demo with logo placed
      ctx.fillStyle = "#f0f4f8"; rr(422, 156, W - 442, H - 168, 8); ctx.fill();
      // Grid
      ctx.strokeStyle = "rgba(59,130,246,0.06)"; ctx.lineWidth = 0.5;
      for (let x = 432; x < W - 22; x += 32) { ctx.beginPath(); ctx.moveTo(x, 156); ctx.lineTo(x, H - 12); ctx.stroke(); }
      for (let y = 166; y < H - 12; y += 32) { ctx.beginPath(); ctx.moveTo(422, y); ctx.lineTo(W - 22, y); ctx.stroke(); }

      // Stat widgets on canvas
      [{ l: "Shares", v: "22,200", c: "#3b82f6" }, { l: "Valuation", v: "42M", c: "#10b981" }].forEach((w, i) => {
        const wx = 436 + i * 130, wy = 170;
        ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 8;
        rr(wx, wy, 120, 56, 8); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = w.c; rr(wx, wy, 3, 56, 2); ctx.fill();
        ctx.fillStyle = "#94a3b8"; ctx.font = "9px sans-serif"; ctx.fillText(w.l, wx + 9, wy + 16);
        ctx.fillStyle = "#0f172a"; ctx.font = "bold 18px sans-serif"; ctx.fillText(w.v, wx + 9, wy + 42);
      });

      // Logo (Pied Piper pink placeholder)
      ctx.fillStyle = "rgba(255,20,100,0.12)"; ctx.strokeStyle = "rgba(255,20,100,0.4)";
      ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      rr(436, 238, 72, 44, 8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#e0115f"; ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Pied Piper", 472, 264); ctx.textAlign = "left";
      // Drag handles
      [[436, 238], [508, 238], [436, 282], [508, 282]].forEach(([hx, hy]) => {
        ctx.fillStyle = "#3b82f6"; ctx.fillRect(hx - 3, hy - 3, 6, 6);
      });

      // Text layer
      ctx.fillStyle = "#1e293b"; ctx.font = "bold 12px 'DM Sans',sans-serif";
      ctx.fillText("Hi Jared — see Pied Piper's data", 436, 310);
      ctx.fillStyle = "#64748b"; ctx.font = "10px 'DM Sans',sans-serif";
      ctx.fillText("Personalised for jared@piedpiper.com", 436, 326);
    }

    if (step === 3) {
      // Step 4: Export/Send
      ctx.fillStyle = "#0a1020"; ctx.fillRect(0, 88, W, H - 88);

      // Generated demos grid
      const demoCompanies = ["Pied Piper", "Hooli", "Aviato", "Initech", "Globodyne", "Vandelay", "Dinoco", "Bluth Co"];
      const cols = 4, rows = 2, dw = Math.floor((W - 32) / cols) - 10, dh = Math.floor((H - 140) / rows) - 10;
      demoCompanies.slice(0, cols * rows).forEach((co, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const dx = 16 + col * (dw + 10), dy = 100 + row * (dh + 10);
        ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 10;
        rr(dx, dy, dw, dh, 8); ctx.fill(); ctx.shadowBlur = 0;

        // Mini dashboard inside each
        ctx.fillStyle = "#f0f4f8"; rr(dx, dy, dw, 22, 8); ctx.fill();
        ctx.fillStyle = "#1e293b"; ctx.font = "bold 9px sans-serif";
        ctx.fillText(`Demo — ${co}`, dx + 6, dy + 14);

        // Fake logo blob
        const colors = { "Pied Piper": "rgba(240,200,255,0.85)", "Hooli": "#ff6b35", "Aviato": "#f59e0b", "Initech": "#10b981", "Globodyne": "#8b5cf6", "Vandelay": "#e0115f", "Dinoco": "#0099ff", "Bluth Co": "#f97316" };
        ctx.fillStyle = colors[co] || "#3b82f6"; rr(dx + dw - 44, dy + 26, 36, 22, 5); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center"; ctx.fillText(co.slice(0, 3), dx + dw - 26, dy + 41); ctx.textAlign = "left";

        // Mini bars
        [0.4, 0.7, 0.5, 0.9].forEach((bh, bi) => {
          ctx.fillStyle = "rgba(59,130,246,0.3)";
          rr(dx + 6 + bi * 14, dy + dh - Math.floor(bh * 24) - 4, 10, Math.floor(bh * 24), 3); ctx.fill();
        });

        // Checkmark
        ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(dx + dw - 10, dy + 10, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(dx + dw - 13, dy + 10); ctx.lineTo(dx + dw - 10, dy + 13); ctx.lineTo(dx + dw - 7, dy + 7); ctx.stroke();
      });

      // Bottom action bar
      ctx.fillStyle = "rgba(20,30,50,0.95)"; ctx.fillRect(0, H - 56, W, 56);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, H - 57, W, 1);

      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px 'DM Sans',sans-serif";
      ctx.fillText(`${demoCompanies.length} personalised demos ready`, 16, H - 28);

      [
        { label: "Download ZIP", color: "rgba(255,255,255,0.1)", tx: "rgba(255,255,255,0.8)", bx: W - 380 },
        { label: "Send via Gmail", color: "rgba(255,255,255,0.7)", tx: "#fff", bx: W - 240 },
        { label: "Export slides", color: "rgba(180,180,180,0.8)", tx: "#fff", bx: W - 110 },
      ].forEach(({ label, color, tx, bx }) => {
        ctx.fillStyle = color; rr(bx, H - 44, 120, 28, 7); ctx.fill();
        ctx.fillStyle = tx; ctx.font = "600 11px 'DM Sans',sans-serif";
        ctx.textAlign = "center"; ctx.fillText(label, bx + 60, H - 26); ctx.textAlign = "left";
      });
    }

    if (step === 4) {
      // Step 5: Video demo with website screenshot
      ctx.fillStyle = "#0f1520"; ctx.fillRect(0, 0, W, H);

      // App header
      ctx.fillStyle = "#141e30"; ctx.fillRect(0, 0, W, 52);
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(0, 51, W, 1);
      ctx.fillStyle = "rgba(240,200,255,0.85)"; rr(16, 14, 26, 26, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("LP", 29, 31); ctx.textAlign = "left";
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px 'DM Sans',sans-serif"; ctx.fillText("LogoPlacer", 50, 28);
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px 'DM Sans',sans-serif"; ctx.fillText("Personalised demos", 50, 41);
      // Buttons
      [["Preview", "rgba(255,255,255,0.08)", "rgba(255,255,255,0.6)", W - 310],
      ["Send", "rgba(255,255,255,0.08)", "rgba(255,255,255,0.6)", W - 210],
      ["Download (5)", "rgba(240,200,255,0.85)", "#fff", W - 120]].forEach(([lbl, bg, tc, bx]) => {
        ctx.fillStyle = bg; rr(bx, 16, 102, 22, 6); ctx.fill();
        ctx.fillStyle = tc; ctx.font = "600 10px 'DM Sans',sans-serif"; ctx.textAlign = "center";
        ctx.fillText(lbl, bx + 51, 31); ctx.textAlign = "left";
      });

      // Tabs
      ctx.fillStyle = "#141e30"; ctx.fillRect(0, 52, W, 34);
      ["Image", "Video"].forEach((t, i) => {
        ctx.fillStyle = i === 1 ? "#fff" : "rgba(255,255,255,0.3)";
        ctx.font = i === 1 ? "600 13px 'DM Sans',sans-serif" : "13px 'DM Sans',sans-serif";
        ctx.textAlign = "center"; ctx.fillText(t, i === 0 ? W * 0.27 : W * 0.73, 73); ctx.textAlign = "left";
        if (i === 1) { ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.fillRect(W * 0.73 - 30, 84, 60, 2); }
      });
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(0, 86, W, 1);

      // Sidebar
      ctx.fillStyle = "#141e30"; ctx.fillRect(0, 87, 240, H - 87);
      ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(240, 87, 1, H - 87);

      // YOUR VIDEO label + upload zone
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "bold 9px 'DM Sans',sans-serif";
      ctx.fillText("YOUR VIDEO", 16, 108);
      ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      rr(16, 116, 210, 90, 8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      // Video icon
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(80, 132, 50, 36, 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(130, 138); ctx.lineTo(146, 144); ctx.lineTo(130, 150); ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "600 10px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Click or drag your video", 120, 178); ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("MP4 · MOV · WEBM", 120, 191); ctx.textAlign = "left";

      // PERSONAL DEMO IMAGE
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "bold 9px 'DM Sans',sans-serif";
      ctx.fillText("PERSONAL DEMO IMAGE", 16, 222);
      ctx.fillStyle = "rgba(16,185,129,0.1)"; ctx.strokeStyle = "rgba(16,185,129,0.3)";
      ctx.lineWidth = 1; rr(16, 230, 210, 50, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(28, 255, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "600 11px 'DM Sans',sans-serif"; ctx.fillText("Demo image ready", 40, 252);
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.fillText("Rendered uniquely per company", 40, 266);

      // INTRO TEXT
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "bold 9px 'DM Sans',sans-serif";
      ctx.fillText("INTRO TEXT (PHASE 1)", 16, 298);
      ctx.fillStyle = "rgba(255,255,255,0.06)"; rr(16, 306, 210, 30, 6); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "11px 'DM Sans',sans-serif"; ctx.fillText("((name))'s future IR", 22, 325);
      // Tag buttons
      ["+first name", "+full name", "+company"].forEach((tag, i) => {
        const tx = 16 + i * 72;
        ctx.fillStyle = "rgba(255,255,255,0.15)"; rr(tx, 341, 66, 18, 5); ctx.fill();
        ctx.fillStyle = "rgba(248,220,255,0.7)"; ctx.font = "9px 'DM Sans',sans-serif";
        ctx.textAlign = "center"; ctx.fillText(tag, tx + 33, 353); ctx.textAlign = "left";
      });

      // Font + size row
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.fillText("Size (px)", 16, 374); ctx.fillText("Font", 100, 374);
      ctx.fillStyle = "rgba(255,255,255,0.06)"; rr(16, 379, 70, 22, 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "11px 'DM Sans',sans-serif"; ctx.fillText("28", 22, 394);
      ctx.fillStyle = "rgba(255,255,255,0.06)"; rr(100, 379, 130, 22, 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "11px 'DM Sans',sans-serif"; ctx.fillText("Inter", 106, 394);

      // B Bold button
      ctx.fillStyle = "rgba(255,255,255,0.07)"; rr(16, 408, 100, 22, 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px 'DM Sans',sans-serif"; ctx.textAlign = "center"; ctx.fillText("B Bold", 66, 423); ctx.textAlign = "left";

      // ── Main video preview area ─────────────────────────────────
      const vx = 250, vy = 96, vw = W - 260, vh = H - 100;

      // Company header row
      ctx.fillStyle = "rgba(255,255,255,0.06)"; rr(vx, vy, vw, 36, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.arc(vx + 20, vy + 18, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(240,200,255,0.85)"; ctx.font = "bold 10px 'DM Sans',sans-serif"; ctx.textAlign = "center"; ctx.fillText("PP", vx + 20, vy + 22); ctx.textAlign = "left";
      ctx.fillStyle = "#fff"; ctx.font = "600 11px 'DM Sans',sans-serif"; ctx.fillText("Jared Dunn", vx + 36, vy + 16);
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "9px 'DM Sans',sans-serif"; ctx.fillText("piedpiper.com", vx + 36, vy + 28);
      // Timing dots
      ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(vx + vw - 180, vy + 18, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px"; ctx.fillText("4s intro", vx + vw - 170, vy + 22);
      ctx.fillStyle = "#8b5cf6"; ctx.beginPath(); ctx.arc(vx + vw - 110, vy + 18, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("7s demo", vx + vw - 100, vy + 22);
      ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(vx + vw - 42, vy + 18, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("8s site", vx + vw - 32, vy + 22);

      // ── Video preview: two-panel (video left, website screenshot right) ──
      const panelY = vy + 44, panelH = vh - 52, splitX = vx + Math.floor(vw * 0.55);

      // LEFT: video preview (dark with mockup frame)
      ctx.fillStyle = "#0a0f1a"; rr(vx, panelY, splitX - vx - 4, panelH, 8); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
      rr(vx, panelY, splitX - vx - 4, panelH, 8); ctx.stroke();

      // Fake video frame — product demo screenshot mockup
      const fw2 = splitX - vx - 24, fh = Math.floor(panelH * 0.72), fx = vx + 10, fy = panelY + 16;
      ctx.fillStyle = "#1a2744"; rr(fx, fy, fw2, fh, 8); ctx.fill();
      // Screen content
      ctx.fillStyle = "#0d1628"; rr(fx + 10, fy + 10, fw2 - 20, fh - 20, 5); ctx.fill();
      // Mini stat bars
      [0.5, 0.8, 0.6, 0.95, 0.7].forEach((h2, i) => {
        const bh2 = Math.floor(h2 * (fh - 50)), bx2 = fx + 18 + i * Math.floor((fw2 - 36) / 5);
        ctx.fillStyle = i === 3 ? "rgba(240,200,255,0.85)" : "rgba(255,255,255,0.3)";
        rr(bx2, fy + fh - 30 - bh2, Math.floor((fw2 - 36) / 5) - 4, bh2, 3); ctx.fill();
      });
      // Text overlay chip (personalised intro text)
      const chipW = Math.min(fw2 - 20, 200);
      ctx.fillStyle = "rgba(0,0,0,0.6)"; rr(fx + 10, fy + fh - 24, chipW, 18, 9); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 9px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Jared's future IR", fx + 10 + chipW / 2, fy + fh - 12); ctx.textAlign = "left";
      // Play button
      ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(splitX - vx - 24 >> 1, panelY + panelH / 2, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath();
      const px2 = vx + (splitX - vx - 24) / 2, py2 = panelY + panelH / 2;
      ctx.moveTo(px2 - 6, py2 - 8); ctx.lineTo(px2 + 10, py2); ctx.lineTo(px2 - 6, py2 + 8); ctx.closePath(); ctx.fill();
      // Duration bar
      ctx.fillStyle = "rgba(255,255,255,0.08)"; rr(vx + 10, panelY + panelH - 18, splitX - vx - 24, 6, 3); ctx.fill();
      ctx.fillStyle = "rgba(240,200,255,0.85)"; rr(vx + 10, panelY + panelH - 18, Math.floor((splitX - vx - 24) * 0.35), 6, 3); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(vx + 10 + Math.floor((splitX - vx - 24) * 0.35), panelY + panelH - 15, 5, 0, Math.PI * 2); ctx.fill();

      // RIGHT: website screenshot panel
      ctx.fillStyle = "#e8edf5"; rr(splitX + 4, panelY, vx + vw - splitX - 14, panelH, 8); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 1;
      rr(splitX + 4, panelY, vx + vw - splitX - 14, panelH, 8); ctx.stroke();

      // Browser chrome
      ctx.fillStyle = "#fff"; rr(splitX + 4, panelY, vx + vw - splitX - 14, 32, 8); ctx.fill();
      ctx.fillStyle = "#e8edf5"; ctx.fillRect(splitX + 4, panelY + 24, vx + vw - splitX - 14, 8);
      // Browser dots
      [0, 1, 2].forEach(i => { ctx.fillStyle = ["#ff5f57", "#ffbd2e", "#28c940"][i]; ctx.beginPath(); ctx.arc(splitX + 16 + i * 14, panelY + 16, 4, 0, Math.PI * 2); ctx.fill(); });
      // URL bar
      ctx.fillStyle = "#f1f5f9"; rr(splitX + 52, panelY + 8, Math.min(vx + vw - splitX - 80, 160), 18, 9); ctx.fill();
      ctx.fillStyle = "#64748b"; ctx.font = "9px monospace";
      ctx.fillText("piedpiper.com", splitX + 60, panelY + 20);

      // Website content (fake landing page of Pied Piper)
      const wx2 = splitX + 10, wy2 = panelY + 36, ww = vx + vw - splitX - 24;
      ctx.fillStyle = "#1e3a5f"; rr(wx2, wy2, ww, 40, 0); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 12px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Pied Piper", wx2 + ww / 2, wy2 + 17); ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "9px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Middle-out compression", wx2 + ww / 2, wy2 + 32); ctx.textAlign = "left";
      ctx.fillStyle = "#fff"; ctx.font = "600 9px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Get started →", wx2 + ww / 2, wy2 + 52); ctx.textAlign = "left";
      // Hero section blocks
      ctx.fillStyle = "#f8fafc"; rr(wx2, wy2 + 62, ww, panelH - 110, 0); ctx.fill();
      [[0.3, "#3b82f6"], [0.6, "#93c5fd"], [0.45, "#bfdbfe"], [0.7, "#3b82f6"]].forEach(([h3, col], i) => {
        const bw3 = Math.floor(ww / 4) - 6, bh3 = Math.floor(h3 * 60), bx3 = wx2 + 4 + i * (bw3 + 6), by3 = wy2 + panelH - 80 - bh3;
        ctx.fillStyle = col; rr(bx3, by3, bw3, bh3, 3); ctx.fill();
      });
      // Screenshot badge
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.5;
      rr(splitX + 4, panelY, vx + vw - splitX - 14, panelH, 8); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.1)"; rr(splitX + 8, panelY + panelH - 28, 120, 20, 10); ctx.fill();
      ctx.fillStyle = "#3b82f6"; ctx.font = "bold 9px 'DM Sans',sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Live website screenshot", splitX + 68, panelY + panelH - 15); ctx.textAlign = "left";
    }

    ctx.fillStyle = "rgba(0,0,0,0)"; // flush
  }, [step, activeLeadIdx]);

  return <canvas ref={canvasRef} width={860} height={480} style={{ display: "block", width: "100%", height: "auto" }} />;
}

function DemoWalkthrough() {
  const darkMode = useDarkMode();
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [activeLeadIdx, setActiveLeadIdx] = useState(0);
  const [ref, vis] = useReveal(0.05);
  const timerRef = useRef(null);

  // Cycle leads in step 2
  useEffect(() => {
    if (step !== 1) return;
    timerRef.current = setInterval(() => {
      setActiveLeadIdx(i => (i + 1) % DEMO_STEPS[1].leads.length);
    }, 900);
    return () => clearInterval(timerRef.current);
  }, [step]);

  useEffect(() => { setActiveLeadIdx(0); }, [step]);

  return (
    <div ref={ref} style={{
      maxWidth: 1100, margin: "0 auto",
      transition: "opacity .9s, transform .9s",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>{lang === "sv" ? "Hur det fungerar" : "How it works"}</div>
        <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px" }}>
          {lang === "sv" ? "Från noll till 100 demos" : "From zero to 100 demos"}<br />{lang === "sv" ? "på under en minut." : "in under a minute."}
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
          {lang === "sv" ? "Klicka igenom stegen för att se hur det fungerar." : "Click through the steps to see exactly how it works."}
        </p>
      </div>

      {/* Step tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {DEMO_STEPS.map((s, i) => {
          const isActive = step === i;
          const stepColor = s.color || "rgba(255,255,255,0.8)";
          return (
            <button key={i} onClick={() => setStep(i)}
              style={{
                padding: "9px 20px", borderRadius: 10,
                border: `1px solid ${isActive ? stepColor : "rgba(255,255,255,0.06)"}`,
                background: isActive ? `linear-gradient(135deg,${stepColor}22,${stepColor}11)` : "rgba(255,255,255,0.03)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all .2s",
                boxShadow: isActive ? `0 0 20px ${stepColor}40, 0 4px 16px rgba(0,0,0,0.3)` : "none",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = `${stepColor}55`;
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.boxShadow = `0 0 12px ${stepColor}25`;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}>
              <span style={{ opacity: .55, marginRight: 6, color: isActive ? stepColor : "inherit" }}>{i + 1}.</span>
              {(lang === "sv" ? s.titleSv || s.title : s.title).split(" ").slice(0, 3).join(" ")}…
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div style={{
        borderRadius: 18, overflow: "hidden",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px ${DEMO_STEPS[step].color || "rgba(240,200,255,0.85)"}33, 0 0 60px ${DEMO_STEPS[step].color || "rgba(240,200,255,0.85)"}18`,
        position: "relative",
        transition: "box-shadow .4s",
      }}>
        <DemoCanvas step={step} activeLeadIdx={activeLeadIdx} />

        {/* Overlay caption */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(7,11,18,0.95) 0%, transparent 100%)",
          padding: "48px 32px 24px",
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 6 }}>
            {DEMO_STEPS[step].tag}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-.3px", marginBottom: 6 }}>
            {DEMO_STEPS[step].title}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 500 }}>
            {DEMO_STEPS[step].desc}
          </div>
        </div>

        {/* Nav arrows */}
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(10,16,26,0.8)", backdropFilter: "blur(12px)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
            </button>
          )}
          {step < DEMO_STEPS.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: "linear-gradient(135deg,rgba(240,200,255,0.85),rgba(200,160,255,0.9))",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(255,107,0,0.4)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Dot progress */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
        {DEMO_STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            width: step === i ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer",
            background: step === i ? "rgba(240,200,255,0.85)" : "rgba(255,255,255,0.15)",
            transition: "all .3s", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// HI DEMO CARD — cycling personas
// ─────────────────────────────────────────────
const HI_PERSONAS = [
  { name: "Emma", nameSv: "Emma", company: "Weyland Corp", initial: "W", color: "#3b82f6" },
  { name: "Marcus", nameSv: "Marcus", company: "Pied Piper", initial: "P", color: "#22c55e" },
  { name: "Sofia", nameSv: "Sofia", company: "Globodyne", initial: "G", color: "#f97316" },
  { name: "Johan", nameSv: "Johan", company: "Initech", initial: "I", color: "#a855f7" },
  { name: "Anna", nameSv: "Anna", company: "Vandelay Ind.", initial: "V", color: "#ef4444" },
  { name: "Erik", nameSv: "Erik", company: "Hooli", initial: "H", color: "#06b6d4" },
  { name: "Lena", nameSv: "Lena", company: "Aviato", initial: "A", color: "#f59e0b" },
  { name: "Oscar", nameSv: "Oscar", company: "Bluth Co", initial: "B", color: "#10b981" },
];

function HiDemoCard({ lang, statsVis }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i + 1) % HI_PERSONAS.length); setFading(false); }, 300);
    }, 2600);
    return () => clearInterval(t);
  }, []);
  const p = HI_PERSONAS[idx];
  return (
    <div style={{
      position: "relative", borderRadius: 22, overflow: "hidden",
      background: "linear-gradient(160deg, #09090b 0%, #07070a 100%)",
      border: "1px solid rgba(255,255,255,0.09)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
      display: "flex", flexDirection: "column",
      minHeight: 320,
      opacity: statsVis ? 1 : 0,
      transform: statsVis ? "translateY(0)" : "translateY(32px)",
      transition: "opacity .8s, transform .8s",
    }}>
      {/* Faux product screenshot */}
      <div style={{ flex: 1, padding: "28px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18, opacity: 0.25 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c940" }} />
          <div style={{ flex: 1, height: 13, borderRadius: 4, background: "rgba(255,255,255,0.05)", marginLeft: 8 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 0.1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ height: 36, borderRadius: 7, background: i === 1 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }} />)}
          </div>
          {[0.9, 0.7, 0.85, 0.5].map((w, i) => (
            <div key={i} style={{ height: 8, borderRadius: 3, background: "rgba(255,255,255,0.15)", width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
      {/* Cycling company badge — top right */}
      <div style={{
        position: "absolute", top: 20, right: 20,
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(-5px) scale(0.96)" : "translateY(0) scale(1)",
        transition: "opacity .28s, transform .28s",
      }}>
        <div style={{
          background: "rgba(6,6,8,0.95)", backdropFilter: "blur(16px)",
          border: `1px solid ${p.color}35`, borderRadius: 11,
          padding: "7px 11px", display: "flex", alignItems: "center", gap: 7,
          boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 16px ${p.color}14`,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: `${p.color}22`, border: `1px solid ${p.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: p.color }}>{p.initial}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{p.company}</span>
        </div>
      </div>
      {/* Main email overlay */}
      <div style={{
        position: "absolute", bottom: 20, left: 20, right: 20,
        background: "rgba(4,4,6,0.97)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 17,
        padding: "20px 22px 18px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: `${p.color}20`, border: `1px solid ${p.color}38`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: p.color,
            opacity: fading ? 0 : 1, transition: "opacity .28s",
          }}>{p.initial}</div>
          <div style={{ opacity: fading ? 0 : 1, transition: "opacity .28s", minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.company} demo
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>
              {lang === "sv" ? `Personaliserad för ${p.nameSv}` : `Personalised for ${p.name}`} · just now
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 7px #22c55e" }} />
            <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 700 }}>SENT</span>
          </div>
        </div>
        <div style={{
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(5px)" : "translateY(0)",
          transition: "opacity .28s, transform .28s",
        }}>
          <div style={{ fontSize: "clamp(15px, 2vw, 21px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, letterSpacing: "-.35px" }}>
            {lang === "sv"
              ? <>Hi {p.nameSv}, jag skapade den<br />här demon för <span style={{ color: p.color }}>{p.company}</span></>
              : <>Hi {p.name}, I created this<br />demo for <span style={{ color: p.color }}>{p.company}</span></>
            }
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.04)" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)" }}>+ 99 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function Landing({ onEnterApp, onOpenBlog }) {
  const t = useT();
  const { lang, setLang } = useLang();
  const darkMode = true;
  const [featRef, featVis] = useReveal(0.08);
  const [stepsRef, stepsVis] = useReveal(0.08);
  const [statsRef, statsVis] = useReveal(0.15);
  const [testiRef, testiVis] = useReveal(0.08);
  const [faqRef, faqVis] = useReveal(0.08);
  const [ctaRef, ctaVis] = useReveal(0.15);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <DarkModeContext.Provider value={darkMode}>
      <div data-theme={darkMode ? "dark" : "light"} style={{ background: darkMode ? "#000" : "#fafaf8", color: darkMode ? "#fff" : "#0a0a0a", fontFamily: "'DM Sans','Helvetica Neue',sans-serif", overflowX: "hidden", transition: "background .4s, color .4s" }}>
        <ExitIntentPopup onEnterApp={onEnterApp} />
        <SocialProofTicker />
        <FloatingDock onEnterApp={onEnterApp} onOpenBlog={onOpenBlog} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />

        {/* ── NAV ───────────────────────────────────── */}
        <nav role="navigation" aria-label="Main navigation" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: 64, padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: navScrolled ? "rgba(0,0,0,0.92)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "all .3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={30} />
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-.4px", color: "#fff" }}>Logoplacers</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              { label: lang === "sv" ? "Funktioner" : "Features", href: "#features" },
              { label: lang === "sv" ? "Hur det funkar" : "How it works", href: "#how-it-works" },
              { label: lang === "sv" ? "Priser" : "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map(item => (
              <a key={item.label} href={item.href}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", padding: "8px 12px", borderRadius: 8, transition: "color .15s" }}
                onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
                {item.label}
              </a>
            ))}
            <button onClick={onOpenBlog} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 12px", borderRadius: 8, transition: "color .15s" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{t("nav.blog")}</button>
            {/* Language toggle */}
            <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 2, marginLeft: 4 }}>
              {["en", "sv"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "rgba(255,255,255,0.12)" : "none", border: "none", borderRadius: 6, padding: "3px 9px", color: lang === l ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "all .15s" }}>{l}</button>
              ))}
            </div>
            <button onClick={onEnterApp} style={{ marginLeft: 6, background: "linear-gradient(105deg, #fff 0%, #e8c8ff 30%, #f8c8ff 60%, #fff 100%)", backgroundSize: "200% auto", animation: "cdShimmer 4s linear infinite", color: "#000", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-.1px", transition: "box-shadow .2s, transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,190,255,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              {lang === "sv" ? "Prova gratis" : "Try for free"}
            </button>
          </div>
        </nav>

        {/* ── HERO ──────────────────────────────────── */}
        <section aria-label="Hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
          <HeroScene />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(ellipse 100% 50% at 50% 100%, #000 0%, transparent 60%)" }} />

          {/* Hero text */}
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "80px 24px 40px", maxWidth: 900 }}>
            <h1 style={{ fontSize: "clamp(44px, 8vw, 96px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-4px", margin: "0 0 28px" }}>
              <span style={{ color: "#fff", display: "block", animation: "fadeSlideUp .8s ease both" }}>
                {lang === "sv" ? "Din produkt." : "Your product."}
              </span>
              <CDShimmerText style={{ display: "block", fontSize: "clamp(44px, 8vw, 96px)", fontWeight: 800, letterSpacing: "-4px" }}>
                {lang === "sv" ? "Deras logotyp. Varje mejl." : "Their logo. Every email."}
              </CDShimmerText>
            </h1>

            {/* SEO subtitle — visually subtle but semantically present */}
            <p style={{ fontSize: "clamp(13px, 1.2vw, 14px)", color: "rgba(255,255,255,0.22)", lineHeight: 1.8, maxWidth: 540, margin: "0 auto 48px", fontWeight: 400 }}>
              {lang === "sv"
                ? "Ladda upp en skärmbild av din produkt. Klistra in en lista med företag. Logoplacers hämtar automatiskt varje logotyp och genererar 100 unika personaliserade demobilder — och skickar dem direkt från ditt Gmail på under 10 minuter."
                : "Upload one screenshot of your product. Paste a list of companies. Logoplacers auto-fetches every logo and generates 100 unique personalised demo images — then sends them directly from your Gmail in under 10 minutes."}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeSlideUp .8s .3s ease both" }}>
              <button onClick={onEnterApp} style={{
                background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "17px 44px",
                transition: "all .2s",
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-.2px",
                transition: "opacity .15s, transform .15s",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(255,255,255,0.08)",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = ".9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
                {lang === "sv" ? "Börja gratis — inget kreditkort" : "Start free — no credit card"}
              </button>
              <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{
                color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "17px 28px",
                fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
                transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                {lang === "sv"
                  ? <><span style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="8" height="8" viewBox="0 0 10 10" fill="rgba(255,255,255,0.7)" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5 L8.5 5 L2 8.5 Z" /></svg></span> Se hur det fungerar</>
                  : <><span style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="8" height="8" viewBox="0 0 10 10" fill="rgba(255,255,255,0.7)" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5 L8.5 5 L2 8.5 Z" /></svg></span> See how it works</>
                }
              </button>
            </div>
          </div>

          {/* Dashboard cards below hero */}
          <div style={{ position: "relative", zIndex: 10, width: "100%", paddingBottom: 80 }}>
            <DashboardCards />
          </div>

          {/* Scroll caret */}
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10, animation: "bounce 2.2s infinite" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────── */}
        <section ref={statsRef} style={{ padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="stats-grid" style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "stretch" }}>
            <HiDemoCard lang={lang} statsVis={statsVis} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { target: 30, suffix: "s", prefix: "< ", lbl: lang === "sv" ? "att personalisera per prospekt" : "to personalise per prospect", grad: "linear-gradient(135deg,#fff 0%,rgba(180,220,255,0.8) 100%)" },
                { target: 94, suffix: "%", prefix: "", lbl: lang === "sv" ? "av köpare föredrar visuella demos" : "of buyers prefer visual demos", grad: "linear-gradient(135deg,#fff 0%,rgba(200,200,255,0.8) 100%)" },
              ].map(({ target, suffix, prefix, lbl, grad }, i) => (
                <AnimatedStat key={i} target={target} suffix={suffix} prefix={prefix} lbl={lbl} visible={statsVis} delay={i * 180} mouseX={mouse.x} mouseY={mouse.y} idx={i} grad={grad} />
              ))}
            </div>
          </div>
        </section>
        {/* ── HUBSPOT-STYLE STEP SLIDESHOW ─────────── */}
        <section id="how-it-works" style={{ padding: "120px 0" }}>
          <div ref={stepsRef} style={{ opacity: stepsVis ? 1 : 0, transform: stepsVis ? "translateY(0)" : "translateY(36px)", transition: "opacity .9s, transform .9s" }}>
            <StepSlideshow />
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────── */}
        <section id="features" style={{ padding: "120px 48px", background: "rgba(0,0,0,0.45)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div ref={featRef} style={{ textAlign: "center", marginBottom: 72, opacity: featVis ? 1 : 0, transform: featVis ? "translateY(0)" : "translateY(28px)", transition: "opacity .8s, transform .8s" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>{lang === "sv" ? "Funktioner" : "Features"}</div>
              <h2 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 800, letterSpacing: "-2px", margin: 0, color: "#fff" }}>
                {lang === "sv" ? "Allt du behöver för att" : "Everything you need"}<br />
                <span style={{ display: "inline-block", animation: "floatPulse 3s ease-in-out infinite", color: "#fff" }}>
                  <CDShimmerText dark={darkMode}>{lang === "sv" ? "sticka ut i inkorgen." : "to stand out in the inbox."}</CDShimmerText>
                </span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
              {[
                { icon: Icon.bolt, title: lang === "sv" ? "Personalisering med ett klick" : "One-click personalisation", desc: lang === "sv" ? "Ladda upp en gång. Logoplacers hämtar automatiskt din prospekts logotyp och placerar den perfekt på din demo — varje gång." : "Upload once. Logoplacers auto-fetches your prospect's logo and places it perfectly on your demo — every single time." },
                { icon: Icon.mail, title: lang === "sv" ? "Skicka direkt från Gmail" : "Send directly from Gmail", desc: lang === "sv" ? "Ansluten till ditt Gmail. Skicka personaliserade demos till hela din prospektlista utan att lämna verktyget." : "Connected to your Gmail. Send personalised demos to your entire prospect list without ever leaving the tool." },
                { icon: Icon.target, title: lang === "sv" ? "Pixelperfekt placering" : "Pixel-perfect placement", desc: lang === "sv" ? "Dra, ändra storlek och placera varje element med precision. Din demo ser exakt ut som du tänkt för varje mottagare." : "Drag, resize and position every element with precision. Your demo looks exactly how you intended for every recipient." },
                { icon: Icon.search, title: lang === "sv" ? "Smart logotypdetektering" : "Smart logo detection", desc: lang === "sv" ? "Skriv ett företagsnamn och Logoplacers hittar och hämtar automatiskt rätt varumärkeslogotyp. Ingen manuell sökning." : "Type a company name and Logoplacers automatically finds and fetches the correct brand logo. No manual searching." },
                { icon: Icon.box, title: lang === "sv" ? "Bulkexport på sekunder" : "Bulk export in seconds", desc: lang === "sv" ? "Generera personaliserade bilder för 50 prospekter på den tid det brukade ta att göra en. ZIP-nedladdning eller direktutskick." : "Generate personalised images for 50 prospects in the time it used to take to do one. ZIP download or direct send." },
                { icon: Icon.lock, title: lang === "sv" ? "Säkert & privat" : "Secure & private", desc: lang === "sv" ? "Dina Gmail-uppgifter och prospektdata lämnar aldrig din webbläsare. Ingen lagring på server överhuvudtaget." : "Your Gmail credentials and prospect data never leave your browser. No server-side storage of any kind." },
              ].map((f, i) => <FeatureCard key={i} {...f} idx={i} visible={featVis} />)}
            </div>
          </div>
        </section>

        {/* ── LIVE DEMO ─────────────────────────────── */}
        <section id="demo" style={{ padding: "120px 48px" }}>
          <LiveDemo />
        </section>

        {/* ── TESTIMONIALS ──────────────────────────── */}
        <section style={{ padding: "100px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
          <div ref={testiRef} style={{ opacity: testiVis ? 1 : 0, transform: testiVis ? "translateY(0)" : "translateY(28px)", transition: "opacity .8s, transform .8s" }}>
            <TestimonialCarousel />
          </div>
        </section>

        {/* ── COMPARISON ────────────────────────────── */}
        <section id="comparison" style={{ padding: "100px 48px" }}>
          <ComparisonTable />
        </section>

        {/* ── EARLY ACCESS ──────────────────────────── */}
        <section id="waitlist" ref={ctaRef} style={{ padding: "140px 48px 160px", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", opacity: ctaVis ? 1 : 0, transform: ctaVis ? "translateY(0)" : "translateY(28px)", transition: "opacity .9s, transform .9s" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 20 }}>{lang === "sv" ? "Tidig åtkomst" : "Early access"}</div>
            <h2 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 16px", color: "#fff" }}>
              <CDShimmerText dark={darkMode}>{lang === "sv" ? "Var först i kön." : "Be first in line."}</CDShimmerText>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", marginBottom: 40, lineHeight: 1.7 }}>
              {lang === "sv" ? "Logoplacers rullar nu ut till tidiga användare. Skriv din e-post och vi hör av oss så snart din plats öppnas." : "Logoplacers is rolling out to early users now. Drop your email and we will reach out as soon as your spot opens."}
            </p>
            <div
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(220,190,255,0.35)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(220,190,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px", backdropFilter: "blur(20px)", transition: "border .2s, box-shadow .2s" }}>
              <WaitlistForm onEnterApp={onEnterApp} />
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{lang === "sv" ? "Inget spam. Inget kreditkort. Bara tidig åtkomst." : "No spam. No credit card. Just early access."}</div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────── */}
        <section id="pricing" style={{ padding: "100px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 14 }}>{t("nav.pricing")}</div>
              <h2 style={{ fontSize: "clamp(28px,5vw,50px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 12px", color: "#fff" }}><CDShimmerText dark={darkMode}>{t("pricing.title")}</CDShimmerText></h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", maxWidth: 380, margin: "0 auto" }}>{t("pricing.sub")}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 12 }}>
              {[
                { name: "Free", price: "Free", period: "", credits: "4 credits / day", features: ["Single export only", "Auto logo fetch", "Gmail send"], highlight: false, cta: lang === "sv" ? "Börja gratis" : "Get started free", priceId: null },
                { name: "SDR", price: "$19", period: "/mo", credits: "300 credits / month", features: ["Bulk send + export", "Auto logo fetch", "Gmail send"], highlight: false, cta: "Get SDR", priceId: "price_1T94U1A1MErAKbCi3MOZydEy" },
                { name: "Sales Pro", price: "$29", period: "/mo", credits: "2 000 credits / month", features: ["Everything in SDR", "Priority support"], highlight: true, cta: "Get Sales Pro", priceId: "price_1T94U1A1MErAKbCiPMitkjPc" },
                { name: "Team", price: "$59", period: "/mo", credits: "10 000 credits / month", features: ["Up to 5 seats", "Everything in Pro"], highlight: false, cta: "Get Team", priceId: "price_1T94U0A1MErAKbCioJt6SdZa" },
              ].map((p, i) => (
                <div key={i} style={{
                  background: p.highlight ? "rgba(220,190,255,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${p.highlight ? "rgba(220,190,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 18, padding: "26px 20px",
                  transform: p.highlight ? "scale(1.03)" : "scale(1)",
                  position: "relative", display: "flex", flexDirection: "column", gap: 9,
                  boxShadow: p.highlight ? "0 0 60px rgba(220,190,255,0.12), 0 0 120px rgba(200,160,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)" : "none",
                }}>
                  {p.highlight && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(105deg,#fff 0%,#e8c8ff 30%,#f8c8ff 60%,#fff 100%)", backgroundSize: "200% auto", animation: "cdShimmer 3s linear infinite", color: "#000", fontSize: 10, fontWeight: 700, letterSpacing: "1px", padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", textTransform: "uppercase" }}>Most popular</div>}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: p.highlight ? "#fff" : "rgba(255,255,255,0.35)" }}>{p.name}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-2px", color: "#fff", lineHeight: 1 }}>{p.price}<span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>{p.period}</span></div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{p.credits}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    {p.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.highlight ? "#fff" : "rgba(255,255,255,0.25)"} strokeWidth="2.5" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { if (!p.priceId) { onEnterApp(); return; } sessionStorage.setItem("lp_pending_price", p.priceId); onEnterApp(); }}
                    style={{ marginTop: 6, background: p.highlight ? "#fff" : p.name === "Free" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.07)", color: p.highlight ? "#000" : "#fff", border: p.highlight ? "none" : p.name === "Free" ? "1px solid rgba(220,190,255,0.3)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", transition: "all .2s", boxShadow: p.name === "Free" ? "0 0 0 0 rgba(220,190,255,0)" : "none" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.boxShadow = p.highlight ? "0 8px 28px rgba(0,0,0,0.25)" : "0 0 20px rgba(220,190,255,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = p.name === "Free" ? "0 0 0 0 rgba(220,190,255,0)" : "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────── */}
        <section id="faq" style={{ padding: "120px 48px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 16 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px", margin: 0, color: "#fff" }}>{lang === "sv" ? "Vanliga frågor." : "Common questions."}</h2>
            </div>
            <div ref={faqRef} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { q: lang === "sv" ? "Lagrar Logoplacers mina Gmail-uppgifter?" : "Does Logoplacers store my Gmail credentials?", a: lang === "sv" ? "Nej. Din Gmail-anslutning använder Googles officiella OAuth-flöde helt i webbläsaren. Vi ser eller lagrar aldrig dina uppgifter eller e-postinnehåll." : "No. Your Gmail connection uses Google's official OAuth flow entirely in the browser. We never see or store your credentials or email content." },
                { q: lang === "sv" ? "Hur många prospekter kan jag personalisera på en gång?" : "How many prospects can I personalise at once?", a: lang === "sv" ? "Det finns ingen hård gräns. Logoplacers genererar bilder för varje prospekt i din lista och exporterar dem som en ZIP, eller skickar dem direkt via Gmail med anti-spam-fördröjningar." : "There is no hard limit. Logoplacers generates images for every prospect in your list and exports them as a ZIP, or sends them directly via Gmail with anti-spam delays." },
                { q: lang === "sv" ? "Vilka bildformat stöds?" : "What image formats does it support?", a: lang === "sv" ? "PNG, JPG, WEBP och HEIC (iPhone-foton). HEIC-filer konverteras automatiskt i webbläsaren — inget externt verktyg behövs." : "PNG, JPG, WEBP and HEIC (iPhone photos). HEIC files are automatically converted in the browser — no external tool needed." },
                { q: lang === "sv" ? "Hur fungerar automatisk logotypdetektering?" : "How does automatic logo detection work?", a: lang === "sv" ? "Skriv ett företagsnamn eller domän och Logoplacers söker i flera logotypdatabaser samtidigt. Det validerar varje resultat och faller tillbaka elegant om ingen logotyp hittas." : "Type a company name or domain and Logoplacers queries multiple logo databases simultaneously. It validates each result and falls back gracefully if a logo cannot be found." },
                { q: lang === "sv" ? "Finns det en gratis provperiod?" : "Is there a free trial?", a: lang === "sv" ? "Ja — gratisplanen ger dig 4 krediter per dag utan kreditkort. Betalplaner börjar på $19/månad för 300 krediter." : "Yes — the Free plan gives you 4 credits per day with no credit card required. Paid plans start at $19/month for 300 credits." },
              ].map((f, i) => <FAQ key={i} {...f} />)}
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────── */}
        <footer role="contentinfo" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={24} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Logoplacers</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={onOpenBlog} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{t("nav.blog")}</button>
            <a href="#privacy" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>{t("footer.privacy")}</a>
            <a href="#terms" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>{t("footer.terms")}</a>
            <a href="mailto:hello@logoplacers.com" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>hello@logoplacers.com</a>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.12)" }}>© 2025 Logoplacers</span>
          </div>
        </footer>

        <style>{`
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes cdShimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes featurePulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes floatPulse { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }

        /* ── Mobile responsive ── */
        @media (max-width: 768px) {
          /* Stats cards: 2x2 */
          .dashboard-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }

          /* Stats section: HiDemoCard + stat boxes stack vertically */
          .stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Step slideshow: text on top, visual below */
          .step-slide-grid { grid-template-columns: 1fr !important; gap: 20px !important; min-height: unset !important; }
          .step-slide-visual { height: 240px !important; }

          /* Step tabs: horizontally scrollable, no wrapping */
          .step-tabs { flex-wrap: nowrap !important; overflow-x: auto !important; justify-content: flex-start !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 4px; }
          .step-tabs::-webkit-scrollbar { display: none; }

          /* Live demo: canvas scrollable, controls below */
          .live-demo-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .live-demo-canvas-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; border-radius: 12px; }
          .live-demo-canvas-wrap canvas { min-width: 480px; height: auto !important; }

          /* Section padding */
          section { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding: 0 16px !important; }

          /* Hide floating dock on mobile */
          .floating-dock { display: none !important; }

          /* Hero padding */
          .hero-section { padding: 80px 20px 60px !important; }
          .hero-h1 { font-size: clamp(32px,8vw,52px) !important; }
        }

        @media (max-width: 480px) {
          .dashboard-cards-grid { gap: 10px !important; }
          .step-slide-visual { height: 200px !important; }
        }

        /* ── Light mode overrides ── */
        [data-theme="light"] nav { background: rgba(248,248,245,0.95) !important; border-bottom: 1px solid rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .floating-dock { background: rgba(248,248,245,0.95) !important; border-color: rgba(0,0,0,0.1) !important; }
        [data-theme="light"] section { border-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] button:not(.shimmer-btn) { border-color: rgba(0,0,0,0.12) !important; }
        [data-theme="light"] [style*="rgba(255,255,255,0.04)"] { background: rgba(0,0,0,0.03) !important; }
        [data-theme="light"] [style*="rgba(255,255,255,0.06)"] { background: rgba(0,0,0,0.05) !important; }
        [data-theme="light"] [style*="rgba(255,255,255,0.07)"] { background: rgba(0,0,0,0.05) !important; }
        [data-theme="light"] [style*="rgba(255,255,255,0.08)"] { background: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] [style*="rgba(255,255,255,0.1)"]  { background: rgba(0,0,0,0.07) !important; }
        [data-theme="light"] [style*="border: 1px solid rgba(255,255,255"] { border-color: rgba(0,0,0,0.1) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.4)"]  { color: rgba(0,0,0,0.45) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.5)"]  { color: rgba(0,0,0,0.5) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.35)"] { color: rgba(0,0,0,0.4) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.3)"]  { color: rgba(0,0,0,0.35) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.25)"] { color: rgba(0,0,0,0.3) !important; }
        [data-theme="light"] [style*="color: rgba(255,255,255,0.2)"]  { color: rgba(0,0,0,0.25) !important; }
        [data-theme="light"] [style*="background: #fff"][style*="color: #000"] { background: #000 !important; color: #fff !important; }
        [data-theme="light"] .ticker-wrap { background: rgba(0,0,0,0.03) !important; border-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] input { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.1) !important; color: #0a0a0a !important; }
        [data-theme="light"] input::placeholder { color: rgba(0,0,0,0.35) !important; }
        [data-theme="light"] table th, [data-theme="light"] table td { background: rgba(0,0,0,0.02) !important; }
        [data-theme="light"] table { border-color: rgba(0,0,0,0.08) !important; }
        html{scroll-behavior:smooth}*{box-sizing:border-box}
        ::placeholder{color:rgba(255,255,255,0.2)}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}
        a{color:inherit}
        section{will-change:transform}
      `}</style>
      </div>
    </DarkModeContext.Provider>
  );
}
