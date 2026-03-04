/**
 * AnimatedRecorder.jsx
 * ─────────────────────────────────────────────────────────────────
 * Standalone component — safe to remove without touching App.jsx.
 * To add:    import AnimatedRecorder from "./AnimatedRecorder";
 *            + one mode-tab + one mode === "animate" render block.
 * To remove: delete this file + those two lines in App.jsx.
 * ─────────────────────────────────────────────────────────────────
 *
 * Features:
 *  • Click to set zoom-target point on the base image
 *  • Animated intro: smooth zoom-in to target + logo fade-in
 *  • Record live via MediaRecorder (WebM) while you demo
 *  • Auto-personalises per recipient: swaps company logo + name
 *  • Exports one .webm file per recipient into a ZIP
 */

import { useState, useRef, useEffect, useCallback } from "react";

// ── Helpers ────────────────────────────────────────────────────────

function resolveTemplate(tpl, name, company) {
  if (!tpl) return "";
  return tpl
    .replace(/\(\(name\)\)/gi, (name || "").split(" ")[0])
    .replace(/\(\(fullname\)\)/gi, name || "")
    .replace(/\(\(company\)\)/gi, company || "");
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) { return a + (b - a) * t; }

// Draw one frame onto a canvas context
function drawFrame(ctx, W, H, {
  baseImg, companyLogoEl, myLogoEl, myLogoPos, myLogoSize,
  logoInstances, textLayers, symbols,
  personName, companyName,
  zoom, panX, panY, logoOpacity,
}) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply zoom + pan
  ctx.translate(W / 2, H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-W / 2 + panX, -H / 2 + panY);

  // Base image
  ctx.drawImage(baseImg, 0, 0, W, H);

  const scaleX = baseImg.width / W;
  const scaleY = baseImg.height / H;
  const scale  = Math.max(scaleX, scaleY);

  // Company logos
  if (companyLogoEl && logoOpacity > 0) {
    ctx.globalAlpha = logoOpacity;
    logoInstances.forEach(inst => {
      const x = inst.pos.x, y = inst.pos.y, s = inst.size;
      const ar = companyLogoEl.width / companyLogoEl.height;
      ctx.drawImage(companyLogoEl, x, y, ar >= 1 ? s : s * ar, ar >= 1 ? s / ar : s);
    });
    ctx.globalAlpha = 1;
  }

  // My logo
  if (myLogoEl && logoOpacity > 0) {
    ctx.globalAlpha = logoOpacity;
    const x = myLogoPos.x, y = myLogoPos.y, s = myLogoSize;
    const ar = myLogoEl.width / myLogoEl.height;
    ctx.drawImage(myLogoEl, x, y, ar >= 1 ? s : s * ar, ar >= 1 ? s / ar : s);
    ctx.globalAlpha = 1;
  }

  // Text layers
  textLayers.forEach(cfg => {
    if (!cfg.enabled || !cfg.template?.trim()) return;
    const resolved = resolveTemplate(cfg.template, personName, companyName);
    const fontSize = cfg.fontSize;
    const fw = cfg.fontWeight ?? (cfg.bold ? "bold" : "normal");
    ctx.font = `${cfg.italic ? "italic " : ""}${fw} ${fontSize}px "${cfg.fontFamily || "Inter"}"`;
    ctx.fillStyle = cfg.color;
    const x = cfg.pos.x + 4, y = cfg.pos.y + fontSize + 4;
    resolved.split("\n").forEach((line, i) => ctx.fillText(line, x, y + i * fontSize * 1.4));
  });

  // Symbols
  symbols.forEach(sym => {
    ctx.font = `bold ${sym.size}px Arial`;
    ctx.fillStyle = sym.color;
    ctx.fillText(sym.char, sym.pos.x, sym.pos.y + sym.size);
  });

  ctx.restore();
}

// ── Main component ─────────────────────────────────────────────────

export default function AnimatedRecorder({ renderIngredients, companies }) {
  const [zoomTarget, setZoomTarget]   = useState(null);   // { x, y } in canvas %
  const [zoomLevel, setZoomLevel]     = useState(1.8);
  const [introDur, setIntroDur]       = useState(1800);   // ms
  const [recording, setRecording]     = useState(false);
  const [exporting, setExporting]     = useState(false);
  const [progress, setProgress]       = useState(null);   // "3 / 10"
  const [preview, setPreview]         = useState(null);   // blob URL
  const [selectedId, setSelectedId]   = useState("all");  // "all" or company id

  const canvasRef    = useRef(null);
  const previewRef   = useRef(null);
  const rafRef       = useRef(null);
  const streamRef    = useRef(null);
  const recorderRef  = useRef(null);
  const chunksRef    = useRef([]);
  const startTimeRef = useRef(null);
  const introActiveRef = useRef(false);

  const ri = renderIngredients;
  const W  = ri?.w  || 760;
  const H  = ri?.h  || 520;

  // ── Animation loop (intro only — after that user records freely) ──
  const runIntro = useCallback((companyLogoEl, personName, companyName) => {
    if (!canvasRef.current || !ri) return;
    const ctx = canvasRef.current.getContext("2d");
    const tx = zoomTarget ? zoomTarget.x * W : W / 2;
    const ty = zoomTarget ? zoomTarget.y * H : H / 2;
    const dur = introDur;

    introActiveRef.current = true;
    startTimeRef.current = performance.now();

    const tick = (now) => {
      if (!introActiveRef.current) return;
      const t   = Math.min((now - startTimeRef.current) / dur, 1);
      const ez  = easeInOut(t);
      const zoom = lerp(1, zoomLevel, ez);
      // Pan so the target stays centred
      const panX = lerp(0, (W / 2 - tx) * (zoomLevel - 1) / zoomLevel, ez);
      const panY = lerp(0, (H / 2 - ty) * (zoomLevel - 1) / zoomLevel, ez);
      const logoOpacity = t > 0.4 ? easeInOut((t - 0.4) / 0.6) : 0;

      drawFrame(ctx, W, H, {
        baseImg: ri.baseImg, companyLogoEl, myLogoEl: ri.myLogoEl,
        myLogoPos: ri.myLogoPos, myLogoSize: ri.myLogoSize,
        logoInstances: ri.logoInstances, textLayers: ri.textLayers, symbols: ri.symbols,
        personName, companyName,
        zoom, panX, panY, logoOpacity,
      });

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else introActiveRef.current = false;
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [ri, zoomTarget, zoomLevel, introDur, W, H]);

  // Draw static preview frame whenever ingredients change
  useEffect(() => {
    if (!ri?.baseImg || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const company = companies.find(c => c.status === "ok");
    drawFrame(ctx, W, H, {
      baseImg: ri.baseImg, companyLogoEl: company?.logoEl || null,
      myLogoEl: ri.myLogoEl, myLogoPos: ri.myLogoPos, myLogoSize: ri.myLogoSize,
      logoInstances: ri.logoInstances, textLayers: ri.textLayers, symbols: ri.symbols,
      personName: company?.personName || "", companyName: company?.companyName || "",
      zoom: 1, panX: 0, panY: 0, logoOpacity: 1,
    });
  }, [ri, companies, W, H]);

  // ── Record single company ──────────────────────────────────────
  const recordCompany = useCallback(async (company) => {
    if (!canvasRef.current || !ri) return null;
    return new Promise((resolve) => {
      const stream = canvasRef.current.captureStream(30);
      const rec    = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9" : "video/webm",
      });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      rec.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      rec.start();
      runIntro(company?.logoEl || null, company?.personName || "", company?.companyName || "");
      // Stop after intro + 500ms buffer
      setTimeout(() => { rec.stop(); }, introDur + 500);
    });
  }, [ri, runIntro, introDur]);

  // ── Export all ─────────────────────────────────────────────────
  const exportAll = async () => {
    const JSZip = (await import("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js")).default;
    const targets = selectedId === "all"
      ? companies.filter(c => c.status === "ok")
      : companies.filter(c => c.id === selectedId && c.status === "ok");

    if (!targets.length) return;
    setExporting(true);

    const zip = new JSZip();
    for (let i = 0; i < targets.length; i++) {
      const company = targets[i];
      setProgress(`${i + 1} / ${targets.length} — ${company.companyName}`);
      const blob = await recordCompany(company);
      const fname = `${company.companyName.toLowerCase().replace(/\s+/g, "_")}_demo.webm`;
      zip.file(fname, blob);
      await new Promise(r => setTimeout(r, 200));
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a"); a.href = url;
    a.download = "animerade_demos.zip"; a.click();
    setExporting(false);
    setProgress(null);
  };

  // ── Live record (user records themselves) ──────────────────────
  const startLiveRecord = async () => {
    if (!canvasRef.current) return;
    chunksRef.current = [];
    const stream = canvasRef.current.captureStream(30);
    streamRef.current = stream;
    const rec = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9" : "video/webm",
    });
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setPreview(URL.createObjectURL(blob));
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);

    // Run intro animation at start
    const company = companies.find(c =>
      selectedId === "all" ? c.status === "ok" : c.id === selectedId && c.status === "ok"
    );
    runIntro(company?.logoEl || null, company?.personName || "", company?.companyName || "");
  };

  const stopLiveRecord = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  // ── Click to set zoom target ───────────────────────────────────
  const onCanvasClick = (e) => {
    if (recording || exporting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    setZoomTarget({ x, y });
  };

  // ── Cleanup ────────────────────────────────────────────────────
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  if (!ri?.baseImg) return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🎬</div>
      <p style={styles.emptyTitle}>Ladda upp en basbild på Bild-fliken först</p>
    </div>
  );

  const readyCompanies = companies.filter(c => c.status === "ok");

  return (
    <div style={styles.root}>
      {/* Left panel */}
      <div style={styles.panel}>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>MOTTAGARE</div>
          <select style={styles.select} value={selectedId}
            onChange={e => setSelectedId(e.target.value)}>
            <option value="all">Alla ({readyCompanies.length})</option>
            {readyCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}{c.personName ? ` · ${c.personName}` : ""}</option>
            ))}
          </select>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>ZOOM-MÅL</div>
          <p style={styles.hint}>Klicka på bilden där kameran ska zooma in.</p>
          {zoomTarget
            ? <div style={styles.targetBadge}>✓ Satt ({Math.round(zoomTarget.x*100)}%, {Math.round(zoomTarget.y*100)}%) <button style={styles.clearBtn} onClick={() => setZoomTarget(null)}>×</button></div>
            : <div style={{...styles.targetBadge, opacity:.5}}>Ej satt — zoomar till mitten</div>
          }
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>INTRO-ZOOM</div>
          <div style={styles.row}>
            <span style={styles.slLabel}>Nivå</span>
            <span style={{...styles.slVal, color:"var(--blue)"}}>{zoomLevel.toFixed(1)}×</span>
          </div>
          <input type="range" min={1.1} max={4} step={0.1} value={zoomLevel}
            onChange={e => setZoomLevel(Number(e.target.value))}
            style={{width:"100%",marginBottom:10}} />

          <div style={styles.row}>
            <span style={styles.slLabel}>Varaktighet</span>
            <span style={{...styles.slVal, color:"var(--blue)"}}>{(introDur/1000).toFixed(1)}s</span>
          </div>
          <input type="range" min={500} max={5000} step={100} value={introDur}
            onChange={e => setIntroDur(Number(e.target.value))}
            style={{width:"100%"}} />
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>SPELA IN</div>
          <p style={styles.hint}>Spela in dig själv medan du demonstrerar. Intron körs automatiskt.</p>
          {!recording ? (
            <button style={styles.btnRec} onClick={startLiveRecord}>⏺ Starta inspelning</button>
          ) : (
            <button style={{...styles.btnRec, background:"#ff3b30"}} onClick={stopLiveRecord}>⏹ Stoppa</button>
          )}
          {recording && <div style={styles.recBadge}>● REC</div>}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>EXPORTERA INTRO-VIDEOS</div>
          <p style={styles.hint}>Genererar en personaliserad intro-video per mottagare och laddar ner som ZIP.</p>
          <button style={exporting ? {...styles.btnExport, opacity:.5} : styles.btnExport}
            disabled={exporting} onClick={exportAll}>
            {exporting ? `Exporterar ${progress || ""}` : "⬇ Ladda ner ZIP"}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div style={styles.canvasArea}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{
            ...styles.canvas,
            cursor: recording || exporting ? "default" : "crosshair",
            boxShadow: recording ? "0 0 0 3px #ff3b30" : "0 24px 80px rgba(0,0,0,.7)",
          }}
          onClick={onCanvasClick} />

        {/* Zoom target crosshair */}
        {zoomTarget && !recording && (
          <div style={{
            position:"absolute",
            left: `${zoomTarget.x * 100}%`,
            top:  `${zoomTarget.y * 100}%`,
            transform:"translate(-50%,-50%)",
            width:28, height:28,
            border:"2px solid #0a84ff",
            borderRadius:"50%",
            pointerEvents:"none",
            boxShadow:"0 0 0 2px rgba(10,132,255,.3)",
          }}>
            <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:"#0a84ff",transform:"translateY(-50%)"}}/>
            <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:"#0a84ff",transform:"translateX(-50%)"}}/>
          </div>
        )}

        <div style={styles.canvasHint}>
          {recording ? "Inspelning pågår — klicka ⏹ för att stoppa" :
           exporting ? `Exporterar ${progress}` :
           "Klicka på bilden för att sätta zoom-mål  ·  Scrolla för att zooma förhandsgranskning"}
        </div>
      </div>

      {/* Preview panel */}
      {preview && (
        <div style={styles.previewPanel}>
          <div style={styles.sectionLabel}>FÖRHANDSVISNING</div>
          <video src={preview} controls style={{width:"100%",borderRadius:8,marginBottom:10}} />
          <a href={preview} download="demo.webm" style={styles.btnExport}>⬇ Ladda ner</a>
          <button style={{...styles.btnRec, marginTop:6, background:"var(--bg4)", color:"var(--t1)"}}
            onClick={() => setPreview(null)}>Rensa</button>
        </div>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = {
  root: { display:"flex", height:"100%", overflow:"hidden", background:"var(--bg)" },
  panel: { width:280, background:"var(--bg2)", borderRight:"0.5px solid var(--sep)", overflowY:"auto", padding:"16px 0", display:"flex", flexDirection:"column", gap:0, flexShrink:0 },
  section: { padding:"12px 16px", borderBottom:"0.5px solid var(--sep)" },
  sectionLabel: { fontSize:10, fontWeight:700, letterSpacing:".8px", color:"var(--t4)", textTransform:"uppercase", marginBottom:8 },
  hint: { fontSize:12, color:"var(--t3)", lineHeight:1.5, margin:"0 0 10px" },
  row: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 },
  slLabel: { fontSize:12, color:"var(--t2)" },
  slVal: { fontSize:12, fontWeight:600 },
  select: { width:"100%", background:"var(--bg4)", border:"0.5px solid var(--sep)", color:"var(--t1)", fontFamily:"inherit", fontSize:13, padding:"7px 10px", borderRadius:8, outline:"none" },
  targetBadge: { fontSize:12, color:"var(--blue)", background:"var(--blue-dim)", padding:"5px 10px", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"space-between" },
  clearBtn: { background:"none", border:"none", color:"var(--t3)", cursor:"pointer", fontSize:16 },
  btnRec: { width:"100%", background:"#ff3b30", color:"#fff", border:"none", fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"10px", borderRadius:8, cursor:"pointer" },
  btnExport: { width:"100%", display:"block", textAlign:"center", background:"var(--blue)", color:"#fff", border:"none", fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"10px", borderRadius:8, cursor:"pointer", textDecoration:"none" },
  recBadge: { fontSize:12, color:"#ff3b30", fontWeight:700, textAlign:"center", marginTop:8, animation:"pulse 1s infinite" },
  canvasArea: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, position:"relative", background:"hsl(220 13% 6%)", backgroundImage:"radial-gradient(circle at 1px 1px, hsl(220 8% 14%) 1px, transparent 0)", backgroundSize:"22px 22px", overflow:"auto" },
  canvas: { borderRadius:12, maxWidth:"100%", maxHeight:"100%", objectFit:"contain" },
  canvasHint: { position:"absolute", bottom:16, fontSize:12, color:"var(--t4)", textAlign:"center" },
  previewPanel: { width:260, background:"var(--bg2)", borderLeft:"0.5px solid var(--sep)", padding:16, overflowY:"auto", flexShrink:0, display:"flex", flexDirection:"column", gap:0 },
  empty: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:12 },
  emptyIcon: { fontSize:48 },
  emptyTitle: { fontSize:15, color:"var(--t3)" },
};
