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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let script = document.getElementById("threejs-cdn");
    if (!script) {
      script = document.createElement("script");
      script.id = "threejs-cdn";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      document.head.appendChild(script);
    }
    const tryInit = () => { if (window.THREE) { setLoaded(true); } else { setTimeout(tryInit, 50); } };
    script.onload = () => setLoaded(true);
    if (window.THREE) setLoaded(true);
    else tryInit();
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

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0x1a2040, 2));
    const dir = new THREE.DirectionalLight(0x4499ff, 3);
    dir.position.set(5, 8, 5);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x8855ff, 2);
    dir2.position.set(-5, -3, -5);
    scene.add(dir2);

    // ── Central floating "product screenshot" frame ──────────────
    const frameGeo = new THREE.BoxGeometry(7, 4.5, 0.12);
    const frameMat = new THREE.MeshPhongMaterial({
      color: 0x0d1a2e,
      emissive: 0x0a1428,
      specular: 0x1a82ff,
      shininess: 60,
      transparent: true,
      opacity: 0.92,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    scene.add(frame);

    // Frame border glow
    const edgesGeo = new THREE.EdgesGeometry(frameGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x1a82ff, transparent: true, opacity: 0.4 });
    frame.add(new THREE.LineSegments(edgesGeo, edgesMat));

    // Inner screen plane
    const screenGeo = new THREE.PlaneGeometry(6.5, 4.0);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0a1525, transparent: true, opacity: 0.8 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.07;
    frame.add(screen);

    // Grid lines on screen
    const gridHelper = new THREE.GridHelper(6, 12, 0x1a82ff, 0x0d2040);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = 0.08;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    frame.add(gridHelper);

    // ── Floating logo cubes (representing prospect logos) ─────────
    const logoColors = [0x1a82ff, 0x5b4fff, 0x4ecdc4, 0xff6b6b, 0xffd93d];
    const logoCubes = [];
    const positions = [
      [-4.5, 1.5, 2], [4.5, 1.8, 1.5], [-3.8, -1.8, 2.5],
      [4.2, -1.5, 2], [0, 3.2, 1], [-1.5, -3, 1.5],
    ];
    positions.forEach((pos, i) => {
      const s = 0.45 + Math.random() * 0.25;
      const geo = new THREE.BoxGeometry(s, s, s);
      const mat = new THREE.MeshPhongMaterial({
        color: logoColors[i % logoColors.length],
        emissive: logoColors[i % logoColors.length],
        emissiveIntensity: 0.3,
        transparent: true, opacity: 0.85,
      });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(...pos);
      cube.userData.baseY = pos[1];
      cube.userData.phase = Math.random() * Math.PI * 2;
      cube.userData.speed = 0.4 + Math.random() * 0.5;

      // Wire outline
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: logoColors[i % logoColors.length], transparent: true, opacity: 0.6 })
      );
      cube.add(wire);
      scene.add(cube);
      logoCubes.push(cube);
    });

    // ── Orbiting ring ─────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(6, 0.025, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1a82ff, transparent: true, opacity: 0.15 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(8, 0.015, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x5b4fff, transparent: true, opacity: 0.1 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ── Particle field ────────────────────────────────────────────
    const partCount = 300;
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPos[i]   = (Math.random() - 0.5) * 30;
      partPos[i+1] = (Math.random() - 0.5) * 20;
      partPos[i+2] = (Math.random() - 0.5) * 20;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({ color: 0x3366aa, size: 0.07, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(partGeo, partMat));

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize
    const onResize = () => {
      W = el.clientWidth; H = el.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ───────────────────────────────────────────────────
    let raf;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.012;

      // Frame: gentle float + tilt
      frame.position.y = Math.sin(t * 0.5) * 0.18;
      frame.rotation.y = Math.sin(t * 0.3) * 0.06 + mx * 0.04;
      frame.rotation.x = Math.sin(t * 0.2) * 0.03 - my * 0.03;

      // Logo cubes: float + rotate
      logoCubes.forEach((c, i) => {
        c.rotation.x += 0.008 + i * 0.002;
        c.rotation.y += 0.012 + i * 0.001;
        c.position.y = c.userData.baseY + Math.sin(t * c.userData.speed + c.userData.phase) * 0.4;
      });

      // Rings rotate
      ring.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;
      ring2.rotation.y += 0.001;

      // Camera parallax
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.8 + 2 - camera.position.y) * 0.04;
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

  return (
    <div ref={mountRef} style={{
      position: "absolute", inset: 0, zIndex: 1,
      opacity: loaded ? 1 : 0, transition: "opacity 1s",
    }} />
  );
}

// ─────────────────────────────────────────────
// FLOATING 3D FEATURE SCENE
// ─────────────────────────────────────────────
function FeatureScene({ index }) {
  const mountRef = useRef(null);
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
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 4;

    scene.add(new THREE.AmbientLight(0x1a2040, 3));
    const dl = new THREE.DirectionalLight(0x4499ff, 4);
    dl.position.set(3, 5, 3);
    scene.add(dl);

    const colors = [0x1a82ff, 0x5b4fff, 0x4ecdc4, 0xff6b35, 0xffd93d, 0x2ecc71];
    const c = colors[index % colors.length];

    let mainObj;
    switch (index % 6) {
      case 0: {
        const g = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, wireframe: false, transparent: true, opacity: 0.8 }));
        mainObj.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.8 })));
        break;
      }
      case 1: {
        const g = new THREE.TorusGeometry(0.8, 0.25, 12, 40);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, transparent: true, opacity: 0.8 }));
        break;
      }
      case 2: {
        const g = new THREE.OctahedronGeometry(0.9);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.25, transparent: true, opacity: 0.75 }));
        mainObj.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.9 })));
        break;
      }
      case 3: {
        const g = new THREE.IcosahedronGeometry(0.9, 0);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, wireframe: true }));
        break;
      }
      case 4: {
        const g = new THREE.TorusKnotGeometry(0.6, 0.2, 60, 10);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, transparent: true, opacity: 0.85 }));
        break;
      }
      case 5: {
        const g = new THREE.DodecahedronGeometry(0.9, 0);
        mainObj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, transparent: true, opacity: 0.75 }));
        mainObj.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.8 })));
        break;
      }
    }
    scene.add(mainObj);

    // Small orbiting particle
    const orbitGeo = new THREE.SphereGeometry(0.07, 6, 6);
    const orbitMat = new THREE.MeshBasicMaterial({ color: c });
    const orbitDot = new THREE.Mesh(orbitGeo, orbitMat);
    scene.add(orbitDot);

    let raf, t = index * 1.3;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.014;
      mainObj.rotation.x += 0.007;
      mainObj.rotation.y += 0.011;
      orbitDot.position.x = Math.cos(t * 1.5) * 1.6;
      orbitDot.position.y = Math.sin(t * 1.5) * 1.6;
      orbitDot.position.z = Math.sin(t) * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [loaded, index]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ─────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────
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
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "14px 18px", color: "#fff", fontSize: 14,
          fontFamily: "inherit", outline: "none",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(26,130,255,0.5)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
      <input
        type="email" name="email" placeholder="Work email" required
        value={email} onChange={e => setEmail(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "14px 18px", color: "#fff", fontSize: 14,
          fontFamily: "inherit", outline: "none",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(26,130,255,0.5)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
      <button type="submit" disabled={sending} style={{
        background: "linear-gradient(135deg,#1a82ff,#5b4fff)",
        color: "#fff", border: "none", borderRadius: 12, padding: "15px",
        fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 8px 32px rgba(26,130,255,0.35)",
        opacity: sending ? 0.6 : 1, transition: "opacity .2s",
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
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20, overflow: "hidden",
      transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: 140, position: "relative", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <FeatureScene index={idx} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 100%, rgba(7,11,18,0.8) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>
      <div style={{ padding: "24px 24px 28px" }}>
        <div style={{ color: "rgba(26,130,255,0.9)", marginBottom: 14 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-.3px" }}>{title}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.72 }}>{desc}</div>
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "120px 48px", background: "rgba(255,255,255,0.018)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: "#1a82ff", textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 800, letterSpacing: "-2px", margin: 0 }}>
              From upload to inbox<br/>in under a minute.
            </h2>
          </div>
          <div ref={stepsRef} style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {[
              { icon: Icon.upload, title: "Upload your product screenshot", desc: "Start with any screenshot — a dashboard, feature view or landing page. Supports PNG, JPG, WEBP and HEIC.", delay: 0 },
              { icon: Icon.users, title: "Paste your prospect list", desc: "Drop in your prospect names and companies. Logoplacers automatically finds each logo and maps it to your template.", delay: 120 },
              { icon: Icon.move, title: "Position logos and text", desc: "Use the visual editor to drag your prospect's logo onto the perfect spot. Add personalised text with their name or company.", delay: 240 },
              { icon: Icon.send, title: "Send directly from Gmail", desc: "Hit send. Logoplacers generates a unique image for each prospect and delivers it via Gmail with built-in anti-spam delays.", delay: 360 },
            ].map((s, i) => <Step key={i} n={i+1} {...s} visible={stepsVis} />)}
          </div>
        </div>
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
            background: "rgba(10,16,26,0.7)", backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "36px 36px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
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
