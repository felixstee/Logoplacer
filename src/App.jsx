import { useState, useRef, useEffect } from "react";
import Landing from "./Landing";
import JSZip from "jszip";
import heic2any from "heic2any";

const GOOGLE_FONTS_URL = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;600&family=Raleway:wght@400;600;700&family=Roboto+Condensed:wght@400;700&family=Montserrat:wght@400;600;700&family=Bebas+Neue&family=Space+Grotesk:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Barlow:wght@400;600;700&display=swap";

const style = `
  @import url('${GOOGLE_FONTS_URL}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           hsl(220 13% 9%);
    --bg2:          hsl(220 11% 12%);
    --bg3:          hsl(220 10% 16%);
    --bg4:          hsl(220 9% 20%);
    --sep:          hsl(220 8% 22%);
    --t1:           hsl(0 0% 96%);
    --t2:           hsl(220 6% 65%);
    --t3:           hsl(220 5% 42%);
    --t4:           hsl(220 5% 28%);
    --blue:         hsl(211 100% 58%);
    --blue-dim:     hsla(211 100% 58% / .12);
    --green:        hsl(142 70% 48%);
    --red:          hsl(0 72% 58%);
    --orange:       hsl(31 92% 58%);
    --purple:       hsl(270 70% 68%);
    --yellow:       hsl(46 96% 56%);
    --r-sm:         8px;
    --r-md:         12px;
    --r-lg:         16px;
  }

  body { background: var(--bg); color: var(--t1); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif; -webkit-font-smoothing: antialiased; }
  html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; overflow-x: hidden; }
  .app { min-height: 100vh; width: 100vw; max-width: 100vw; overflow-x: hidden; background: var(--bg); display: grid; grid-template-rows: auto auto 1fr; }

  /* ── Header ─────────────────────────────────────────── */
  .header { padding: 12px 20px; background: var(--bg2); border-bottom: 0.5px solid var(--sep); display: flex; align-items: center; justify-content: space-between; position: relative; }
  .header::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(26,130,255,0.45) 30%, rgba(91,79,255,0.45) 70%, transparent); pointer-events: none; }
  .header-brand { display: flex; align-items: center; gap: 10px; }
  .header-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg,#1a82ff,#5b4fff); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(26,130,255,0.3); }
  .header-name { font-size: 16px; font-weight: 700; background: linear-gradient(135deg,#ffffff,#a5c8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -.3px; }
  .header-sub  { font-size: 11px; color: var(--t3); margin-top: 1px; }
  .header-btns { display: flex; gap: 8px; }

  /* ── Mode tabs ───────────────────────────────────────── */
  .mode-tabs { display: flex; background: var(--bg2); border-bottom: 0.5px solid var(--sep); padding: 0 4px; }
  .mode-tab { flex: 1; padding: 11px 0; text-align: center; font-size: 13px; font-weight: 500; color: var(--t3); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; font-family: inherit; }
  .mode-tab:hover { color: var(--t2); }
  .mode-tab.active { color: #7db8ff; border-bottom-color: #1a82ff; text-shadow: 0 0 20px rgba(26,130,255,0.4); }

  /* ── Layout ──────────────────────────────────────────── */
  .workspace { display: grid; grid-template-columns: 320px 1fr; height: calc(100vh - 101px); overflow: hidden; }
  .sidebar { background: linear-gradient(180deg, rgba(26,15,50,0.4) 0%, var(--bg2) 120px); border-right: 0.5px solid rgba(91,79,255,0.12); overflow-y: auto; padding-bottom: 40px; }
  .sidebar::-webkit-scrollbar { width: 0; }

  /* ── Section titles ──────────────────────────────────── */
  .s-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(167,139,250,0.7); padding: 20px 16px 7px; display: block; }
  .s-row { display: flex; align-items: center; justify-content: space-between; padding: 18px 16px 7px; }
  .s-row .s-label { padding: 0; }

  /* ── Cards ───────────────────────────────────────────── */
  .card { background: var(--bg3); border-radius: var(--r-md); margin: 0 10px; overflow: hidden; border: 0.5px solid var(--sep); }
  .card-pad { padding: 13px; }

  /* ── Upload zone ─────────────────────────────────────── */
  .upload-zone { display: block; border: 1.5px dashed var(--sep); border-radius: var(--r-sm); padding: 18px 14px; text-align: center; cursor: pointer; transition: all .2s; }
  .upload-zone:hover { border-color: var(--blue); background: var(--blue-dim); }
  .upload-zone input { display: none; }
  .uz-icon { display: flex; align-items: center; justify-content: center; margin-bottom: 6px; height: 24px; }
  .uz-text { font-size: 13px; color: var(--t2); }
  .uz-active { font-size: 13px; color: var(--blue); }
  .uz-hint { font-size: 11px; color: var(--t4); margin-top: 3px; }

  /* ── Slider ──────────────────────────────────────────── */
  .sl-wrap { margin-top: 11px; }
  .sl-head { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .sl-label { font-size: 12px; color: var(--t2); }
  .sl-val { font-size: 12px; font-weight: 500; }
  .sl-val-inp { font-size: 12px; font-weight: 500; background: var(--bg4); border: 0.5px solid var(--blue); color: var(--t1); font-family: inherit; border-radius: 4px; padding: 1px 4px; width: 52px; text-align: right; outline: none; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: var(--bg4); outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--blue); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.4); }

  /* ── Layer cards ─────────────────────────────────────── */
  .lcard { background: var(--bg3); border-radius: var(--r-sm); margin: 0 10px 6px; border: 0.5px solid var(--sep); overflow: hidden; }
  .lcard-hd { display: flex; align-items: center; gap: 8px; padding: 10px 12px; cursor: pointer; user-select: none; transition: background .1s; }
  .lcard-hd:hover { background: var(--bg4); }
  .ldot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .lcard-title { font-size: 13px; font-weight: 500; color: var(--t1); flex: 1; }
  .lcard-prev { font-size: 12px; color: var(--t3); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lcard-bd { padding: 12px; border-top: 0.5px solid var(--sep); }
  .lrm { background: none; border: none; color: var(--t4); font-size: 16px; cursor: pointer; line-height: 1; flex-shrink: 0; }
  .lrm:hover { color: var(--red); }
  .lchev { font-size: 10px; color: var(--t4); }

  /* ── Form inputs ─────────────────────────────────────── */
  .inp { width: 100%; background: var(--bg4); border: 0.5px solid var(--sep); color: var(--t1); font-family: inherit; font-size: 13px; padding: 8px 10px; border-radius: var(--r-sm); outline: none; transition: border-color .15s; }
  .inp:focus { border-color: var(--blue); }
  .inp::placeholder { color: var(--t4); }
  .inp.sm { font-size: 12px; padding: 6px 9px; }
  textarea.inp { resize: none; line-height: 1.55; }
  select.inp { cursor: pointer; }

  /* ── Tag buttons ─────────────────────────────────────── */
  .tag-btns { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
  .tag-btn { background: linear-gradient(135deg,rgba(26,130,255,0.12),rgba(91,79,255,0.12)); border: 0.5px solid rgba(91,79,255,0.35); color: #a78bfa; font-size: 11px; padding: 3px 8px; border-radius: 6px; cursor: pointer; font-family: inherit; transition: all .15s; }
  .tag-btn:hover { background: linear-gradient(135deg,#1a82ff,#5b4fff); color:#fff; border-color:transparent; }

  /* ── Controls grid ───────────────────────────────────── */
  .cg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cg-cell { display: flex; flex-direction: column; gap: 3px; }
  .cg-label { font-size: 11px; color: var(--t3); }

  /* ── Colour picker ───────────────────────────────────── */
  .color-swatch { width: 28px; height: 28px; border-radius: 7px; border: 1.5px solid var(--sep); cursor: pointer; padding: 0; flex-shrink: 0; position: relative; overflow: hidden; }
  .color-swatch input[type=color] { opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; }

  /* ── Toggle buttons ──────────────────────────────────── */
  .trow { display: flex; gap: 5px; }
  .tbtn { flex: 1; background: var(--bg4); border: 0.5px solid var(--sep); color: var(--t3); font-family: inherit; font-size: 12px; padding: 6px; border-radius: 7px; cursor: pointer; transition: all .15s; }
  .tbtn.on { background: linear-gradient(135deg,rgba(26,130,255,0.15),rgba(91,79,255,0.15)); border-color: rgba(91,79,255,0.5); color: #a78bfa; }

  /* ── Font-weight pills ───────────────────────────────── */
  .wrow { display: flex; gap: 4px; }
  .wbtn { flex: 1; background: var(--bg4); border: 0.5px solid var(--sep); color: var(--t3); font-family: inherit; font-size: 11px; padding: 5px 2px; border-radius: 6px; cursor: pointer; transition: all .15s; text-align: center; }
  .wbtn.on { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }

  /* ── Send modal ──────────────────────────────────────── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.76); z-index:800; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeup .15s; }
  .modal-box { background:var(--bg2); border:0.5px solid var(--sep); border-radius:var(--r-lg); width:100%; max-width:660px; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,.72); }
  .modal-head { display:flex; align-items:flex-start; justify-content:space-between; padding:16px 20px; border-bottom:0.5px solid var(--sep); flex-shrink:0; }
  .modal-title { font-size:15px; font-weight:600; color:var(--t1); }
  .modal-sub { font-size:11px; color:var(--t3); margin-top:3px; max-width:500px; line-height:1.45; }
  .modal-body { flex:1; overflow-y:auto; padding:18px 20px; display:flex; flex-direction:column; gap:14px; }
  .modal-body::-webkit-scrollbar { width:4px; }
  .modal-body::-webkit-scrollbar-thumb { background:var(--bg4); border-radius:4px; }
  .modal-foot { display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:0.5px solid var(--sep); flex-shrink:0; background:var(--bg2); }
  .modal-close { background:none; border:none; color:var(--t3); font-size:20px; cursor:pointer; padding:0 4px; border-radius:6px; line-height:1; flex-shrink:0; }
  .modal-close:hover { background:var(--bg4); color:var(--t1); }
  .field-lbl { font-size:10px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:var(--t3); margin-bottom:5px; display:block; }
  .modal-inp { width:100%; background:var(--bg4); border:0.5px solid var(--sep); color:var(--t1); font-family:inherit; font-size:13px; padding:8px 10px; border-radius:var(--r-sm); outline:none; }
  .modal-inp:focus { border-color:var(--blue); }
  .modal-ta { width:100%; background:var(--bg4); border:0.5px solid var(--sep); color:var(--t1); font-family:inherit; font-size:13px; padding:8px 10px; border-radius:var(--r-sm); outline:none; resize:vertical; line-height:1.6; min-height:120px; }
  .modal-ta:focus { border-color:var(--blue); }
  .rcpt-row { display:flex; align-items:center; gap:9px; padding:7px 0; border-bottom:0.5px solid var(--sep); }
  .rcpt-row:last-child { border-bottom:none; }
  .send-row { display:flex; align-items:center; gap:12px; padding:11px 12px; background:var(--bg3); border:0.5px solid var(--sep); border-radius:var(--r-sm); }
  .send-thumb { width:56px; height:36px; object-fit:cover; border-radius:5px; border:0.5px solid var(--sep); flex-shrink:0; background:var(--bg4); }
  .send-thumb-ph { width:56px; height:36px; border-radius:5px; background:var(--bg4); border:0.5px solid var(--sep); display:flex; align-items:center; justify-content:center; color:var(--t4); flex-shrink:0; font-size:18px; }
  .send-info { flex:1; min-width:0; }
  .send-name { font-size:13px; font-weight:500; color:var(--t1); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .send-detail { font-size:11px; color:var(--t3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
  .send-st { font-size:11px; font-weight:600; min-width:60px; text-align:right; flex-shrink:0; }
  .send-st.ok { color:var(--green); } .send-st.err { color:var(--red); } .send-st.ing { color:var(--orange); }
  .google-btn { display:flex; align-items:center; gap:10px; background:#fff; color:#3c4043; border:none; font-family:inherit; font-size:14px; font-weight:500; padding:10px 22px; border-radius:8px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.25); transition:box-shadow .15s; }
  .google-btn:hover { box-shadow:0 4px 16px rgba(0,0,0,.3); }
  .auth-center { display:flex; flex-direction:column; align-items:center; gap:14px; padding:24px 16px; text-align:center; }
  .auth-icon { width:52px; height:52px; border-radius:14px; background:var(--bg3); display:flex; align-items:center; justify-content:center; font-size:24px; }
  .email-dot { width:6px; height:6px; border-radius:50%; background:var(--green); flex-shrink:0; }

  /* ── Buttons ─────────────────────────────────────────── */
  .btn-p { background: linear-gradient(135deg, #1a82ff, #5b4fff); color: #fff; border: none; font-family: inherit; font-size: 14px; font-weight: 500; padding: 10px 16px; border-radius: var(--r-sm); cursor: pointer; width: 100%; transition: opacity .15s, box-shadow .15s; box-shadow: 0 4px 16px rgba(26,130,255,0.25); }
  .btn-p:hover { opacity: .92; box-shadow: 0 6px 22px rgba(26,130,255,0.38); }
  .btn-p:disabled { background: var(--bg4); color: var(--t4); cursor: not-allowed; opacity: 1; }
  .btn-s { background: var(--bg4); color: var(--t1); border: 0.5px solid var(--sep); font-family: inherit; font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: var(--r-sm); cursor: pointer; white-space: nowrap; transition: all .15s; }
  .btn-s:hover { background: rgba(26,130,255,0.1); border-color: rgba(26,130,255,0.3); color: #7db8ff; }
  .btn-s:disabled { opacity: .38; cursor: not-allowed; }
  .btn-text { background: none; border: none; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--blue); cursor: pointer; padding: 0; display: flex; align-items: center; gap: 3px; }
  .btn-text:hover { opacity: .8; }
  .btn-text-red { background: none; border: none; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--red); cursor: pointer; padding: 0; }
  .btn-text-red:hover { opacity: .8; }

  /* ── Paste area ──────────────────────────────────────── */
  .paste-area { width: 100%; height: 100px; background: var(--bg4); border: 0.5px solid var(--sep); color: var(--t1); font-size: 12px; padding: 9px 11px; border-radius: var(--r-sm); resize: none; outline: none; line-height: 1.6; font-family: "SF Mono", "Fira Code", monospace; }
  .paste-area:focus { border-color: var(--blue); }
  .paste-area::placeholder { color: var(--t4); }

  /* ── Symbol grid ─────────────────────────────────────── */
  .sym-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; padding: 8px; }
  .sym-btn { background: none; border: none; font-size: 16px; padding: 7px 0; border-radius: 8px; cursor: pointer; text-align: center; color: var(--t2); transition: background .1s; }
  .sym-btn:hover { background: var(--bg4); color: var(--t1); }
  .sym-row { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-top: 0.5px solid var(--sep); }

  /* ── Company list ────────────────────────────────────── */
  .co-list-wrap { margin: 0 10px; background: var(--bg3); border-radius: var(--r-md); border: 0.5px solid var(--sep); overflow: hidden; }
  .co-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 0.5px solid var(--sep); }
  .co-hd-label { font-size: 13px; color: var(--t2); }
  .co-row { display: flex; align-items: center; gap: 9px; padding: 9px 13px; border-bottom: 0.5px solid var(--sep); }
  .co-row:last-child { border-bottom: none; }
  .co-logo { width: 32px; height: 32px; background: #fff; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
  .co-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
  .co-logo .ph { font-size: 12px; color: #888; font-weight: 600; }
  .co-logo .spinner { width: 13px; height: 13px; border: 2px solid #ddd; border-top-color: #888; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .co-info { flex: 1; min-width: 0; }
  .co-name { font-size: 13px; font-weight: 500; color: var(--t1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .co-sub  { font-size: 11px; color: var(--t3); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .badge-ok  { font-size: 12px; color: var(--green); }
  .badge-err { font-size: 12px; color: var(--red); cursor: pointer; background: none; border: none; }
  .ico-rm { background: none; border: none; color: var(--t4); font-size: 16px; cursor: pointer; line-height: 1; }
  .ico-rm:hover { color: var(--red); }
  .ico-edit { background:none; border:none; color:var(--t4); cursor:pointer; font-size:12px; padding:2px 3px; border-radius:4px; line-height:1; flex-shrink:0; }
  .ico-edit:hover { color:var(--blue); }
  .domain-inp { background:var(--bg); border:0.5px solid var(--blue); color:var(--t1); font-family:"SF Mono","Fira Code",monospace; font-size:11px; padding:3px 7px; border-radius:5px; outline:none; width:100%; min-width:0; }

  /* ── Canvas area ─────────────────────────────────────── */
  .canvas-area { display: flex; flex-direction: column; overflow: hidden; }
  .canvas-toolbar { padding: 10px 18px; border-bottom: 0.5px solid var(--sep); background: var(--bg2); display: flex; align-items: center; gap: 10px; }
  .canvas-wrapper { flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; padding: 40px; background: hsl(220 13% 6%); background-image: radial-gradient(circle at 1px 1px, hsl(220 8% 14%) 1px, transparent 0); background-size: 22px 22px; position: relative; }
  .zoom-controls { position: absolute; bottom: 16px; right: 16px; display: flex; align-items: center; gap: 6px; background: var(--bg2); border: 0.5px solid var(--sep); border-radius: 10px; padding: 5px 8px; z-index: 10; }
  .zoom-btn { background: none; border: none; color: var(--t2); font-size: 16px; cursor: pointer; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: 600; }
  .zoom-btn:hover { background: var(--bg4); color: var(--t1); }
  .zoom-label { font-size: 11px; color: var(--t3); min-width: 34px; text-align: center; font-variant-numeric: tabular-nums; }
  .canvas-container { position: relative; border-radius: var(--r-lg); overflow: hidden; user-select: none; box-shadow: 0 24px 80px rgba(0,0,0,.7), 0 0 0 0.5px rgba(255,255,255,.07); }
  .canvas-container canvas { display: block; }
  .canvas-footer { font-size: 12px; color: var(--t4); padding: 9px 20px; text-align: center; background: var(--bg2); border-top: 0.5px solid var(--sep); }

  /* ── Overlay boxes ───────────────────────────────────── */
  .overlay-box { position: absolute; border: 1.5px dashed; cursor: move; display: flex; align-items: center; justify-content: center; border-radius: 0; }
  .overlay-box.text-box { padding: 4px 7px; min-width: 20px; min-height: 10px; align-items: flex-start; justify-content: flex-start; border-radius: 4px; }
  .inner-text { pointer-events: none; white-space: pre; line-height: 1.4; }
  .ov-pill { position: absolute; top: -20px; left: 0; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 100px; color: #fff; pointer-events: none; white-space: nowrap; }

  /* ── Empty state ─────────────────────────────────────── */
  .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; height: 100%; justify-content: center; }
  .empty-icon { width: 64px; height: 64px; border-radius: 18px; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .empty-title { font-size: 15px; font-weight: 500; color: var(--t2); }
  .empty-sub   { font-size: 13px; color: var(--t3); text-align: center; }

  /* ── Toast ───────────────────────────────────────────── */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg3); color: var(--t1); font-size: 13px; font-weight: 500; padding: 10px 18px; border-radius: 100px; z-index: 999; border: 0.5px solid var(--sep); box-shadow: 0 8px 32px rgba(0,0,0,.5); white-space: nowrap; animation: fadeup .2s; }
  @keyframes fadeup { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

  /* ── Video mode ──────────────────────────────────────── */
  .timing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
  .timing-cell { display: flex; flex-direction: column; gap: 4px; }
  .timing-label { font-size: 11px; color: var(--t3); }
  .timing-input { background: var(--bg3); border: 0.5px solid var(--sep); color: var(--t1); font-family: inherit; font-size: 13px; padding: 6px 9px; border-radius: var(--r-sm); outline: none; width: 100%; transition: border-color .15s; }
  .timing-input:focus { border-color: var(--blue); }
  .font-select { appearance: none; -webkit-appearance: none; background: var(--bg3); border: 0.5px solid var(--sep); color: var(--t1); font-family: inherit; font-size: 12px; padding: 7px 28px 7px 10px; border-radius: var(--r-sm); outline: none; cursor: pointer; width: 100%; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; transition: border-color .15s; }
  .font-select:focus { border-color: var(--blue); }
  .font-select option { background: var(--bg2); color: var(--t1); }
  .contact-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--sep); }
  .contact-row:last-child { border-bottom: none; }
  .contact-row-name { flex: 1; font-size: 13px; color: var(--t1); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .contact-row-company { font-size: 11px; color: var(--t3); }
  .screenshot-thumb { width: 40px; height: 26px; object-fit: cover; border-radius: 5px; border: 0.5px solid var(--sep); flex-shrink: 0; }
  .screenshot-placeholder { width: 40px; height: 26px; border: 1px dashed var(--sep); border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; font-size: 12px; color: var(--t4); }
  .open-link-btn { font-size: 12px; color: var(--blue); background: none; border: none; cursor: pointer; font-family: inherit; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
  .open-link-btn:hover { opacity: .75; }
  .gen-btn { background: var(--blue); color: #fff; border: none; font-family: inherit; font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 7px; cursor: pointer; white-space: nowrap; }
  .gen-btn:disabled { background: var(--bg4); color: var(--t4); cursor: not-allowed; }
  .gen-btn.generating { background: linear-gradient(135deg,#1a82ff,#5b4fff); }

  /* ─────────────────────────────────────────────────────
     MOBILE RESPONSIVE  (max-width: 768px)
  ───────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    /* Header */
    .header { padding: 10px 12px; }
    .header-sub { display: none; }
    .header-name { font-size: 14px; }
    .header-icon { width: 28px; height: 28px; font-size: 14px; }
    .header-btns { gap: 4px; }
    .header-btns .btn-s { display: none; }
    .header-btns .btn-p { font-size: 11px; padding: 6px 10px; white-space: nowrap; }

    /* Mode tabs */
    .mode-tab { font-size: 12px; padding: 9px 0; }

    /* Main workspace: stack vertically */
    .workspace {
      grid-template-columns: 1fr !important;
      height: auto !important;
      overflow: visible !important;
    }
    .sidebar {
      max-height: 40vh;
      border-right: none;
      border-bottom: 0.5px solid var(--sep);
      overflow-y: auto;
    }
    .canvas-area { height: 52vh; }
    .canvas-wrapper { padding: 14px; }
    .canvas-footer { font-size: 11px; padding: 7px 12px; }
    .zoom-controls { bottom: 8px; right: 8px; padding: 4px 6px; }

    /* Modal */
    .modal-overlay { padding: 10px; }
    .modal-box { max-height: 95vh; }
    .modal-head { padding: 12px 14px; }
    .modal-body { padding: 12px 14px; gap: 10px; }
    .modal-foot { padding: 10px 14px; gap: 6px; }
    .modal-title { font-size: 14px; }

    /* Sidebar cards */
    .card { margin: 0 8px; }
    .lcard { margin: 0 8px 6px; }
    .co-list-wrap { margin: 0 8px; }
    .s-label { padding: 14px 14px 6px; }
    .s-row { padding: 14px 14px 6px; }
    .cg { grid-template-columns: 1fr 1fr; }
    .upload-zone { padding: 14px 10px; }

    /* Toast */
    .toast {
      font-size: 12px;
      padding: 8px 14px;
      white-space: normal;
      text-align: center;
      max-width: 88vw;
    }

    /* Video mode */
    .video-workspace {
      grid-template-columns: 1fr !important;
      height: auto !important;
      overflow: visible !important;
    }
    .video-workspace .sidebar {
      max-height: 38vh;
      border-right: none;
      border-bottom: 0.5px solid var(--sep);
    }
    .video-workspace > div:last-child { height: 52vh; overflow: hidden; }
  }
`;

const COLOR_PRESETS = [
  "#ffffff","#000000","#c8f04c","#60a5fa","#f87171","#fbbf24","#a78bfa",
  "#34d399","#f97316","#e879f9","#38bdf8","#fb7185","#4ade80","#facc15",
  "#c084fc","#22d3ee","#f43f5e","#84cc16","#818cf8","#fb923c",
];

const FONT_OPTIONS = [
  { label: "Arial", value: "Arial" },
  { label: "Inter", value: "Inter" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Oswald", value: "Oswald" },
  { label: "Raleway", value: "Raleway" },
  { label: "Bebas Neue", value: "Bebas Neue" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Barlow", value: "Barlow" },
  { label: "Roboto Condensed", value: "Roboto Condensed" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Lora", value: "Lora" },
  { label: "Georgia", value: "Georgia" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
];

const SYMBOL_OPTIONS = ["×", "+", "=", "→", "←", "↑", "↓", "★", "♦", "●", "▲", "◆", "♥", "✓", "~"];
const LAYER_COLORS = ["#c8f04c","#60a5fa","#f87171","#a78bfa","#fbbf24","#34d399","#f97316","#e879f9"];

function domainToCompanyName(domain) {
  let name = domain.replace(/^www\./, "").split(".")[0];
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return cleanCompanyName(name);
}

function cleanCompanyName(name) {
  return name
    .replace(/\s+(AB|Aktiebolag|Publ|AB\.|Inc\.?|LLC|Ltd\.?|GmbH|BV|AS|ApS|Oy|SAS|SRL|Corp\.?|Co\.?)$/i, "")
    .trim();
}

function guessDomain(input, email = null) {
  let s = input.trim().toLowerCase();
  if (s.includes(".")) return s.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  s = s.replace(/\s+(ab|aktiebolag|publ|inc\.?|llc|ltd\.?|gmbh|bv|as|aps|oy|sas|srl|corp\.?|co\.?)$/i, "").trim();
  s = s.replace(/\s+/g, "");
  const known = { google:"google.com", apple:"apple.com", microsoft:"microsoft.com", amazon:"amazon.com", meta:"meta.com", facebook:"facebook.com", netflix:"netflix.com", spotify:"spotify.com", uber:"uber.com", tesla:"tesla.com", ikea:"ikea.com", volvo:"volvo.com", klarna:"klarna.com" };
  if (known[s]) return known[s];
  if (email) {
    const emailDomain = email.split("@")[1];
    if (emailDomain) {
      const tld = emailDomain.slice(emailDomain.lastIndexOf("."));
      return s + tld;
    }
  }
  return s + ".com";
}

const SKIP_RE = new RegExp(
  "^(request|click to|access |fair\\d|\\+\\d|sweden|gothenburg|stockholm|" +
  "saevsjoe|malmoe|financial services|accounting|retail|investments|outdoor|" +
  "information tech|software|health|medical|telecom|packaging|" +
  "ceo|cfo|coo|cto|cpo|chief|officer|founder|co-founder|director|" +
  "manager|head|president|partner|controller|advisor|\\d+)", "i"
);

const ROLE_WORDS = [
  "ceo","cfo","coo","cto","cpo","vp","vice","chief","officer",
  "founder","co-founder","director","manager","head","president",
  "partner","lead","controller","advisor",
];

function isSkipLine(line) {
  if (!line || line.length < 2) return true;
  if (SKIP_RE.test(line.trim())) return true;
  if (/^[A-Z]$/.test(line.trim())) return true;
  return false;
}

function looksLikeName(line) {
  const words = line.trim().split(/\s+/);
  if (words.length < 1 || words.length > 4) return false;
  if (/\d/.test(line) || /@/.test(line) || /,/.test(line)) return false;
  if (isSkipLine(line)) return false;
  return words.every(w => /^[A-ZÅÄÖ][a-zåäö]{1,}/.test(w));
}

function looksLikeCompany(line) {
  if (!line || line.length < 2 || line.length > 80) return false;
  if (/^\d+$/.test(line) || /@/.test(line) || /http/i.test(line)) return false;
  if (isSkipLine(line)) return false;
  const lower = line.toLowerCase().trim();
  if (ROLE_WORDS.some(w => lower === w)) return false;
  if (ROLE_WORDS.some(w => lower.startsWith(w + " ") && lower.length < 30)) return false;
  return true;
}

function extractContacts(raw) {
  const results = []; const seen = new Set();
  const lines = raw.split("\n").map(l => l.trim());
  const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  const emailIdxs = lines.reduce((a, l, i) => { if (EMAIL_RE.test(l)) a.push(i); return a; }, []);

  if (emailIdxs.length > 0) {
    for (const ei of emailIdxs) {
      const email = lines[ei].toLowerCase();
      let personName = "", companyName = "";
      for (let back = 1; back <= 12; back++) {
        const c = (lines[ei - back] || "").trim();
        if (!c) continue;
        if (/^request phone/i.test(c)) continue;
        if (/^\+\d/.test(c)) continue;
        if (/^\d+$/.test(c)) continue;
        if (/^(click to|access |fair\d|sweden|gothenburg|stockholm|malmoe|saevsjoe)/i.test(c)) continue;
        if (/^(financial services|accounting|retail|investments|outdoor|information tech|software|health|medical|telecom|packaging|renewables|defense|hospital|marketing|food|research)/i.test(c)) continue;
        if (/^[A-Z]$/.test(c)) continue;
        if (EMAIL_RE.test(c)) break;
        if (back === 1 && !isSkipLine(c) && looksLikeCompany(c)) { companyName = c; continue; }
        if (back === 2 && !companyName && !isSkipLine(c) && looksLikeCompany(c)) { companyName = c; continue; }
        if (!personName && looksLikeName(c)) { personName = c; }
        if (personName && companyName) break;
      }
      if (!companyName) {
        for (let fwd = 1; fwd <= 3; fwd++) {
          const c = (lines[ei + fwd] || "").trim();
          if (!c || EMAIL_RE.test(c)) break;
          if (!isSkipLine(c) && looksLikeCompany(c)) { companyName = c; break; }
        }
      }
      if (!companyName) continue;
      const key = companyName.toLowerCase();
      if (!seen.has(key)) { seen.add(key); results.push({ personName, companyName, email }); }
    }
    if (results.length > 0) return results;
  }

  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const bLines = block.split("\n").map(l => l.trim()).filter(Boolean);
    let personName = "", companyName = "", email = null;
    for (const l of bLines) {
      if (!email && EMAIL_RE.test(l)) { email = l.toLowerCase(); continue; }
      if (!personName && looksLikeName(l)) { personName = l; continue; }
      if (!companyName && looksLikeCompany(l)) { companyName = l; }
    }
    if (companyName) {
      const key = companyName.toLowerCase();
      if (!seen.has(key)) { seen.add(key); results.push({ personName, companyName, email }); }
    }
  }
  return results;
}

async function fetchLogoDataURL(domain) {
  const d = domain.replace(/^www\./, "");
  const proxyUrl = `/.netlify/functions/logo?domain=${encodeURIComponent(d)}`;
  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const blob = await res.blob();
      if (blob.size >= 50) {
        const dataUrl = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(blob);
        });
        await new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => img.width <= 2 && img.height <= 2 ? rej() : res();
          img.onerror = rej;
          img.src = dataUrl;
        });
        return dataUrl;
      }
    }
  } catch { /* fall through */ }
  throw new Error("no logo found for " + domain);
}

function resolveTemplate(template, personName, companyName) {
  const firstName = (personName || "").split(" ")[0];
  const possessive = /[sxzSXZ]$/.test(firstName) ? firstName : firstName + "s";
  return template
    .replace(/\(\(name\)\)s/gi, possessive)
    .replace(/\(\(name\)\)/gi, firstName)
    .replace(/\(\(fullname\)\)/gi, personName || "")
    .replace(/\(\(company\)\)/gi, companyName || "");
}

function PxInput({ value, onChange, color, suffix = "px", min = 1, max = 2000 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
    setEditing(false);
  };
  if (editing) return (
    <input className="sl-val-inp" autoFocus value={draft}
      style={{ color: color || "var(--t1)" }}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} />
  );
  return (
    <span className="sl-val" style={{ color, cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 2 }}
      title="Click to edit" onClick={() => { setDraft(String(value)); setEditing(true); }}>
      {value}{suffix}
    </span>
  );
}

function renderComposite(baseImg, logoInstances, myLogoEl, myLogoPos, myLogoSize, displayW, displayH, textLayers, symbols, personName, companyName, companyLogoEl, canvasBg) {
  const off = document.createElement("canvas");
  off.width = baseImg.width; off.height = baseImg.height;
  const ctx = off.getContext("2d");
  if (canvasBg?.enabled) { ctx.fillStyle = canvasBg.color; ctx.fillRect(0, 0, off.width, off.height); }
  ctx.drawImage(baseImg, 0, 0);
  if (canvasBg?.personalisedColors && canvasBg?.brandColor && canvasBg?.colorToReplace) {
    try {
      const { r: br, g: bg2, b: bb } = canvasBg.brandColor;
      const hex = canvasBg.colorToReplace.replace("#","");
      const tr = parseInt(hex.slice(0,2),16), tg = parseInt(hex.slice(2,4),16), tb = parseInt(hex.slice(4,6),16);
      const imgData = ctx.getImageData(0, 0, off.width, off.height);
      const d = imgData.data;
      const tolerance = 60;
      for (let i = 0; i < d.length; i += 4) {
        const dr2 = Math.abs(d[i]-tr), dg2 = Math.abs(d[i+1]-tg), db2 = Math.abs(d[i+2]-tb);
        if (dr2 < tolerance && dg2 < tolerance && db2 < tolerance) {
          const strength = 1 - Math.sqrt(dr2*dr2+dg2*dg2+db2*db2) / (tolerance * Math.sqrt(3));
          d[i]   = Math.round(d[i]   * (1-strength) + br * strength);
          d[i+1] = Math.round(d[i+1] * (1-strength) + bg2 * strength);
          d[i+2] = Math.round(d[i+2] * (1-strength) + bb * strength);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch(e) { console.warn("Colour replace failed:", e); }
  }
  const scaleX = baseImg.width / displayW, scaleY = baseImg.height / displayH;
  const scale = Math.max(scaleX, scaleY);

  logoInstances.forEach(inst => {
    if (!companyLogoEl) return;
    const x = inst.pos.x * scaleX, y = inst.pos.y * scaleY;
    const s = inst.size * scale;
    const ar = companyLogoEl.width / companyLogoEl.height;
    ctx.drawImage(companyLogoEl, x, y, ar >= 1 ? s : s * ar, ar >= 1 ? s / ar : s);
  });

  if (myLogoEl) {
    const x = myLogoPos.x * scaleX, y = myLogoPos.y * scaleY;
    const s = myLogoSize * scale;
    const ar = myLogoEl.width / myLogoEl.height;
    ctx.drawImage(myLogoEl, x, y, ar >= 1 ? s : s * ar, ar >= 1 ? s / ar : s);
  }

  textLayers.forEach(cfg => {
    if (!cfg.enabled || !cfg.template.trim()) return;
    const resolved = resolveTemplate(cfg.template, personName, companyName);
    const fontSize = cfg.fontSize * scale;
    const fw = cfg.fontWeight ?? (cfg.bold ? "bold" : "normal");
    ctx.font = `${cfg.italic ? "italic " : ""}${fw} ${fontSize}px "${cfg.fontFamily}"`;
    ctx.fillStyle = cfg.color;
    const x = cfg.pos.x * scaleX + 4 * scaleX;
    const y = cfg.pos.y * scaleY + fontSize + 4 * scaleY;
    resolved.split("\n").forEach((line, i) => ctx.fillText(line, x, y + i * fontSize * 1.4));
  });

  symbols.forEach(sym => {
    const fontSize = sym.size * scale;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = sym.color;
    ctx.fillText(sym.char, sym.pos.x * scaleX, sym.pos.y * scaleY + fontSize);
  });

  return off;
}

function extractDominantColor(img) {
  try {
    const tmp = document.createElement("canvas");
    tmp.width = 48; tmp.height = 48;
    const ctx2 = tmp.getContext("2d");
    ctx2.drawImage(img, 0, 0, 48, 48);
    const data = ctx2.getImageData(0, 0, 48, 48).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i+3]; if (a < 30) continue;
      const rv = data[i], gv = data[i+1], bv = data[i+2];
      const brightness = (rv + gv + bv) / 3;
      const sat = Math.max(rv,gv,bv) - Math.min(rv,gv,bv);
      if (brightness > 230 || brightness < 25 || sat < 18) continue;
      r += rv; g += gv; b += bv; count++;
    }
    if (count < 10) return null;
    return { r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) };
  } catch { return null; }
}

function TextLayerCard({ layer, idx, total, onChange, onRemove, isOpen, onToggle }) {
  const inputRef = useRef(null);
  const color = LAYER_COLORS[idx % LAYER_COLORS.length];

  const insertTag = (tag) => {
    const el = inputRef.current;
    if (!el) { onChange({ template: layer.template + tag }); return; }
    const s = el.selectionStart, e = el.selectionEnd;
    onChange({ template: layer.template.slice(0, s) + tag + layer.template.slice(e) });
    setTimeout(() => { el.focus(); el.setSelectionRange(s + tag.length, s + tag.length); }, 0);
  };

  return (
    <div className="lcard">
      <div className="lcard-hd" onClick={onToggle}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }} />
        <span className="lcard-title">Text {idx + 1}</span>
        <span className="lcard-prev">{layer.template || "empty"}</span>
        <span className="lchev">{isOpen ? "▲" : "▼"}</span>
        {total > 1 && <button className="lrm" onClick={e => { e.stopPropagation(); onRemove(); }}>×</button>}
      </div>
      {isOpen && (
        <div className="lcard-bd">
          <input ref={inputRef} className="inp" style={{marginBottom:8}} placeholder="Hi ((name)) at ((company))!"
            value={layer.template} onChange={e => onChange({ template: e.target.value })} />
          <div className="tag-btns">
            <button className="tag-btn" onClick={() => insertTag("((name))")}>+ first name</button>
            <button className="tag-btn" onClick={() => insertTag("((fullname))")}>+ full name</button>
            <button className="tag-btn" onClick={() => insertTag("((company))")}>+ company</button>
          </div>
          <div className="cg">
            <div className="cg-cell">
              <span className="cg-label">Size</span>
              <PxInput value={layer.fontSize} onChange={v => onChange({ fontSize: v })} color="var(--t1)" min={1} max={1000} />
            </div>
            <div className="cg-cell">
              <span className="cg-label">Font</span>
              <select className="font-select" value={layer.fontFamily} onChange={e => onChange({ fontFamily: e.target.value })}>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"span 2",display:"flex",flexDirection:"column",gap:4}}>
              <span className="cg-label">Weight</span>
              <div className="wrow">
                {[["normal","Regular"],["600","Semi"],["bold","Bold"]].map(([val,lbl]) => {
                  const isOn = (layer.fontWeight ?? (layer.bold ? "bold" : "normal")) === val;
                  return <button key={val} className={`wbtn${isOn?" on":""}`} style={{fontWeight:val}} onClick={() => onChange({ fontWeight: val, bold: val==="bold" })}>{lbl}</button>;
                })}
              </div>
            </div>
            <div className="trow" style={{gridColumn:"span 2"}}>
              <button className={`tbtn${layer.italic ? " on" : ""}`} style={{fontStyle:"italic"}} onClick={() => onChange({ italic: !layer.italic })}>Italic</button>
              <button className={`tbtn${layer.enabled ? " on" : ""}`} onClick={() => onChange({ enabled: !layer.enabled })}>{layer.enabled ? "Visible" : "Hidden"}</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,gridColumn:"span 2"}}>
              <span style={{fontSize:11,color:"var(--t3)"}}>Colour</span>
              <div className="color-swatch" style={{background:layer.color}}>
                <input type="color" value={layer.color} onChange={e => onChange({color: e.target.value})} />
              </div>
              <span style={{fontSize:11,color:"var(--t3)",fontFamily:"monospace"}}>{layer.color}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoInstanceCard({ inst, idx, total, onChange, onRemove, isOpen, onToggle }) {
  const color = LAYER_COLORS[(idx + 4) % LAYER_COLORS.length];
  return (
    <div className="lcard">
      <div className="lcard-hd" onClick={onToggle}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }} />
        <span className="lcard-title">Logo {idx + 1}</span>
        <span className="lcard-prev">{inst.size}px</span>
        <span className="lchev">{isOpen ? "▲" : "▼"}</span>
        {total > 1 && <button className="lrm" onClick={e => { e.stopPropagation(); onRemove(); }}>×</button>}
      </div>
      {isOpen && (
        <div className="lcard-bd">
          <div className="sl-wrap">
            <div className="sl-head"><span className="sl-label">Size</span><PxInput value={inst.size} onChange={v => onChange({ size: v })} color={color} /></div>
            <input type="range" min={1} max={1000} value={inst.size} onChange={e => onChange({ size: Number(e.target.value) })} style={{ accentColor: color }} />
          </div>
          <div className="sl-wrap">
            <div className="sl-head"><span className="sl-label">Opacity</span>
            <PxInput value={inst.opacity ?? 100} onChange={v => onChange({ opacity: v })} color={color} suffix="%" min={1} max={100} /></div>
            <input type="range" min={10} max={100} value={inst.opacity ?? 100} onChange={e => onChange({ opacity: Number(e.target.value) })} style={{ accentColor: color }} />
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_VIDEO_OVERLAY = {
  text: "((name))'s future IR",
  fontSize: 28,
  fontFamily: "Inter",
  color: "#ffffff",
  bgOpacity: 55,
  duration: 4,
  bold: false,
};

function DropZone({ accept, onFile, children, className, style: styleProp }) {
  const [over, setOver] = useState(false);
  return (
    <div className={className} style={{ ...styleProp, borderColor: over ? "var(--blue)" : undefined, background: over ? "var(--blue-dim)" : undefined }}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); const file = e.dataTransfer.files[0]; if (file) onFile(file); }}>
      {children}
    </div>
  );
}

function VideoMode({ companies, resolveTemplateFn, renderIngredients }) {
  const [myVideo, setMyVideo] = useState(null);
  const [myVideoName, setMyVideoName] = useState(null);
  const [overlay, setOverlay] = useState(DEFAULT_VIDEO_OVERLAY);
  const [timings, setTimings] = useState({ demoImg: 7, screenshot: 8 });
  const [phaseOrder, setPhaseOrder] = useState(["demo", "screenshot"]);
  const [screenshots, setScreenshots] = useState({});
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState({});
  const videoRef = useRef(null);

  const updateOverlay = p => setOverlay(o => ({ ...o, ...p }));
  const readyCompanies = companies.filter(c => c.status === "ok");

  const handleScreenshotFile = (companyId, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const img = new Image();
    img.onload = () => setScreenshots(s => ({ ...s, [companyId]: img }));
    img.src = URL.createObjectURL(file);
  };

  const previewC = readyCompanies[0];
  const previewText = resolveTemplateFn(overlay.text, previewC?.personName || "Jordan", previewC?.companyName || "Acme Corp");
  const totalSec = timings.demoImg + timings.screenshot;

  const generateVideo = async (company) => {
    if (!myVideo) return;
    setGenerating(company.id);
    const ovSnap = { ...overlay };
    const phSnap = [...phaseOrder];
    const tmSnap = { ...timings };
    const ssImg = screenshots[company.id] || null;

    let demoImg = null;
    if (renderIngredients?.baseImg) {
      const { baseImg, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols } = renderIngredients;
      const off = renderComposite(baseImg, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols, company.personName, company.companyName, company.logoEl, null);
      demoImg = await new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = off.toDataURL(); });
    }

    const imgA = phSnap[0] === "demo" ? demoImg : ssImg;
    const imgB = phSnap[0] === "demo" ? ssImg : demoImg;
    const resolvedText = resolveTemplateFn(ovSnap.text, company.personName, company.companyName);

    const videoArrayBuffer = await myVideo.arrayBuffer();
    const videoBlob = new Blob([videoArrayBuffer], { type: myVideo.type || "video/mp4" });
    const videoUrl = URL.createObjectURL(videoBlob);

    const vid = document.createElement("video");
    vid.loop = false; vid.muted = true; vid.src = videoUrl; vid.load();
    await new Promise(r => { vid.onloadedmetadata = () => r(); vid.onerror = () => r(); setTimeout(r, 8000); });

    const VW = vid.videoWidth || 1280;
    const VH = vid.videoHeight || 720;
    const vidDurMs = (vid.duration && isFinite(vid.duration)) ? vid.duration * 1000 : 999999;

    const canvas = document.createElement("canvas");
    canvas.width = VW; canvas.height = VH;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(30);

    let audioRes = null;
    try {
      const actx = new AudioContext();
      const abuf = await actx.decodeAudioData(videoArrayBuffer.slice(0));
      const dest = actx.createMediaStreamDestination();
      const anode = actx.createBufferSource();
      anode.buffer = abuf; anode.loop = true;
      anode.connect(dest); anode.connect(actx.destination); anode.start(0);
      dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
      audioRes = { actx, anode };
    } catch(e) { console.warn("Audio skipped:", e.message); }

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    const dur1 = Math.min(ovSnap.duration * 1000, tmSnap.demoImg * 1000);
    const dur2 = tmSnap.demoImg * 1000;
    const dur3 = tmSnap.screenshot * 1000;
    const total = Math.min(dur2 + dur3, isFinite(vidDurMs) ? vidDurMs : dur2 + dur3, 30000);

    const pipW = Math.round(VW * 0.22);
    const pipH = Math.round(pipW * (VH / VW));
    const pipX = VW - pipW - 20;
    const pipY = VH - pipH - 20;
    const R = 12;

    const rrect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
    };

    const drawPip = () => {
      if (vid.paused) vid.play().catch(()=>{});
      ctx.save(); rrect(pipX,pipY,pipW,pipH,R); ctx.clip();
      ctx.drawImage(vid, pipX,pipY,pipW,pipH);
      ctx.restore();
      ctx.save(); ctx.strokeStyle="rgba(255,255,255,0.18)"; ctx.lineWidth=1.5;
      rrect(pipX,pipY,pipW,pipH,R); ctx.stroke(); ctx.restore();
    };

    const drawText = () => {
      const fs = Math.round(ovSnap.fontSize * (VW / 760));
      const font = `${ovSnap.bold?"bold ":""}${fs}px "${ovSnap.fontFamily}", sans-serif`;
      const maxW = VW * 0.72;
      ctx.font = font;
      const tw = Math.min(ctx.measureText(resolvedText).width, maxW);
      const pw = tw + 44; const ph = fs + 24;
      const px = (VW - pw) / 2; const py = VH * 0.038;
      ctx.save(); ctx.globalAlpha = Math.min(ovSnap.bgOpacity / 100, 0.88);
      ctx.fillStyle = "rgba(0,0,0,0.85)"; rrect(px,py,pw,ph,ph/2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.font=font; ctx.fillStyle=ovSnap.color;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(resolvedText, VW/2, py+ph/2, maxW); ctx.restore();
    };

    const drawImg = (img) => {
      if (!img) { ctx.fillStyle="#0d0d14"; ctx.fillRect(0,0,VW,VH); return; }
      const ar = img.width/img.height;
      const dw = ar>VW/VH ? VW : VH*ar;
      const dh = ar>VW/VH ? VW/ar : VH;
      ctx.drawImage(img,(VW-dw)/2,(VH-dh)/2,dw,dh);
    };

    vid.currentTime = 0;
    await vid.play().catch(()=>{});

    const blob = await new Promise(resolve => {
      const t0 = performance.now(); let done = false;
      const drawFrame = () => {
        if (done) return;
        const el = performance.now() - t0;
        ctx.clearRect(0, 0, VW, VH);
        if (el < dur2) { drawImg(imgA); if (el < dur1) drawText(); drawPip(); }
        else if (el < total) { drawImg(imgB); drawPip(); }
        if (el >= total && !done) {
          done = true; clearInterval(timerId); recorder.stop(); vid.pause();
          if (audioRes) { try { audioRes.anode.stop(); audioRes.actx.close(); } catch(_){} }
        }
      };
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      recorder.start(200);
      const timerId = setInterval(drawFrame, 1000 / 30);
      setTimeout(() => {
        if (!done) {
          done = true; clearInterval(timerId);
          try { recorder.stop(); } catch(_) {} vid.pause();
          if (audioRes) { try { audioRes.anode.stop(); audioRes.actx.close(); } catch(_){} }
        }
      }, total + 8000);
    });

    URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(blob);
    setGenerated(g => ({ ...g, [company.id]: url }));
    setGenerating(null);
  };

  return (
    <div className="video-workspace" style={{ display:"grid", gridTemplateColumns:"320px 1fr", height:"calc(100vh - 101px)", overflow:"hidden" }}>
      <div className="sidebar">
        <span className="s-label">Your video</span>
        <div className="card" style={{margin:"0 10px"}}>
          <div className="card-pad">
            <DropZone accept="video/*" onFile={f => { if (f.type.startsWith("video/")) { setMyVideoName(f.name); setMyVideo(f); } }} className="upload-zone" style={{}}>
              <label style={{cursor:"pointer",display:"block"}}>
                <input type="file" accept="video/*" style={{display:"none"}} onChange={e => { const f=e.target.files[0]; if(f){setMyVideoName(f.name);setMyVideo(f);} }} />
                <div className="uz-icon" style={{color:"var(--t3)"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3V10z"/></svg>
                </div>
                {myVideoName ? <p className="uz-active">{myVideoName}</p> : <p className="uz-text">Click or drag video here</p>}
                <p className="uz-hint">MP4 · MOV · WEBM</p>
              </label>
            </DropZone>
            <video ref={videoRef} style={{display:"none"}} playsInline muted={false} />
          </div>
        </div>

        <span className="s-label">Intro text overlay</span>
        <div className="card" style={{margin:"0 10px"}}>
          <div className="card-pad" style={{display:"flex",flexDirection:"column",gap:8}}>
            <input className="inp" value={overlay.text} placeholder="((name))'s future IR"
              onChange={e => updateOverlay({ text: e.target.value })} />
            <div className="tag-btns">
              <button className="tag-btn" onClick={() => updateOverlay({ text: overlay.text + "((name))" })}>+ first name</button>
              <button className="tag-btn" onClick={() => updateOverlay({ text: overlay.text + "((company))" })}>+ company</button>
            </div>
            <div className="timing-grid">
              <div className="timing-cell">
                <span className="timing-label">Font size</span>
                <input className="timing-input" type="number" min={12} max={120} value={overlay.fontSize} onChange={e => updateOverlay({ fontSize: Number(e.target.value) })} />
              </div>
              <div className="timing-cell">
                <span className="timing-label">Font</span>
                <select className="font-select" value={overlay.fontFamily} onChange={e => updateOverlay({ fontFamily: e.target.value })} style={{background:"var(--bg4)"}}>
                  {["Inter","Syne","Montserrat","Oswald","Bebas Neue","Raleway","Arial"].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="timing-cell">
                <span className="timing-label">Text colour</span>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div className="color-swatch" style={{background:overlay.color}}>
                    <input type="color" value={overlay.color} onChange={e => updateOverlay({color:e.target.value})} />
                  </div>
                  <span style={{fontSize:11,color:"var(--t3)",fontFamily:"monospace"}}>{overlay.color}</span>
                </div>
              </div>
              <div className="timing-cell">
                <span className="timing-label">BG opacity</span>
                <input type="range" min={0} max={100} value={overlay.bgOpacity} onChange={e => updateOverlay({bgOpacity:Number(e.target.value)})} style={{accentColor:"#1a82ff"}} />
              </div>
            </div>
          </div>
        </div>

        <span className="s-label">Timing (seconds)</span>
        <div className="card" style={{margin:"0 10px"}}>
          <div className="card-pad">
            <div className="timing-grid">
              <div className="timing-cell">
                <span className="timing-label">Intro text duration</span>
                <input className="timing-input" type="number" min={1} max={15} value={overlay.duration} onChange={e => updateOverlay({duration:Number(e.target.value)})} />
              </div>
              <div className="timing-cell">
                <span className="timing-label">Phase 2 (demo)</span>
                <input className="timing-input" type="number" min={1} max={30} value={timings.demoImg} onChange={e => setTimings(t => ({...t, demoImg: Number(e.target.value)}))} />
              </div>
              <div className="timing-cell">
                <span className="timing-label">Phase 3 (website)</span>
                <input className="timing-input" type="number" min={1} max={30} value={timings.screenshot} onChange={e => setTimings(t => ({...t, screenshot: Number(e.target.value)}))} />
              </div>
              <div className="timing-cell">
                <span className="timing-label">Total</span>
                <div style={{fontSize:15,fontWeight:600,color:"var(--t1)",padding:"6px 0"}}>{totalSec}s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"10px 18px",borderBottom:"0.5px solid var(--sep)",background:"var(--bg2)",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:13,color:"var(--t2)"}}>{readyCompanies.length} companies ready</span>
          <button className="btn-p" style={{marginLeft:"auto",width:"auto",padding:"8px 16px",fontSize:13}}
            disabled={readyCompanies.length===0||!myVideo||generating!==null}
            onClick={async()=>{for(const c of readyCompanies)await generateVideo(c);}}>
            Generate all ({readyCompanies.length})
          </button>
        </div>

        <div style={{padding:"10px 20px",borderBottom:"0.5px solid var(--sep)",background:"hsl(220 13% 7%)",display:"flex",alignItems:"center",gap:12,minHeight:48}}>
          <div style={{fontSize:Math.max(overlay.fontSize*0.35,12),fontFamily:overlay.fontFamily,color:overlay.color,fontWeight:overlay.bold?"bold":"normal",background:"rgba(0,0,0,0.55)",display:"inline-block",padding:"4px 14px",borderRadius:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>
            {previewText}
          </div>
          <span style={{fontSize:11,color:"var(--t3)",marginLeft:"auto"}}>{overlay.duration}s intro · {timings.demoImg}s demo · {timings.screenshot}s website = <strong style={{color:"var(--blue)"}}>{totalSec}s</strong></span>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
          {readyCompanies.length === 0 && (
            <div style={{textAlign:"center",color:"var(--t4)",fontSize:13,paddingTop:40}}>Add companies in Image mode first</div>
          )}
          {readyCompanies.map(c => (
            <div key={c.id} className="contact-row">
              <div style={{width:30,height:30,background:"#fff",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                <img src={c.logoDataUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:2}} />
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="contact-row-name">{c.personName || "—"}</div>
                <div className="contact-row-company">{c.companyName}</div>
              </div>
              <button className="open-link-btn" onClick={() => window.open(`https://${c.domain}`, "_blank")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {c.domain}
              </button>
              <DropZone accept="image/*" onFile={file => handleScreenshotFile(c.id, file)} style={{cursor:"pointer"}}>
                <label style={{cursor:"pointer"}}>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={e => handleScreenshotFile(c.id, e.target.files[0])} />
                  {screenshots[c.id]
                    ? <img className="screenshot-thumb" src={screenshots[c.id].src} alt="screenshot" />
                    : <div className="screenshot-placeholder">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>}
                </label>
              </DropZone>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {generated[c.id] && (
                  <>
                    <button className="btn-s" style={{fontSize:11,padding:"4px 8px"}} onClick={() => {
                      const v=document.createElement("video"); v.src=generated[c.id]; v.controls=true;
                      v.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);max-width:90vw;max-height:85vh;z-index:1000;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.8);background:#000;";
                      const ov=document.createElement("div"); ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999;cursor:pointer;";
                      ov.onclick=()=>{ov.remove();v.remove();}; document.body.append(ov,v);
                    }}>Play</button>
                    <button className="btn-s" style={{fontSize:11,padding:"4px 8px"}} onClick={() => {
                      const a=document.createElement("a"); a.href=generated[c.id];
                      a.download=c.companyName.toLowerCase().replace(/\s+/g,"_")+"_video.webm"; a.click();
                    }}>Save</button>
                  </>
                )}
                <button className={`gen-btn${generating === c.id ? " generating" : ""}`}
                  disabled={!myVideo || generating !== null}
                  onClick={() => generateVideo(c)}>
                  {generating === c.id ? "Creating…" : generated[c.id] ? "Redo" : "Create"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="canvas-footer">Click or drag a screenshot · Creates .webm per company</div>
      </div>
    </div>
  );
}

function buildGmailRaw({ to, subject, bodyHtml, attachBlob, filename }) {
  return new Promise(async (resolve) => {
    const boundary = "MP_" + Math.random().toString(36).slice(2);
    const subjB64 = btoa(unescape(encodeURIComponent(subject)));
    const bodyB64 = btoa(unescape(encodeURIComponent(bodyHtml)));
    const attB64 = await new Promise((res, rej) => {
      const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej;
      r.readAsDataURL(attachBlob);
    });
    const chunk76 = s => { const r=[]; for (let i=0;i<s.length;i+=76) r.push(s.slice(i,i+76)); return r; };
    const raw = [
      `To: ${to}`, `Subject: =?UTF-8?B?${subjB64}?=`,
      "MIME-Version: 1.0", `Content-Type: multipart/mixed; boundary="${boundary}"`, "",
      `--${boundary}`, "Content-Type: text/html; charset=UTF-8", "Content-Transfer-Encoding: base64", "",
      ...chunk76(bodyB64), "",
      `--${boundary}`, `Content-Type: image/png; name="${filename}"`, "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${filename}"`, "", ...chunk76(attB64), "",
      `--${boundary}--`,
    ].join("\r\n");
    resolve(btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""));
  });
}

function SendModal({ companies, getImageBlob, onClose, sharedToken, onTokenAcquired }) {
  const [step, setStep] = useState(sharedToken ? "compose" : "auth");
  const token = sharedToken;
  const [subject, setSubject] = useState("A personal demo for ((company))");
  const [bodyText, setBodyText] = useState("Hi ((name)),\n\nHere's a personalised demo we put together for ((company)).\n\nLet us know what you think!\n\nBest regards");
  const [selected, setSelected] = useState(null);
  const [previews, setPreviews] = useState({});
  const [results, setResults] = useState({});
  const [countdown, setCountdown] = useState(null);
  const subjectRef = useRef(null);
  const bodyRef = useRef(null);

  const withEmail = companies.filter(c => c.status === "ok" && c.email);

  useEffect(() => { setSelected(new Set(withEmail.map(c => c.id))); }, []);
  useEffect(() => { loadGIS(); }, []);

  const login = async () => {
    await loadGIS();
    if (!window.google?.accounts?.oauth2) { alert("Google Sign-In failed to load. Check popup blockers."); return; }
    window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/gmail.send",
      callback: (r) => {
        if (r.access_token) { onTokenAcquired(r.access_token); setStep("compose"); }
        else alert("Login failed: " + (r.error || "unknown"));
      },
    }).requestAccessToken();
  };

  const selectedContacts = withEmail.filter(c => selected?.has(c.id));
  const resolveStr = (tpl, c) => resolveTemplate(tpl, c.personName, c.companyName);

  useEffect(() => {
    if (step !== "approve" && step !== "sending" && step !== "done") return;
    for (const c of selectedContacts) {
      if (previews[c.id]) continue;
      getImageBlob(c).then(blob => {
        const url = URL.createObjectURL(blob);
        setPreviews(p => ({ ...p, [c.id]: url }));
      }).catch(() => {});
    }
  }, [step]);

  const insertAtCursor = (ref, setter, tag) => {
    const el = ref?.current;
    if (!el) { setter(v => v + tag); return; }
    const s = el.selectionStart ?? el.value.length;
    const e = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, s) + tag + el.value.slice(e);
    setter(next);
    setTimeout(() => { el.focus(); el.setSelectionRange(s+tag.length, s+tag.length); }, 0);
  };

  const sendAll = async () => {
    setStep("sending");
    for (let si = 0; si < selectedContacts.length; si++) {
      const c = selectedContacts[si];
      if (si > 0) {
        const delay = Math.floor(Math.random() * 31) + 15;
        for (let s = delay; s > 0; s--) { setCountdown(s); await new Promise(r => setTimeout(r, 1000)); }
        setCountdown(null);
      }
      setResults(r => ({ ...r, [c.id]: "ing" }));
      try {
        const subj = resolveStr(subject, c);
        const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:560px">${resolveStr(bodyText, c).replace(/\n/g,"<br>")}</div>`;
        const blob = await getImageBlob(c);
        const filename = `${c.companyName.toLowerCase().replace(/\s+/g,"_")}.png`;
        const raw = await buildGmailRaw({ to: c.email, subject: subj, bodyHtml: html, attachBlob: blob, filename });
        const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ raw }),
        });
        setResults(r => ({ ...r, [c.id]: res.ok ? "ok" : "err" }));
      } catch { setResults(r => ({ ...r, [c.id]: "err" })); }
    }
    setCountdown(null); setStep("done");
  };

  const doneOk = Object.values(results).filter(v => v === "ok").length;
  const doneErr = Object.values(results).filter(v => v === "err").length;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-title">
              {step === "auth" && "Send email"}{step === "compose" && "Compose message"}
              {step === "approve" && `Approve — ${selectedContacts.length} recipients`}
              {step === "sending" && "Sending…"}{step === "done" && "Done!"}
            </div>
            <div className="modal-sub">
              {step === "compose" && "((name)) and ((company)) are replaced per recipient. Image attached automatically."}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {step === "auth" && (
            <div className="auth-center">
              <div className="auth-icon">📧</div>
              <div style={{fontSize:17,fontWeight:600,color:"var(--t1)"}}>Connect Gmail</div>
              <div style={{fontSize:13,color:"var(--t3)",maxWidth:340,lineHeight:1.55}}>
                LogoPlacer sends emails via your Gmail account. Send-only access.
              </div>
              {withEmail.length === 0 ? (
                <div style={{fontSize:13,color:"var(--orange)",padding:"10px 16px",background:"hsla(31,92%,58%,.1)",borderRadius:8}}>
                  No contacts have email addresses. Add them first.
                </div>
              ) : (
                <>
                  <div style={{fontSize:13,color:"var(--t3)"}}>{withEmail.length} contacts with email ready</div>
                  <button className="google-btn" onClick={login}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91A8.87 8.87 0 0 0 17.64 9.2z"/><path fill="#34A853" d="M9 18a8.7 8.7 0 0 0 6.04-2.18l-2.91-2.26A5.49 5.49 0 0 1 3.66 9.8H.7v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.66 9.8A5.36 5.36 0 0 1 3.38 9c0-.28.04-.55.1-.8V5.86H.7A9 9 0 0 0 0 9a9 9 0 0 0 .7 3.14L3.66 9.8z"/><path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35L14.5 2.87A8.7 8.7 0 0 0 9 0 9 9 0 0 0 .7 5.86L3.66 8.2A5.36 5.36 0 0 1 9 3.58z"/></svg>
                    Continue with Google
                  </button>
                </>
              )}
            </div>
          )}

          {step === "compose" && (
            <>
              <div style={{fontSize:13,color:"var(--green)",display:"flex",alignItems:"center",gap:6,fontWeight:500}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Gmail connected
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label className="field-lbl">Subject</label>
                <input className="modal-inp" ref={subjectRef} value={subject} onChange={e => setSubject(e.target.value)} />
                <div className="tag-btns">
                  <button className="tag-btn" onClick={() => insertAtCursor(subjectRef, setSubject, "((name))")}>+ name</button>
                  <button className="tag-btn" onClick={() => insertAtCursor(subjectRef, setSubject, "((company))")}>+ company</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label className="field-lbl">Message body</label>
                <textarea className="modal-ta" ref={bodyRef} value={bodyText} onChange={e => setBodyText(e.target.value)} />
                <div className="tag-btns">
                  <button className="tag-btn" onClick={() => insertAtCursor(bodyRef, setBodyText, "((name))")}>+ name</button>
                  <button className="tag-btn" onClick={() => insertAtCursor(bodyRef, setBodyText, "((fullname))")}>+ full name</button>
                  <button className="tag-btn" onClick={() => insertAtCursor(bodyRef, setBodyText, "((company))")}>+ company</button>
                </div>
                <p style={{fontSize:11,color:"var(--t3)"}}>📎 Personalised image attached automatically as .png per recipient.</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label className="field-lbl">Recipients ({selectedContacts.length}/{withEmail.length})</label>
                <div style={{background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:"var(--r-sm)",padding:"4px 12px"}}>
                  {withEmail.map(c => (
                    <label key={c.id} className="rcpt-row" style={{cursor:"pointer"}}>
                      <input type="checkbox" checked={selected?.has(c.id) || false}
                        onChange={e => setSelected(s => { const n = new Set(s); e.target.checked ? n.add(c.id) : n.delete(c.id); return n; })}
                        style={{accentColor:"#1a82ff",width:14,height:14,flexShrink:0}} />
                      <div style={{width:26,height:26,background:"#fff",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
                        {c.logoDataUrl ? <img src={c.logoDataUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:2}} /> : <span style={{fontSize:11,color:"#888"}}>{c.companyName[0]}</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:500,color:"var(--t1)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.personName || c.companyName}</div>
                        <div style={{fontSize:11,color:"var(--t3)"}}>{c.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "approve" && (
            <>
              <p style={{fontSize:13,color:"var(--t2)"}}>Each person gets their personalised image attached. Review below:</p>
              {selectedContacts.map(c => (
                <div key={c.id} className="send-row">
                  {previews[c.id] ? <img className="send-thumb" src={previews[c.id]} alt="" /> : <div className="send-thumb-ph">🖼</div>}
                  <div className="send-info">
                    <div className="send-name">{c.personName || c.companyName}</div>
                    <div className="send-detail">{c.email}</div>
                    <div className="send-detail" style={{color:"var(--t2)"}}><strong>{resolveStr(subject, c)}</strong></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {(step === "sending" || step === "done") && (
            <>
              {step === "sending" && countdown !== null && (
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"hsla(31,92%,58%,.1)",border:"0.5px solid hsla(31,92%,58%,.35)",borderRadius:"var(--r-sm)"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span style={{fontSize:13,color:"var(--orange)"}}>Waiting {countdown}s before next send — anti-spam protection</span>
                </div>
              )}
              {selectedContacts.map(c => (
                <div key={c.id} className="send-row">
                  {previews[c.id] ? <img className="send-thumb" src={previews[c.id]} alt="" /> : <div className="send-thumb-ph">🖼</div>}
                  <div className="send-info"><div className="send-name">{c.personName || c.companyName}</div><div className="send-detail">{c.email}</div></div>
                  <div className={`send-st ${results[c.id] || ""}`}>
                    {!results[c.id] && <span style={{color:"var(--t4)"}}>waiting</span>}
                    {results[c.id] === "ing" && "sending…"}
                    {results[c.id] === "ok" && "✓ Sent"}
                    {results[c.id] === "err" && "✕ Error"}
                  </div>
                </div>
              ))}
              {step === "done" && (
                <div style={{textAlign:"center",padding:"12px 0"}}>
                  <div style={{fontSize:28}}>{doneErr === 0 ? "🎉" : "⚠️"}</div>
                  <div style={{fontSize:15,fontWeight:600,color:"var(--t1)",marginTop:6}}>{doneOk} of {selectedContacts.length} sent</div>
                  {doneErr > 0 && <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>{doneErr} failed — check token expiry</div>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-foot">
          {step === "compose" && (
            <>
              <button className="btn-s" onClick={onClose}>Cancel</button>
              <button className="btn-p" style={{width:"auto",padding:"8px 20px"}}
                disabled={!selectedContacts.length} onClick={() => setStep("approve")}>
                Preview ({selectedContacts.length}) →
              </button>
            </>
          )}
          {step === "approve" && (
            <>
              <button className="btn-s" onClick={() => setStep("compose")}>← Back</button>
              <button className="btn-p" style={{width:"auto",padding:"8px 20px",background:"var(--green)"}} onClick={sendAll}>
                ✓ Send {selectedContacts.length} email{selectedContacts.length !== 1 ? "s" : ""}
              </button>
            </>
          )}
          {step === "done" && <button className="btn-p" style={{width:"auto",padding:"8px 20px"}} onClick={onClose}>Close</button>}
          {(step === "auth" || step === "sending") && <button className="btn-s" disabled={step==="sending"} onClick={onClose}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, loading }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const COUNT = 260;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() * 3 + 0.2,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.3, alpha: Math.random() * 0.6 + 0.15,
      pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.008 + Math.random() * 0.022,
      color: Math.random() > 0.8 ? "rgba(91,79,255," : Math.random() > 0.5 ? "rgba(26,130,255," : "rgba(180,210,255,",
    }));

    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 60 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.09, vy: (Math.random() - 0.5) * 0.09,
      color: Math.random() > 0.5 ? "26,130,255" : "91,79,255", alpha: 0.025 + Math.random() * 0.035,
    }));

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.fillStyle = "#070b12"; ctx.fillRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W+o.r; if (o.x > W+o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H+o.r; if (o.y > H+o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
        g.addColorStop(0, `rgba(${o.color},${o.alpha})`); g.addColorStop(1, `rgba(${o.color},0)`);
        ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x=W; if (p.x > W) p.x=0; if (p.y < 0) p.y=H; if (p.y > H) p.y=0;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const r = p.r / p.z;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3);
        g.addColorStop(0, `${p.color}${a})`); g.addColorStop(1, `${p.color}0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,r*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fillStyle=`${p.color}${Math.min(a*2,1)})`; ctx.fill();
      });
      for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
          if (dist < 90) {
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.strokeStyle=`rgba(26,130,255,${(1-dist/90)*0.07})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, background:"#070b12", overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:0 }} />
      <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:52 }}>
          <div style={{ width:50, height:50, borderRadius:15, background:"linear-gradient(135deg,#1a82ff,#5b4fff)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 48px rgba(26,130,255,0.45)" }}>
            <svg width="26" height="26" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".95"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".55"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".55"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".95"/></svg>
          </div>
          <div>
            <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-1px" }}>LogoPlacer</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:3, letterSpacing:"1px", textTransform:"uppercase" }}>Personalised demos</div>
          </div>
        </div>
        <div style={{ background:"rgba(10,16,26,0.8)", backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:24, padding:"40px 44px", width:"100%", maxWidth:390, display:"flex", flexDirection:"column", alignItems:"center", gap:26, boxShadow:"0 48px 96px rgba(0,0,0,0.7)" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:21, fontWeight:700, color:"#fff", letterSpacing:"-.4px", marginBottom:8 }}>Sign in</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", lineHeight:1.65 }}>Use your Google account to<br/>access the app.</div>
          </div>
          <div style={{ width:"100%", height:"1px", background:"rgba(255,255,255,0.05)" }} />
          <button onClick={onLogin} disabled={loading}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"13px 20px", borderRadius:12, border:"none", background: hovered ? "#fff" : "rgba(255,255,255,0.93)", color:"#111827", fontSize:14, fontWeight:600, fontFamily:"inherit", cursor: loading ? "default" : "pointer", opacity: loading ? 0.5 : 1, transition:"all .18s" }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.18)", textAlign:"center" }}>Access is by invitation only</div>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

const GOOGLE_CLIENT_ID = "1004987283059-4kv0vtqrdc1mf1en2udktim2sjk18v7o.apps.googleusercontent.com";

function loadGIS() {
  return new Promise(resolve => {
    if (window.google?.accounts?.oauth2) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = resolve; s.onerror = resolve;
    document.head.appendChild(s);
  });
}

let idCounter = 1;
const uid = () => idCounter++;
const defaultText = () => ({ id: uid(), enabled: true, template: "", fontSize: 32, fontFamily: "Inter", color: "#ffffff", bold: false, italic: false, pos: { x: 50, y: 180 } });

function App() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("lp_authed"));
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      await loadGIS();
      await new Promise((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
          callback: (resp) => {
            if (resp.error) { reject(resp.error); return; }
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${resp.access_token}` }
            })
            .then(r => r.json())
            .then(user => {
              sessionStorage.setItem("lp_authed", "1");
              sessionStorage.setItem("lp_user", JSON.stringify({ name: user.name, email: user.email, picture: user.picture }));
              sessionStorage.setItem("lp_gtoken", resp.access_token);
              setAuthed(true); resolve();
            })
            .catch(reject);
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
      });
    } catch { /* cancelled */ }
    setAuthLoading(false);
  };

  if (!authed) return <LoginPage onLogin={handleLogin} loading={authLoading} />;

  const sessionUser = JSON.parse(sessionStorage.getItem("lp_user") || "{}");

  const [baseImageName, setBaseImageName] = useState(null);
  const [converting, setConverting] = useState(false);
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem("lp_companies");
      if (!saved) return [];
      return JSON.parse(saved).map(c => {
        if (c.logoDataUrl && c.status === "ok") {
          const img = new Image(); img.src = c.logoDataUrl;
          return { ...c, logoEl: img };
        }
        return { ...c, logoEl: null, status: c.status === "loading" ? "error" : c.status };
      });
    } catch { return []; }
  });
  const [pasteText, setPasteText] = useState("");
  const [singleCompany, setSingleCompany] = useState("");
  const [singlePerson, setSinglePerson] = useState("");
  const [logoInstances, setLogoInstances] = useState([{ id: uid(), size: 120, opacity: 100, pos: { x: 50, y: 50 } }]);
  const [openLogoId, setOpenLogoId] = useState(null);
  const [myLogoEl, setMyLogoEl] = useState(null);
  const [myLogoName, setMyLogoName] = useState(null);
  const [myLogoSize, setMyLogoSize] = useState(100);
  const [myLogoPos, setMyLogoPos] = useState({ x: 200, y: 50 });
  const [textLayers, setTextLayers] = useState([defaultText()]);
  const [openTextId, setOpenTextId] = useState(textLayers[0].id);
  const [symbols, setSymbols] = useState([]);
  const [mode, setMode] = useState("image");
  const [dragging, setDragging] = useState(null);
  const [toast, setToast] = useState(null);
  const [zipping, setZipping] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [canvasBg, setCanvasBg] = useState({ enabled: false, color: "#1a1a2e" });
  const [personalisedColors, setPersonalisedColors] = useState(false);
  const [brandColor, setBrandColor] = useState(null);
  const [colorToReplace, setColorToReplace] = useState("#ffffff");
  const [templates, setTemplates] = useState(() => { try { return JSON.parse(localStorage.getItem("lp_templates") || "[]"); } catch { return []; } });
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [allPreviews, setAllPreviews] = useState([]);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [gmailToken, setGmailToken] = useState(() => sessionStorage.getItem("lp_gtoken") || null);
  const [editingDomain, setEditingDomain] = useState({});
  const [editingContact, setEditingContact] = useState(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const baseImageRef = useRef(null);
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    try { localStorage.setItem("lp_companies", JSON.stringify(companies.map(({ logoEl, ...rest }) => rest))); } catch {}
  }, [companies]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const updateLogoInst = (id, patch) => setLogoInstances(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  const addLogoInst = () => {
    const { w } = canvasSizeRef.current;
    const inst = { id: uid(), size: 80, opacity: 100, pos: { x: Math.min(50 + logoInstances.length * 40, w - 100), y: 100 } };
    setLogoInstances(ls => [...ls, inst]); setOpenLogoId(inst.id);
  };
  const updateTextLayer = (id, patch) => setTextLayers(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  const addTextLayer = () => {
    const t = { ...defaultText(), pos: { x: 50, y: 180 + textLayers.length * 50 } };
    setTextLayers(ls => [...ls, t]); setOpenTextId(t.id);
  };
  const addSymbol = (char) => {
    const { w, h } = canvasSizeRef.current;
    setSymbols(s => [...s, { id: uid(), char, size: 60, color: "#ffffff", pos: { x: Math.floor(w/2)-20, y: Math.floor(h/2)-30 } }]);
  };
  const updateSymbol = (id, patch) => setSymbols(s => s.map(x => x.id === id ? { ...x, ...patch } : x));
  const removeSymbol = (id) => setSymbols(s => s.filter(x => x.id !== id));

  const saveTemplate = () => {
    const name = templateName.trim() || `Template ${templates.length + 1}`;
    const tpl = { id: uid(), name, savedAt: Date.now(), logoInstances, textLayers, symbols, canvasBg, personalisedColors, colorToReplace };
    const updated = [tpl, ...templates].slice(0, 20);
    setTemplates(updated); localStorage.setItem("lp_templates", JSON.stringify(updated)); setTemplateName("");
    showToast(`Template "${name}" saved`);
  };

  const loadTemplate = (tpl) => {
    if (tpl.logoInstances) setLogoInstances(tpl.logoInstances);
    if (tpl.textLayers) setTextLayers(tpl.textLayers);
    if (tpl.symbols) setSymbols(tpl.symbols);
    if (tpl.canvasBg) setCanvasBg(tpl.canvasBg);
    if (tpl.personalisedColors !== undefined) setPersonalisedColors(tpl.personalisedColors);
    if (tpl.colorToReplace) setColorToReplace(tpl.colorToReplace);
    setShowTemplates(false); showToast(`Template "${tpl.name}" loaded`);
  };

  const drawImageToCanvas = (img) => {
    const maxW = 760, maxH = 520;
    let w = img.width, h = img.height;
    if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
    canvasSizeRef.current = { w, h }; baseImageRef.current = img; setHasImage(true);
  };

  const redrawBaseCanvas = () => {
    if (!canvasRef.current || !baseImageRef.current) return;
    const { w, h } = canvasSizeRef.current;
    canvasRef.current.width = w; canvasRef.current.height = h;
    canvasRef.current.getContext("2d").drawImage(baseImageRef.current, 0, 0, w, h);
  };

  useEffect(() => { if (!hasImage) return; redrawBaseCanvas(); }, [hasImage]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const name = file.name.toLowerCase();
    const isHEIC = name.endsWith(".heic") || name.endsWith(".heif") || file.type === "image/heic" || file.type === "image/heif";
    setBaseImageName(file.name);
    if (isHEIC) {
      setConverting(true); showToast("Converting HEIC...");
      try {
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        const img = new Image(); img.onload = () => { drawImageToCanvas(img); setConverting(false); showToast("HEIC converted"); }; img.src = URL.createObjectURL(blob);
      } catch { setConverting(false); showToast("Could not convert HEIC"); }
      return;
    }
    const img = new Image(); img.onload = () => drawImageToCanvas(img); img.src = URL.createObjectURL(file);
  };

  const addContact = (personName, companyRaw, email = null) => {
    const trimmed = companyRaw.trim(); if (!trimmed) return;
    const domain = guessDomain(trimmed, email);
    const companyName = trimmed.includes(".") ? domainToCompanyName(domain) : cleanCompanyName(trimmed);
    if (companies.find(c => c.companyName.toLowerCase() === companyName.toLowerCase())) return;
    const entry = { id: Date.now() + Math.random(), personName: personName.trim(), companyName, domain, email: email || null, status: "loading", logoDataUrl: null, logoEl: null };
    setCompanies(cs => [...cs, entry]);
    fetchLogoDataURL(domain)
      .then(dataUrl => { const img = new Image(); img.onload = () => setCompanies(cs => cs.map(c => c.id === entry.id ? { ...c, status: "ok", logoDataUrl: dataUrl, logoEl: img } : c)); img.src = dataUrl; })
      .catch(() => setCompanies(cs => cs.map(c => c.id === entry.id ? { ...c, status: "error" } : c)));
  };

  const retryCompany = (entry) => {
    setCompanies(cs => cs.map(c => c.id === entry.id ? { ...c, status: "loading" } : c));
    fetchLogoDataURL(entry.domain)
      .then(dataUrl => { const img = new Image(); img.onload = () => setCompanies(cs => cs.map(c => c.id === entry.id ? { ...c, status: "ok", logoDataUrl: dataUrl, logoEl: img } : c)); img.src = dataUrl; })
      .catch(() => setCompanies(cs => cs.map(c => c.id === entry.id ? { ...c, status: "error" } : c)));
  };

  const commitDomain = (id, raw) => {
    const domain = guessDomain(raw.trim() || "x.com");
    setEditingDomain(ed => { const n = {...ed}; delete n[id]; return n; });
    setCompanies(cs => cs.map(c => c.id === id ? { ...c, domain, status: "loading", logoDataUrl: null, logoEl: null } : c));
    fetchLogoDataURL(domain)
      .then(dataUrl => { const img = new Image(); img.onload = () => setCompanies(cs => cs.map(c => c.id === id ? { ...c, status: "ok", logoDataUrl: dataUrl, logoEl: img } : c)); img.src = dataUrl; })
      .catch(() => setCompanies(cs => cs.map(c => c.id === id ? { ...c, status: "error" } : c)));
  };

  const handlePaste = () => {
    const contacts = extractContacts(pasteText);
    if (contacts.length === 0) { showToast("No contacts found — try manual"); return; }
    contacts.forEach(({ personName, companyName, email }) => addContact(personName, companyName, email));
    showToast(`${contacts.length} contacts added${contacts.filter(c=>c.email).length ? ` · ${contacts.filter(c=>c.email).length} with email` : ""}`);
    setPasteText("");
  };

  const downloadZip = async () => {
    const ready = companies.filter(c => c.status === "ok");
    if (!ready.length || !baseImageRef.current) return;
    setZipping(true); showToast("Creating zip…");
    const zip = new JSZip(); const folder = zip.folder("images");
    const { w, h } = canvasSizeRef.current;
    for (const c of ready) {
      const off = renderComposite(baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols, c.personName, c.companyName, c.logoEl, canvasBg);
      const blob = await new Promise(res => off.toBlob(res, "image/png"));
      folder.file(`${c.companyName.toLowerCase().replace(/\s+/g,"_")}.png`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(zipBlob); a.download = "images.zip"; a.click();
    setZipping(false); showToast(`${ready.length} images saved`);
  };

  const getImageBlob = async (company) => {
    if (!baseImageRef.current) throw new Error("no base image");
    const { w, h } = canvasSizeRef.current;
    const off = renderComposite(baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols, company.personName, company.companyName, company.logoEl, canvasBg);
    return new Promise(res => off.toBlob(res, "image/png"));
  };

  const showPreview = () => {
    if (!baseImageRef.current) return;
    const { w, h } = canvasSizeRef.current;
    const ready = companies.filter(c => c.status === "ok");
    const targets = ready.length > 0 ? ready : [{ personName: "Jordan", companyName: "Stratton Oakmont", logoEl: null }];
    const previews = []; let done = 0;
    targets.forEach((comp, i) => {
      const off = renderComposite(baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols, comp.personName, comp.companyName, comp.logoEl || null, { ...canvasBg, personalisedColors, colorToReplace, brandColor: comp.brandColor || null });
      off.toBlob(blob => {
        previews[i] = { name: comp.companyName || "Preview", url: URL.createObjectURL(blob) };
        done++;
        if (done === targets.length) { setAllPreviews(previews); setPreviewIdx(0); setPreviewUrl(previews[0].url); }
      });
    });
  };

  const onMouseDown = (e) => {
    if (!baseImageRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / canvasZoom, my = (e.clientY - rect.top) / canvasZoom;
    for (const sym of symbols) {
      if (mx >= sym.pos.x && mx <= sym.pos.x + sym.size && my >= sym.pos.y && my <= sym.pos.y + sym.size) {
        setDragging({ target:"symbol", id:sym.id, ox:mx-sym.pos.x, oy:my-sym.pos.y }); e.preventDefault(); return;
      }
    }
    if (myLogoEl && mx >= myLogoPos.x && mx <= myLogoPos.x + myLogoSize && my >= myLogoPos.y && my <= myLogoPos.y + myLogoSize) {
      setDragging({ target:"mylogo", ox:mx-myLogoPos.x, oy:my-myLogoPos.y }); e.preventDefault(); return;
    }
    for (const inst of logoInstances) {
      if (mx >= inst.pos.x && mx <= inst.pos.x + inst.size && my >= inst.pos.y && my <= inst.pos.y + inst.size) {
        setDragging({ target:"logo", id:inst.id, ox:mx-inst.pos.x, oy:my-inst.pos.y }); e.preventDefault(); return;
      }
    }
    for (const layer of textLayers) {
      if (layer.enabled && layer.template) {
        if (mx >= layer.pos.x && mx <= layer.pos.x + 300 && my >= layer.pos.y && my <= layer.pos.y + 70) {
          setDragging({ target:"text", id:layer.id, ox:mx-layer.pos.x, oy:my-layer.pos.y }); e.preventDefault(); return;
        }
      }
    }
  };

  const onMouseMove = (e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / canvasZoom, my = (e.clientY - rect.top) / canvasZoom;
    const { w, h } = canvasSizeRef.current;
    const clamp = (v, max) => Math.max(0, Math.min(v, max));
    if (dragging.target === "logo") updateLogoInst(dragging.id, { pos: { x:clamp(mx-dragging.ox,w-20), y:clamp(my-dragging.oy,h-20) } });
    else if (dragging.target === "mylogo") setMyLogoPos({ x:clamp(mx-dragging.ox,w-myLogoSize), y:clamp(my-dragging.oy,h-myLogoSize) });
    else if (dragging.target === "text") updateTextLayer(dragging.id, { pos: { x:clamp(mx-dragging.ox,w-20), y:clamp(my-dragging.oy,h-20) } });
    else if (dragging.target === "symbol") updateSymbol(dragging.id, { pos: { x:clamp(mx-dragging.ox,w-20), y:clamp(my-dragging.oy,h-20) } });
  };

  const { w: cw, h: ch } = canvasSizeRef.current;
  const readyCount = companies.filter(c => c.status === "ok").length;
  const previewPerson = companies[0]?.personName || "Jordan";
  const previewCompany = companies[0]?.companyName || "Stratton Oakmont";
  const companyLogoEl = companies.find(c => c.status === "ok")?.logoEl || null;

  return (
    <>
      <style>{style}</style>
      <div className="app" onMouseMove={onMouseMove} onMouseUp={() => setDragging(null)}>
        <div className="header">
          <div className="header-brand">
            <div className="header-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".9"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".6"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".6"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".9"/></svg></div>
            <div><div className="header-name">LogoPlacer</div><div className="header-sub">Personalised demos</div></div>
          </div>
          <div className="header-btns">
            {sessionUser?.picture && (
              <div style={{display:"flex",alignItems:"center",gap:8,marginRight:4}}>
                <img src={sessionUser.picture} alt="" style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid var(--sep)"}} />
                <span style={{fontSize:12,color:"var(--t3)"}}>{sessionUser.name?.split(" ")[0]}</span>
                <button className="btn-s" onClick={() => { sessionStorage.clear(); setAuthed(false); }} style={{fontSize:11,padding:"3px 8px"}}>Sign out</button>
              </div>
            )}
            <button className="btn-s" disabled={!hasImage} onClick={showPreview}>
              <span style={{display:"flex",alignItems:"center",gap:6}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </span>
            </button>
            <button className="btn-s" onClick={() => setShowSendModal(true)} style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
              Send
              {companies.filter(c=>c.email).length > 0 && <span style={{fontSize:10,background:"var(--blue)",color:"#fff",borderRadius:"100px",padding:"1px 5px"}}>{companies.filter(c=>c.email).length}</span>}
            </button>
            <button className="btn-p" style={{width:"auto",padding:"8px 16px",fontSize:13}} disabled={!hasImage || readyCount === 0 || zipping} onClick={downloadZip}>
              {zipping ? "Packing..." : `Download (${readyCount})`}
            </button>
          </div>
        </div>

        <div className="mode-tabs">
          <button className={`mode-tab${mode === "image" ? " active" : ""}`} onClick={() => setMode("image")}>Image</button>
          <button className={`mode-tab${mode === "video" ? " active" : ""}`} onClick={() => setMode("video")}>Video</button>
        </div>

        {mode === "video" && <VideoMode
          companies={companies}
          resolveTemplateFn={resolveTemplate}
          renderIngredients={hasImage && baseImageRef.current ? { baseImg: baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w: canvasSizeRef.current.w, h: canvasSizeRef.current.h, textLayers, symbols } : null}
        />}

        {mode === "image" && <div className="workspace">
          <div className="sidebar">
            <span className="s-label">Base image</span>
            <div className="card"><div className="card-pad">
              <DropZone accept="image/*" onFile={file => handleFileUpload({ target: { files: [file] } })} className="upload-zone" style={{}}>
                <label style={{cursor:"pointer",display:"block",textAlign:"center"}}>
                  <input type="file" accept="image/*,.heic,.heif" style={{display:"none"}} onChange={handleFileUpload} />
                  <div className="uz-icon" style={{color:"var(--t3)"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
                  {converting && <p className="uz-active">Converting...</p>}
                  {!converting && baseImageName && <p className="uz-active">{baseImageName}</p>}
                  {!converting && !baseImageName && <p className="uz-text">Click or drag here</p>}
                  <p className="uz-hint">JPG · PNG · WEBP · HEIC</p>
                </label>
              </DropZone>
            </div></div>

            <div className="card" style={{margin:"0 10px 6px",padding:"10px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:canvasBg.enabled?10:0}}>
                <span style={{fontSize:12,fontWeight:600,color:"var(--t2)"}}>Background colour</span>
                <div style={{width:34,height:20,borderRadius:10,background:canvasBg.enabled?"var(--blue)":"var(--bg4)",border:"0.5px solid var(--sep)",position:"relative",cursor:"pointer",transition:"background .2s"}}
                  onClick={() => setCanvasBg(bg => ({ ...bg, enabled: !bg.enabled }))}>
                  <div style={{position:"absolute",top:3,left:canvasBg.enabled?16:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.4)"}} />
                </div>
              </div>
              {canvasBg.enabled && (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="color" value={canvasBg.color} onChange={e => setCanvasBg(bg => ({ ...bg, color: e.target.value }))}
                    style={{width:32,height:32,borderRadius:8,border:"1.5px solid var(--sep)",cursor:"pointer",padding:2,background:"none"}} />
                  <span style={{fontSize:12,color:"var(--t3)",fontFamily:"monospace"}}>{canvasBg.color}</span>
                </div>
              )}
            </div>

            <div style={{margin:"0 10px 6px",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:10,padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--t2)"}}>Match brand colour</span>
                  <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>Replace a colour with recipient's brand</div>
                </div>
                <label style={{position:"relative",display:"inline-block",width:32,height:18,cursor:"pointer",flexShrink:0}}>
                  <input type="checkbox" checked={personalisedColors} onChange={e => setPersonalisedColors(e.target.checked)} style={{opacity:0,width:0,height:0,position:"absolute"}}/>
                  <span style={{position:"absolute",inset:0,borderRadius:9,background:personalisedColors?"var(--blue)":"var(--bg4)",transition:"background .2s"}}>
                    <span style={{position:"absolute",top:2,left:personalisedColors?16:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
                  </span>
                </label>
              </div>
              {personalisedColors && (
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                  <div style={{fontSize:11,color:"var(--t3)",flexShrink:0}}>Replace:</div>
                  <input type="color" value={colorToReplace} onChange={e => setColorToReplace(e.target.value)}
                    style={{width:32,height:28,borderRadius:6,border:"1.5px solid var(--sep)",cursor:"pointer",padding:2,background:"none",flexShrink:0}} />
                  <div style={{fontSize:10,color:"var(--t4)",fontFamily:"monospace"}}>{colorToReplace}</div>
                </div>
              )}
            </div>

            <div className="s-row">
              <span className="s-label">Recipient logo</span>
              <button className="btn-text" onClick={addLogoInst}>+ New</button>
            </div>
            <div style={{padding:"0 10px"}}>
              {logoInstances.map((inst, idx) => (
                <LogoInstanceCard key={inst.id} inst={inst} idx={idx} total={logoInstances.length}
                  onChange={patch => updateLogoInst(inst.id, patch)}
                  onRemove={() => setLogoInstances(ls => ls.filter(l => l.id !== inst.id))}
                  isOpen={openLogoId === inst.id}
                  onToggle={() => setOpenLogoId(openLogoId === inst.id ? null : inst.id)} />
              ))}
            </div>

            <div className="s-row">
              <span className="s-label">Text layers</span>
              <button className="btn-text" onClick={addTextLayer}>+ New</button>
            </div>
            <div style={{padding:"0 10px"}}>
              {textLayers.map((layer, idx) => (
                <TextLayerCard key={layer.id} layer={layer} idx={idx} total={textLayers.length}
                  onChange={patch => updateTextLayer(layer.id, patch)}
                  onRemove={() => setTextLayers(ls => ls.filter(l => l.id !== layer.id))}
                  isOpen={openTextId === layer.id}
                  onToggle={() => setOpenTextId(openTextId === layer.id ? null : layer.id)} />
              ))}
            </div>

            <div style={{margin:"0 10px 4px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span className="s-label" style={{padding:0}}>Templates</span>
              <button className="btn-text" onClick={() => setShowTemplates(v => !v)} style={{fontSize:11}}>{showTemplates ? "Hide" : `Saved (${templates.length})`}</button>
            </div>
            <div style={{margin:"0 10px 8px",display:"flex",gap:6}}>
              <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name…" onKeyDown={e => e.key==="Enter" && saveTemplate()}
                style={{flex:1,background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:7,padding:"7px 10px",color:"var(--t1)",fontSize:12,fontFamily:"inherit",outline:"none"}} />
              <button onClick={saveTemplate} className="btn-s" style={{fontSize:12,padding:"6px 12px",flexShrink:0}}>Save</button>
            </div>
            {showTemplates && templates.length > 0 && (
              <div style={{margin:"0 10px 8px",display:"flex",flexDirection:"column",gap:4,maxHeight:220,overflowY:"auto"}}>
                {templates.map(tpl => (
                  <div key={tpl.id} style={{display:"flex",alignItems:"center",gap:6,background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"7px 10px"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--t1)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tpl.name}</div>
                      <div style={{fontSize:10,color:"var(--t4)"}}>{new Date(tpl.savedAt).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => loadTemplate(tpl)} style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:"none",background:"var(--blue)",color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>Load</button>
                    <button onClick={() => { const u = templates.filter(t => t.id !== tpl.id); setTemplates(u); localStorage.setItem("lp_templates", JSON.stringify(u)); }} style={{fontSize:11,padding:"4px 7px",borderRadius:6,border:"0.5px solid var(--sep)",background:"none",color:"var(--t3)",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <span className="s-label">Symbols</span>
            <div className="card">
              <div className="sym-grid">
                {SYMBOL_OPTIONS.map(char => <button key={char} className="sym-btn" onClick={() => addSymbol(char)}>{char}</button>)}
              </div>
              {symbols.length > 0 && (
                <div style={{display:"flex",flexDirection:"column",gap:6,padding:"0 8px 8px"}}>
                  {symbols.map(sym => (
                    <div key={sym.id} style={{background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:20,minWidth:28,textAlign:"center"}}>{sym.char}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <input type="range" min={10} max={300} value={sym.size} onChange={e => updateSymbol(sym.id, { size: Number(e.target.value) })} style={{flex:1,accentColor:"#fbbf24"}} />
                          <span style={{fontSize:11,color:"var(--yellow)",minWidth:28}}>{sym.size}px</span>
                          <div className="color-swatch" style={{background:sym.color}}><input type="color" value={sym.color} onChange={e => updateSymbol(sym.id,{color:e.target.value})} /></div>
                        </div>
                      </div>
                      <button className="ico-rm" onClick={() => removeSymbol(sym.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span className="s-label">Contacts</span>
            <div className="card"><div className="card-pad" style={{display:"flex",flexDirection:"column",gap:8}}>
              <textarea className="paste-area" placeholder={"Paste from CRM / LinkedIn:\n__Carl Hersaeus__\n__Flowlife__\n\nOr: Jordan, Stratton Oakmont"} value={pasteText} onChange={e => setPasteText(e.target.value)} />
              <button className="btn-p" onClick={handlePaste} disabled={!pasteText.trim()}>Extract contacts</button>
              <div style={{borderTop:"0.5px solid var(--sep)",paddingTop:10,display:"flex",flexDirection:"column",gap:6}}>
                <p style={{fontSize:12,color:"var(--t3)"}}>Or add manually</p>
                <input className="inp sm" placeholder="Person name (optional)" value={singlePerson} onChange={e => setSinglePerson(e.target.value)} />
                <div style={{display:"flex",gap:7}}>
                  <input className="inp sm" style={{flex:1}} placeholder="Company name or domain" value={singleCompany}
                    onChange={e => setSingleCompany(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { addContact(singlePerson, singleCompany); setSingleCompany(""); setSinglePerson(""); } }} />
                  <button className="btn-s" disabled={!singleCompany.trim()}
                    onClick={() => { addContact(singlePerson, singleCompany); setSingleCompany(""); setSinglePerson(""); }}>+</button>
                </div>
              </div>
            </div></div>

            {companies.length > 0 && (<>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 16px 6px"}}>
                <span style={{fontSize:13,color:"var(--t2)"}}>{companies.length} companies · {readyCount} ready</span>
                <button className="btn-text-red" onClick={() => setCompanies([])}>Clear all</button>
              </div>
              <div className="co-list-wrap">
                {companies.map(c => (
                  <div key={c.id}>
                    <div className="co-row">
                      <div className="co-logo" style={{cursor:c.status==="error"?"pointer":"default"}} onClick={() => c.status==="error" && retryCompany(c)}>
                        {c.status === "loading" && <div className="spinner" />}
                        {c.status === "ok" && <img src={c.logoDataUrl} alt={c.companyName} />}
                        {c.status === "error" && <span className="ph">{c.companyName[0].toUpperCase()}</span>}
                      </div>
                      <div className="co-info" style={{flex:1,minWidth:0}}>
                        <div className="co-name">{c.companyName}
                          {c.personName && <span style={{fontWeight:400,color:"var(--t3)",marginLeft:5,fontSize:12}}>· {c.personName}</span>}
                        </div>
                        {editingDomain[c.id] !== undefined ? (
                          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                            <input className="domain-inp" value={editingDomain[c.id]} autoFocus placeholder="e.g. lysa.se"
                              onChange={e => setEditingDomain(ed => ({...ed, [c.id]: e.target.value}))}
                              onKeyDown={e => { if (e.key==="Enter") commitDomain(c.id, editingDomain[c.id]); if (e.key==="Escape") setEditingDomain(ed=>{const n={...ed};delete n[c.id];return n;}); }}
                              onBlur={() => commitDomain(c.id, editingDomain[c.id])} />
                          </div>
                        ) : (
                          <div style={{display:"flex",alignItems:"center",gap:3,marginTop:1}}>
                            <span className="co-sub" style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.domain}</span>
                            <button className="ico-edit" onClick={() => setEditingDomain(ed => ({...ed, [c.id]: c.domain}))}>✎</button>
                          </div>
                        )}
                      </div>
                      {c.email && <span title={c.email} style={{fontSize:11,color:"var(--green)",flexShrink:0}}>@</span>}
                      {c.status === "ok" && <span className="badge-ok"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                      {c.status === "error" && <button className="badge-err" title="Retry" onClick={() => retryCompany(c)}>↺</button>}
                      <button className="ico-edit" style={{fontSize:11,padding:"2px 5px"}}
                        onClick={() => setEditingContact(ec => ec?.id===c.id ? null : {id:c.id, name:c.personName||"", email:c.email||""})}>
                        {editingContact?.id===c.id ? "▲" : "▼"}
                      </button>
                      <button className="ico-rm" onClick={() => setCompanies(cs => cs.filter(x => x.id !== c.id))}>×</button>
                    </div>
                    {editingContact?.id === c.id && (
                      <div style={{padding:"8px 12px 10px 54px",background:"var(--bg)",borderBottom:"0.5px solid var(--sep)",display:"flex",flexDirection:"column",gap:6}}>
                        <div style={{display:"flex",gap:6}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>Name</div>
                            <input className="domain-inp" value={editingContact.name} placeholder="First Last" onChange={e => setEditingContact(ec => ({...ec, name:e.target.value}))} />
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>Email</div>
                            <input className="domain-inp" value={editingContact.email} placeholder="name@company.com" type="email" onChange={e => setEditingContact(ec => ({...ec, email:e.target.value}))} />
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                          <button className="btn-s" style={{padding:"4px 10px",fontSize:11}} onClick={() => setEditingContact(null)}>Cancel</button>
                          <button className="btn-p" style={{width:"auto",padding:"4px 12px",fontSize:11}} onClick={() => {
                            setCompanies(cs => cs.map(x => x.id===c.id ? {...x, personName:editingContact.name, email:editingContact.email||null} : x));
                            setEditingContact(null);
                          }}>Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>)}
          </div>

          <div className="canvas-area">
            <div className="canvas-wrapper" onWheel={e => { e.preventDefault(); setCanvasZoom(z => Math.min(4, Math.max(0.1, z - e.deltaY * 0.001))); }}>
              {!hasImage ? (
                <div className="empty-state">
                  <div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
                  <p className="empty-title">No image selected</p>
                  <p className="empty-sub">Upload a base image on the left</p>
                </div>
              ) : (
                <div className="canvas-container" ref={containerRef} onMouseDown={onMouseDown}
                  style={{ width:cw||"auto", height:ch||"auto", cursor:dragging?"grabbing":"default", transform:`scale(${canvasZoom})`, transformOrigin:"center center" }}>
                  <canvas ref={canvasRef} />
                  {cw > 0 && (
                    <>
                      {logoInstances.map((inst, idx) => {
                        const color = LAYER_COLORS[(idx + 4) % LAYER_COLORS.length];
                        return (
                          <div key={inst.id} className="overlay-box"
                            style={{ left:inst.pos.x, top:inst.pos.y, width:inst.size, height:inst.size, borderColor:color, background:`${color}11`, borderRadius:Math.min(inst.size*0.15,12) }}>
                            <div className="ov-pill" style={{background:color}}>Logo {idx+1}</div>
                            <span style={{fontSize:10,color,textTransform:"uppercase",pointerEvents:"none"}}>{companyLogoEl?"▣":"LOGO"}</span>
                          </div>
                        );
                      })}
                      {myLogoEl && (
                        <div className="overlay-box" style={{ left:myLogoPos.x, top:myLogoPos.y, width:myLogoSize, height:myLogoSize, borderColor:"#a78bfa", background:"rgba(167,139,250,0.07)", borderRadius:Math.min(myLogoSize*0.15,12) }}>
                          <div className="ov-pill" style={{background:"var(--purple)"}}>My logo</div>
                          <span style={{fontSize:10,color:"var(--purple)",pointerEvents:"none"}}>▣</span>
                        </div>
                      )}
                      {textLayers.map((layer, idx) => {
                        const color = LAYER_COLORS[idx % LAYER_COLORS.length];
                        if (!layer.enabled || !layer.template) return null;
                        return (
                          <div key={layer.id} className="overlay-box text-box"
                            style={{ left:layer.pos.x, top:layer.pos.y, borderColor:color, background:`${color}11`, fontSize:layer.fontSize, fontFamily:layer.fontFamily, color:layer.color, fontWeight:layer.fontWeight??(layer.bold?"bold":"normal"), fontStyle:layer.italic?"italic":"normal", lineHeight:1.4 }}>
                            <div className="ov-pill" style={{background:color}}>Text {idx+1}</div>
                            <span className="inner-text">{resolveTemplate(layer.template, previewPerson, previewCompany)}</span>
                          </div>
                        );
                      })}
                      {symbols.map(sym => (
                        <div key={sym.id} className="overlay-box"
                          style={{ left:sym.pos.x, top:sym.pos.y, width:sym.size, height:sym.size, borderColor:"#fbbf24", background:"rgba(251,191,36,0.07)", fontSize:sym.size*0.75, color:sym.color, fontWeight:"bold" }}>
                          <div className="ov-pill" style={{background:"var(--yellow)",color:"#000"}}>Symbol</div>
                          <span style={{fontSize:sym.size*0.7,color:sym.color,pointerEvents:"none"}}>{sym.char}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="canvas-footer" style={{position:"relative"}}>
              {cw > 0 ? "Drag elements to position · Scroll to zoom" : "Upload a base image to get started"}
              {hasImage && (
                <div className="zoom-controls">
                  <button className="zoom-btn" onClick={() => setCanvasZoom(z => Math.max(0.1, +(z-0.1).toFixed(2)))}>−</button>
                  <span className="zoom-label">{Math.round(canvasZoom*100)}%</span>
                  <button className="zoom-btn" onClick={() => setCanvasZoom(z => Math.min(4, +(z+0.1).toFixed(2)))}>+</button>
                  <button className="zoom-btn" style={{fontSize:9}} onClick={() => setCanvasZoom(1)}>↺</button>
                </div>
              )}
            </div>
          </div>
        </div>}

        {toast && <div className="toast">{toast}</div>}

        {previewUrl && (
          <div onClick={() => { setPreviewUrl(null); setAllPreviews([]); }}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <div onClick={e => e.stopPropagation()} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,maxWidth:"92vw",maxHeight:"96vh"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{allPreviews[previewIdx]?.name}</span>
                {allPreviews.length > 1 && <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{previewIdx+1} / {allPreviews.length}</span>}
              </div>
              <img src={allPreviews[previewIdx]?.url || previewUrl} style={{maxWidth:"88vw",maxHeight:"72vh",borderRadius:12,boxShadow:"0 24px 80px rgba(0,0,0,.7)",display:"block"}} alt="Preview" />
              {allPreviews.length > 1 && (
                <div style={{display:"flex",gap:8,overflowX:"auto",maxWidth:"88vw",padding:"4px 0"}}>
                  {allPreviews.map((p,i) => (
                    <img key={i} src={p.url} alt={p.name} onClick={() => setPreviewIdx(i)}
                      style={{width:72,height:46,objectFit:"cover",borderRadius:6,flexShrink:0,cursor:"pointer",border:i===previewIdx?"2px solid var(--blue)":"2px solid transparent",opacity:i===previewIdx?1:0.55,transition:"all .15s"}} />
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:8}}>
                {allPreviews.length > 1 && (
                  <>
                    <button className="btn-s" onClick={() => setPreviewIdx(i => Math.max(i-1,0))} disabled={previewIdx===0}>Prev</button>
                    <button className="btn-s" onClick={() => setPreviewIdx(i => Math.min(i+1,allPreviews.length-1))} disabled={previewIdx===allPreviews.length-1}>Next</button>
                  </>
                )}
                <button onClick={() => { setPreviewUrl(null); setAllPreviews([]); }} className="btn-s">Close</button>
                <button onClick={() => { const a=document.createElement("a"); a.href=allPreviews[previewIdx]?.url||previewUrl; a.download=`${allPreviews[previewIdx]?.name||"preview"}.png`; a.click(); }} className="btn-p" style={{width:"auto",padding:"8px 16px"}}>Download</button>
              </div>
            </div>
          </div>
        )}

        {showSendModal && (
          <SendModal
            companies={companies}
            getImageBlob={getImageBlob}
            sharedToken={gmailToken}
            onTokenAcquired={t => { setGmailToken(t); sessionStorage.setItem("lp_gtoken", t); }}
            onClose={() => setShowSendModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default function AppRouter() {
  const [view, setView] = useState(() => window.location.hash === "#app" ? "app" : "landing");
  useEffect(() => {
    const onHash = () => setView(window.location.hash === "#app" ? "app" : "landing");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const goToApp = () => { window.location.hash = "app"; setView("app"); };
  if (view === "landing") return <Landing onEnterApp={goToApp} />;
  return <App />;
}
