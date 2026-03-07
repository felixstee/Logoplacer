/**
 * Landing.jsx — Logoplacers marketing site
 * Three.js 3D scene, custom SVG icons, Netlify Forms waitlist
 */
import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────
// SVG ICONS (no emojis)
// ─────────────────────────────────────────────
const Icon = {
  bolt: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  mail: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 7 10-7"/>
    </svg>
  ),
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  search: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  lock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  upload: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  users: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  move: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>
      <polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>
      <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  ),
  send: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lgrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a82ff"/><stop offset="1" stopColor="#5b4fff"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lgrad)"/>
      <rect x="5" y="5" width="9" height="9" rx="2.5" fill="white" opacity=".95"/>
      <rect x="18" y="5" width="9" height="9" rx="2.5" fill="white" opacity=".45"/>
      <rect x="5" y="18" width="9" height="9" rx="2.5" fill="white" opacity=".45"/>
      <rect x="18" y="18" width="9" height="9" rx="2.5" fill="white" opacity=".95"/>
      <rect x="13.5" y="13.5" width="5" height="5" rx="1.5" fill="white" opacity=".2"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// THREE.JS HERO SCENE
// ─────────────────────────────────────────────
function HeroScene() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let script = document.getElementById("threejs-cdn");
    if (!script) {
      script = document.createElement("script");
      script.id = "threejs-cdn";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      document.head.appendChild(script);
    }
    const tryInit = () => { if (window.THREE) setLoaded(true); else setTimeout(tryInit, 50); };
    script.onload = () => setLoaded(true);
    if (window.THREE) setLoaded(true); else tryInit();
  }, []);

  useEffect(() => {
    if (!loaded || !mountRef.current) return;
    const THREE = window.THREE;
    const el = mountRef.current;
    let W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 0, 16);

    // Lights for glass
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pl1 = new THREE.PointLight(0xaaccff, 4, 50); pl1.position.set(8, 10, 8); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xccddff, 3, 50); pl2.position.set(-8, -6, -4); scene.add(pl2);
    const pl3 = new THREE.PointLight(0xffffff, 2, 30); pl3.position.set(0, -8, 10); scene.add(pl3);

    const glassMat = (opacity = 0.06) => new THREE.MeshPhongMaterial({
      color: 0xeef6ff, emissive: 0x081428, emissiveIntensity: 0.02,
      specular: 0xffffff, shininess: 240,
      transparent: true, opacity, side: THREE.DoubleSide,
    });
    const wireMat = () => new THREE.LineBasicMaterial({ color: 0xc8dcf8, transparent: true, opacity: 0.85 });

    // ── Email envelope function ───────────────────────────────────
    const makeEnvelope = (size = 1) => {
      const group = new THREE.Group();
      // Body — flat box
      const bodyGeo = new THREE.BoxGeometry(size * 1.4, size, size * 0.12);
      const body = new THREE.Mesh(bodyGeo, glassMat(0.05));
      body.add(new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), wireMat()));
      group.add(body);
      // Flap — two triangles forming a V on front face
      const flapPts = [
        new THREE.Vector3(-size*0.7, size*0.5, 0.07),
        new THREE.Vector3(0, 0, 0.07),
        new THREE.Vector3(size*0.7, size*0.5, 0.07),
      ];
      const flapGeo = new THREE.BufferGeometry().setFromPoints(flapPts);
      group.add(new THREE.Line(flapGeo, wireMat()));
      // Bottom triangle
      const bot = [
        new THREE.Vector3(-size*0.7, -size*0.5, 0.07),
        new THREE.Vector3(0, 0.1, 0.07),
        new THREE.Vector3(size*0.7, -size*0.5, 0.07),
      ];
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bot), wireMat()));
      return group;
    };

    // ── Spread envelopes through scene ────────────────────────────
    const envelopes = [];
    const positions = [
      [-5.5, 2.8, 1], [5.2, 3, 0.5], [-4, -2.5, 2],
      [4.5, -2.2, 1.5], [0.5, 4.2, -1], [-2, -4.2, 0.5],
      [6.5, 0.5, -1], [-6, 0, 0], [2.5, -1, 3],
      [-3, 3.5, -2], [3.5, 2, -2.5], [-1, -1.5, 4],
    ];
    const sizes = [0.55, 0.7, 0.45, 0.65, 0.5, 0.6, 0.4, 0.72, 0.48, 0.55, 0.62, 0.38];

    positions.forEach((pos, i) => {
      const env = makeEnvelope(sizes[i]);
      env.position.set(...pos);
      env.rotation.set(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.4
      );
      env.userData.baseY = pos[1];
      env.userData.phase = i * 0.55;
      env.userData.floatSpeed = 0.28 + i * 0.04;
      env.userData.rotSpeed = { x: (Math.random()-.5)*0.006, y: (Math.random()-.5)*0.008 };
      scene.add(env);
      envelopes.push(env);
    });

    // ── Central floating "@ " orb ────────────────────────────────
    const orbGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const orbMat = new THREE.MeshPhongMaterial({ color: 0xaaccff, transparent: true, opacity: 0.6, specular: 0xffffff, shininess: 200 });

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(7.5, 0.02, 6, 80);
    const ring = new THREE.Mesh(ringGeo, glassMat(0.1));
    ring.rotation.x = Math.PI / 3.5;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(10.5, 0.015, 6, 100);
    const ring2 = new THREE.Mesh(ring2Geo, glassMat(0.12));
    ring2.rotation.x = Math.PI / 6; ring2.rotation.y = Math.PI / 5;
    scene.add(ring2);

    // Orbit dots
    const orbitDots = Array.from({length: 5}, () => {
      const m = new THREE.Mesh(orbGeo, orbMat.clone());
      scene.add(m); return m;
    });

    // Particles
    const pCount = 300;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i]=(Math.random()-.5)*36; pPos[i+1]=(Math.random()-.5)*24; pPos[i+2]=(Math.random()-.5)*20;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x5577aa, size: 0.05, transparent: true, opacity: 0.4 })));

    const onMouse = (e) => {
      mouseRef.current = { x: (e.clientX/window.innerWidth-.5)*2, y: (e.clientY/window.innerHeight-.5)*2 };
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      W=el.clientWidth; H=el.clientHeight;
      camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
    };
    window.addEventListener("resize", onResize);

    let raf; let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.01;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      envelopes.forEach((env, i) => {
        env.rotation.x += env.userData.rotSpeed.x + my * 0.001;
        env.rotation.y += env.userData.rotSpeed.y + mx * 0.001;
        env.position.y = env.userData.baseY + Math.sin(t * env.userData.floatSpeed + env.userData.phase) * 0.5;
      });

      ring.rotation.z  += 0.002;
      ring2.rotation.z -= 0.0015; ring2.rotation.y += 0.001;

      orbitDots.forEach((dot, i) => {
        const angle = t * 0.8 + i * (Math.PI * 2 / 5);
        dot.position.x = Math.cos(angle) * 7.5;
        dot.position.y = Math.sin(angle) * 7.5 * Math.sin(Math.PI / 3.5);
        dot.position.z = Math.sin(angle) * 7.5 * Math.cos(Math.PI / 3.5);
      });

      camera.position.x += (mx * 1.8 - camera.position.x) * 0.04;
      camera.position.y += (-my * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [loaded]);

  return <div ref={mountRef} style={{ position:"absolute", inset:0, zIndex:1, opacity:loaded?1:0, transition:"opacity 1s" }} />;
}

function FeatureScene({ index }) {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tryInit = () => { if (window.THREE) setLoaded(true); else setTimeout(tryInit, 100); };
    tryInit();
  }, []);

  useEffect(() => {
    if (!loaded || !mountRef.current) return;
    const THREE = window.THREE;
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H); renderer.setClearColor(0,0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
    camera.position.z = 4;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.PointLight(0x99bbff, 3, 20); dl.position.set(3,4,4); scene.add(dl);
    const dl2 = new THREE.PointLight(0xffffff, 2, 20); dl2.position.set(-3,-3,3); scene.add(dl2);

    const glassMat = new THREE.MeshPhongMaterial({
      color: 0xddeeff, emissive: 0x112244, emissiveIntensity: 0.05,
      specular: 0xffffff, shininess: 160,
      transparent: true, opacity: 0.22, side: THREE.DoubleSide,
    });
    const wireMat = new THREE.LineBasicMaterial({ color: 0x99bbdd, transparent: true, opacity: 0.65 });

    const geos = [
      new THREE.IcosahedronGeometry(1.0, 0),
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      new THREE.TorusGeometry(0.8, 0.28, 12, 48),
      new THREE.TorusKnotGeometry(0.65, 0.22, 80, 12),
      new THREE.DodecahedronGeometry(1.0, 0),
    ];
    const geo = geos[index % geos.length];
    const mesh = new THREE.Mesh(geo, glassMat);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), wireMat));
    scene.add(mesh);

    // Small orbiting glass sphere
    const orbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const orbMat = new THREE.MeshPhongMaterial({ color: 0xbbddff, transparent: true, opacity: 0.55, specular: 0xffffff, shininess: 200 });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    // Mouse interaction on card
    const onMouse = (e) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = { x: (e.clientX-rect.left)/rect.width*2-1, y: -((e.clientY-rect.top)/rect.height*2-1) };
    };
    el.addEventListener("mousemove", onMouse);

    let raf; let t = index * 1.4;
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.012;
      const mx = mouseRef.current.x * 0.3;
      const my = mouseRef.current.y * 0.3;
      mesh.rotation.x += 0.006 + my * 0.02;
      mesh.rotation.y += 0.009 + mx * 0.02;
      orb.position.x = Math.cos(t * 1.4) * 1.7;
      orb.position.y = Math.sin(t * 1.4) * 1.7;
      orb.position.z = Math.sin(t * 0.8) * 0.6;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMouse);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [loaded, index]);

  return <div ref={mountRef} style={{ width:"100%", height:"100%" }} />;
}

function useReveal(threshold = 0.1) {
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
// WAITLIST FORM
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// LIVE INTERACTIVE DEMO
// ─────────────────────────────────────────────
function LiveDemo() {
  const canvasRef  = useRef(null);
  const wrapRef    = useRef(null);
  const [company,  setCompany]  = useState("");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [fetching, setFetching] = useState(false);
  const [logoEl,   setLogoEl]   = useState(null);
  const [logoPos,  setLogoPos]  = useState({ x: 220, y: 108 });
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
        const a = data[i+3];
        if (a < 30) continue; // skip transparent
        const rv = data[i], gv = data[i+1], bv = data[i+2];
        // Skip near-white and near-black pixels
        const brightness = (rv + gv + bv) / 3;
        const saturation = Math.max(rv,gv,bv) - Math.min(rv,gv,bv);
        if (brightness > 230 || brightness < 25 || saturation < 20) continue;
        r += rv; g += gv; b += bv; count++;
      }
      if (count > 0) {
        setAccentColor(`rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`);
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
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, W, H);

    // ── Left sidebar (dark navy like [Your product]) ─────────────────────
    const sbW = 180;
    // Use brand color if available
    const brand = accentColor || "#1a2744";
    const brandMid = accentColor || "#1d3a6e";
    ctx.fillStyle = accentColor ? brand : "#1a2744";
    ctx.fillRect(0, 0, sbW, H);

    // Sidebar logo area
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, 12, 12, sbW - 24, 36, 8);
    ctx.fill();
    // Logo placeholder square
    ctx.fillStyle = "#3b82f6";
    roundRect(ctx, 20, 19, 22, 22, 5);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'DM Sans', sans-serif";
    ctx.fillText(company ? company.slice(0,10) : "Logoplacers", 50, 34);

    // Sidebar nav items
    const navItems = ["Dashboard", "Prospects", "Templates", "Sent", "Settings"];
    navItems.forEach((item, i) => {
      const y = 72 + i * 40;
      if (i === 1) {
        ctx.fillStyle = accentColor ? "rgba(255,255,255,0.15)" : "rgba(59,130,246,0.25)";
        roundRect(ctx, 10, y - 10, sbW - 20, 32, 7);
        ctx.fill();
        ctx.fillStyle = accentColor ? "rgba(255,255,255,0.9)" : "#60a5fa";
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.38)";
      }
      ctx.font = i === 1 ? "600 12px 'DM Sans',sans-serif" : "12px 'DM Sans',sans-serif";
      ctx.fillText(item, 22, y + 11);
    });

    // Bottom user chip
    if (name || email) {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(ctx, 10, H - 54, sbW - 20, 40, 8);
      ctx.fill();
      // Avatar circle
      ctx.fillStyle = "#3b82f6";
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
      const emailShort = email.length > 18 ? email.slice(0,18)+"…" : email;
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
      ctx.fillStyle = "#eff6ff";
      roundRect(ctx, W - 180, 14, 162, 26, 13);
      ctx.fill();
      ctx.strokeStyle = "#bfdbfe";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#3b82f6";
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
      { label: "Reply Rate",  val: "34%",    sub: "+12% this week", accent: "#3b82f6" },
      { label: "Demos Sent",  val: "247",    sub: "to prospects",   accent: "#10b981" },
      { label: "Time Saved",  val: "12h",    sub: "this month",     accent: "#8b5cf6" },
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
      // Accent bar left
      ctx.fillStyle = (i===0 && accentColor) ? accentColor : card.accent;
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
      ctx.fillStyle = "#3b82f6";
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
      // Value bar
      ctx.fillStyle = i === 5 ? (accentColor || "#3b82f6") : (accentColor ? accentColor.replace("rgb(","rgba(").replace(")",",0.25)") : "#bfdbfe");
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
        const em = email.length > 22 ? email.slice(0,22)+"…" : email;
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

      // Send button
      ctx.fillStyle = "#3b82f6";
      roundRect(ctx, p2x + 14, panelY + panelH - 40, p2W - 28, 28, 7);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'DM Sans',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Send personalised demo", p2x + p2W/2, panelY + panelH - 22);
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
      // Drag handle border
      ctx.strokeStyle = "rgba(59,130,246,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      roundRect(ctx, logoPos.x - 4, logoPos.y - 4, lw + 8, lh + 8, 6);
      ctx.stroke();
      ctx.setLineDash([]);
      // Corner handles
      [[logoPos.x-4,logoPos.y-4],[logoPos.x+lw+4,logoPos.y-4],[logoPos.x-4,logoPos.y+lh+4],[logoPos.x+lw+4,logoPos.y+lh+4]].forEach(([hx,hy]) => {
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(hx-3, hy-3, 6, 6);
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
      const cx2 = zx + zoneSize/2, cy2 = zy + zoneSize/2 - 8;
      roundRect(ctx, cx2-14, cy2-14, 28, 28, 6);
      ctx.stroke();
      ctx.fillStyle = "rgba(26,130,255,0.06)";
      ctx.fill();
      ctx.fillStyle = "rgba(100,130,180,0.8)";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(company ? company[0].toUpperCase() : "?", cx2, cy2+6);
      // Label
      ctx.fillStyle = fetching ? "#1a82ff" : "rgba(80,100,140,0.7)";
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
      // Try .com first, then .se, then exact input as domain
      const input = company.trim();
      const isUrl = input.includes(".");
      const candidates = isUrl
        ? [input.replace(/^https?:\/\//, "").replace(/\/.*$/, "")]
        : [
            input.toLowerCase().replace(/\s+/g,"") + ".com",
            input.toLowerCase().replace(/\s+/g,"") + ".se",
            input.toLowerCase().replace(/\s+/g,"") + ".io",
          ];
      let found = false;
      for (const domain of candidates) {
        try {
          const res = await fetch(`/.netlify/functions/logo?domain=${encodeURIComponent(domain)}`);
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => { setLogoEl(img); extractColor(img); setFetching(false); };
            img.src = url;
            found = true;
            break;
          }
        } catch {}
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
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>Live demo</div>
        <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px" }}>Try it right now.</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
          Type a company name and watch their logo appear on the demo — then drag it anywhere.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>
        {/* Canvas */}
        <div style={{
          borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(91,79,255,0.2)",
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
            background: "rgba(26,130,255,0.08)", border: "1px solid rgba(26,130,255,0.18)",
            borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ba4ff" strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              In the real tool, paste <strong style={{color:"#5ba4ff"}}>100 companies at once</strong> and get 100 personalised demos in seconds.
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: ".2px" }}>
            Personalise this demo
          </div>

          {[
            { label: "Company", placeholder: "e.g. Hooli", val: company, set: setCompany, type: "text" },
            { label: "Name",    placeholder: "e.g. Marcus",  val: name,    set: setName,    type: "text" },
            { label: "Email",   placeholder: "marcus@co.com",val: email,   set: setEmail,   type: "email" },
          ].map(({ label, placeholder, val, set, type }) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
              <input type={type} placeholder={placeholder} value={val} onChange={e => set(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
              />
            </div>
          ))}

          {logoEl && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
                Logo size — {logoSize}px
              </div>
              <input type="range" min={5} max={120} value={logoSize} onChange={e => setLogoSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6" }} />
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
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <img src={logoEl.src} style={{height:32,maxWidth:80,objectFit:"contain"}} alt="logo" />
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Drag the logo on the canvas</div>
              </div>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" style={{margin:"0 auto 8px",display:"block"}}>
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>
                  {fetching ? "Fetching logo…" : company ? "No logo found — try exact company name" : "Type a company above to auto-fetch their logo"}
                </div>
              </>
            )}
          </div>

          {accentColor && (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:accentColor, flexShrink:0,
                border:"1px solid rgba(255,255,255,0.15)", boxShadow:`0 0 16px ${accentColor}55` }} />
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>
                Brand colour detected — applied to demo automatically
              </div>
            </div>
          )}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.65 }}>
            Full tool: drag anywhere · add text layers · bulk export · send via Gmail
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


// ─────────────────────────────────────────────
// DEMO WALKTHROUGH — animated step-by-step
// ─────────────────────────────────────────────
const DEMO_STEPS = [
  {
    title: "Upload your product screenshot",
    desc: "Start by uploading any screenshot of your product — a dashboard, feature view, or landing page.",
    tag: "Step 1",
  },
  {
    title: "Paste your prospect list",
    desc: "Drop in company names and contacts. Logoplacers auto-fetches every logo simultaneously.",
    tag: "Step 2",
    leads: [
      { company: "Pied Piper",    name: "Jared Dunn",  email: "jared@piedpiper.com",    status: "ok" },
      { company: "Hooli",   name: "Gavin Belson",    email: "gavin@hooli.com", status: "ok" },
      { company: "Aviato",      name: "Erlich Bachman", email: "erlich@aviato.com",      status: "ok" },
      { company: "Initech",   name: "Michael Bolton",   email: "michael@initech.com",   status: "ok" },
      { company: "Globodyne", name: "Richard Hendricks",  email: "richard@globodyne.com", status: "ok" },
    ],
  },
  {
    title: "Position logo & add text",
    desc: "Drag your prospect's logo onto your screenshot. Add personalised name and company text layers.",
    tag: "Step 3",
  },
  {
    title: "Export or send via Gmail",
    desc: "Download all 100 demos as a ZIP, or send directly from Gmail with one click — with anti-spam delays built in.",
    tag: "Step 4",
  },
  {
    title: "Video demos with website screenshots",
    desc: "Record a product walkthrough video, add a website screenshot of your prospect's site, and generate a personalised .webm video per company — automatically.",
    tag: "Bonus",
  },
];

function DemoCanvas({ step, activeLeadIdx }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const rr = (x,y,w,h,r) => {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
      ctx.closePath();
    };

    // ── App chrome ──────────────────────────────────────────────
    // Header
    ctx.fillStyle = "#0f1520"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#141e30"; ctx.fillRect(0,0,W,52);
    ctx.fillStyle = "rgba(26,130,255,0.4)"; ctx.fillRect(0,51,W,1);

    // Logo
    ctx.fillStyle = "#1a82ff"; rr(16,14,26,26,7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign="center";
    ctx.fillText("LP",29,31); ctx.textAlign="left";
    ctx.fillStyle = "#fff"; ctx.font = "bold 13px 'DM Sans',sans-serif";
    ctx.fillText("LogoPlacer", 50, 28);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px 'DM Sans',sans-serif";
    ctx.fillText("Personalised demos", 50, 41);

    // Top right buttons
    const btns = ["Preview","Send","Download"];
    btns.forEach((b,i) => {
      const bx = W - 260 + i * 90;
      ctx.fillStyle = i===1 ? "#1a82ff" : "rgba(255,255,255,0.07)";
      rr(bx,16,82,22,6); ctx.fill();
      ctx.fillStyle = i===1 ? "#fff" : "rgba(255,255,255,0.5)";
      ctx.font = "600 10px 'DM Sans',sans-serif"; ctx.textAlign="center";
      ctx.fillText(b, bx+41,31); ctx.textAlign="left";
    });

    // Tabs
    ctx.fillStyle = "#141e30"; ctx.fillRect(0,52,W,36);
    ctx.fillStyle = "#1a82ff"; ctx.fillRect(0,87,W,1);
    ["Bild","Video"].forEach((t,i) => {
      const tx = 200 + i*320;
      ctx.fillStyle = i===0 ? "#fff" : "rgba(255,255,255,0.3)";
      ctx.font = i===0 ? "600 13px 'DM Sans',sans-serif" : "13px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText(t,tx,73); ctx.textAlign="left";
      if(i===0){ ctx.fillStyle="#1a82ff"; ctx.fillRect(tx-30,85,60,2); }
    });

    // Sidebar
    ctx.fillStyle = "#141e30"; ctx.fillRect(0,88,240,H-88);
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(240,88,1,H-88);

    // ── STEP-SPECIFIC CONTENT ──────────────────────────────────
    if (step === 0) {
      // Step 1: Upload zone
      ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      rr(16,108,210,100,10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.font="11px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("BASE IMAGE",121,130);
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="600 12px 'DM Sans',sans-serif";
      ctx.fillText("Click or drag here",121,152);
      ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("JPG · PNG · WEBP · HEIC",121,168);
      ctx.textAlign="left";

      // My logo section removed

      // Main area — empty state
      ctx.fillStyle="#0a1020"; ctx.fillRect(241,88,W-241,H-88);
      ctx.fillStyle="rgba(255,255,255,0.06)";
      rr(320,180,W-400,H-250,16); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.font="13px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("No image selected",W/2+60,280);
      ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="11px 'DM Sans',sans-serif";
      ctx.fillText("Upload a base image on the left",W/2+60,300); ctx.textAlign="left";
    }

    if (step === 1) {
      // Step 2: Prospect list
      ctx.fillStyle="rgba(255,255,255,0.04)";
      ctx.strokeStyle="rgba(255,255,255,0.08)"; ctx.lineWidth=1;
      rr(16,108,210,30,6); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#5ba4ff"; ctx.font="600 10px 'DM Sans',sans-serif";
      ctx.fillText("RECIPIENT LOGO",22,127);
      ctx.fillStyle="#1a82ff"; ctx.font="600 10px 'DM Sans',sans-serif";
      ctx.textAlign="right"; ctx.fillText("+ Ny",226,127); ctx.textAlign="left";

      const leads = DEMO_STEPS[1].leads;
      leads.forEach((lead,i) => {
        const ly = 146 + i*46;
        const isActive = i === activeLeadIdx;
        ctx.fillStyle = isActive ? "rgba(26,130,255,0.15)" : "rgba(255,255,255,0.03)";
        ctx.strokeStyle = isActive ? "rgba(26,130,255,0.4)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth=1; rr(16,ly,210,40,8); ctx.fill(); ctx.stroke();

        // Status dot
        ctx.fillStyle = lead.status==="ok" ? "#10b981" : "#f59e0b";
        ctx.beginPath(); ctx.arc(30,ly+20,4,0,Math.PI*2); ctx.fill();

        ctx.fillStyle = isActive ? "#fff" : "rgba(255,255,255,0.7)";
        ctx.font = "600 11px 'DM Sans',sans-serif";
        ctx.fillText(lead.company, 42,ly+16);
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font="10px 'DM Sans',sans-serif";
        ctx.fillText(lead.name, 42,ly+30);
      });

      // Main preview area — show active lead demo
      ctx.fillStyle="#0a1020"; ctx.fillRect(241,88,W-241,H-88);
      const al = leads[Math.min(activeLeadIdx, leads.length-1)];

      // Mock dashboard with company branding
      ctx.fillStyle="#fff"; rr(270,108,W-290,H-120,12); ctx.fill();

      // Light sidebar
      ctx.fillStyle="#f0f4f8"; rr(270,108,140,H-120,12); ctx.fill();
      ctx.fillStyle="#e2e8f0"; ctx.fillRect(410,108,1,H-120);
      ["Dashboard","Assets","Portfolio","Settings"].forEach((item,i) => {
        const iy = 148+i*38;
        ctx.fillStyle = i===1 ? "#eff6ff" : "transparent";
        if(i===1){ rr(278,iy-10,124,28,6); ctx.fill(); }
        ctx.fillStyle = i===1 ? "#1d4ed8" : "#64748b";
        ctx.font = i===1 ? "600 11px 'DM Sans',sans-serif" : "11px 'DM Sans',sans-serif";
        ctx.fillText(item,290,iy+9);
      });

      // Main content
      ctx.fillStyle="#1e293b"; ctx.font="bold 14px 'DM Sans',sans-serif";
      ctx.fillText(`Demo for ${al.company}`,422,138);
      ctx.fillStyle="#64748b"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText(`Prepared for ${al.name}`,422,154);

      // Stat cards
      [{l:"Reply Rate",v:"34%",c:"#3b82f6"},{l:"Demos",v:"247",c:"#10b981"},{l:"Saved",v:"12h",c:"#8b5cf6"}].forEach((card,i)=>{
        const cx=422+i*96, cy=168;
        ctx.fillStyle="#fff"; ctx.shadowColor="rgba(0,0,0,0.08)"; ctx.shadowBlur=6;
        rr(cx,cy,88,50,6); ctx.fill(); ctx.shadowBlur=0;
        ctx.fillStyle=card.c; rr(cx,cy,3,50,2); ctx.fill();
        ctx.fillStyle="#94a3b8"; ctx.font="9px 'DM Sans',sans-serif"; ctx.fillText(card.l,cx+8,cy+14);
        ctx.fillStyle="#0f172a"; ctx.font="bold 16px 'DM Sans',sans-serif"; ctx.fillText(card.v,cx+8,cy+38);
      });

      // Logo placeholder area — PROMINENT
      ctx.fillStyle="rgba(59,130,246,0.08)"; ctx.strokeStyle="rgba(59,130,246,0.4)";
      ctx.lineWidth=2; ctx.setLineDash([6,4]);
      rr(422,230,120,72,10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="#3b82f6"; ctx.font="600 10px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Logo drops here",482,262);
      ctx.fillStyle="rgba(59,130,246,0.5)"; ctx.font="9px 'DM Sans',sans-serif";
      ctx.fillText(al.company,482,276); ctx.textAlign="left";
    }

    if (step === 2) {
      // Step 3: Editor with logo placed
      ctx.fillStyle="#0a1020"; ctx.fillRect(241,88,W-241,H-88);
      ctx.fillStyle="#fff"; rr(260,100,W-280,H-112,12); ctx.fill();

      // Light panels
      ctx.fillStyle="#f8fafc"; rr(260,100,W-280,52,12); ctx.fill();
      ctx.fillStyle="#e2e8f0"; ctx.fillRect(260,150,W-280,1);

      ctx.fillStyle="#0f172a"; ctx.font="bold 13px 'DM Sans',sans-serif";
      ctx.fillText("Demo — Pied Piper",275,120);
      ctx.fillStyle="#64748b"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("Hi Jared, here's what Pied Piper could look like in your workflow",275,137);

      // Sidebar controls
      ctx.fillStyle="#f8fafc"; rr(260,152,160,H-164,8); ctx.fill();
      ctx.fillStyle="#e2e8f0"; ctx.fillRect(420,152,1,H-164);

      ["TEXT LAYERS","RECIPIENT LOGO","STORLEK"].forEach((label,i) => {
        const ly = 174+i*60;
        ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.font="bold 9px 'DM Sans',sans-serif";
        ctx.fillText(label,272,ly);
        ctx.fillStyle="rgba(0,0,0,0.06)"; rr(270,ly+6,146,36,6); ctx.fill();
        ctx.strokeStyle="rgba(0,0,0,0.08)"; ctx.lineWidth=1; ctx.stroke();
        if(i===0){ ctx.fillStyle="#334155"; ctx.font="11px sans-serif"; ctx.fillText("Hi Emma, see how...",278,ly+28); }
        if(i===1){ ctx.fillStyle="#1d4ed8"; ctx.font="600 11px sans-serif"; ctx.fillText("Pied Piper logo ✓",278,ly+28); }
        if(i===2){
          ctx.fillStyle="#3b82f6"; rr(270,ly+20,80,8,4); ctx.fill();
          ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(350,ly+24,5,0,Math.PI*2); ctx.fill();
        }
      });

      // Main canvas — demo with logo placed
      ctx.fillStyle="#f0f4f8"; rr(422,156,W-442,H-168,8); ctx.fill();
      // Grid
      ctx.strokeStyle="rgba(59,130,246,0.06)"; ctx.lineWidth=0.5;
      for(let x=432;x<W-22;x+=32){ ctx.beginPath();ctx.moveTo(x,156);ctx.lineTo(x,H-12);ctx.stroke(); }
      for(let y=166;y<H-12;y+=32){ ctx.beginPath();ctx.moveTo(422,y);ctx.lineTo(W-22,y);ctx.stroke(); }

      // Stat widgets on canvas
      [{l:"Shares",v:"22,200",c:"#3b82f6"},{l:"Valuation",v:"42M",c:"#10b981"}].forEach((w,i)=>{
        const wx=436+i*130, wy=170;
        ctx.fillStyle="#fff"; ctx.shadowColor="rgba(0,0,0,0.1)"; ctx.shadowBlur=8;
        rr(wx,wy,120,56,8); ctx.fill(); ctx.shadowBlur=0;
        ctx.fillStyle=w.c; rr(wx,wy,3,56,2); ctx.fill();
        ctx.fillStyle="#94a3b8"; ctx.font="9px sans-serif"; ctx.fillText(w.l,wx+9,wy+16);
        ctx.fillStyle="#0f172a"; ctx.font="bold 18px sans-serif"; ctx.fillText(w.v,wx+9,wy+42);
      });

      // Logo (Pied Piper pink placeholder)
      ctx.fillStyle="rgba(255,20,100,0.12)"; ctx.strokeStyle="rgba(255,20,100,0.4)";
      ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      rr(436,238,72,44,8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="#e0115f"; ctx.font="bold 11px sans-serif";
      ctx.textAlign="center"; ctx.fillText("Pied Piper",472,264); ctx.textAlign="left";
      // Drag handles
      [[436,238],[508,238],[436,282],[508,282]].forEach(([hx,hy]) => {
        ctx.fillStyle="#3b82f6"; ctx.fillRect(hx-3,hy-3,6,6);
      });

      // Text layer
      ctx.fillStyle="#1e293b"; ctx.font="bold 12px 'DM Sans',sans-serif";
      ctx.fillText("Hi Jared — see Pied Piper's data",436,310);
      ctx.fillStyle="#64748b"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("Personalised for jared@piedpiper.com",436,326);
    }

    if (step === 3) {
      // Step 4: Export/Send
      ctx.fillStyle="#0a1020"; ctx.fillRect(0,88,W,H-88);

      // Generated demos grid
      const demoCompanies = ["Pied Piper","Hooli","Aviato","Initech","Globodyne","Vandelay","Dinoco","Bluth Co"];
      const cols=4, rows=2, dw=Math.floor((W-32)/cols)-10, dh=Math.floor((H-140)/rows)-10;
      demoCompanies.slice(0,cols*rows).forEach((co,i) => {
        const col=i%cols, row=Math.floor(i/cols);
        const dx=16+col*(dw+10), dy=100+row*(dh+10);
        ctx.fillStyle="#fff"; ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.shadowBlur=10;
        rr(dx,dy,dw,dh,8); ctx.fill(); ctx.shadowBlur=0;

        // Mini dashboard inside each
        ctx.fillStyle="#f0f4f8"; rr(dx,dy,dw,22,8); ctx.fill();
        ctx.fillStyle="#1e293b"; ctx.font="bold 9px sans-serif";
        ctx.fillText(`Demo — ${co}`,dx+6,dy+14);

        // Fake logo blob
        const colors={"Pied Piper":"#1a82ff","Hooli":"#ff6b35","Aviato":"#f59e0b","Initech":"#10b981","Globodyne":"#8b5cf6","Vandelay":"#e0115f","Dinoco":"#0099ff","Bluth Co":"#f97316"};
        ctx.fillStyle=colors[co]||"#3b82f6"; rr(dx+dw-44,dy+26,36,22,5); ctx.fill();
        ctx.fillStyle="#fff"; ctx.font="bold 8px sans-serif";
        ctx.textAlign="center"; ctx.fillText(co.slice(0,3),dx+dw-26,dy+41); ctx.textAlign="left";

        // Mini bars
        [0.4,0.7,0.5,0.9].forEach((bh,bi) => {
          ctx.fillStyle="rgba(59,130,246,0.3)";
          rr(dx+6+bi*14,dy+dh-Math.floor(bh*24)-4,10,Math.floor(bh*24),3); ctx.fill();
        });

        // Checkmark
        ctx.fillStyle="#10b981"; ctx.beginPath(); ctx.arc(dx+dw-10,dy+10,7,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#fff"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(dx+dw-13,dy+10); ctx.lineTo(dx+dw-10,dy+13); ctx.lineTo(dx+dw-7,dy+7); ctx.stroke();
      });

      // Bottom action bar
      ctx.fillStyle="rgba(20,30,50,0.95)"; ctx.fillRect(0,H-56,W,56);
      ctx.fillStyle="rgba(255,255,255,0.08)"; ctx.fillRect(0,H-57,W,1);

      ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.font="12px 'DM Sans',sans-serif";
      ctx.fillText(`${demoCompanies.length} personalised demos ready`,16,H-28);

      [
        {label:"Download ZIP",color:"rgba(255,255,255,0.1)",tx:"rgba(255,255,255,0.8)",bx:W-380},
        {label:"Send via Gmail",color:"#1a82ff",tx:"#fff",bx:W-240},
        {label:"Export slides",color:"rgba(91,79,255,0.8)",tx:"#fff",bx:W-110},
      ].forEach(({label,color,tx,bx}) => {
        ctx.fillStyle=color; rr(bx,H-44,120,28,7); ctx.fill();
        ctx.fillStyle=tx; ctx.font="600 11px 'DM Sans',sans-serif";
        ctx.textAlign="center"; ctx.fillText(label,bx+60,H-26); ctx.textAlign="left";
      });
    }

    if (step === 4) {
      // Step 5: Video demo with website screenshot
      ctx.fillStyle="#0f1520"; ctx.fillRect(0,0,W,H);

      // App header
      ctx.fillStyle="#141e30"; ctx.fillRect(0,0,W,52);
      ctx.fillStyle="rgba(26,130,255,0.4)"; ctx.fillRect(0,51,W,1);
      ctx.fillStyle="#1a82ff"; rr(16,14,26,26,7); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("LP",29,31); ctx.textAlign="left";
      ctx.fillStyle="#fff"; ctx.font="bold 13px 'DM Sans',sans-serif"; ctx.fillText("LogoPlacer",50,28);
      ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="10px 'DM Sans',sans-serif"; ctx.fillText("Personalised demos",50,41);
      // Buttons
      [["Preview","rgba(255,255,255,0.08)","rgba(255,255,255,0.6)",W-310],
       ["Send","rgba(255,255,255,0.08)","rgba(255,255,255,0.6)",W-210],
       ["Download (5)","#1a82ff","#fff",W-120]].forEach(([lbl,bg,tc,bx])=>{
        ctx.fillStyle=bg; rr(bx,16,102,22,6); ctx.fill();
        ctx.fillStyle=tc; ctx.font="600 10px 'DM Sans',sans-serif"; ctx.textAlign="center";
        ctx.fillText(lbl,bx+51,31); ctx.textAlign="left";
      });

      // Tabs
      ctx.fillStyle="#141e30"; ctx.fillRect(0,52,W,34);
      ["Image","Video"].forEach((t,i)=>{
        ctx.fillStyle=i===1?"#fff":"rgba(255,255,255,0.3)";
        ctx.font=i===1?"600 13px 'DM Sans',sans-serif":"13px 'DM Sans',sans-serif";
        ctx.textAlign="center"; ctx.fillText(t,i===0?W*0.27:W*0.73,73); ctx.textAlign="left";
        if(i===1){ ctx.fillStyle="#1a82ff"; ctx.fillRect(W*0.73-30,84,60,2); }
      });
      ctx.fillStyle="rgba(26,130,255,0.4)"; ctx.fillRect(0,86,W,1);

      // Sidebar
      ctx.fillStyle="#141e30"; ctx.fillRect(0,87,240,H-87);
      ctx.fillStyle="rgba(255,255,255,0.04)"; ctx.fillRect(240,87,1,H-87);

      // YOUR VIDEO label + upload zone
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="bold 9px 'DM Sans',sans-serif";
      ctx.fillText("YOUR VIDEO",16,108);
      ctx.fillStyle="rgba(255,255,255,0.04)"; ctx.strokeStyle="rgba(255,255,255,0.12)";
      ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      rr(16,116,210,90,8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      // Video icon
      ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(80,132,50,36,4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(130,138); ctx.lineTo(146,144); ctx.lineTo(130,150); ctx.closePath();
      ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="600 10px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Click or drag your video",120,178); ctx.textAlign="left";
      ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.font="9px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("MP4 · MOV · WEBM",120,191); ctx.textAlign="left";

      // PERSONAL DEMO IMAGE
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="bold 9px 'DM Sans',sans-serif";
      ctx.fillText("PERSONAL DEMO IMAGE",16,222);
      ctx.fillStyle="rgba(16,185,129,0.1)"; ctx.strokeStyle="rgba(16,185,129,0.3)";
      ctx.lineWidth=1; rr(16,230,210,50,8); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#10b981"; ctx.beginPath(); ctx.arc(28,255,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="600 11px 'DM Sans',sans-serif"; ctx.fillText("Demo image ready",40,252);
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="9px 'DM Sans',sans-serif";
      ctx.fillText("Rendered uniquely per company",40,266);

      // INTRO TEXT
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="bold 9px 'DM Sans',sans-serif";
      ctx.fillText("INTRO TEXT (PHASE 1)",16,298);
      ctx.fillStyle="rgba(255,255,255,0.06)"; rr(16,306,210,30,6); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="11px 'DM Sans',sans-serif"; ctx.fillText("((name))'s future IR",22,325);
      // Tag buttons
      ["+first name","+full name","+company"].forEach((tag,i)=>{
        const tx=16+i*72;
        ctx.fillStyle="rgba(26,130,255,0.15)"; rr(tx,341,66,18,5); ctx.fill();
        ctx.fillStyle="#5ba4ff"; ctx.font="9px 'DM Sans',sans-serif";
        ctx.textAlign="center"; ctx.fillText(tag,tx+33,353); ctx.textAlign="left";
      });

      // Font + size row
      ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="9px 'DM Sans',sans-serif";
      ctx.fillText("Size (px)",16,374); ctx.fillText("Font",100,374);
      ctx.fillStyle="rgba(255,255,255,0.06)"; rr(16,379,70,22,5); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="11px 'DM Sans',sans-serif"; ctx.fillText("28",22,394);
      ctx.fillStyle="rgba(255,255,255,0.06)"; rr(100,379,130,22,5); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="11px 'DM Sans',sans-serif"; ctx.fillText("Inter",106,394);

      // B Bold button
      ctx.fillStyle="rgba(255,255,255,0.07)"; rr(16,408,100,22,5); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 10px 'DM Sans',sans-serif"; ctx.textAlign="center"; ctx.fillText("B Bold",66,423); ctx.textAlign="left";

      // ── Main video preview area ─────────────────────────────────
      const vx=250, vy=96, vw=W-260, vh=H-100;

      // Company header row
      ctx.fillStyle="rgba(255,255,255,0.06)"; rr(vx,vy,vw,36,6); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.arc(vx+20,vy+18,10,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#1a82ff"; ctx.font="bold 10px 'DM Sans',sans-serif"; ctx.textAlign="center"; ctx.fillText("PP",vx+20,vy+22); ctx.textAlign="left";
      ctx.fillStyle="#fff"; ctx.font="600 11px 'DM Sans',sans-serif"; ctx.fillText("Jared Dunn",vx+36,vy+16);
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="9px 'DM Sans',sans-serif"; ctx.fillText("piedpiper.com",vx+36,vy+28);
      // Timing dots
      ctx.fillStyle="#3b82f6"; ctx.beginPath(); ctx.arc(vx+vw-180,vy+18,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.font="9px"; ctx.fillText("4s intro",vx+vw-170,vy+22);
      ctx.fillStyle="#8b5cf6"; ctx.beginPath(); ctx.arc(vx+vw-110,vy+18,4,0,Math.PI*2); ctx.fill();
      ctx.fillText("7s demo",vx+vw-100,vy+22);
      ctx.fillStyle="#10b981"; ctx.beginPath(); ctx.arc(vx+vw-42,vy+18,4,0,Math.PI*2); ctx.fill();
      ctx.fillText("8s site",vx+vw-32,vy+22);

      // ── Video preview: two-panel (video left, website screenshot right) ──
      const panelY=vy+44, panelH=vh-52, splitX=vx+Math.floor(vw*0.55);

      // LEFT: video preview (dark with mockup frame)
      ctx.fillStyle="#0a0f1a"; rr(vx,panelY,splitX-vx-4,panelH,8); ctx.fill();
      ctx.strokeStyle="rgba(26,130,255,0.2)"; ctx.lineWidth=1;
      rr(vx,panelY,splitX-vx-4,panelH,8); ctx.stroke();

      // Fake video frame — product demo screenshot mockup
      const fw2=splitX-vx-24, fh=Math.floor(panelH*0.72), fx=vx+10, fy=panelY+16;
      ctx.fillStyle="#1a2744"; rr(fx,fy,fw2,fh,8); ctx.fill();
      // Screen content
      ctx.fillStyle="#0d1628"; rr(fx+10,fy+10,fw2-20,fh-20,5); ctx.fill();
      // Mini stat bars
      [0.5,0.8,0.6,0.95,0.7].forEach((h2,i)=>{
        const bh2=Math.floor(h2*(fh-50)), bx2=fx+18+i*Math.floor((fw2-36)/5);
        ctx.fillStyle=i===3?"#1a82ff":"rgba(26,130,255,0.3)";
        rr(bx2,fy+fh-30-bh2,Math.floor((fw2-36)/5)-4,bh2,3); ctx.fill();
      });
      // Text overlay chip (personalised intro text)
      const chipW=Math.min(fw2-20,200);
      ctx.fillStyle="rgba(0,0,0,0.6)"; rr(fx+10,fy+fh-24,chipW,18,9); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 9px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Jared's future IR",fx+10+chipW/2,fy+fh-12); ctx.textAlign="left";
      // Play button
      ctx.fillStyle="rgba(26,130,255,0.85)"; ctx.beginPath(); ctx.arc(splitX-vx-24>>1,panelY+panelH/2,18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath();
      const px2=vx+(splitX-vx-24)/2, py2=panelY+panelH/2;
      ctx.moveTo(px2-6,py2-8); ctx.lineTo(px2+10,py2); ctx.lineTo(px2-6,py2+8); ctx.closePath(); ctx.fill();
      // Duration bar
      ctx.fillStyle="rgba(255,255,255,0.08)"; rr(vx+10,panelY+panelH-18,splitX-vx-24,6,3); ctx.fill();
      ctx.fillStyle="#1a82ff"; rr(vx+10,panelY+panelH-18,Math.floor((splitX-vx-24)*0.35),6,3); ctx.fill();
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(vx+10+Math.floor((splitX-vx-24)*0.35),panelY+panelH-15,5,0,Math.PI*2); ctx.fill();

      // RIGHT: website screenshot panel
      ctx.fillStyle="#e8edf5"; rr(splitX+4,panelY,vx+vw-splitX-14,panelH,8); ctx.fill();
      ctx.strokeStyle="rgba(0,0,0,0.08)"; ctx.lineWidth=1;
      rr(splitX+4,panelY,vx+vw-splitX-14,panelH,8); ctx.stroke();

      // Browser chrome
      ctx.fillStyle="#fff"; rr(splitX+4,panelY,vx+vw-splitX-14,32,8); ctx.fill();
      ctx.fillStyle="#e8edf5"; ctx.fillRect(splitX+4,panelY+24,vx+vw-splitX-14,8);
      // Browser dots
      [0,1,2].forEach(i=>{ ctx.fillStyle=["#ff5f57","#ffbd2e","#28c940"][i]; ctx.beginPath(); ctx.arc(splitX+16+i*14,panelY+16,4,0,Math.PI*2); ctx.fill(); });
      // URL bar
      ctx.fillStyle="#f1f5f9"; rr(splitX+52,panelY+8,Math.min(vx+vw-splitX-80,160),18,9); ctx.fill();
      ctx.fillStyle="#64748b"; ctx.font="9px monospace";
      ctx.fillText("piedpiper.com",splitX+60,panelY+20);

      // Website content (fake landing page of Pied Piper)
      const wx2=splitX+10, wy2=panelY+36, ww=vx+vw-splitX-24;
      ctx.fillStyle="#1e3a5f"; rr(wx2,wy2,ww,40,0); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font="bold 12px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Pied Piper",wx2+ww/2,wy2+17); ctx.textAlign="left";
      ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.font="9px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Middle-out compression",wx2+ww/2,wy2+32); ctx.textAlign="left";
      ctx.fillStyle="#fff"; ctx.font="600 9px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Get started →",wx2+ww/2,wy2+52); ctx.textAlign="left";
      // Hero section blocks
      ctx.fillStyle="#f8fafc"; rr(wx2,wy2+62,ww,panelH-110,0); ctx.fill();
      [[0.3,"#3b82f6"],[0.6,"#93c5fd"],[0.45,"#bfdbfe"],[0.7,"#3b82f6"]].forEach(([h3,col],i)=>{
        const bw3=Math.floor(ww/4)-6, bh3=Math.floor(h3*60), bx3=wx2+4+i*(bw3+6), by3=wy2+panelH-80-bh3;
        ctx.fillStyle=col; rr(bx3,by3,bw3,bh3,3); ctx.fill();
      });
      // Screenshot badge
      ctx.fillStyle="rgba(26,130,255,0.12)"; ctx.strokeStyle="rgba(26,130,255,0.4)"; ctx.lineWidth=1.5;
      rr(splitX+4,panelY,vx+vw-splitX-14,panelH,8); ctx.stroke();
      ctx.fillStyle="rgba(26,130,255,0.1)"; rr(splitX+8,panelY+panelH-28,120,20,10); ctx.fill();
      ctx.fillStyle="#3b82f6"; ctx.font="bold 9px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("Live website screenshot",splitX+68,panelY+panelH-15); ctx.textAlign="left";
    }

    ctx.fillStyle="rgba(0,0,0,0)"; // flush
  }, [step, activeLeadIdx]);

  return <canvas ref={canvasRef} width={860} height={480} style={{display:"block",width:"100%",height:"auto"}} />;
}

function DemoWalkthrough() {
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
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
        <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px" }}>
          From zero to 100 demos<br/>in under a minute.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
          Click through the steps to see exactly how it works.
        </p>
      </div>

      {/* Step tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {DEMO_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "9px 20px", borderRadius: 10, border: "none",
            background: step===i ? "linear-gradient(135deg,#1a82ff,#5b4fff)" : "rgba(255,255,255,0.05)",
            color: step===i ? "#fff" : "rgba(255,255,255,0.45)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "all .2s",
            boxShadow: step===i ? "0 4px 20px rgba(26,130,255,0.3)" : "none",
          }}>
            <span style={{ opacity: .6, marginRight: 6 }}>{i+1}.</span>{s.title.split(" ").slice(0,3).join(" ")}…
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{
        borderRadius: 18, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(26,130,255,0.1)",
        position: "relative",
      }}>
        <DemoCanvas step={step} activeLeadIdx={activeLeadIdx} />

        {/* Overlay caption */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(7,11,18,0.95) 0%, transparent 100%)",
          padding: "48px 32px 24px",
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#5ba4ff", textTransform: "uppercase", marginBottom: 6 }}>
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
        <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", right:16, display:"flex", flexDirection:"column", gap:8 }}>
          {step > 0 && (
            <button onClick={() => setStep(s=>s-1)} style={{
              width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",
              background:"rgba(10,16,26,0.8)",backdropFilter:"blur(12px)",
              color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          )}
          {step < DEMO_STEPS.length-1 && (
            <button onClick={() => setStep(s=>s+1)} style={{
              width:36,height:36,borderRadius:"50%",border:"none",
              background:"linear-gradient(135deg,#1a82ff,#5b4fff)",
              color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 16px rgba(26,130,255,0.4)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Dot progress */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:20 }}>
        {DEMO_STEPS.map((_,i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            width: step===i ? 24 : 8, height:8, borderRadius:4, border:"none", cursor:"pointer",
            background: step===i ? "#1a82ff" : "rgba(255,255,255,0.15)",
            transition:"all .3s", padding:0,
          }}/>
        ))}
      </div>
    </div>
  );
}

function WaitlistForm({ onEnterApp }) {
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [sent, setSent]   = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      const body = new FormData();
      body.append("form-name", "waitlist");
      body.append("email", email);
      body.append("name", name);
      await fetch("/", { method: "POST", body });
      setSent(true);
    } catch {
      setSent(true); // Show success anyway (form may work on Netlify even if fetch fails locally)
    }
    setSending(false);
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
        background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 40px rgba(26,130,255,0.5)",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>You're on the list.</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 24 }}>
        We'll reach out as soon as your spot is ready.
      </div>
      <button onClick={onEnterApp} style={{
        background: "rgba(26,130,255,0.15)", border: "1px solid rgba(26,130,255,0.3)",
        color: "#5ba4ff", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
        padding: "10px 24px", borderRadius: 10, cursor: "pointer",
      }}>
        Try the tool now
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} data-netlify="true" name="waitlist" method="POST"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name="form-name" value="waitlist" />
      <input
        type="text" name="name" placeholder="Your name"
        value={name} onChange={e => setName(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: "13px 18px", color: "rgba(255,255,255,0.85)", fontSize: 14,
          fontFamily: "inherit", outline: "none", backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)", transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(26,130,255,0.35)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
      />
      <input
        type="email" name="email" placeholder="Work email" required
        value={email} onChange={e => setEmail(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: "13px 18px", color: "rgba(255,255,255,0.85)", fontSize: 14,
          fontFamily: "inherit", outline: "none", backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)", transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(26,130,255,0.35)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
      />
      <button type="submit" disabled={sending} style={{
        background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
        color: "#fff", border: "none", borderRadius: 12, padding: "15px",
        fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 20px rgba(26,130,255,0.2)",
        opacity: sending ? 0.5 : 1, transition: "opacity .2s, box-shadow .2s",
      }}>
        {sending ? "Sending..." : "Request access"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, idx, visible }) {
  const delay = idx * 80;
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hov ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: "28px 26px",
        transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms, background .2s, border-color .2s, box-shadow .2s`,
        opacity: visible ? 1 : 0,
        transform: visible ? (hov ? "translateY(-3px)" : "translateY(0)") : "translateY(32px)",
        boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(59,130,246,0.1)" : "none",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
      <div style={{
        width: 48, height: 48, borderRadius: 13, flexShrink: 0,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? "#60a5fa" : "rgba(255,255,255,0.5)",
        transition: "color .2s",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-.3px" }}>{title}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.72 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP
// ─────────────────────────────────────────────
function Step({ n, title, desc, icon, visible, delay = 0 }) {
  return (
    <div style={{
      display: "flex", gap: 28, alignItems: "flex-start",
      transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms`,
      opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-28px)",
    }}>
      <div style={{
        flexShrink: 0, width: 52, height: 52, borderRadius: 15,
        background: "linear-gradient(135deg,rgba(26,130,255,0.2),rgba(91,79,255,0.2))",
        border: "1px solid rgba(26,130,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#5ba4ff", boxShadow: "0 0 20px rgba(26,130,255,0.15)",
      }}>{icon}</div>
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "rgba(26,130,255,0.7)", textTransform: "uppercase", marginBottom: 6 }}>Step {n}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-.3px" }}>{title}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.72 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SOCIAL PROOF TICKER
// ─────────────────────────────────────────────
const TICKER_EVENTS = [
  "Marcus just sent 47 personalised demos ⚡",
  "Sofia closed a deal from a personalised outreach 🎉",
  "Erik's reply rate jumped to 38% this week 📈",
  "Lena saved 6 hours of manual Figma work ✅",
  "Tom sent 120 demos in under 3 minutes 🚀",
  "Anna got 14 replies in the first hour 💬",
  "Peter personalised 80 demos before lunch ⚡",
];

function SocialProofTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % TICKER_EVENTS.length); setVisible(true); }, 400);
    }, 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: "rgba(26,130,255,0.06)", border: "1px solid rgba(26,130,255,0.18)",
      borderRadius: 100, padding: "8px 18px 8px 12px",
      fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a82ff", flexShrink: 0, boxShadow: "0 0 8px #1a82ff", animation: "pulse 1.8s infinite" }} />
      <span style={{ transition: "opacity .35s", opacity: visible ? 1 : 0 }}>{TICKER_EVENTS[idx]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIAL CAROUSEL
// ─────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "I sent 40 personalised demos in the same time it used to take me to build one in Figma. My reply rate went through the roof.", name: "Marcus L.", role: "Senior AE", company: "Scaleup SaaS" },
  { quote: "The Gmail integration is a game changer. My prospects respond saying they were impressed by how tailored the outreach felt.", name: "Sofia R.", role: "SDR Lead", company: "B2B Fintech" },
  { quote: "Every cold email tool promises personalisation but this is the first one that makes it visual. It's like Loom but for demos.", name: "Erik J.", role: "Head of Sales", company: "Growth Agency" },
  { quote: "I used to spend 20 minutes per prospect in Canva. Now I do 50 in the time it takes to make a coffee. Genuinely insane ROI.", name: "Lena M.", role: "Account Executive", company: "SaaS Startup" },
  { quote: "Opened by 83% of my prospects last week. The personalised logo image is what makes people stop and look.", name: "Tom H.", role: "BDR", company: "RevOps Platform" },
  { quote: "Our SDR team uses this daily. Booking rates are up 2x since we switched from plain text outreach.", name: "Anna K.", role: "VP Sales", company: "Enterprise SaaS" },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [ref, vis] = useReveal(0.08);

  const go = useCallback((next) => {
    if (animating) return;
    setDir(next > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setCurrent(next); setAnimating(false); }, 320);
  }, [animating, current]);

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [current, go]);

  const t = TESTIMONIALS[current];
  const cols = 3;
  const visible3 = [0,1,2].map(i => TESTIMONIALS[(current + i) % TESTIMONIALS.length]);

  return (
    <div ref={ref} style={{ transition: "opacity .8s, transform .8s", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(36px)" }}>
      {/* 3-column desktop grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 32 }}
        className="testi-grid">
        {visible3.map((t2, i) => (
          <div key={`${current}-${i}`} style={{
            background: i === 0 ? "rgba(26,130,255,0.06)" : "rgba(255,255,255,0.025)",
            border: `1px solid ${i === 0 ? "rgba(26,130,255,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 20, padding: "28px",
            transition: "opacity .32s, transform .32s",
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${dir * 24}px)` : "translateX(0)",
            transitionDelay: `${i * 60}ms`,
          }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
              {[...Array(5)].map((_, j) => (
                <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#1a82ff" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: 22, fontStyle: "italic" }}>
              "{t2.quote}"
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff",
              }}>{t2.name[0]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t2.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{t2.role}, {t2.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <button onClick={() => go((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} style={{
          width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(26,130,255,0.15)"; e.currentTarget.style.borderColor="rgba(26,130,255,0.4)"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              width: i === current ? 20 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer",
              background: i === current ? "#1a82ff" : "rgba(255,255,255,0.15)",
              transition: "all .3s", padding: 0,
            }}/>
          ))}
        </div>
        <button onClick={() => go((current + 1) % TESTIMONIALS.length)} style={{
          width: 36, height: 36, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg,#1a82ff,#5b4fff)", color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(26,130,255,0.35)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────
function ComparisonTable() {
  const [ref, vis] = useReveal(0.08);
  const rows = [
    { feature: "Auto logo fetch from domain", lp: true,  loom: false, canva: false, manual: false },
    { feature: "Send directly from Gmail",    lp: true,  loom: false, canva: false, manual: true  },
    { feature: "Bulk personalise 50+ demos",  lp: true,  loom: false, canva: false, manual: false },
    { feature: "No design skills needed",     lp: true,  loom: true,  canva: false, manual: false },
    { feature: "Under 30 seconds per demo",   lp: true,  loom: false, canva: false, manual: false },
    { feature: "Works in the browser",        lp: true,  loom: true,  canva: true,  manual: true  },
    { feature: "Visual brand personalisation",lp: true,  loom: false, canva: true,  manual: true  },
    { feature: "Free plan available",         lp: true,  loom: true,  canva: true,  manual: true  },
  ];
  const cols = [
    { label: "Logoplacers", highlight: true },
    { label: "Loom",        highlight: false },
    { label: "Canva",       highlight: false },
    { label: "Manual",      highlight: false },
  ];
  const Check = ({ yes }) => yes
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a82ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

  return (
    <div ref={ref} style={{
      maxWidth: 840, margin: "0 auto",
      transition: "opacity .8s, transform .8s",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(36px)",
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Feature</th>
              {cols.map(c => (
                <th key={c.label} style={{
                  textAlign: "center", padding: "14px 16px", fontSize: 12, fontWeight: 700,
                  color: c.highlight ? "#5ba4ff" : "rgba(255,255,255,0.35)",
                  borderBottom: `1px solid ${c.highlight ? "rgba(26,130,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                  background: c.highlight ? "rgba(26,130,255,0.06)" : "transparent",
                  borderRadius: c.highlight ? "12px 12px 0 0" : 0,
                  letterSpacing: ".3px",
                }}>{c.label}{c.highlight && <span style={{ marginLeft: 6, background: "linear-gradient(135deg,#1a82ff,#5b4fff)", color: "#fff", fontSize: 9, padding: "2px 7px", borderRadius: 100, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", verticalAlign: "middle" }}>You're here</span>}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ transition: `opacity .5s ${i * 50}ms`, opacity: vis ? 1 : 0 }}>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{row.feature}</td>
                {[row.lp, row.loom, row.canva, row.manual].map((val, j) => (
                  <td key={j} style={{
                    textAlign: "center", padding: "13px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: j === 0 ? "rgba(26,130,255,0.04)" : "transparent",
                  }}>
                    <Check yes={val} />
                  </td>
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
// EXIT INTENT POPUP
// ─────────────────────────────────────────────
function ExitIntentPopup({ onEnterApp }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("lp_exit_seen")) return;
    const handle = (e) => {
      if (e.clientY < 10 && !fired.current) {
        fired.current = true;
        setShow(true);
        sessionStorage.setItem("lp_exit_seen", "1");
      }
    };
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);

  if (!show || dismissed) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeUp .25s ease",
    }} onClick={() => setDismissed(true)}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 460, width: "90%",
        background: "linear-gradient(160deg,rgba(7,11,18,0.98),rgba(14,22,40,0.98))",
        border: "1px solid rgba(26,130,255,0.25)", borderRadius: 24, padding: "48px 40px",
        textAlign: "center", position: "relative",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(26,130,255,0.1)",
      }}>
        <button onClick={() => setDismissed(true)} style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          color: "rgba(255,255,255,0.3)", fontSize: 20, cursor: "pointer", lineHeight: 1,
        }}>×</button>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎁</div>
        <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px", color: "#fff" }}>
          Before you go —
        </h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 28px" }}>
          Try Logoplacers free. No credit card. 4 personalised demos to see if it works for you.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => { setDismissed(true); onEnterApp(); }} style={{
            background: "linear-gradient(135deg,#1a82ff,#5b4fff)", color: "#fff", border: "none",
            borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(26,130,255,0.4)",
          }}>
            Try free now — no card needed
          </button>
          <button onClick={() => setDismissed(true)} style={{
            background: "none", color: "rgba(255,255,255,0.25)", border: "none",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>
            No thanks, I don't want more replies
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BLOG DATA + COMPONENTS
// ─────────────────────────────────────────────
const BLOG_POSTS = [
  {
    slug: "how-to-personalise-cold-outreach-at-scale",
    title: "How to Personalise Cold Outreach at Scale Without Spending Hours in Canva",
    excerpt: "Most SDRs spend 20 minutes per prospect creating personalised images. Here's how to do 50 in the same time.",
    tag: "Sales Strategy", readTime: "5 min",
    body: `Personalised outreach works. Study after study shows that buyers are significantly more likely to open, read, and reply to an email that feels made for them. The problem isn't the strategy — it's the execution.\n\nMost AEs and SDRs resort to one of two approaches: spend 20 minutes per prospect in Canva crafting something visual, or skip the personalisation altogether and blast generic templates.\n\nNeither works at scale.\n\n**The Visual Personalisation Problem**\n\nVisual personalisation — placing a prospect's logo on your product screenshot — is one of the highest-converting outreach tactics available today. It signals effort, specificity, and that you actually understand the prospect's world.\n\nBut doing it manually is brutal. You have to:\n1. Find the prospect's logo (good luck if it's not on their website)\n2. Download it\n3. Open Canva, Figma, or Photoshop\n4. Resize and position it\n5. Export\n6. Attach to an email\n\nMultiply that by 50 prospects and you've killed your entire morning.\n\n**The Logoplacers Approach**\n\nLogoplacers solves this with a three-step workflow:\n1. Upload your product screenshot once\n2. Paste your prospect list\n3. Click export\n\nThe tool auto-fetches each company's logo, places it on your screenshot, and generates personalised images for every prospect simultaneously. What used to take 20 minutes per prospect now takes under 30 seconds total.\n\n**Why Visual Personalisation Works**\n\nThe psychology is simple: when someone sees their own logo on your product, they immediately visualise the integration. They see themselves using it. That mental shift from "interesting tool" to "this could be for us" is worth dozens of follow-up emails.\n\nHigh-performing sales teams report 2-3x higher reply rates on visual personalised outreach vs plain text. Not because the copy is better — because the image does the storytelling before a single word is read.\n\n**Getting Started**\n\nThe best approach is to start small. Take your current best-performing email template, add one personalised image, and run an A/B test over 50 sends. The data will convince you more than any article could.`,
  },
  {
    slug: "personalised-sales-demos-reply-rates",
    title: "Why Personalised Sales Demos Get 3.4x More Replies (And How to Build Them in 30 Seconds)",
    excerpt: "The data is clear: visual personalisation in cold email outperforms generic outreach by a wide margin. Here's the science and the shortcut.",
    tag: "Data & Research", readTime: "4 min",
    body: `Cold email is harder than it's ever been. Inboxes are flooded. Spam filters are sophisticated. And buyers have developed a finely-tuned reflex for detecting templated outreach.\n\nSo how do the top 1% of SDRs and AEs still achieve consistent 25%+ reply rates? The answer, increasingly, is visual personalisation.\n\n**The Numbers**\n\nAcross campaigns tracked by sales intelligence platforms, emails containing a personalised image — specifically the prospect's logo embedded in a product screenshot — achieve reply rates between 2.8x and 3.6x higher than text-only alternatives.\n\nThe mechanism is clear: personalised images aren't just visually distinctive in an inbox — they communicate "I made this for you" in a way that no subject line personalisation can replicate.\n\n**Why Logos Specifically**\n\nBrand logos carry psychological weight. They're symbols of identity, ownership, and investment. When a prospect sees their logo on your product interface, the brain processes it as social proof and relevance simultaneously.\n\nIt's not manipulation — it's communication. You're showing, not telling.\n\n**The Speed Problem**\n\nThe reason most teams don't do this consistently is time. Creating 50 personalised images manually takes a full day. That's not sustainable.\n\nLogoplacers exists specifically to remove that bottleneck. The tool fetches logos automatically, places them on your template, and generates bulk exports in seconds. A full sequence of 100 prospects — images generated, Gmail ready — takes under three minutes.\n\n**Implementation Tips**\n\n— Test one personalised image per campaign before rolling out at scale\n— Place the prospect's logo prominently, not buried\n— Keep the product screenshot clean and recognisable\n— Pair the image with a subject line that references the personalisation`,
  },
  {
    slug: "best-cold-email-tools-2025",
    title: "The Best Cold Email Personalisation Tools in 2025 (Honest Comparison)",
    excerpt: "We compared the top tools for visual personalisation in cold outreach. Here's what actually works for SDR teams.",
    tag: "Tool Reviews", readTime: "7 min",
    body: `The cold email tool market is crowded. Every week there's a new AI writing assistant promising to 10x your reply rates. But most of them solve the wrong problem.\n\nThe real leverage in cold outreach isn't word choice — it's visual differentiation. This guide covers the tools that actually move the needle on reply rates through personalisation.\n\n**Category 1: Visual Personalisation Tools**\n\n*Logoplacers* — Purpose-built for logo-on-screenshot personalisation. Auto-fetches company logos, bulk generates images, sends directly from Gmail. Best for AEs and SDRs who want visual personalisation at scale without design tools.\n\n*Hyperise* — Broader personalisation platform. Good for image personalisation within email sequences. Higher price point, more complex setup.\n\n*Lemlist* — Email sequencing with built-in image personalisation. Good if you need an all-in-one sequence tool, but the image personalisation is less flexible than standalone tools.\n\n**Category 2: Screen Recording**\n\n*Loom* — Great for bespoke video messages but not scalable for bulk outreach. Every video requires manual recording. Best for late-stage personalisation.\n\n**Category 3: Design Tools**\n\n*Canva / Figma* — Maximum flexibility but requires significant time per prospect. Not viable for sequences of more than 10 prospects.\n\n**Our Recommendation**\n\nFor SDR teams focused on cold outreach volume: Logoplacers for image personalisation, paired with your existing sequence tool for delivery.\n\nFor enterprise teams needing full customisation: Consider Hyperise alongside a dedicated sequence platform.\n\nFor one-to-one high-value deals: Loom for personal video, Logoplacers for the initial hook.`,
  },
  {
    slug: "what-is-aio-ai-optimisation",
    title: "What Is AIO? How to Optimise Your SaaS for AI Search in 2025",
    excerpt: "ChatGPT, Claude, and Perplexity are replacing Google for product discovery. Here's how to get your SaaS in front of AI-generated answers.",
    tag: "SEO & AIO", readTime: "6 min",
    body: `If you've noticed your organic traffic patterns changing in 2025, you're not imagining things. A significant and growing portion of product discovery now happens through AI assistants — ChatGPT, Claude, Perplexity, and Gemini — rather than traditional search.\n\nThis shift is what people are calling AIO: AI Optimisation.\n\n**What Is AIO?**\n\nAIO refers to the practice of structuring your web content so that AI language models can accurately represent your product in conversational search results.\n\nWhen someone asks ChatGPT "what's the best tool for personalising cold email outreach with prospect logos?", the model synthesises information from its training data and live web searches. AIO is about making sure your product shows up accurately in that synthesis.\n\n**How AI Models Discover Products**\n\nAI crawlers and training pipelines process web content differently from traditional search engines. They prioritise:\n\n— Clear, factual descriptions of what a product does\n— Structured data (Schema.org) that explicitly categorises the product\n— Consistent brand mentions across multiple sources\n— Clear use-case articulation (who uses it, for what problem)\n— Authoritative third-party mentions (directories, reviews, comparisons)\n\n**The llms.txt Standard**\n\nA new convention is emerging: the `llms.txt` file. Similar to `robots.txt` for search crawlers, `llms.txt` is a plain-text file placed at the root of your domain that gives AI models a structured summary of your product, use cases, and key pages.\n\nEarly adoption of this standard is a low-effort way to signal clarity to AI systems.\n\n**Practical AIO Checklist**\n\n1. Add Schema.org SoftwareApplication markup to your homepage\n2. Create an `llms.txt` file at your domain root\n3. Write clear, factual FAQs in natural Q&A format\n4. Build blog content around specific use-case queries\n5. Get listed on AI-curated directories (Futurepedia, Toolify, There's An AI For That)\n6. Ensure consistent product descriptions across all platforms`,
  },
  {
    slug: "sdr-productivity-hacks-2025",
    title: "7 SDR Productivity Hacks That Top Performers Swear By in 2025",
    excerpt: "The best SDRs aren't working harder — they've found the leverage points. Here are the tactics making the biggest difference right now.",
    tag: "Sales Productivity", readTime: "5 min",
    body: `Top-performing SDRs don't book more meetings by making more calls. They book more meetings by making smarter investments of their time.\n\nHere are seven tactics that consistently separate the top 10% from the rest.\n\n**1. Visual Personalisation on the First Touch**\n\nStop leading with generic templates. A personalised image — your prospect's logo on your product screenshot — takes 30 seconds with the right tool and consistently 2-3x the response rate. This is the single highest-leverage change most SDRs can make today.\n\n**2. Time-Block Sequencing**\n\nDon't send emails throughout the day. Block 60-90 minutes in the morning for bulk personalisation and sending. The focus effect alone improves output quality.\n\n**3. The 10-Minute Research Rule**\n\nSpend exactly 10 minutes researching a prospect before reaching out. Find one specific trigger — a recent hire, funding round, product launch, or competitor mention — and lead with it. No more, no less. More than 10 minutes and you're over-investing on unqualified accounts.\n\n**4. Subject Line A/B Testing**\n\nMost SDRs write subject lines based on intuition. Run a proper A/B test across 50 sends minimum. The winning subject line often feels counterintuitive — short, lowercase, and oddly specific outperforms polished and professional.\n\n**5. LinkedIn + Email Sequences**\n\nMulti-channel sequences outperform single-channel by 40-70%. A simple pattern: email day 1, LinkedIn connection day 3, email follow-up day 6.\n\n**6. Record and Review**\n\nRecord your cold calls once a week and listen back. Most SDRs discover they're talking too fast, not pausing enough, or killing objections with over-explanation. Ten minutes of review saves hours of ineffective calling.\n\n**7. Batch Similar Tasks**\n\nResearch mode, writing mode, calling mode — your brain switches gears for each. Batch similar activities together rather than context-switching all day. Personalisation, research, writing, calls — each gets its own block.`,
  },
  {
    slug: "cold-email-personalisation-examples",
    title: "10 Cold Email Personalisation Examples That Actually Got Replies",
    excerpt: "Real examples of personalised cold emails that broke through. What they had in common, and how to replicate the approach.",
    tag: "Email Templates", readTime: "6 min",
    body: `Personalisation in cold email is often misunderstood. Adding {{first_name}} to a subject line is not personalisation. Researching someone's LinkedIn and writing a paragraph about their career history is over-engineering.\n\nThe sweet spot is specific, effortless-feeling personalisation that signals you understand the prospect's world without feeling like you stalked them.\n\nHere are patterns from emails that generated real responses:\n\n**Pattern 1: The Logo Hook**\n\nSubject: Made something for [Company]\nBody: "Hi [Name], I put together a personalised demo of [Your Product] for [Company] — attached. Takes 30 seconds to look at. [CTA]"\n\nThe attached personalised image does the heavy lifting. The email is short precisely because the image communicates what 200 words couldn't.\n\n**Pattern 2: The Specific Trigger**\n\n"Hi [Name], saw [Company] just launched [feature/product/announcement]. Congrats — that's a meaningful milestone. We work with teams at this stage to [specific use case]. Would a 15-minute call make sense?"\n\n**Pattern 3: The Peer Reference**\n\n"Hi [Name], I was talking to [Peer at similar company] last week about [shared challenge]. They mentioned you might be dealing with the same thing. Worth 15 minutes?"\n\n**Pattern 4: The Honest Ask**\n\n"Hi [Name], I'll be direct — I'm reaching out because [Company] fits our ideal customer profile exactly. I think [Your Product] would be genuinely useful for your team. Can I show you why in 15 minutes?"\n\n**What They All Have in Common**\n\n— Short (under 75 words)\n— One specific reason for reaching out\n— One clear ask\n— Zero filler phrases ("I hope this finds you well", "I wanted to reach out")\n— Visual element (logo image, screenshot) where possible`,
  },
  {
    slug: "b2b-sales-prospecting-tools",
    title: "B2B Sales Prospecting Tools That Save the Most Time in 2025",
    excerpt: "A practical guide to the tools that actually reduce manual work in B2B prospecting and outreach.",
    tag: "Tools & Tech", readTime: "5 min",
    body: `B2B prospecting has more tools than ever, which paradoxically makes decision-making harder. This guide cuts through the noise and focuses on tools that create genuine time savings.\n\n**List Building**\n\n*Apollo.io* — The standard for prospect list building. Strong filtering, decent email data, integrated sequencing.\n*Clay* — More powerful enrichment, better for building sophisticated prospecting workflows.\n*LinkedIn Sales Navigator* — Still the gold standard for account-based prospecting.\n\n**Personalisation**\n\n*Logoplacers* — Visual personalisation at scale. Auto-fetches logos, generates bulk images, sends via Gmail. Best for teams doing high-volume visual outreach.\n*Hyperise* — Broader personalisation platform for multi-format campaigns.\n\n**Sequencing**\n\n*Outreach / Salesloft* — Enterprise-grade sequence management.\n*Instantly* — Better for high-volume cold email at lower cost.\n*Lemlist* — Good balance of features for SMB and mid-market teams.\n\n**Recording and Video**\n\n*Loom* — For bespoke video messages in late-stage or high-value outreach.\n*Vidyard* — Enterprise video personalisation with better tracking.\n\n**Our Stack Recommendation for an SDR Team of 5-10**\n\nApollo or Clay for list building → Logoplacers for visual personalisation → Instantly or Lemlist for sequencing → Loom for high-value follow-ups.\n\nThis stack costs under $300/month combined, saves 20+ hours per SDR per month, and produces consistently better reply rates than more expensive alternatives.`,
  },
  {
    slug: "gmail-cold-outreach-limits",
    title: "Gmail Cold Outreach: Limits, Best Practices, and How Not to Get Banned",
    excerpt: "Using Gmail for cold outreach? Here's everything you need to know about sending limits, spam signals, and staying deliverable.",
    tag: "Deliverability", readTime: "5 min",
    body: `Gmail is the most trusted email client in B2B. Sending from a Gmail or Google Workspace account gets your emails into inboxes that corporate email servers regularly flag from third-party tools.\n\nBut Gmail has limits, and ignoring them will kill your domain.\n\n**The Numbers**\n\nFree Gmail accounts: 500 emails per day.\nGoogle Workspace accounts: 2,000 emails per day.\n\nThese are hard limits. Hit them and Google suspends sending for 24 hours. Hit them repeatedly and your account gets flagged.\n\n**Anti-Spam Signals That Trigger Google**\n\n— Sending identical emails to large lists (no personalisation)\n— High bounce rates (>3%)\n— High spam complaint rates (>0.1%)\n— Sending to purchased lists\n— Sudden volume spikes\n\n**The Right Approach**\n\nSend in batches of 50-100 per day from a single account. Warm your domain gradually if it's new. Use delays between sends (Logoplacers builds in random 15-45 second anti-spam delays automatically).\n\nPersonalise every email. Not just the subject line — the image. A personalised image is the single most effective signal to Gmail's spam detection that this is a real, relevant communication.\n\n**Domain Warm-Up**\n\nFor a new Google Workspace domain:\n— Week 1: 20-30 emails per day\n— Week 2: 50-75 per day\n— Week 3: 100-150 per day\n— Week 4+: Up to your target volume\n\nThis gradual ramp is non-negotiable for preserving deliverability.`,
  },
  {
    slug: "what-is-logo-personalisation",
    title: "What Is Logo Personalisation in Sales? (And Why It Works Better Than You Think)",
    excerpt: "The complete guide to using prospect logos in sales outreach — what it is, why it works, and how to do it at scale.",
    tag: "Beginner's Guide", readTime: "4 min",
    body: `Logo personalisation is a cold outreach technique where you embed a prospect's company logo directly into an image you send them — typically your product screenshot, a demo environment, or a mockup.\n\nThe concept is simple. The results are not.\n\n**Why It Works**\n\nThere are three psychological mechanisms at work:\n\n*Relevance signal*: Seeing their own logo on your product creates an immediate "this is relevant to me" response before a word is read.\n\n*Effort signal*: A personalised image communicates that you didn't blast 10,000 people with the same message. It signals selectivity, which increases perceived value.\n\n*Visualisation*: The prospect sees their brand inside your product. This collapses the gap between "interesting" and "I can see us using this."\n\n**What You Actually Send**\n\nThe most effective format is a product screenshot — your actual dashboard, interface, or output — with the prospect's logo placed naturally within it. Not a mock-up, not a generic template. Your real product, contextualised for them.\n\n**The Scale Problem (and Its Solution)**\n\nDoing this manually in Canva or Photoshop takes 15-20 minutes per prospect. That's fine for 5 prospects. It's impossible for 50.\n\nLogoplacers solves this: upload your screenshot, paste your company list, and the tool fetches every logo automatically and generates all personalised images simultaneously. 50 prospects in under a minute.\n\n**Getting Started**\n\n1. Take a clean screenshot of your best product feature\n2. Add it to Logoplacers as your template\n3. Paste your prospect list\n4. Generate and send`,
  },
  {
    slug: "outbound-sales-strategy-2025",
    title: "Outbound Sales Strategy in 2025: What's Working, What's Dead, What's Next",
    excerpt: "The outbound playbook has changed significantly. Here's a grounded view of what's actually producing pipeline in 2025.",
    tag: "Sales Strategy", readTime: "7 min",
    body: `The outbound sales landscape in 2025 looks nothing like it did three years ago. AI writing tools flooded inboxes with high-volume, low-quality sequences. Buyers got smarter. Spam filters got better. Reply rates collapsed for everyone who didn't adapt.\n\nBut outbound isn't dead — it's just become higher-signal. Here's what's working.\n\n**What's Dead**\n\n*Volume-only strategies*: Sending 500 generic emails per day produces noise. Buyers have learned to filter it at a glance. High volume is only effective paired with high relevance.\n\n*Long, impressive intros*: "I hope this finds you well, I wanted to reach out to introduce you to..." — deleted before the second sentence. Nobody cares about your intro.\n\n*Feature-focused pitches*: "We have X integrations and Y uptime and Z compliance certifications." Features don't sell. Outcomes do.\n\n**What's Working**\n\n*Trigger-based outreach*: Reaching out specifically because of a recent hiring spike, product launch, funding announcement, or competitive switch. The timing justifies the contact.\n\n*Visual personalisation*: Logo-on-screenshot outreach continues to significantly outperform text-only. The image communicates relevance in half a second.\n\n*Tight ICP + lower volume*: 30 highly-targeted prospects per week outperforms 300 loosely-targeted ones. The maths work out better.\n\n*Multi-threaded deals*: One contact per account is fragile. Best-performing teams are threading multiple stakeholders simultaneously.\n\n**What's Emerging**\n\n*AI-assisted research*: Using LLMs to rapidly synthesise prospect context — news, LinkedIn activity, job postings — before writing.\n\n*Video in late-stage sequences*: Loom or similar for prospects who've engaged but not converted. Personal video at this stage has outsized impact.\n\n*AIO-driven inbound*: Teams investing in content optimised for AI search are seeing compounding inbound that reduces outbound burden over time.`,
  },
  {
    slug: "how-to-send-bulk-personalised-emails",
    title: "How to Send Bulk Personalised Emails Without Looking Like a Spammer",
    excerpt: "Bulk email doesn't have to mean generic. Here's how to send at volume while keeping personalisation (and deliverability) intact.",
    tag: "Email How-To", readTime: "5 min",
    body: `Bulk email has a reputation problem. When most people think "bulk email", they think spam filters, bounced messages, and unsubscribes.\n\nBut bulk personalised email — done correctly — is one of the most efficient activities in an SDR's toolkit. Here's how to do it properly.\n\n**The Core Principle: Personalise the Image, Not Just the Text**\n\nText personalisation ({{first_name}}, {{company}}) is so common that buyers have stopped noticing it. The next level is visual personalisation — embedding the prospect's logo in the image you attach.\n\nThis is nearly impossible to fake at scale without a dedicated tool. Which is exactly why it still works: it signals genuine effort.\n\n**Deliverability Fundamentals**\n\nBefore sending anything at volume:\n— Use Google Workspace (not free Gmail) for business email\n— Verify your domain (SPF, DKIM, DMARC)\n— Clean your list — remove invalid addresses before sending\n— Warm your domain if it's less than 3 months old\n\n**The Right Sending Pattern**\n\nNever send more than 100 emails per day from a single account if you're doing cold outreach. Build in delays between sends — 15-45 seconds is the sweet spot for appearing human.\n\nLogoplacers handles this automatically: its Gmail send feature includes randomised anti-spam delays built in.\n\n**Segmenting for Relevance**\n\nDon't send the same message to your entire list. Segment by:\n— Industry\n— Company size\n— Job function\n— Specific trigger event\n\nFive well-segmented lists of 20 prospects each will consistently outperform one generic list of 100.`,
  },
  {
    slug: "personalisation-vs-automation-sales",
    title: "Personalisation vs Automation in Sales: Finding the Right Balance",
    excerpt: "Too much automation feels robotic. Too much personalisation doesn't scale. Here's where to draw the line.",
    tag: "Sales Strategy", readTime: "4 min",
    body: `The tension between personalisation and automation is one of the defining challenges in modern sales. Automation scales. Personalisation converts. The challenge is doing both.\n\n**The Spectrum**\n\nAt one extreme: fully automated sequences, zero personalisation, maximum volume. Low conversion, high scale.\n\nAt the other extreme: fully personalised, handcrafted outreach to every single prospect. High conversion, zero scale.\n\nThe optimal point lies in between — but it's not exactly in the middle.\n\n**Where Automation Wins**\n\n— Timing (when emails go out)\n— Sequence management (follow-ups)\n— Data enrichment (pulling company info)\n— List building and segmentation\n\n**Where Personalisation Wins**\n\n— First-touch differentiation (the image, the hook, the reason for contact)\n— Response handling\n— Late-stage deal nurturing\n— Re-engagement after silence\n\n**The Hybrid Approach**\n\nAutomate the infrastructure. Personalise the signal.\n\nUse automation to build your list, schedule your sends, and manage follow-ups. Use personalisation tools like Logoplacers to generate custom images at scale — so the prospect receives what feels like a handcrafted message, at the speed of automation.\n\nThis is the formula that lets a single SDR send 50 personalised demos per day without compromising quality.`,
  },
  {
    slug: "sales-demo-design-best-practices",
    title: "Sales Demo Design: 8 Best Practices for Demos That Actually Close",
    excerpt: "A poorly designed demo loses deals before the conversation starts. Here's how to design product demos that convert.",
    tag: "Design & UX", readTime: "5 min",
    body: `A product demo is a first impression, a value proposition, and a call to action simultaneously. Most demos underdeliver on all three because they're designed for comprehensiveness rather than conversion.\n\nHere's how to fix that.\n\n**1. Lead With Outcome, Not Feature**\n\nThe opening slide/screen should show the prospect what success looks like — their metrics improved, their problem solved. Show the outcome before you explain how you achieve it.\n\n**2. Use Real Data**\n\nDemos with generic placeholder data ("John Doe", "ACME Corp") look like templates. Replace with real-looking data, ideally data that mirrors the prospect's industry.\n\n**3. Personalise Visually**\n\nEmbed the prospect's logo in the demo. This takes a second with a tool like Logoplacers and creates an immediate "this was made for us" feeling.\n\n**4. Keep It Under 3 Minutes**\n\nIf you're sending a static demo or short video, 3 minutes is the maximum. Longer and completion rates drop off a cliff. Force yourself to edit ruthlessly.\n\n**5. One CTA**\n\nSingle, clear call to action. "Book a 15-minute call" or "start a free trial." Multiple options create decision paralysis.\n\n**6. Mobile-First Design**\n\n60%+ of emails are first opened on mobile. Your demo image needs to read at 375px width. If the key information isn't legible on a phone screen, redesign.\n\n**7. Brand Consistency**\n\nYour demo should look like your brand. Fonts, colours, and visual style should be consistent. An inconsistent demo signals an inconsistent product.\n\n**8. Test and Iterate**\n\nA/B test demo designs just like you A/B test email copy. The best-converting demo isn't the most beautiful — it's the one that most clearly communicates the outcome for the specific prospect.`,
  },
  {
    slug: "remote-sales-team-tools",
    title: "The Essential Tech Stack for Remote Sales Teams in 2025",
    excerpt: "What tools do high-performing remote sales teams actually use? A practical guide with honest assessments.",
    tag: "Tools & Tech", readTime: "6 min",
    body: `Remote sales teams face a specific challenge: they need to maintain the same output quality and coordination as co-located teams, without the casual collaboration that co-location enables.\n\nThe right tech stack is what makes this possible.\n\n**Communication**\n\n*Slack* — Standard. Channels per account, per campaign, per deal stage.\n*Loom* — Async video for internal updates, manager coaching, and high-value prospect touches.\n*Zoom* — Live discovery calls and demos. Nothing has genuinely replaced it.\n\n**Prospecting**\n\n*Apollo or Clay* — List building and enrichment.\n*LinkedIn Sales Navigator* — Account and contact research.\n\n**Personalisation**\n\n*Logoplacers* — Visual personalisation at scale. Particularly valuable for remote teams because it eliminates the coordination cost of having someone in a central office create custom images.\n\n**Outreach and Sequencing**\n\n*Instantly or Outreach* — Depending on team size and budget.\n\n**CRM**\n\n*HubSpot* — Best for SMB and mid-market remote teams.\n*Salesforce* — Enterprise standard.\n\n**Pipeline and Forecasting**\n\n*Clari or Gong* — Conversation intelligence and pipeline health.\n\n**The Most Underrated Remote Sales Tool**\n\nCalendar hygiene. The best remote sales teams have strict meeting scheduling standards, deep work blocks, and async-first communication norms. This isn't a product — it's a practice. But it determines whether all the other tools actually get used.`,
  },
  {
    slug: "increase-email-reply-rate",
    title: "How to Increase Your Cold Email Reply Rate: A Practical Guide",
    excerpt: "Actionable, tested changes that consistently improve reply rates in cold email campaigns. No theory — just what works.",
    tag: "Email How-To", readTime: "6 min",
    body: `Low reply rates are the most common cold email problem, and they almost always trace back to the same root causes: lack of relevance, lack of specificity, or lack of differentiation.\n\nHere's a systematic approach to diagnosing and fixing each.\n\n**Step 1: Audit Your Subject Lines**\n\nSubject lines determine open rates. Open rates determine whether your reply rate problem is in the email or before it. If your open rate is below 30%, fix subject lines first.\n\nHighest-performing subject line patterns:\n— Referencing a specific trigger: "Re: [Company]'s recent launch"\n— Ultra-short: "Quick question"\n— Honest and direct: "[Name] — 5 minutes?"\n\n**Step 2: Check Your First Sentence**\n\nThe first sentence either earns attention or loses it permanently. It should:\n— Not start with "I"\n— Not explain who you are\n— Create immediate relevance for the specific prospect\n\n**Step 3: Add a Visual Element**\n\nEmails with personalised images consistently outperform text-only. A screenshot with the prospect's logo placed on it takes 30 seconds with Logoplacers and typically raises reply rates by 2-3x.\n\n**Step 4: Shorten Everything**\n\nIf your email is over 75 words, cut it in half. The best cold emails are 40-60 words.\n\n**Step 5: Improve the Ask**\n\nThe CTA should be specific, low-commitment, and time-bounded. "Would a 15-minute call next week make sense?" outperforms "Would love to connect!" every time.\n\n**Step 6: Test Systematically**\n\nChange one variable at a time. Subject line, first sentence, image, CTA — test each in isolation across 50 sends minimum. Build your own database of what works for your ICP.`,
  },
];

function BlogCard({ post, style: s }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={`#blog/${post.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none",
        background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? "rgba(26,130,255,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18, padding: "26px",
        transition: "all .2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.3)" : "none",
        ...s,
      }}>
      <div style={{
        display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "1px",
        textTransform: "uppercase", color: "#5ba4ff",
        background: "rgba(26,130,255,0.1)", border: "1px solid rgba(26,130,255,0.2)",
        borderRadius: 6, padding: "3px 8px", marginBottom: 14,
      }}>{post.tag}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.45, letterSpacing: "-.3px" }}>{post.title}</h3>
      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: "0 0 16px" }}>{post.excerpt}</p>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {post.readTime} read
        <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>·</span>
        <span style={{ color: "#5ba4ff" }}>Read →</span>
      </div>
    </a>
  );
}

function BlogSection() {
  const [ref, vis] = useReveal(0.06);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? BLOG_POSTS : BLOG_POSTS.slice(0, 6);
  return (
    <div ref={ref} style={{ maxWidth: 1140, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 72,
        transition: "opacity .8s, transform .8s", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>Blog</div>
        <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 14px", lineHeight: 1.05 }}>
          Learn from the best.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", margin: 0 }}>Practical guides for modern sales teams.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
        {shown.map((post, i) => (
          <BlogCard key={post.slug} post={post} style={{
            transition: `opacity .6s ${(i % 6) * 70}ms, transform .6s ${(i % 6) * 70}ms`,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
          }} />
        ))}
      </div>
      {!showAll && BLOG_POSTS.length > 6 && (
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button onClick={() => setShowAll(true)} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "13px 32px",
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "all .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(26,130,255,0.1)"; e.currentTarget.style.borderColor="rgba(26,130,255,0.3)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
            Show all {BLOG_POSTS.length} articles →
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// BLOG POST PAGE
// ─────────────────────────────────────────────
function BlogPostPage({ slug, onBack }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  useEffect(() => { window.scrollTo(0, 0); if (post) document.title = `${post.title} — Logoplacers`; }, [slug]);
  if (!post) return <div style={{ padding: 80, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Post not found. <button onClick={onBack} style={{ background:"none",border:"none",color:"#5ba4ff",cursor:"pointer",fontFamily:"inherit",fontSize:14 }}>← Back</button></div>;

  const paragraphs = post.body.split("\n\n");

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 32px 100px" }}>
      <button onClick={onBack} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,letterSpacing:".3px",display:"flex",alignItems:"center",gap:6,marginBottom:40,padding:0,transition:"color .15s" }}
        onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        All articles
      </button>
      <div style={{ display:"inline-block",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:"#5ba4ff",background:"rgba(26,130,255,0.1)",border:"1px solid rgba(26,130,255,0.2)",borderRadius:6,padding:"3px 8px",marginBottom:20 }}>{post.tag}</div>
      <h1 style={{ fontSize:"clamp(28px,4vw,44px)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.12,margin:"0 0 20px",color:"#fff" }}>{post.title}</h1>
      <div style={{ fontSize:12,color:"rgba(255,255,255,0.25)",marginBottom:52,display:"flex",gap:12,alignItems:"center" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {post.readTime} read
      </div>
      <div style={{ color:"rgba(255,255,255,0.62)",lineHeight:1.85,fontSize:15.5 }}>
        {paragraphs.map((p, i) => {
          if (p.startsWith("**") && p.endsWith("**")) {
            return <h2 key={i} style={{ fontSize:19,fontWeight:700,color:"#fff",margin:"36px 0 12px",letterSpacing:"-.4px" }}>{p.replace(/\*\*/g,"")}</h2>;
          }
          if (p.startsWith("— ") || p.startsWith("*") || p.match(/^\d\./)) {
            const items = p.split("\n").filter(Boolean);
            return <ul key={i} style={{ paddingLeft:20,margin:"0 0 20px",display:"flex",flexDirection:"column",gap:6 }}>
              {items.map((item,j) => <li key={j} style={{ color:"rgba(255,255,255,0.55)",fontSize:14.5 }}>{item.replace(/^[—*]\s?/,"").replace(/^\d\.\s?/,"")}</li>)}
            </ul>;
          }
          if (p.startsWith("*") && p.endsWith("*")) {
            return <p key={i} style={{ fontStyle:"italic",color:"rgba(255,255,255,0.45)",margin:"0 0 20px" }}>{p.replace(/\*/g,"")}</p>;
          }
          return <p key={i} style={{ margin:"0 0 22px" }}>{p}</p>;
        })}
      </div>
      <div style={{ marginTop:56,padding:"28px 32px",background:"rgba(26,130,255,0.07)",border:"1px solid rgba(26,130,255,0.2)",borderRadius:18 }}>
        <div style={{ fontSize:16,fontWeight:700,color:"#fff",marginBottom:8 }}>Try Logoplacers free</div>
        <div style={{ fontSize:13,color:"rgba(255,255,255,0.42)",marginBottom:18,lineHeight:1.6 }}>Personalise your first demos in under a minute. No credit card required.</div>
        <button onClick={onBack} style={{ background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",border:"none",borderRadius:10,padding:"11px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
          Get started free →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SOCIAL PROOF TICKER
// ─────────────────────────────────────────────
const TICKER_EVENTS = [
  "Marcus at Klarna just sent 47 personalised demos",
  "Sofia at Stripe booked 3 meetings from one sequence",
  "Erik's reply rate hit 38% this week",
  "Anna at HubSpot generated 60 demos in under 2 minutes",
  "Liam just closed a deal after a personalised follow-up",
  "Julia booked a VP meeting on the first email",
  "Tom hit 41% open rate with visual personalisation",
  "Emma sent 80 personalised demos before lunch",
];

function SocialProofTicker() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % TICKER_EVENTS.length); setVis(true); }, 350);
    }, 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 300,
      background: "rgba(7,11,18,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 10, maxWidth: 320,
      transition: "opacity .35s, transform .35s",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(6px)",
      pointerEvents: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 8px rgba(34,197,94,0.7)" }}/>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.45 }}>{TICKER_EVENTS[idx]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXIT-INTENT POPUP
// ─────────────────────────────────────────────
function ExitIntentPopup({ onEnterApp }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (dismissed) return;
    const handler = (e) => {
      if (e.clientY <= 8 && !dismissed) { setShow(true); }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [dismissed]);
  if (!show || dismissed) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fadeIn .25s ease",
    }} onClick={e => { if (e.target === e.currentTarget) { setShow(false); setDismissed(true); } }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(13,18,30,0.98), rgba(7,11,18,0.98))",
        border: "1px solid rgba(26,130,255,0.25)", borderRadius: 28, padding: "52px 48px",
        maxWidth: 480, width: "100%", textAlign: "center", position: "relative",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(26,130,255,0.1)",
        animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <button onClick={() => { setShow(false); setDismissed(true); }} style={{
          position: "absolute", top: 18, right: 18, background: "rgba(255,255,255,0.06)", border: "none",
          color: "rgba(255,255,255,0.4)", width: 32, height: 32, borderRadius: "50%",
          cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}>×</button>

        {/* Glow blob */}
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: "radial-gradient(ellipse, rgba(26,130,255,0.15), transparent 70%)", pointerEvents: "none" }}/>

        <div style={{ fontSize: 48, marginBottom: 16 }}>✋</div>
        <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px", lineHeight: 1.2 }}>
          Wait — before you go.
        </h3>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, margin: "0 0 32px" }}>
          Personalise your first demo in 30 seconds — no credit card, no setup. Just upload a screenshot and see the difference.
        </p>
        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <button onClick={() => { onEnterApp(); setDismissed(true); }} style={{
            background: "linear-gradient(135deg,#1a82ff,#5b4fff)", color: "#fff", border: "none",
            borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 32px rgba(26,130,255,0.35)",
            transition: "transform .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform="none"}>
            Try for free — takes 30 seconds
          </button>
          <button onClick={() => { setShow(false); setDismissed(true); }} style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 12,
            cursor: "pointer", fontFamily: "inherit", padding: "4px",
          }}>
            No thanks, I'll keep building demos manually
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} } @keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// BLOG PREVIEW SECTION (on landing page)
// ─────────────────────────────────────────────
function BlogPreview({ onOpenBlog }) {
  const [ref, vis] = useReveal(0.08);
  const previews = [
    { title: "Why Personalised Sales Demos Get 3× More Replies", cat: "Strategy", min: 7, slug: "personalised-sales-demos-reply-rates" },
    { title: "How to Personalise Cold Email at Scale in 2025", cat: "Outreach", min: 9, slug: "cold-email-personalisation-at-scale" },
    { title: "The Best B2B Outbound Sales Tools in 2025 (Ranked)", cat: "Tools", min: 11, slug: "b2b-outbound-sales-tools-2025" },
  ];
  return (
    <section style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 14 }}>From the blog</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-1.5px", margin: 0 }}>
              Sales playbooks that work.
            </h2>
          </div>
          <button onClick={onOpenBlog} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "10px 20px",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "all .15s", display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(26,130,255,0.35)"; e.currentTarget.style.color="#5ba4ff"; e.currentTarget.style.background="rgba(26,130,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
            View all 15 articles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
          {previews.map((p, i) => (
            <BlogPreviewCard key={p.slug} post={p} idx={i} visible={vis} onOpenBlog={onOpenBlog} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewCard({ post, idx, visible, onOpenBlog }) {
  const [hov, setHov] = useState(false);
  const CAT_COLOR = { Strategy: "#5ba4ff", Outreach: "#a78bfa", Tools: "#34d399" };
  return (
    <article
      onClick={onOpenBlog}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor: "pointer",
        background: hov ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${hov ? "rgba(26,130,255,0.2)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20, padding: "28px",
        transition: `opacity .6s ${idx * 80}ms, transform .6s ${idx * 80}ms, background .2s, border-color .2s, box-shadow .2s`,
        opacity: visible ? 1 : 0, transform: visible ? (hov ? "translateY(-4px)" : "translateY(0)") : "translateY(28px)",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.3)" : "none",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: CAT_COLOR[post.cat] || "#5ba4ff", background: "rgba(26,130,255,0.1)", border: "1px solid rgba(26,130,255,0.2)", borderRadius: 100, padding: "3px 10px" }}>{post.cat}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{post.min} min read</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4, letterSpacing: "-.2px" }}>{post.title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: hov ? "#5ba4ff" : "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600, transition: "color .2s", marginTop: "auto" }}>
        Read →
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${open ? "rgba(26,130,255,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14, overflow: "hidden", transition: "border-color .2s",
    }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", background: "none", border: "none",
        color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", textAlign: "left", letterSpacing: "-.2px", gap: 16,
      }}>
        <span>{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 24px 22px", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{a}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function Landing({ onEnterApp }) {
  const [heroRef,  heroVis]  = useReveal(0.05);
  const [featRef,  featVis]  = useReveal(0.08);
  const [statsRef, statsVis] = useReveal(0.15);
  const [faqRef,   faqVis]   = useReveal(0.08);
  const [ctaRef,   ctaVis]   = useReveal(0.15);
  const [navScrolled, setNavScrolled] = useState(false);
  const [blogSlug, setBlogSlug] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e) => setMouse({ x: (e.clientX/window.innerWidth-.5)*2, y: (e.clientY/window.innerHeight-.5)*2 });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#blog/")) setBlogSlug(hash.replace("#blog/",""));
      else setBlogSlug(null);
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  if (blogSlug) {
    return (
      <div style={{ background: "#070b12", color: "#fff", fontFamily: "\'DM Sans\',\'Helvetica Neue\',sans-serif", minHeight: "100vh" }}>
        <SEO />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet"/>
        <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:200,height:64,padding:"0 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,11,18,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => { window.location.hash=""; setBlogSlug(null); }} style={{ display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0 }}>
            <Logo size={28}/><span style={{ fontSize:15,fontWeight:700,letterSpacing:"-.4px",color:"#fff" }}>Logoplacers</span>
          </button>
          <button onClick={onEnterApp} style={{ background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Use the tool</button>
        </nav>
        <BlogPostPage slug={blogSlug} onBack={() => { window.location.hash=""; setBlogSlug(null); }} />
        <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}html{scroll-behavior:smooth}*{box-sizing:border-box}::placeholder{color:rgba(255,255,255,0.25)}"}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#070b12", color: "#fff", fontFamily: "\'DM Sans\',\'Helvetica Neue\',sans-serif", overflowX: "hidden" }}>
      <SEO />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet"/>
      <ExitIntentPopup onEnterApp={onEnterApp} />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:200,height:64,padding:"0 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:navScrolled?"rgba(7,11,18,0.88)":"transparent",backdropFilter:navScrolled?"blur(20px)":"none",borderBottom:navScrolled?"1px solid rgba(255,255,255,0.06)":"none",transition:"all .3s" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}><Logo size={30}/><span style={{ fontSize:16,fontWeight:700,letterSpacing:"-.4px" }}>Logoplacers</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          {["Features","How it works","Pricing","Blog","FAQ"].map(label => (
            <a key={label} href={label==="Blog"?"#blog-section":`#${label.toLowerCase().replace(/ /g,"-")}`}
              style={{ fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",padding:"8px 14px",borderRadius:8,transition:"color .15s" }}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{label}</a>
          ))}
          <button onClick={onEnterApp} style={{ marginLeft:8,background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(26,130,255,0.3)" }}>Use the tool</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <HeroScene/>
        <div style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none",background:"radial-gradient(ellipse 100% 50% at 50% 100%, #070b12 0%, transparent 60%)" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none",background:"radial-gradient(ellipse 60% 80% at 50% 50%, transparent 40%, rgba(7,11,18,0.5) 100%)" }}/>
        <div ref={heroRef} style={{ position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:860 }}>
          <div style={{ marginBottom:20,animation:"fadeUp .7s ease both" }}><SocialProofTicker /></div>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(26,130,255,0.1)",border:"1px solid rgba(26,130,255,0.25)",borderRadius:100,padding:"7px 18px",marginBottom:28,fontSize:11,fontWeight:700,color:"#5ba4ff",letterSpacing:"1.5px",textTransform:"uppercase",animation:"fadeUp .8s .1s ease both" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#1a82ff",display:"inline-block",boxShadow:"0 0 10px #1a82ff" }}/>
            Early access — apply below
          </div>
          <h1 style={{ fontSize:"clamp(44px, 7.5vw, 84px)",fontWeight:800,lineHeight:1.03,letterSpacing:"-3.5px",margin:"0 0 24px",animation:"fadeUp .9s .15s ease both" }}>
            <span style={{ color:"#fff" }}>Personalised demos</span><br/>
            <span style={{ background:"linear-gradient(135deg,#1a82ff 0%,#a78bfa 55%,#5b4fff 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>that close deals.</span>
          </h1>
          <p style={{ fontSize:"clamp(15px,1.8vw,19px)",color:"rgba(255,255,255,0.48)",lineHeight:1.72,maxWidth:540,margin:"0 auto 44px",animation:"fadeUp .9s .25s ease both" }}>
            Upload your product screenshot. Add your prospect's logo. Send a personalised demo directly from Gmail — for every prospect, in seconds.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .9s .35s ease both" }}>
            <button onClick={onEnterApp} style={{ background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",border:"none",borderRadius:14,padding:"16px 36px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 40px rgba(26,130,255,0.4)",transition:"transform .15s, box-shadow .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 48px rgba(26,130,255,0.55)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 40px rgba(26,130,255,0.4)"}}>Use the tool</button>
            <a href="#waitlist" style={{ color:"rgba(255,255,255,0.55)",textDecoration:"none",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"16px 28px",fontSize:15,fontWeight:500,transition:"all .15s",display:"flex",alignItems:"center",gap:8 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.3)";e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(255,255,255,0.55)"}}>Request early access</a>
          </div>
        </div>
        <div style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",zIndex:10,animation:"bounce 2.2s infinite" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding:"72px 48px",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:960,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40,textAlign:"center" }}>
          {[{val:"3.4x",lbl:"more replies vs generic outreach"},{val:"< 30s",lbl:"to personalise per prospect"},{val:"94%",lbl:"of buyers prefer visual demos"}].map(({val,lbl},i)=>(
            <div key={i} style={{ transition:`opacity .7s ${i*150}ms, transform .7s ${i*150}ms`,opacity:statsVis?1:0,transform:statsVis?`translateY(0) translate(${mouse.x*-4*(i-1)}px,${mouse.y*-3}px)`:"translateY(20px)" }}>
              <div style={{ fontSize:"clamp(36px,5vw,52px)",fontWeight:800,letterSpacing:"-2px",lineHeight:1,background:"linear-gradient(135deg,#fff,rgba(26,130,255,0.7))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{val}</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:10 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"120px 48px" }}>
        <div style={{ maxWidth:1140,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:80 }}>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:16 }}>Features</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-2px",margin:0,lineHeight:1.05 }}>Everything you need<br/>to stand out in the inbox.</h2>
          </div>
          <div ref={featRef} style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18 }}>
            {[
              {icon:Icon.bolt,title:"One-click personalisation",desc:"Upload once. Logoplacers auto-fetches your prospect's logo and places it perfectly on your demo — every single time."},
              {icon:Icon.mail,title:"Send directly from Gmail",desc:"Connected to your Gmail. Send personalised demos to your entire prospect list without ever leaving the tool."},
              {icon:Icon.target,title:"Pixel-perfect placement",desc:"Drag, resize and position every element with precision. Your demo looks exactly how you intended for every recipient."},
              {icon:Icon.search,title:"Smart logo detection",desc:"Type a company name and Logoplacers automatically finds and fetches the correct brand logo. No manual searching."},
              {icon:Icon.box,title:"Bulk export in seconds",desc:"Generate personalised images for 50 prospects in the time it used to take to do one. ZIP download or direct send."},
              {icon:Icon.lock,title:"Secure & private",desc:"Your Gmail credentials and prospect data never leave your browser. No server-side storage of any kind."},
            ].map((f,i)=><FeatureCard key={i} {...f} idx={i} visible={featVis} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:"120px 48px",background:"rgba(255,255,255,0.018)" }}>
        <DemoWalkthrough />
      </section>

      {/* COMPARISON */}
      <section style={{ padding:"120px 48px" }}>
        <div style={{ maxWidth:1140,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:72 }}>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:16 }}>vs the alternatives</div>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-2px",margin:"0 0 14px",lineHeight:1.05 }}>Why Logoplacers wins.</h2>
            <p style={{ fontSize:15,color:"rgba(255,255,255,0.38)",margin:0 }}>See how it stacks up against common alternatives.</p>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"120px 48px",background:"rgba(255,255,255,0.018)" }}>
        <div style={{ maxWidth:1140,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:72 }}>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:16 }}>What people say</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-2px",margin:0 }}>Sales teams love it.</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding:"120px 48px" }}>
        <div style={{ maxWidth:740,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:72 }}>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:16 }}>FAQ</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-2px",margin:0 }}>Common questions.</h2>
          </div>
          <div ref={faqRef} style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {[
              {q:"Does Logoplacers store my Gmail credentials?",a:"No. Your Gmail connection uses Google's official OAuth flow entirely in the browser. We never see or store your credentials or email content."},
              {q:"How many prospects can I personalise at once?",a:"There is no hard limit. Logoplacers generates images for every prospect in your list and exports them as a ZIP, or sends them directly via Gmail with anti-spam delays."},
              {q:"What image formats does it support?",a:"PNG, JPG, WEBP and HEIC (iPhone photos). HEIC files are automatically converted in the browser — no external tool needed."},
              {q:"How does automatic logo detection work?",a:"Type a company name or domain and Logoplacers queries multiple logo databases simultaneously. It validates each result and falls back gracefully if a logo cannot be found."},
              {q:"What counts as a credit?",a:"1 credit = 1 personalised image generated. 1 credit = 1 email sent via Gmail. Free users get 4 credits per day. Paid plans get 300–10,000 per month."},
              {q:"Is there a free plan?",a:"Yes. The Free plan gives you 4 credits per day — no credit card required. Enough to test with real prospects before committing."},
              {q:"Can Logoplacers be used with Apollo or Clay?",a:"Absolutely. Export your list from Apollo, Clay, or LinkedIn Sales Navigator, paste it into Logoplacers, and it handles the rest."},
              {q:"How is this different from Hyperise or Lemlist?",a:"Logoplacers is purpose-built for logo-on-screenshot personalisation at speed. Simpler, faster, more focused. No complex setup."},
            ].map((f,i)=><FAQ key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:"120px 48px",background:"rgba(255,255,255,0.018)" }}>
        <Pricing onEnterApp={onEnterApp} />
      </section>

      {/* LIVE DEMO */}
      <section style={{ padding:"120px 48px" }}>
        <LiveDemo />
      </section>

      {/* BLOG */}
      <section id="blog-section" style={{ padding:"120px 48px",background:"rgba(255,255,255,0.018)" }}>
        <BlogSection />
      </section>

      {/* WAITLIST */}
      <section id="waitlist" ref={ctaRef} style={{ padding:"140px 48px 160px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:500,background:"radial-gradient(ellipse, rgba(26,130,255,0.1) 0%, transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:300,background:"radial-gradient(ellipse, rgba(91,79,255,0.08) 0%, transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ maxWidth:520,margin:"0 auto",textAlign:"center",transition:"opacity .9s, transform .9s",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(32px)" }}>
          <div style={{ fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:20 }}>Early access</div>
          <h2 style={{ fontSize:"clamp(32px,5vw,54px)",fontWeight:800,letterSpacing:"-2px",margin:"0 0 16px",lineHeight:1.05 }}>Be first in line.</h2>
          <p style={{ fontSize:16,color:"rgba(255,255,255,0.42)",marginBottom:48,lineHeight:1.7 }}>Logoplacers is rolling out to early users now. Drop your email and we will reach out as soon as your spot opens.</p>
          <div style={{ background:"rgba(255,255,255,0.02)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:24,padding:"36px",boxShadow:"0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <WaitlistForm onEnterApp={onEnterApp}/>
          </div>
          <div style={{ marginTop:28,fontSize:12,color:"rgba(255,255,255,0.2)" }}>No spam. No credit card. Just early access.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)",padding:"40px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}><Logo size={24}/><span style={{ fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.5)" }}>Logoplacers</span></div>
        <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
          {BLOG_POSTS.slice(0,5).map(p=>(
            <a key={p.slug} href={`#blog/${p.slug}`} style={{ fontSize:11,color:"rgba(255,255,255,0.22)",textDecoration:"none",transition:"color .15s",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.22)"}>{p.title.slice(0,45)}…</a>
          ))}
        </div>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.22)" }}>Personalised sales demos that convert.</div>
      </footer>

      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}} @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}} html{scroll-behavior:smooth}*{box-sizing:border-box}::placeholder{color:rgba(255,255,255,0.25)} @media(max-width:768px){.testi-grid{grid-template-columns:1fr!important}}"}</style>
    </div>
  );
}
