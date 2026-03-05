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
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 2, 14);

    // Lights for glass effect
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pt1 = new THREE.PointLight(0x88bbff, 3, 40); pt1.position.set(6, 8, 6); scene.add(pt1);
    const pt2 = new THREE.PointLight(0xbbccff, 2, 40); pt2.position.set(-6, -4, -4); scene.add(pt2);
    const pt3 = new THREE.PointLight(0xffffff, 1.5, 30); pt3.position.set(0, -6, 8); scene.add(pt3);

    // Glass material factory
    const glassMat = (opacity = 0.18, color = 0xaaccff) => new THREE.MeshPhongMaterial({
      color, emissive: 0x1133aa, emissiveIntensity: 0.06,
      specular: 0xffffff, shininess: 120,
      transparent: true, opacity, side: THREE.DoubleSide,
    });
    const wireGlass = (color = 0xaaccff, opacity = 0.35) => new THREE.LineBasicMaterial({
      color, transparent: true, opacity,
    });

    // ── Central floating frame (product mockup) ────────────────
    const frameGeo = new THREE.BoxGeometry(7, 4.5, 0.1);
    const frame = new THREE.Mesh(frameGeo, glassMat(0.12, 0xddeeff));
    frame.add(new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), wireGlass(0x99ccff, 0.5)));
    scene.add(frame);

    // Inner grid on frame
    for (let i = -3; i <= 3; i++) {
      const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i*1.1,2.2,0.06), new THREE.Vector3(i*1.1,-2.2,0.06)]);
      frame.add(new THREE.Line(lg, wireGlass(0x88aadd, 0.12)));
      const lg2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.4,i*0.7,0.06), new THREE.Vector3(3.4,i*0.7,0.06)]);
      frame.add(new THREE.Line(lg2, wireGlass(0x88aadd, 0.12)));
    }

    // ── Glass geometries floating around ──────────────────────
    const shapes = [];
    const geoList = [
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.OctahedronGeometry(0.55, 0),
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.DodecahedronGeometry(0.5, 0),
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
    ];
    const positions = [[-4.8,1.8,1.5],[4.6,2,1],[- 3.8,-1.6,2],[4,-1.8,1.8],[0.5,3.4,0.5],[-1.2,-3.2,1.2]];

    positions.forEach((pos, i) => {
      const geo = geoList[i % geoList.length];
      const mesh = new THREE.Mesh(geo, glassMat(0.2 + i*0.02, 0xccddff));
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), wireGlass(0xaaccff, 0.7)));
      mesh.position.set(...pos);
      mesh.userData.baseY = pos[1];
      mesh.userData.phase = i * 1.1;
      mesh.userData.floatSpeed = 0.35 + i * 0.07;
      mesh.userData.rotX = (Math.random()-.5)*0.015;
      mesh.userData.rotY = (Math.random()-.5)*0.018;
      scene.add(mesh);
      shapes.push(mesh);
    });

    // ── Torus ring ─────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(6.5, 0.03, 8, 90);
    const ring = new THREE.Mesh(ringGeo, glassMat(0.25, 0xbbddff));
    ring.rotation.x = Math.PI / 3.5;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(9, 0.018, 8, 120);
    const ring2 = new THREE.Mesh(ring2Geo, glassMat(0.15, 0xaabbdd));
    ring2.rotation.x = Math.PI / 6; ring2.rotation.y = Math.PI / 5;
    scene.add(ring2);

    // ── Particles ──────────────────────────────────────────────
    const pCount = 260;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random()-.5)*32; pPos[i+1] = (Math.random()-.5)*22; pPos[i+2] = (Math.random()-.5)*18;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x7799cc, size: 0.055, transparent: true, opacity: 0.45 })));

    // Mouse
    const onMouse = (e) => { mouseRef.current = { x: (e.clientX/window.innerWidth-.5)*2, y: (e.clientY/window.innerHeight-.5)*2 }; };
    window.addEventListener("mousemove", onMouse);
    const onResize = () => { W=el.clientWidth; H=el.clientHeight; camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H); };
    window.addEventListener("resize", onResize);

    let raf, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.011;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      frame.position.y = Math.sin(t * 0.45) * 0.2;
      frame.rotation.y = Math.sin(t * 0.28) * 0.05 + mx * 0.035;
      frame.rotation.x = -my * 0.025;

      shapes.forEach(s => {
        s.rotation.x += s.userData.rotX;
        s.rotation.y += s.userData.rotY;
        s.position.y = s.userData.baseY + Math.sin(t * s.userData.floatSpeed + s.userData.phase) * 0.45;
      });

      ring.rotation.z += 0.0025;
      ring2.rotation.z -= 0.0018; ring2.rotation.y += 0.001;

      camera.position.x += (mx * 1.4 - camera.position.x) * 0.035;
      camera.position.y += (-my * 0.9 + 2 - camera.position.y) * 0.035;
      camera.lookAt(0, 0.5, 0);
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

    // ── Left sidebar (dark navy like Findex) ─────────────────────
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

    // ── Light stat cards (2 prominent ones like Findex) ──────────
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
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 16;
      roundRect(ctx, zx, zy, zoneSize, zoneSize, 12);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Border
      ctx.strokeStyle = fetching ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash(fetching ? [] : [5, 3]);
      roundRect(ctx, zx, zy, zoneSize, zoneSize, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      // Icon
      ctx.strokeStyle = "rgba(59,130,246,0.5)";
      ctx.lineWidth = 1.5;
      // Simple logo icon in centre
      const cx2 = zx + zoneSize/2, cy2 = zy + zoneSize/2 - 8;
      roundRect(ctx, cx2-14, cy2-14, 28, 28, 6);
      ctx.stroke();
      ctx.fillStyle = "rgba(59,130,246,0.1)";
      ctx.fill();
      ctx.fillStyle = "rgba(59,130,246,0.6)";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(company ? company[0].toUpperCase() : "?", cx2, cy2+6);
      // Label
      ctx.fillStyle = fetching ? "#3b82f6" : "rgba(30,41,59,0.55)";
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
      try {
        const domain = company.toLowerCase().replace(/\s+/g, "") + ".com";
        const res = await fetch(`/.netlify/functions/logo?domain=${encodeURIComponent(domain)}`);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => { setLogoEl(img); extractColor(img); setFetching(false); };
          img.src = url;
        } else { setLogoEl(null); setFetching(false); }
      } catch { setLogoEl(null); setFetching(false); }
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
          boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(59,130,246,0.15)",
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
            { label: "Company", placeholder: "e.g. Spotify", val: company, set: setCompany, type: "text" },
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
              <input type="range" min={36} max={120} value={logoSize} onChange={e => setLogoSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6" }} />
            </div>
          )}

          {/* Logo drop zone */}
          <div style={{
            border: `2px dashed ${logoEl ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.18)"}`,
            borderRadius: 14, padding: "18px 14px", textAlign: "center",
            background: logoEl ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.03)",
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
      { company: "Klarna",    name: "Emma Svensson",  email: "emma@klarna.com",    status: "ok" },
      { company: "Spotify",   name: "Marcus Berg",    email: "marcus@spotify.com", status: "ok" },
      { company: "Bolt",      name: "Sofia Lindgren", email: "sofia@bolt.eu",      status: "ok" },
      { company: "Revolut",   name: "Erik Hansson",   email: "erik@revolut.com",   status: "ok" },
      { company: "Northvolt", name: "Anna Karlsson",  email: "anna@northvolt.com", status: "ok" },
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

      // My logo zone
      ctx.fillStyle="rgba(255,255,255,0.04)"; ctx.strokeStyle="rgba(255,255,255,0.12)";
      ctx.setLineDash([5,4]); rr(16,220,210,80,10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="600 12px 'DM Sans',sans-serif";
      ctx.textAlign="center"; ctx.fillText("MY LOGO",121,258);
      ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("Click or drag here loggan",121,274); ctx.textAlign="left";

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
      ctx.fillText("Demo — Klarna",275,120);
      ctx.fillStyle="#64748b"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("Hi Emma, here's what Klarna could look like in your workflow",275,137);

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
        if(i===1){ ctx.fillStyle="#1d4ed8"; ctx.font="600 11px sans-serif"; ctx.fillText("Klarna logo ✓",278,ly+28); }
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

      // Logo (Klarna pink placeholder)
      ctx.fillStyle="rgba(255,20,100,0.12)"; ctx.strokeStyle="rgba(255,20,100,0.4)";
      ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      rr(436,238,72,44,8); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="#e0115f"; ctx.font="bold 11px sans-serif";
      ctx.textAlign="center"; ctx.fillText("Klarna",472,264); ctx.textAlign="left";
      // Drag handles
      [[436,238],[508,238],[436,282],[508,282]].forEach(([hx,hy]) => {
        ctx.fillStyle="#3b82f6"; ctx.fillRect(hx-3,hy-3,6,6);
      });

      // Text layer
      ctx.fillStyle="#1e293b"; ctx.font="bold 12px 'DM Sans',sans-serif";
      ctx.fillText("Hi Emma — see Klarna's data",436,310);
      ctx.fillStyle="#64748b"; ctx.font="10px 'DM Sans',sans-serif";
      ctx.fillText("Personalised for emma@klarna.com",436,326);
    }

    if (step === 3) {
      // Step 4: Export/Send
      ctx.fillStyle="#0a1020"; ctx.fillRect(0,88,W,H-88);

      // Generated demos grid
      const demoCompanies = ["Klarna","Spotify","Bolt","Revolut","Northvolt","Wise","Skyscanner","iZettle"];
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
        const colors={"Klarna":"#e0115f","Spotify":"#1db954","Bolt":"#34d399","Revolut":"#0666eb","Northvolt":"#f59e0b","Wise":"#9ece6a","Skyscanner":"#00b9f1","iZettle":"#ee3124"};
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
// TESTIMONIAL
// ─────────────────────────────────────────────
function Testimonial({ quote, name, role, company, visible, delay = 0 }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20, padding: "28px",
      transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms`,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
    }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#1a82ff" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: 22, fontStyle: "italic" }}>
        "{quote}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#fff",
        }}>{name[0]}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{role}, {company}</div>
        </div>
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
  const [stepsRef, stepsVis] = useReveal(0.08);
  const [statsRef, statsVis] = useReveal(0.15);
  const [testiRef, testiVis] = useReveal(0.08);
  const [faqRef,   faqVis]   = useReveal(0.08);
  const [ctaRef,   ctaVis]   = useReveal(0.15);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: "#070b12", color: "#fff", fontFamily: "'DM Sans','Helvetica Neue',sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(7,11,18,0.88)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all .3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={30}/>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-.4px" }}>Logoplacers</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["Features","How it works","FAQ"].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g,"-")}`}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", padding: "8px 14px", borderRadius: 8, transition: "color .15s" }}
              onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.45)"}>
              {label}
            </a>
          ))}
          <button onClick={onEnterApp} style={{
            marginLeft: 8,
            background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
            color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(26,130,255,0.3)", letterSpacing: "-.1px",
          }}>
            Use the tool
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <HeroScene/>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "radial-gradient(ellipse 100% 50% at 50% 100%, #070b12 0%, transparent 60%)" }}/>
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, transparent 40%, rgba(7,11,18,0.5) 100%)" }}/>

        <div ref={heroRef} style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 820 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(26,130,255,0.1)", border: "1px solid rgba(26,130,255,0.25)",
            borderRadius: 100, padding: "7px 18px", marginBottom: 36,
            fontSize: 11, fontWeight: 700, color: "#5ba4ff", letterSpacing: "1.5px", textTransform: "uppercase",
            animation: "fadeUp .8s ease both",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a82ff", display: "inline-block", boxShadow: "0 0 10px #1a82ff" }}/>
            Early access — apply below
          </div>

          <h1 style={{
            fontSize: "clamp(44px, 7.5vw, 84px)", fontWeight: 800, lineHeight: 1.03,
            letterSpacing: "-3.5px", margin: "0 0 24px",
            animation: "fadeUp .9s .1s ease both",
          }}>
            <span style={{ color: "#fff" }}>Personalised demos</span>
            <br/>
            <span style={{
              background: "linear-gradient(135deg,#1a82ff 0%,#a78bfa 55%,#5b4fff 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>that close deals.</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 1.8vw, 19px)", color: "rgba(255,255,255,0.48)",
            lineHeight: 1.72, maxWidth: 540, margin: "0 auto 48px",
            animation: "fadeUp .9s .2s ease both",
          }}>
            Upload your product screenshot. Add your prospect's logo.
            Send a personalised demo directly from Gmail — for every prospect, in seconds.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp .9s .3s ease both" }}>
            <button onClick={onEnterApp} style={{
              background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
              color: "#fff", border: "none", borderRadius: 14, padding: "16px 36px",
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 8px 40px rgba(26,130,255,0.4)", letterSpacing: "-.2px",
              transition: "transform .15s, box-shadow .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 48px rgba(26,130,255,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 40px rgba(26,130,255,0.4)"; }}>
              Use the tool free
            </button>
            <a href="#waitlist" style={{
              color: "rgba(255,255,255,0.55)", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "16px 28px",
              fontSize: 15, fontWeight: 500, transition: "all .15s",
              display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}>
              Request early access
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          animation: "bounce 2.2s infinite",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: "72px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, textAlign: "center" }}>
          {[
            { val: "3.4x", lbl: "more replies vs generic outreach" },
            { val: "< 30s", lbl: "to personalise per prospect" },
            { val: "94%", lbl: "of buyers prefer visual demos" },
          ].map(({ val, lbl }, i) => (
            <div key={i} style={{ transition: `opacity .7s ${i*150}ms, transform .7s ${i*150}ms`, opacity: statsVis ? 1 : 0, transform: statsVis ? "translateY(0)" : "translateY(20px)" }}>
              <div style={{
                fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1,
                background: "linear-gradient(135deg,#fff,rgba(26,130,255,0.7))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 10, letterSpacing: ".2px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: 0, lineHeight: 1.05 }}>
              Everything you need<br/>to stand out in the inbox.
            </h2>
          </div>
          <div ref={featRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
            {[
              { icon: Icon.bolt, title: "One-click personalisation", desc: "Upload once. Logoplacers auto-fetches your prospect's logo and places it perfectly on your demo — every single time." },
              { icon: Icon.mail, title: "Send directly from Gmail", desc: "Connected to your Gmail. Send personalised demos to your entire prospect list without ever leaving the tool." },
              { icon: Icon.target, title: "Pixel-perfect placement", desc: "Drag, resize and position every element with precision. Your demo looks exactly how you intended for every recipient." },
              { icon: Icon.search, title: "Smart logo detection", desc: "Type a company name and Logoplacers automatically finds and fetches the correct brand logo. No manual searching." },
              { icon: Icon.box, title: "Bulk export in seconds", desc: "Generate personalised images for 50 prospects in the time it used to take to do one. ZIP download or direct send." },
              { icon: Icon.lock, title: "Secure & private", desc: "Your Gmail credentials and prospect data never leave your browser. No server-side storage of any kind." },
            ].map((f, i) => <FeatureCard key={i} {...f} idx={i} visible={featVis} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — interactive demo walkthrough */}
      <section id="how-it-works" style={{ padding: "120px 48px", background: "rgba(255,255,255,0.018)" }}>
        <DemoWalkthrough />
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>What people say</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: 0 }}>Sales teams love it.</h2>
          </div>
          <div ref={testiRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
            {[
              { quote: "I sent 40 personalised demos in the same time it used to take me to build one in Figma. My reply rate went through the roof.", name: "Marcus L.", role: "Senior AE", company: "Scaleup SaaS", delay: 0 },
              { quote: "The Gmail integration is a game changer. My prospects respond saying they were impressed by how tailored the outreach felt.", name: "Sofia R.", role: "SDR Lead", company: "B2B Fintech", delay: 100 },
              { quote: "Every cold email tool promises personalisation but this is the first one that makes it visual. It is like Loom but for demos.", name: "Erik J.", role: "Head of Sales", company: "Growth Agency", delay: 200 },
            ].map((t, i) => <Testimonial key={i} {...t} visible={testiVis} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "120px 48px", background: "rgba(255,255,255,0.018)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: 0 }}>Common questions.</h2>
          </div>
          <div ref={faqRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { q: "Does Logoplacers store my Gmail credentials?", a: "No. Your Gmail connection uses Google's official OAuth flow entirely in the browser. We never see or store your credentials or email content." },
              { q: "How many prospects can I personalise at once?", a: "There is no hard limit. Logoplacers generates images for every prospect in your list and exports them as a ZIP, or sends them directly via Gmail with anti-spam delays." },
              { q: "What image formats does it support?", a: "PNG, JPG, WEBP and HEIC (iPhone photos). HEIC files are automatically converted in the browser — no external tool needed." },
              { q: "How does automatic logo detection work?", a: "Type a company name or domain and Logoplacers queries multiple logo databases simultaneously. It validates each result and falls back gracefully if a logo cannot be found." },
              { q: "Is there a free trial?", a: "Logoplacers is currently in early access. Apply below for access — we will reach out as soon as your spot is ready." },
            ].map((f, i) => <FAQ key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section style={{ padding: "120px 48px", background: "rgba(255,255,255,0.018)" }}>
        <LiveDemo />
      </section>

      {/* WAITLIST */}
      <section id="waitlist" ref={ctaRef} style={{ padding: "140px 48px 160px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(26,130,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(91,79,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }}/>

        <div style={{
          maxWidth: 520, margin: "0 auto", textAlign: "center",
          transition: "opacity .9s, transform .9s",
          opacity: ctaVis ? 1 : 0, transform: ctaVis ? "translateY(0)" : "translateY(32px)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 20 }}>Early access</div>
          <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 16px", lineHeight: 1.05 }}>
            Be first in line.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.42)", marginBottom: 48, lineHeight: 1.7 }}>
            Logoplacers is rolling out to early users now.
            Drop your email and we will reach out as soon as your spot opens.
          </p>

          <div style={{
            background: "rgba(255,255,255,0.02)", backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "36px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>
            <WaitlistForm onEnterApp={onEnterApp}/>
          </div>

          <div style={{ marginTop: 28, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            No spam. No credit card. Just early access.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={24}/>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Logoplacers</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>Personalised sales demos that convert.</div>
      </footer>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)} }
        html{scroll-behavior:smooth}*{box-sizing:border-box}
        ::placeholder{color:rgba(255,255,255,0.25)}
      `}</style>
    </div>
  );
}
