import { useState, useRef, useEffect, createContext, useContext } from "react";
import Landing from "./Landing";
import Blog from "./Blog";
import { LanguageProvider, useLang, useT } from "./i18n.jsx";
import Legal from "./Legal";
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
  const d = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase().trim();

  const withTimeout = (ms) => { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; };

  const blobToDataURL = (blob) => new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < 8) { URL.revokeObjectURL(url); resolve(null); return; }
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      try { resolve(c.toDataURL("image/png")); } catch { resolve(null); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

  try {
    const res = await fetch(`/api/logo?domain=${encodeURIComponent(d)}`, { signal: withTimeout(8000) });
    if (res.ok) {
      const blob = await res.blob();
      if (blob.size > 0) {
        const data = await blobToDataURL(blob);
        if (data) return data;
      }
    }
  } catch {}

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

function renderComposite(baseImg, logoInstances, myLogoEl, myLogoPos, myLogoSize, displayW, displayH, textLayers, symbols, personName, companyName, companyLogoEl, canvasBg, addWatermark = false) {
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

  // ── Preview watermark (removed on download/send) ──────────────────────────
  if (addWatermark) {
    const W = off.width, H = off.height;
    // Semi-transparent overlay stripe across the middle
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, H * 0.38, W, H * 0.24);
    ctx.restore();
    // Main watermark text
    const wSize = Math.max(18, Math.round(W * 0.045));
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.font = `700 ${wSize}px "DM Sans", "Helvetica Neue", Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Shadow for readability on any background
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Created with Logoplacers", W / 2, H / 2);
    ctx.shadowBlur = 0;
    ctx.restore();
    // Subtle repeat watermark in corners
    const sSize = Math.max(11, Math.round(W * 0.022));
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.font = `600 ${sSize}px "DM Sans", "Helvetica Neue", Arial`;
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 6;
    ctx.fillText("logoplacers.com", 16 * scale, H - 16 * scale);
    ctx.textAlign = "right";
    ctx.fillText("logoplacers.com", W - 16 * scale, 28 * scale);
    ctx.restore();
  }

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
            <button className="tag-btn" onClick={() => insertTag("((name))")}>{t("tag.first_name")}</button>
            <button className="tag-btn" onClick={() => insertTag("((fullname))")}>{t("tag.full_name")}</button>
            <button className="tag-btn" onClick={() => insertTag("((company))")}>{t("tag.company")}</button>
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
  const previewText = resolveTemplateFn(overlay.text, previewC?.personName || "Alex", previewC?.companyName || "Acme Corp");
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
  return new Promise(async (resolve, reject) => {
    try {
      const boundary = "MP_" + Math.random().toString(36).slice(2);
      const subjB64 = btoa(unescape(encodeURIComponent(subject)));
      const bodyB64 = btoa(unescape(encodeURIComponent(bodyHtml)));
      const attB64 = await new Promise((res, rej) => {
        const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej;
        r.readAsDataURL(attachBlob);
      });
      // Sanitise filename — btoa() crashes on non-Latin1 chars (åäö etc)
      const safeFilename = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "_");
      const chunk76 = s => { const r=[]; for (let i=0;i<s.length;i+=76) r.push(s.slice(i,i+76)); return r; };
      const raw = [
        `To: ${to}`, `Subject: =?UTF-8?B?${subjB64}?=`,
        "MIME-Version: 1.0", `Content-Type: multipart/mixed; boundary="${boundary}"`, "",
        `--${boundary}`, "Content-Type: text/html; charset=UTF-8", "Content-Transfer-Encoding: base64", "",
        ...chunk76(bodyB64), "",
        `--${boundary}`, `Content-Type: image/png; name="${safeFilename}"`, "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${safeFilename}"`, "", ...chunk76(attB64), "",
        `--${boundary}--`,
      ].join("\r\n");
      // Use Uint8Array encode so non-ASCII chars never reach btoa()
      const bytes = new Uint8Array(raw.split("").map(c => c.charCodeAt(0)));
      let b64 = ""; const chunk = 8192;
      for (let i = 0; i < bytes.length; i += chunk) b64 += btoa(String.fromCharCode(...bytes.subarray(i, i + chunk)));
      resolve(b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""));
    } catch(err) { reject(err); }
  });
}


// ─────────────────────────────────────────────
// GOOGLE DRIVE UPLOAD
// ─────────────────────────────────────────────
function DriveUploadField({ token, videoLink, setVideoLink }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const uploadToDrive = async (file) => {
    setUploading(true); setError(""); setProgress(0);
    setFileName(file.name);
    try {
      // 1. Initiate resumable upload
      const meta = { name: file.name, mimeType: file.type };
      const initRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Upload-Content-Type": file.type,
            "X-Upload-Content-Length": file.size,
          },
          body: JSON.stringify(meta),
        }
      );
      if (!initRes.ok) throw new Error("Upload init failed: " + initRes.status);
      const uploadUrl = initRes.headers.get("Location");

      // 2. Upload file in chunks (5MB)
      const chunkSize = 5 * 1024 * 1024;
      let offset = 0;
      let fileId = null;
      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        const end = Math.min(offset + chunkSize, file.size);
        const chunkRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`,
            "Content-Type": file.type,
          },
          body: chunk,
        });
        setProgress(Math.round((end / file.size) * 100));
        if (chunkRes.status === 200 || chunkRes.status === 201) {
          const data = await chunkRes.json();
          fileId = data.id;
          break;
        } else if (chunkRes.status !== 308) {
          throw new Error("Upload chunk failed: " + chunkRes.status);
        }
        offset = end;
      }
      if (!fileId) throw new Error("Upload completed but no file ID returned");

      // 3. Make file shareable (anyone with link can view)
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ role: "reader", type: "anyone" }),
      });

      // 4. Get shareable link
      const infoRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const info = await infoRes.json();
      setVideoLink(info.webViewLink || `https://drive.google.com/file/d/${fileId}/view`);
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false); setProgress(0);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) uploadToDrive(f);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) uploadToDrive(f);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label className="field-lbl">
        Video link
        <span style={{fontWeight:400,color:"var(--t4)",marginLeft:4}}>(optional — adds a Watch demo button)</span>
      </label>

      {/* Manual link OR uploaded link */}
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <input className="modal-inp" style={{flex:1}}
          placeholder="Paste Loom / Drive link, or upload below…"
          value={videoLink} onChange={e => setVideoLink(e.target.value)} />
        {videoLink && (
          <button onClick={() => { setVideoLink(""); setFileName(""); }}
            style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:16,padding:"0 4px",flexShrink:0}}>×</button>
        )}
      </div>

      {/* Drive upload zone */}
      {!videoLink && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border:"1.5px dashed var(--sep)", borderRadius:10, padding:"14px 16px",
            display:"flex", alignItems:"center", gap:12, cursor: uploading ? "default" : "pointer",
            background:"var(--bg3)", transition:"border-color .15s",
          }}
          onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = "var(--blue)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--sep)")}
        >
          <input ref={fileRef} type="file" accept="video/*,.mp4,.mov,.webm,.gif"
            onChange={handleFile} style={{display:"none"}} />

          {uploading ? (
            <>
              <div style={{width:18,height:18,borderRadius:"50%",border:"2.5px solid var(--blue)",borderTopColor:"transparent",animation:"spin 0.7s linear infinite",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,color:"var(--t2)",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fileName}</div>
                <div style={{height:4,borderRadius:2,background:"var(--bg4)",overflow:"hidden"}}>
                  <div style={{height:"100%",width:progress+"%",background:"var(--blue)",transition:"width .3s"}}/>
                </div>
              </div>
              <span style={{fontSize:11,color:"var(--t3)",flexShrink:0}}>{progress}%</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--t2)"}}>Upload to Google Drive</div>
                <div style={{fontSize:11,color:"var(--t4)"}}>MP4, MOV, WebM, GIF · drag & drop or click</div>
              </div>
            </>
          )}
        </div>
      )}

      {videoLink && (
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",background:"rgba(26,130,255,.08)",border:"1px solid rgba(26,130,255,.2)",borderRadius:8}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5ba4ff" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{fontSize:11,color:"var(--t2)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{videoLink}</span>
          <a href={videoLink} target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--blue)",textDecoration:"none",flexShrink:0}}>Preview ↗</a>
        </div>
      )}

      {error && <div style={{fontSize:11,color:"var(--red)"}}>{error}</div>}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────
// MACBOOK VIDEO MODAL
// ─────────────────────────────────────────────────────────────────────────
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawLaptopFrame(ctx, W, H, demoImg, progress, animType) {
  ctx.clearRect(0, 0, W, H);

  // Background
  const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.8);
  bgGrad.addColorStop(0, "#0d1520");
  bgGrad.addColorStop(1, "#070b12");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Animation transforms
  let scale = 1, tx = 0, ty = 0, skewX = 0;
  const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
  const p = ease(progress);

  if (animType === "zoom") {
    scale = 1 + p * 0.35;
  } else if (animType === "pan") {
    tx = (p - 0.5) * W * 0.18;
    scale = 1.1;
  } else if (animType === "tilt") {
    skewX = Math.sin(progress * Math.PI * 2) * 0.04;
    scale = 1 + Math.sin(progress * Math.PI) * 0.08;
  } else if (animType === "full") {
    if (progress < 0.3) { scale = 1 + (progress/0.3)*0.25; }
    else if (progress < 0.6) { tx = ((progress-0.3)/0.3 - 0.5)*W*0.15; scale = 1.25; }
    else if (progress < 0.85) { scale = 1.25 + ((progress-0.6)/0.25)*0.1; skewX = ((progress-0.6)/0.25)*0.03; }
    else { scale = 1.35 - ((progress-0.85)/0.15)*0.35; skewX = 0.03*(1-(progress-0.85)/0.15); }
  }

  ctx.save();
  ctx.translate(W/2 + tx, H/2 + ty);
  ctx.scale(scale, scale);
  if (skewX) ctx.transform(1, 0, skewX, 1, 0, 0);
  ctx.translate(-W/2, -H/2);

  // Laptop proportions
  const lw = W * 0.86, lh = H * 0.88;
  const lx = (W - lw) / 2, ly = (H - lh) / 2;
  const screenH = lh * 0.64;

  // Outer screen bezel (dark aluminium)
  const bezelGrad = ctx.createLinearGradient(lx, ly, lx, ly + screenH);
  bezelGrad.addColorStop(0, "#2a2a2a");
  bezelGrad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = bezelGrad;
  roundRectPath(ctx, lx, ly, lw, screenH, 12);
  ctx.fill();

  // Sheen on bezel
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRectPath(ctx, lx, ly, lw, screenH * 0.5, 12);
  ctx.fill();

  // Screen area (slightly inset)
  const si = 10;
  const sx = lx + si, sy = ly + si, sw = lw - si*2, sh = screenH - si - 4;
  ctx.fillStyle = "#000";
  ctx.fillRect(sx, sy, sw, sh);

  // Demo image on screen
  if (demoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sy, sw, sh);
    ctx.clip();
    const ir = demoImg.width / demoImg.height;
    const sr = sw / sh;
    let dx, dy, dw2, dh2;
    if (ir > sr) { dw2 = sw; dh2 = sw / ir; dx = sx; dy = sy + (sh - dh2)/2; }
    else { dh2 = sh; dw2 = sh * ir; dx = sx + (sw - dw2)/2; dy = sy; }
    ctx.drawImage(demoImg, dx, dy, dw2, dh2);
    ctx.restore();
  }

  // Subtle screen glare
  const glare = ctx.createLinearGradient(sx, sy, sx + sw*0.6, sy + sh*0.4);
  glare.addColorStop(0, "rgba(255,255,255,0.07)");
  glare.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glare;
  ctx.fillRect(sx, sy, sw, sh);

  // Camera dot (no branding, just a sensor dot)
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(lx + lw/2, ly + 7, 2.5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(lx + lw/2, ly + 7, 1.5, 0, Math.PI*2);
  ctx.fill();

  // Hinge strip
  const hinge = ctx.createLinearGradient(lx, ly + screenH, lx, ly + screenH + lh*0.025);
  hinge.addColorStop(0, "#1e1e1e");
  hinge.addColorStop(1, "#252525");
  ctx.fillStyle = hinge;
  ctx.fillRect(lx + lw*0.04, ly + screenH, lw*0.92, lh*0.025);

  // Base / keyboard body
  const by = ly + screenH + lh*0.025;
  const bh = lh * 0.32;
  const baseGrad = ctx.createLinearGradient(lx, by, lx + lw, by + bh);
  baseGrad.addColorStop(0, "#252525");
  baseGrad.addColorStop(0.5, "#222222");
  baseGrad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.moveTo(lx - lw*0.01, by);
  ctx.lineTo(lx + lw + lw*0.01, by);
  ctx.lineTo(lx + lw + lw*0.04, by + bh);
  ctx.lineTo(lx - lw*0.04, by + bh);
  ctx.closePath();
  ctx.fill();

  // Keyboard area (subtle)
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  roundRectPath(ctx, lx + lw*0.07, by + bh*0.1, lw*0.86, bh*0.55, 5);
  ctx.fill();

  // Key rows (very subtle)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 14; col++) {
      const kx = lx + lw*0.08 + col*(lw*0.8/14);
      const ky = by + bh*0.12 + row*(bh*0.44/4);
      const kw = lw*0.8/14 - 2, kh = bh*0.44/4 - 2;
      ctx.fillStyle = "rgba(255,255,255,0.018)";
      roundRectPath(ctx, kx, ky, kw, kh, 1.5);
      ctx.fill();
    }
  }

  // Trackpad
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  roundRectPath(ctx, lx + lw*0.33, by + bh*0.7, lw*0.34, bh*0.22, 5);
  ctx.fill();
  ctx.stroke();

  // Bottom edge reflection
  const refl = ctx.createLinearGradient(lx, by + bh - 4, lx, by + bh);
  refl.addColorStop(0, "rgba(255,255,255,0)");
  refl.addColorStop(1, "rgba(255,255,255,0.03)");
  ctx.fillStyle = refl;
  ctx.beginPath();
  ctx.moveTo(lx - lw*0.04, by + bh - 4);
  ctx.lineTo(lx + lw + lw*0.04, by + bh - 4);
  ctx.lineTo(lx + lw + lw*0.04, by + bh);
  ctx.lineTo(lx - lw*0.04, by + bh);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function LaptopDemoModal({ getImageBlob, companies, onClose }) {
  const t = useT();
  const canvasRef = useRef(null);
  const recCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mediaRecRef = useRef(null);
  const chunksRef = useRef([]);

  const readyCompanies = (companies || []).filter(c => c.status === "ok");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [animType, setAnimType] = useState("zoom");
  const [duration, setDuration] = useState(5);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [demoImg, setDemoImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const progressRef = useRef(0);

  const company = readyCompanies[selectedIdx] || readyCompanies[0] || null;

  useEffect(() => {
    if (!company || !getImageBlob) return;
    setLoading(true);
    setDemoImg(null);
    getImageBlob(company).then(blob => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { setDemoImg(img); setLoading(false); };
      img.onerror = () => setLoading(false);
      img.src = url;
    }).catch(() => setLoading(false));
  }, [company?.id]);

  useEffect(() => {
    if (!canvasRef.current || loading) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawLaptopFrame(ctx, canvas.width, canvas.height, demoImg, 0, animType);
  }, [demoImg, animType, loading]);

  const startRecording = () => {
    if (!demoImg) return;
    const recCanvas = recCanvasRef.current;
    if (!recCanvas) return;
    recCanvas.width = 1280; recCanvas.height = 720;
    const ctx = recCanvas.getContext("2d");

    const stream = recCanvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    chunksRef.current = [];
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      setRecording(false);
    };
    mediaRecRef.current = rec;
    rec.start();
    setRecording(true);
    setVideoUrl(null);

    const startTime = performance.now();
    const totalMs = duration * 1000;
    progressRef.current = 0;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      progressRef.current = progress;
      drawLaptopFrame(ctx, recCanvas.width, recCanvas.height, demoImg, progress, animType);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => rec.stop(), 100);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  const stopRecording = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecRef.current && mediaRecRef.current.state === "recording") mediaRecRef.current.stop();
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${company?.companyName || "demo"}_macbook.webm`;
    a.click();
  };

  const canvasW = 680, canvasH = 420;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg2)",border:"0.5px solid var(--sep)",borderRadius:20,width:"100%",maxWidth:760,maxHeight:"92vh",overflow:"auto",padding:"28px 32px"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800,letterSpacing:"-0.5px"}}>{t("video.title")}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:22}}>×</button>
        </div>

        {/* Canvas preview */}
        <div style={{borderRadius:12,overflow:"hidden",marginBottom:20,background:"#070b12",display:"flex",justifyContent:"center"}}>
          {loading
            ? <div style={{height:canvasH*0.6,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--t3)",fontSize:13}}>{t("video.loading")}</div>
            : <canvas ref={canvasRef} width={canvasW} height={canvasH} style={{display:"block",maxWidth:"100%"}} />
          }
        </div>
        <canvas ref={recCanvasRef} style={{display:"none"}} />

        {/* Controls */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          {/* Company selector */}
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:6}}>{t("video.select_company")}</label>
            <select value={selectedIdx} onChange={e=>setSelectedIdx(Number(e.target.value))}
              style={{width:"100%",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",color:"var(--t1)",fontSize:13,fontFamily:"inherit",outline:"none"}}>
              {readyCompanies.length === 0
                ? <option>—</option>
                : readyCompanies.map((c,i) => <option key={i} value={i}>{c.companyName}</option>)
              }
            </select>
          </div>

          {/* Animation type */}
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:6}}>{t("video.animation")}</label>
            <select value={animType} onChange={e=>setAnimType(e.target.value)}
              style={{width:"100%",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",color:"var(--t1)",fontSize:13,fontFamily:"inherit",outline:"none"}}>
              <option value="zoom">{t("video.anim_zoom")}</option>
              <option value="pan">{t("video.anim_pan")}</option>
              <option value="tilt">{t("video.anim_tilt")}</option>
              <option value="full">{t("video.anim_full")}</option>
            </select>
          </div>
        </div>

        {/* Duration slider */}
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:6}}>{t("video.duration")}: {duration}s</label>
          <input type="range" min={3} max={20} value={duration} onChange={e=>setDuration(Number(e.target.value))}
            style={{width:"100%",accentColor:"var(--blue)"}} />
        </div>

        {/* Status */}
        {recording && (
          <div style={{marginBottom:12,padding:"10px 14px",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:10,fontSize:13,color:"#f87171",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"pulse 1s infinite"}}/>
            {t("video.recording")} {duration}s
          </div>
        )}
        {videoUrl && (
          <div style={{marginBottom:12}}>
            <video src={videoUrl} controls style={{width:"100%",borderRadius:10,maxHeight:200}} />
            <div style={{fontSize:11,color:"var(--t3)",marginTop:6}}>{t("video.webm_note")}</div>
          </div>
        )}

        {!demoImg && !loading && (
          <div style={{textAlign:"center",padding:"16px 0",color:"var(--t3)",fontSize:13}}>{t("video.no_image")}</div>
        )}

        {/* Buttons */}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn-s" onClick={onClose}>{t("modal.close")}</button>
          {recording
            ? <button className="btn-s" style={{background:"rgba(239,68,68,.12)",borderColor:"rgba(239,68,68,.3)",color:"#f87171"}} onClick={stopRecording}>■ Stop</button>
            : <button className="btn-p" style={{width:"auto",padding:"8px 20px"}} disabled={!demoImg} onClick={startRecording}>● {t("video.record")}</button>
          }
          {videoUrl && (
            <button className="btn-p" style={{width:"auto",padding:"8px 20px",background:"var(--green)"}} onClick={downloadVideo}>↓ {t("video.download")}</button>
          )}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────
// PRODUCT MOCKUP MODAL — perspective mesh warp + exposure controls
// ─────────────────────────────────────────────────────────────────────────

const MOCKUP_TEMPLATES = [
  {
    id: "golf",
    label: "Golf Ball",
    emoji: "⛳",
    bgColor: "#e8e4dc",
    // circle mask, logo sits on center of sphere
    type: "sphere",
    logoArea: { cx: 0.5, cy: 0.44, r: 0.22 },
  },
  {
    id: "mug",
    label: "Coffee Mug",
    emoji: "☕",
    bgColor: "#d4c5b0",
    type: "cylinder",
    logoArea: { x: 0.32, y: 0.3, w: 0.35, h: 0.38 },
  },
  {
    id: "tshirt",
    label: "T-Shirt",
    emoji: "👕",
    bgColor: "#c8d4e8",
    type: "flat",
    logoArea: { x: 0.35, y: 0.32, w: 0.3, h: 0.2 },
  },
  {
    id: "hoodie",
    label: "Hoodie",
    emoji: "🧥",
    bgColor: "#2d3748",
    type: "flat",
    logoArea: { x: 0.36, y: 0.34, w: 0.28, h: 0.18 },
  },
  {
    id: "bottle",
    label: "Water Bottle",
    emoji: "🍶",
    bgColor: "#b8cce0",
    type: "cylinder",
    logoArea: { x: 0.33, y: 0.35, w: 0.34, h: 0.28 },
  },
  {
    id: "notebook",
    label: "Notebook",
    emoji: "📓",
    bgColor: "#f5e6c8",
    type: "flat",
    logoArea: { x: 0.3, y: 0.28, w: 0.4, h: 0.44 },
  },
  {
    id: "cap",
    label: "Cap",
    emoji: "🧢",
    bgColor: "#1a2540",
    type: "curve",
    logoArea: { cx: 0.5, cy: 0.42, r: 0.15 },
  },
  {
    id: "bag",
    label: "Tote Bag",
    emoji: "👜",
    bgColor: "#e8d5b0",
    type: "flat",
    logoArea: { x: 0.28, y: 0.3, w: 0.44, h: 0.38 },
  },
  {
    id: "phone",
    label: "Phone Case",
    emoji: "📱",
    bgColor: "#2c2c2c",
    type: "flat",
    logoArea: { x: 0.28, y: 0.35, w: 0.44, h: 0.28 },
  },
  {
    id: "custom",
    label: "Custom Photo",
    emoji: "📷",
    bgColor: "#111827",
    type: "custom",
    logoArea: { x: 0.25, y: 0.25, w: 0.5, h: 0.5 },
  },
];

function buildDefaultMesh(cols, rows, W, H, area, type) {
  const pts = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const v = r / rows;
      let x, y;
      if (area.x !== undefined) {
        x = (area.x + u * area.w) * W;
        y = (area.y + v * area.h) * H;
      } else {
        const angle = u * Math.PI * 2;
        x = (area.cx + Math.cos(angle) * area.r) * W;
        y = (area.cy + Math.sin(angle) * area.r) * H;
      }
      // Slight 3D curve effect for cylinder/sphere
      if (type === "cylinder" || type === "curve") {
        const curveMag = 0.06;
        const curve = Math.sin(u * Math.PI) * curveMag;
        y += curve * H * (v - 0.5) * 0.5;
        x += Math.sin(v * Math.PI - Math.PI/2) * curveMag * W * (u - 0.5) * 0.3;
      }
      pts.push({ u, v, x: Math.round(x), y: Math.round(y) });
    }
  }
  return pts;
}

function renderMockupToCanvas(canvas, logoImg, bgImg, bgColor, meshPts, meshCols, meshRows, exposure, opacity, blendMode, templateType) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Draw background
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);
    // Draw a product shape silhouette
    drawProductSilhouette(ctx, W, H, templateType, bgColor);
  }

  if (!logoImg || !meshPts || meshPts.length < 4) return;

  // Draw mesh-warped logo using bilinear patch subdivision
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode;

  // Exposure: brighten/darken logo before placing
  if (exposure !== 0) {
    const offscreen = document.createElement("canvas");
    offscreen.width = logoImg.width || 200;
    offscreen.height = logoImg.height || 200;
    const octx = offscreen.getContext("2d");
    octx.drawImage(logoImg, 0, 0, offscreen.width, offscreen.height);
    if (exposure > 0) {
      octx.globalCompositeOperation = "screen";
      octx.fillStyle = `rgba(255,255,255,${exposure * 0.6})`;
      octx.fillRect(0, 0, offscreen.width, offscreen.height);
    } else {
      octx.globalCompositeOperation = "multiply";
      octx.fillStyle = `rgba(0,0,0,${Math.abs(exposure) * 0.6})`;
      octx.fillRect(0, 0, offscreen.width, offscreen.height);
    }
    // Use adjusted logo
    drawMeshWarped(ctx, offscreen, meshPts, meshCols, meshRows, W, H);
  } else {
    drawMeshWarped(ctx, logoImg, meshPts, meshCols, meshRows, W, H);
  }
  ctx.restore();
}

function drawMeshWarped(ctx, img, pts, cols, rows, W, H) {
  const iw = img.width || img.naturalWidth || 100;
  const ih = img.height || img.naturalHeight || 100;
  const subdiv = 4; // subdivide each cell for smoother warp

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tl = pts[row * (cols+1) + col];
      const tr = pts[row * (cols+1) + col + 1];
      const bl = pts[(row+1) * (cols+1) + col];
      const br = pts[(row+1) * (cols+1) + col + 1];

      // Subdivide each quad
      for (let sr = 0; sr < subdiv; sr++) {
        for (let sc = 0; sc < subdiv; sc++) {
          const u0 = sc / subdiv, u1 = (sc+1) / subdiv;
          const v0 = sr / subdiv, v1 = (sr+1) / subdiv;

          // Bilinear interpolation of corners
          const lerp2 = (a, b, c, d, u, v) => a*(1-u)*(1-v) + b*u*(1-v) + c*(1-u)*v + d*u*v;
          const px = (u,v) => lerp2(tl.x, tr.x, bl.x, br.x, u, v);
          const py = (u,v) => lerp2(tl.y, tr.y, bl.y, br.y, u, v);

          // Source UV in logo image
          const su0 = (col + sc/subdiv) / cols;
          const su1 = (col + (sc+1)/subdiv) / cols;
          const sv0 = (row + sr/subdiv) / rows;
          const sv1 = (row + (sr+1)/subdiv) / rows;

          // Draw using transform
          const x0 = px(u0,v0), y0 = py(u0,v0);
          const x1 = px(u1,v0), y1 = py(u1,v0);
          const x2 = px(u0,v1), y2 = py(u0,v1);

          const dx1 = x1-x0, dy1 = y1-y0;
          const dx2 = x2-x0, dy2 = y2-y0;

          const srcW = (su1-su0) * iw;
          const srcH = (sv1-sv0) * ih;
          if (srcW < 0.1 || srcH < 0.1) continue;

          ctx.save();
          ctx.setTransform(
            dx1/srcW, dy1/srcW,
            dx2/srcH, dy2/srcH,
            x0, y0
          );
          ctx.drawImage(img,
            su0*iw, sv0*ih, srcW, srcH,
            0, 0, srcW, srcH
          );
          ctx.restore();
        }
      }
    }
  }
}

function drawProductSilhouette(ctx, W, H, type, bgColor) {
  // Draw a simple but credible product shape
  const isDark = bgColor < "#888888";
  ctx.save();

  if (type === "sphere") {
    // Golf ball
    const cx = W/2, cy = H*0.46, r = H*0.32;
    const grad = ctx.createRadialGradient(cx - r*0.25, cy - r*0.25, r*0.05, cx, cy, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.5, "#e8e4dc");
    grad.addColorStop(1, "#c8c0b0");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
    // Dimples
    ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const da = (i * 137.5) * Math.PI/180;
      const dr = (i % 3 + 1) / 4 * r * 0.85;
      const dx = cx + Math.cos(da)*dr, dy = cy + Math.sin(da)*dr;
      ctx.beginPath(); ctx.arc(dx, dy, 3.5, 0, Math.PI*2); ctx.stroke();
    }
    // Shadow
    const shadow = ctx.createRadialGradient(cx, cy+r*1.1, 0, cx, cy+r*1.1, r*0.6);
    shadow.addColorStop(0, "rgba(0,0,0,0.2)"); shadow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.ellipse(cx, cy+r*1.1, r*0.65, r*0.12, 0, 0, Math.PI*2); ctx.fill();

  } else if (type === "cylinder") {
    // Mug or bottle
    const mx = W*0.5, my = H*0.5;
    const mw = W*0.38, mh = H*0.55;
    // Body
    const bodyGrad = ctx.createLinearGradient(mx-mw/2, 0, mx+mw/2, 0);
    bodyGrad.addColorStop(0, "rgba(0,0,0,0.15)");
    bodyGrad.addColorStop(0.2, "rgba(255,255,255,0.1)");
    bodyGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    bodyGrad.addColorStop(0.85, "rgba(255,255,255,0.12)");
    bodyGrad.addColorStop(1, "rgba(0,0,0,0.2)");
    // Base shape
    ctx.fillStyle = bgColor;
    roundRectPath(ctx, mx-mw/2, my-mh/2, mw, mh, mw*0.08);
    ctx.fill();
    ctx.fillStyle = bodyGrad;
    roundRectPath(ctx, mx-mw/2, my-mh/2, mw, mh, mw*0.08);
    ctx.fill();
    // Top ellipse
    const topGrad = ctx.createLinearGradient(mx-mw/2, my-mh/2-10, mx+mw/2, my-mh/2);
    topGrad.addColorStop(0, "rgba(255,255,255,0.3)"); topGrad.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = topGrad;
    ctx.beginPath(); ctx.ellipse(mx, my-mh/2, mw/2, mw*0.1, 0, 0, Math.PI*2); ctx.fill();
    // Handle for mug
    if (type === "cylinder" && bgColor.includes("d4c5")) {
      ctx.strokeStyle = bgColor; ctx.lineWidth = mw*0.12; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(mx + mw*0.55, my, mw*0.22, -Math.PI*0.65, Math.PI*0.65); ctx.stroke();
    }

  } else if (type === "flat") {
    // T-shirt / hoodie / tote
    const isTshirt = (bgColor === "#c8d4e8" || bgColor === "#2d3748" || bgColor === "#e8d5b0" || bgColor === "#2c2c2c" || bgColor === "#f5e6c8");
    // Simple rectangle with slight shadow
    ctx.fillStyle = bgColor;
    const fw = W*0.7, fh = H*0.75;
    const fx = (W-fw)/2, fy = (H-fh)/2;
    roundRectPath(ctx, fx, fy, fw, fh, 8);
    ctx.fill();
    // Subtle sheen
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(fx, fy, fw, fh/3);
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(fx+4, fy+fh, fw-8, 10);

  } else if (type === "curve") {
    // Cap — simplified front panel
    const cx = W/2, cy = H*0.42;
    const cr = H*0.28;
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(cx, cy + cr*0.3, cr, Math.PI, 2*Math.PI);
    ctx.lineTo(cx + cr, cy + cr*0.3);
    ctx.closePath();
    ctx.fill();
    // Brim
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + cr*1.25, cr*1.1, cr*0.12, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy + cr*1.25, cr*1.1, cr*0.1, 0, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}

function ProductMockupModal({ getImageBlob, companies, onClose }) {
  const t = useT();
  const canvasRef = useRef(null);
  const [templateId, setTemplateId] = useState("mug");
  const [meshCols, setMeshCols] = useState(6);
  const [meshRows, setMeshRows] = useState(4);
  const [exposure, setExposure] = useState(0);
  const [opacity, setOpacity] = useState(0.9);
  const [blendMode, setBlendMode] = useState("normal");
  const [logoImg, setLogoImg] = useState(null);
  const [bgImg, setBgImg] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [meshPts, setMeshPts] = useState(null);
  const [draggingPt, setDraggingPt] = useState(null);
  const [showMesh, setShowMesh] = useState(true);
  const [loading, setLoading] = useState(false);

  const template = MOCKUP_TEMPLATES.find(t => t.id === templateId) || MOCKUP_TEMPLATES[0];
  const readyCompanies = (companies || []).filter(c => c.status === "ok");
  const company = readyCompanies[selectedIdx] || null;

  const W = 600, H = 500;

  // Init / reset mesh when template or mesh size changes
  useEffect(() => {
    const pts = buildDefaultMesh(meshCols, meshRows, W, H, template.logoArea, template.type);
    setMeshPts(pts);
  }, [templateId, meshCols, meshRows]);

  // Load logo when company changes
  useEffect(() => {
    if (!company || !getImageBlob) { setLogoImg(null); return; }
    setLoading(true);
    getImageBlob(company).then(blob => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { setLogoImg(img); setLoading(false); };
      img.onerror = () => setLoading(false);
      img.src = url;
    }).catch(() => setLoading(false));
  }, [company?.id]);

  // Re-render whenever anything changes
  useEffect(() => {
    if (!canvasRef.current || !meshPts) return;
    const canvas = canvasRef.current;
    canvas.width = W; canvas.height = H;
    renderMockupToCanvas(canvas, logoImg, bgImg, template.bgColor, meshPts, meshCols, meshRows, exposure, opacity, blendMode, template.type);
    if (showMesh && meshPts) drawMeshOverlay(canvas, meshPts, meshCols, meshRows);
  }, [logoImg, bgImg, template, meshPts, exposure, opacity, blendMode, showMesh]);

  function drawMeshOverlay(canvas, pts, cols, rows) {
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.strokeStyle = "rgba(26,130,255,0.5)";
    ctx.lineWidth = 0.8;
    // Grid lines
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const pt = pts[r*(cols+1)+c];
        c === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const pt = pts[r*(cols+1)+c];
        r === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    // Dots
    pts.forEach((pt, i) => {
      const isCorner = [0, cols, rows*(cols+1), rows*(cols+1)+cols].includes(i);
      ctx.fillStyle = isCorner ? "rgba(26,130,255,0.9)" : "rgba(26,130,255,0.55)";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isCorner ? 5 : 3.5, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.restore();
  }

  const getCanvasPt = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onCanvasMouseDown = (e) => {
    if (!meshPts) return;
    const { x, y } = getCanvasPt(e);
    const hitIdx = meshPts.findIndex(pt => Math.hypot(pt.x - x, pt.y - y) < 14);
    if (hitIdx >= 0) setDraggingPt(hitIdx);
  };
  const onCanvasMouseMove = (e) => {
    if (draggingPt === null || draggingPt === undefined) return;
    const { x, y } = getCanvasPt(e);
    setMeshPts(prev => prev.map((pt, i) => i === draggingPt ? { ...pt, x: Math.round(x), y: Math.round(y) } : pt));
  };
  const onCanvasMouseUp = () => setDraggingPt(null);

  const resetMesh = () => {
    const pts = buildDefaultMesh(meshCols, meshRows, W, H, template.logoArea, template.type);
    setMeshPts(pts);
  };

  const downloadMockup = () => {
    if (!canvasRef.current) return;
    const tmp = document.createElement("canvas");
    tmp.width = W; tmp.height = H;
    renderMockupToCanvas(tmp, logoImg, bgImg, template.bgColor, meshPts, meshCols, meshRows, exposure, opacity, blendMode, template.type);
    const a = document.createElement("a");
    a.href = tmp.toDataURL("image/png");
    a.download = `${company?.companyName || "mockup"}_${templateId}.png`;
    a.click();
  };

  const bgUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setBgImg(img);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg2)",border:"0.5px solid var(--sep)",borderRadius:20,width:"100%",maxWidth:980,maxHeight:"94vh",overflow:"auto",padding:"24px 28px",display:"flex",flexDirection:"column",gap:16}} onClick={e=>e.stopPropagation()}>
        
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800,letterSpacing:"-0.5px"}}>{t("mockup.title")}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:22}}>×</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,minHeight:0}}>
          
          {/* Left: Canvas */}
          <div>
            {/* Template picker */}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              {MOCKUP_TEMPLATES.map(tmpl => (
                <button key={tmpl.id} onClick={() => setTemplateId(tmpl.id)} style={{
                  background: templateId===tmpl.id ? "rgba(26,130,255,.15)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${templateId===tmpl.id ? "rgba(26,130,255,.4)" : "rgba(255,255,255,.1)"}`,
                  borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600,
                  color: templateId===tmpl.id ? "#60a5fa" : "var(--t3)", cursor:"pointer", fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  <span style={{fontSize:14}}>{tmpl.emoji}</span>{tmpl.label}
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",background:"#0d0d14",border:"0.5px solid var(--sep)"}}>
              <canvas ref={canvasRef} width={W} height={H}
                style={{display:"block",width:"100%",cursor:draggingPt!=null?"grabbing":"crosshair"}}
                onMouseDown={onCanvasMouseDown}
                onMouseMove={onCanvasMouseMove}
                onMouseUp={onCanvasMouseUp}
                onMouseLeave={onCanvasMouseUp}
              />
              {loading && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.5)",color:"var(--t3)",fontSize:13}}>
                  {t("video.loading")}
                </div>
              )}
            </div>
            <div style={{fontSize:11,color:"var(--t4)",marginTop:6,textAlign:"center"}}>
              {showMesh ? t("mockup.drag_mesh") : ""} · {t("mockup.drag_corners")}
            </div>
          </div>

          {/* Right: Controls */}
          <div style={{display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
            
            {/* Company */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>{t("mockup.company")}</label>
              <select value={selectedIdx} onChange={e=>setSelectedIdx(Number(e.target.value))}
                style={{width:"100%",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",color:"var(--t1)",fontSize:13,fontFamily:"inherit",outline:"none"}}>
                {readyCompanies.length === 0
                  ? <option>— Add contacts first —</option>
                  : readyCompanies.map((c,i) => <option key={i} value={i}>{c.companyName}</option>)
                }
              </select>
            </div>

            {/* Custom background photo */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>{t("mockup.upload_bg")}</label>
              <label style={{display:"block",cursor:"pointer",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",fontSize:12,color:"var(--t3)",textAlign:"center"}}>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={bgUpload}/>
                📷 {bgImg ? "✓ Photo uploaded" : t("mockup.or_use_template")}
              </label>
              {bgImg && (
                <button onClick={()=>setBgImg(null)} style={{marginTop:4,fontSize:11,color:"var(--t3)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>✕ Remove photo</button>
              )}
            </div>

            {/* Mesh size */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>
                {t("mockup.mesh_size")}: {meshCols}×{meshRows}
              </label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>Cols</div>
                  <input type="range" min={2} max={12} value={meshCols} onChange={e=>setMeshCols(Number(e.target.value))} style={{width:"100%",accentColor:"var(--blue)"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>Rows</div>
                  <input type="range" min={2} max={10} value={meshRows} onChange={e=>setMeshRows(Number(e.target.value))} style={{width:"100%",accentColor:"var(--blue)"}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
                <button onClick={resetMesh} style={{fontSize:11,color:"var(--t3)",background:"none",border:"0.5px solid var(--sep)",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>↺ {t("mockup.reset_mesh")}</button>
                <label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--t3)",cursor:"pointer"}}>
                  <input type="checkbox" checked={showMesh} onChange={e=>setShowMesh(e.target.checked)} style={{accentColor:"var(--blue)"}}/>
                  Show mesh
                </label>
              </div>
            </div>

            {/* Exposure */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>
                {t("mockup.exposure")}: {exposure > 0 ? "+" : ""}{Math.round(exposure*100)}
              </label>
              <input type="range" min={-1} max={1} step={0.05} value={exposure}
                onChange={e=>setExposure(Number(e.target.value))}
                style={{width:"100%",accentColor:"var(--yellow)"}}/>
            </div>

            {/* Opacity */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>
                {t("mockup.opacity")}: {Math.round(opacity*100)}%
              </label>
              <input type="range" min={0.1} max={1} step={0.05} value={opacity}
                onChange={e=>setOpacity(Number(e.target.value))}
                style={{width:"100%",accentColor:"var(--blue)"}}/>
            </div>

            {/* Blend mode */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--t3)",display:"block",marginBottom:5}}>{t("mockup.blend")}</label>
              <select value={blendMode} onChange={e=>setBlendMode(e.target.value)}
                style={{width:"100%",background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"8px 10px",color:"var(--t1)",fontSize:13,fontFamily:"inherit",outline:"none"}}>
                {["normal","multiply","screen","overlay","soft-light","hard-light","luminosity","color-dodge"].map(m=>(
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div style={{borderTop:"0.5px solid var(--sep)",paddingTop:12,display:"flex",flexDirection:"column",gap:8}}>
              <button className="btn-s" onClick={onClose}>{t("modal.close")}</button>
              <button className="btn-p" style={{width:"100%",padding:"10px 0"}} onClick={downloadMockup} disabled={!logoImg}>
                ↓ {t("mockup.download")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendModal({ companies, getImageBlob, onClose, sharedToken, onTokenAcquired, spendCredits, creditsBalance = 999, onUpgrade, isFreePlan = false }) {
  const t = useT();
  const { lang } = useLang();
  const [step, setStep] = useState(sharedToken ? "compose" : "auth");
  const [token, setToken] = useState(sharedToken);
  const [sendErrMsg, setSendErrMsg] = useState("");
  const [subject, setSubject] = useState(() => lang === "sv" ? "En personlig demo för ((company))" : "A personal demo for ((company))");
  const [bodyText, setBodyText] = useState(() => lang === "sv" ? "Hej ((name)),\n\nHär är en personaliserad demo vi satte ihop för ((company)).\n\nHör gärna av er!\n\nMed vänliga hälsningar" : "Hi ((name)),\n\nHere's a personalised demo we put together for ((company)).\n\nLet us know what you think!\n\nBest regards");
  const [videoLink, setVideoLink] = useState("");
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
      scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file",
      callback: (r) => {
        if (r.access_token) { onTokenAcquired(r.access_token); setToken(r.access_token); setStep("compose"); }
        else alert("Login failed: " + (r.error || "unknown"));
      },
    }).requestAccessToken({ prompt: "select_account" });
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
    // Credit check: 1 credit per send
    if (spendCredits && !spendCredits(selectedContacts.length)) {
      onUpgrade?.();
      return;
    }
    setSendErrMsg("");
    setStep("sending");
    let tokenExpired = false;
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
        const videoBtn = videoLink.trim()
          ? `<div style="margin:18px 0"><a href="${videoLink.trim()}" style="display:inline-block;background:#1a82ff;color:#fff;text-decoration:none;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600">▶ Watch demo</a></div>`
          : "";
        const viralFooter = isFreePlan
          ? `<div style="margin-top:28px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#aaa;font-family:sans-serif">Sent with <a href="https://www.logoplacers.com" style="color:#1a82ff;text-decoration:none;font-weight:600">Logoplacers</a></div>`
          : "";
        const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:560px">${resolveStr(bodyText, c).replace(/\n/g,"<br>")}${videoBtn}${viralFooter}</div>`;
        const blob = await getImageBlob(c);
        const filename = `${c.companyName.toLowerCase().replace(/\s+/g,"_")}.png`;
        const raw = await buildGmailRaw({ to: c.email, subject: subj, bodyHtml: html, attachBlob: blob, filename });
        const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ raw }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          const errMsg = errBody?.error?.message || `HTTP ${res.status}`;
          console.error("Gmail send error:", res.status, errMsg, "for", c.email);
          if (res.status === 401) { tokenExpired = true; }
          setResults(r => ({ ...r, [c.id]: "err" }));
          setSendErrMsg(res.status === 401 ? "Gmail session expired — reconnect below" : `Error: ${errMsg}`);
        } else {
          setResults(r => ({ ...r, [c.id]: "ok" }));
        }
      } catch(err) {
        console.error("Send failed for", c.email, err);
        setResults(r => ({ ...r, [c.id]: "err" }));
        setSendErrMsg(err.message || "Unknown error");
      }
      if (tokenExpired) break;
    }
    setCountdown(null);
    if (tokenExpired) {
      setStep("reauth");
    } else {
      setStep("done");
    }
  };

  const doneOk = Object.values(results).filter(v => v === "ok").length;
  const doneErr = Object.values(results).filter(v => v === "err").length;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-title">
              {step === "auth" && t("send.title")}{step === "compose" && t("send.compose")}
              {step === "approve" && `Approve — ${selectedContacts.length} recipients`}
              {step === "sending" && t("send.sending")}{step === "done" && t("send.done")}
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
              <div className="auth-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></div>
              <div style={{fontSize:17,fontWeight:600,color:"var(--t1)"}}>Connect Gmail</div>
              <div style={{fontSize:13,color:"var(--t3)",maxWidth:340,lineHeight:1.55}}>
                Logoplacers skickar mejl via ditt Gmail-konto. Vi begär <strong>enbart</strong> sändningsbehörighet (gmail.send) — vi läser aldrig din inkorg, dina kontakter eller din historik.
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
              <DriveUploadField token={token} videoLink={videoLink} setVideoLink={setVideoLink} />
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
                  <div style={{fontSize:28}}>{doneErr === 0 ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}</div>
                  <div style={{fontSize:15,fontWeight:600,color:"var(--t1)",marginTop:6}}>{doneOk} of {selectedContacts.length} sent</div>
                  {doneErr > 0 && sendErrMsg && <div style={{fontSize:12,color:"var(--red)",marginTop:4}}>{sendErrMsg}</div>}
                  {doneErr > 0 && !sendErrMsg && <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>{doneErr} failed</div>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-foot">
          {step === "compose" && (
            <>
              <button className="btn-s" onClick={onClose}>{t("modal.cancel")}</button>
              <button className="btn-p" style={{width:"auto",padding:"8px 20px"}}
                disabled={!selectedContacts.length} onClick={() => setStep("approve")}>
                Preview ({selectedContacts.length}) →
              </button>
            </>
          )}
          {step === "approve" && (
            <>
              <button className="btn-s" onClick={() => setStep("compose")}>{t("modal.back")}</button>
              <button className="btn-p" style={{width:"auto",padding:"8px 20px",background:"var(--green)"}} onClick={sendAll}>
                ✓ Send {selectedContacts.length} email{selectedContacts.length !== 1 ? "s" : ""}
              </button>
            </>
          )}
          {step === "done" && <button className="btn-p" style={{width:"auto",padding:"8px 20px"}} onClick={onClose}>Close</button>}
          {step === "reauth" && (
            <>
              <div style={{fontSize:12,color:"var(--red)",flex:1}}>Gmail session expired. Reconnect and try again.</div>
              <button className="btn-p" style={{width:"auto",padding:"8px 20px"}} onClick={() => {
                window.google?.accounts?.oauth2?.initTokenClient({
                  client_id: "1004987283059-4kv0vtqrdc1mf1en2udktim2sjk18v7o.apps.googleusercontent.com",
                  scope: "https://www.googleapis.com/auth/gmail.send",
                  callback: (r) => { if (r.access_token) { onTokenAcquired(r.access_token); setToken(r.access_token); setStep("approve"); setSendErrMsg(""); setResults({}); } },
                }).requestAccessToken({ prompt: "" });
              }}>Reconnect Gmail →</button>
            </>
          )}
          {(step === "auth" || step === "sending") && <button className="btn-s" disabled={step==="sending"} onClick={onClose}>{t("modal.cancel")}</button>}
        </div>
      </div>
    </div>
  );
}


// ── Language Toggle ───────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div style={{display:"flex",alignItems:"center",gap:2,background:"rgba(255,255,255,.05)",border:"0.5px solid var(--sep)",borderRadius:8,padding:2,flexShrink:0}}>
      {["en","sv"].map(l => (
        <button key={l} onClick={()=>setLang(l)} style={{
          background: lang===l ? "rgba(26,130,255,.25)" : "none",
          border: "none", borderRadius:6, padding:"3px 8px",
          color: lang===l ? "#60a5fa" : "var(--t3)",
          fontSize:11, fontWeight:700, cursor:"pointer",
          fontFamily:"inherit", textTransform:"uppercase", letterSpacing:"0.5px",
          transition:"all .15s",
        }}>{l}</button>
      ))}
    </div>
  );
}

function LoginPage({ onLogin, loading, gdprConsent, onSetGdprConsent }) {
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
            <Logo size={26}/>
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
          {/* GDPR Consent */}
          <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",width:"100%"}}>
            <input type="checkbox" checked={gdprConsent} onChange={e=>onSetGdprConsent(e.target.checked)}
              style={{marginTop:2,accentColor:"#1a82ff",flexShrink:0,width:14,height:14,cursor:"pointer"}} />
            <span style={{fontSize:11,color:"rgba(255,255,255,0.32)",lineHeight:1.6}}>
              Jag godkänner att Logoplacers lagrar min e-post och plan för att hantera mitt konto.
              Läs vår <a href="#privacy" style={{color:"rgba(100,180,255,0.7)",textDecoration:"underline"}}>integritetspolicy</a>.
            </span>
          </label>
          <button onClick={onLogin} disabled={loading || !gdprConsent}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"13px 20px", borderRadius:12, border:"none", background: (!gdprConsent || loading) ? "rgba(255,255,255,0.25)" : hovered ? "#fff" : "rgba(255,255,255,0.93)", color: (!gdprConsent || loading) ? "rgba(0,0,0,0.4)" : "#111827", fontSize:14, fontWeight:600, fontFamily:"inherit", cursor: (loading || !gdprConsent) ? "not-allowed" : "pointer", transition:"all .18s" }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill={(!gdprConsent||loading)?"#aaa":"#4285F4"} d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill={(!gdprConsent||loading)?"#aaa":"#34A853"} d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill={(!gdprConsent||loading)?"#aaa":"#FBBC05"} d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill={(!gdprConsent||loading)?"#aaa":"#EA4335"} d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
            {loading ? "Loggar in..." : gdprConsent ? "Fortsätt med Google" : "Godkänn för att fortsätta"}
          </button>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.18)", textAlign:"center", marginTop:-10 }}>
            Vi läser aldrig din inkorg — vi skickar bara mejl <em>från</em> dig.
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function Logo({ size = 32 }) {
  const id = "lg" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a82ff"/><stop offset="1" stopColor="#5b4fff"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`}/>
      <rect x="4" y="4" width="10" height="10" rx="2.5" fill="white" opacity=".95"/>
      <rect x="18" y="4" width="10" height="10" rx="2" fill="white" opacity=".55"/>
      <rect x="4" y="18" width="10" height="10" rx="2" fill="white" opacity=".55"/>
      <rect x="18" y="18" width="10" height="10" rx="2.5" fill="white" opacity=".9"/>
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="white" opacity=".3"/>
    </svg>
  );
}

const GOOGLE_CLIENT_ID = "1004987283059-4kv0vtqrdc1mf1en2udktim2sjk18v7o.apps.googleusercontent.com";

// ─────────────────────────────────────────────
// SUPABASE
// ─────────────────────────────────────────────
const SB_URL = "https://mnfrswuslktkrzgydvkg.supabase.co";
// SECURITY NOTE: SB_KEY is the public anon key — safe to expose in frontend
// IMPORTANT: RLS (Row Level Security) must be enabled on all Supabase tables
// to prevent unauthorized data access. Verify at: Supabase → Authentication → Policies
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZnJzd3VzbGt0a3J6Z3lkdmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTkxMDUsImV4cCI6MjA4ODYzNTEwNX0.WUVjrEnWp4VVi6Yx9TfYKK9Fke85EwiaNw_ozHddK9Q";

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + path, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "",
      ...opts.headers,
    },
  });
  if (!res.ok) return null;
  try { return await res.json(); } catch { return null; }
}

async function sbGetUser(email) {
  const rows = await sbFetch(`/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function sbUpsertUser(email, data) {
  // First try PATCH (update existing row)
  const res = await sbFetch(`/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  // If no row existed (res is empty array), fall back to INSERT
  if (!res || (Array.isArray(res) && res.length === 0)) {
    return sbFetch("/rest/v1/users", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ email, ...data }),
    });
  }
  return res;
}

async function sbGetAllUsers() {
  return sbFetch("/rest/v1/users?select=*&order=updated_at.desc") || [];
}

// ── Storage helpers (signed URLs) ────────────────────────────────────────
async function sbUploadBaseImage(email, dataUrl) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const path = `${email}/base-image.png`;
    const res = await fetch(`${SB_URL}/storage/v1/object/base-images/${path}`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "image/png", "x-upsert": "true" },
      body: blob,
    });
    return res.ok ? path : null;
  } catch { return null; }
}

async function sbGetSignedUrl(path) {
  try {
    const res = await fetch(`${SB_URL}/storage/v1/object/sign/base-images/${path}`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 3600 }),
    });
    const data = await res.json();
    return data.signedURL ? `${SB_URL}/storage/v1${data.signedURL}` : null;
  } catch { return null; }
}

// ── Project persistence ───────────────────────────────────────────────────
async function sbSaveProject(email, data) {
  // Upsert by email — one active project per user
  const existing = await sbFetch(`/rest/v1/projects?email=eq.${encodeURIComponent(email)}&select=id`);
  if (Array.isArray(existing) && existing.length > 0) {
    return sbFetch(`/rest/v1/projects?id=eq.${existing[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
    });
  }
  return sbFetch("/rest/v1/projects", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ email, ...data }),
  });
}

async function sbLoadProject(email) {
  const rows = await sbFetch(`/rest/v1/projects?email=eq.${encodeURIComponent(email)}&select=*&order=updated_at.desc&limit=1`);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

// ── Companies persistence ─────────────────────────────────────────────────
async function sbSaveCompanies(projectId, companies) {
  // Delete old, insert new
  await sbFetch(`/rest/v1/companies?project_id=eq.${projectId}`, { method: "DELETE" });
  if (!companies.length) return;
  const rows = companies.map(c => ({
    project_id: projectId,
    email: c.email || "",
    domain: c.domain || "",
    name: c.companyName || "",
    person: c.personName || "",
    color: c.brandColor || null,
    status: c.status === "ok" ? "needs-logo" : c.status,
  }));
  return sbFetch("/rest/v1/companies", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(rows),
  });
}

async function sbLoadCompanies(projectId) {
  const rows = await sbFetch(`/rest/v1/companies?project_id=eq.${projectId}&select=*&order=created_at.asc`);
  if (!Array.isArray(rows)) return [];
  return rows.map(r => ({
    id: r.id,
    email: r.email,
    domain: r.domain,
    companyName: r.name,
    personName: r.person,
    brandColor: r.color,
    status: r.status || "idle",
    logoEl: null,
    logoDataUrl: null,
  }));
}

// ── Template persistence ──────────────────────────────────────────────────
async function sbSaveTemplate(email, tpl) {
  return sbFetch("/rest/v1/templates", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ email, name: tpl.name, data: tpl }),
  });
}

async function sbLoadTemplates(email) {
  const rows = await sbFetch(`/rest/v1/templates?email=eq.${encodeURIComponent(email)}&select=*&order=created_at.desc`);
  return Array.isArray(rows) ? rows.map(r => ({ ...r.data, id: r.id, name: r.name })) : [];
}

async function sbDeleteTemplate(id) {
  return sbFetch(`/rest/v1/templates?id=eq.${id}`, { method: "DELETE" });
}

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

// ─────────────────────────────────────────────
// CREDIT SYSTEM
// ─────────────────────────────────────────────
const PLANS = {
  free:       { label: "Free",       creditsPerDay: 4,    monthly: null, bulkMax: 1 },
  sdr:        { label: "SDR",        creditsPerDay: null, monthly: 300,  bulkMax: Infinity },
  salespro:   { label: "Sales Pro",  creditsPerDay: null, monthly: 2000, bulkMax: Infinity },
  team:       { label: "Team",       creditsPerDay: null, monthly: 10000,bulkMax: Infinity },
};

// Credits stored in localStorage: { plan, balance, resetAt (ISO date string) }
// lp_verified_plan in sessionStorage = plan confirmed by Supabase this session
function loadCredits() {
  try {
    const raw = localStorage.getItem("lp_credits");
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Override plan with session-verified plan to prevent flash
    const verifiedPlan = sessionStorage.getItem("lp_verified_plan");
    if (verifiedPlan && data.plan !== verifiedPlan) {
      data.plan = verifiedPlan;
    }
    return data;
  } catch { return null; }
}
function saveCredits(data) {
  localStorage.setItem("lp_credits", JSON.stringify(data));
}
function initCredits(plan = "free") {
  const p = PLANS[plan] || PLANS["free"];
  const now = new Date();
  let resetAt, balance;
  if (p.creditsPerDay) {
    // Reset daily at midnight
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0);
    resetAt = tomorrow.toISOString();
    balance = p.creditsPerDay;
  } else {
    // Reset monthly
    const nextMonth = new Date(now); nextMonth.setMonth(nextMonth.getMonth() + 1); nextMonth.setDate(1); nextMonth.setHours(0,0,0,0);
    resetAt = nextMonth.toISOString();
    balance = p.monthly;
  }
  const data = { plan, balance, resetAt };
  saveCredits(data);
  return data;
}
function getOrInitCredits() {
  let data = loadCredits();
  if (!data) return initCredits("free");
  // Check if reset is due
  if (new Date() >= new Date(data.resetAt)) {
    return initCredits(data.plan);
  }
  return data;
}

function useCredits() {
  const [credits, setCredits] = useState(() => getOrInitCredits());

  const refresh = () => setCredits(getOrInitCredits());

  // ── Listen for plan changes from admin panel (same browser) ──
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "lp_credits") {
        setCredits(getOrInitCredits());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Also poll Supabase every 30s to catch changes from other devices ──
  useEffect(() => {
    const email = (() => { try { return JSON.parse(sessionStorage.getItem("lp_user") || "{}").email; } catch { return null; } })();
    if (!email) return;
    const interval = setInterval(async () => {
      try {
        const row = await sbGetUser(email);
        if (!row) return;
        let effectivePlan = row.plan;
        if (row.trial_until && new Date(row.trial_until) > new Date()) effectivePlan = "pro";
        const current = getOrInitCredits();
        const planChanged = current.plan !== effectivePlan;
        // Also sync balance if admin changed it (row.balance exists and differs)
        const sbBalance = typeof row.balance === "number" ? row.balance : null;
        const balanceChanged = sbBalance !== null && current.balance !== sbBalance;
        if (planChanged || balanceChanged) {
          sessionStorage.setItem("lp_verified_plan", effectivePlan);
          const updated = {
            ...current,
            plan: effectivePlan,
            balance: balanceChanged ? sbBalance : current.balance,
          };
          saveCredits(updated);
          setCredits(updated);
        }
      } catch { /* silent */ }
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // 1 credit per image generated, 1 credit per email sent
  const spend = (amount = 1) => {
    const current = getOrInitCredits();
    if (current.balance < amount) return false;
    const updated = { ...current, balance: current.balance - amount };
    saveCredits(updated);
    setCredits(updated);
    return true;
  };

  const canBulk = (count) => {
    const plan = PLANS[credits.plan] || PLANS["free"];
    if (count > plan.bulkMax) return false;       // Free = 1 max
    return credits.balance >= count;
  };

  const topUp = (amount) => {
    const current = getOrInitCredits();
    const updated = { ...current, balance: current.balance + amount };
    saveCredits(updated);
    setCredits(updated);
  };

  return { credits, spend, canBulk, topUp, refresh, plan: PLANS[credits.plan] };
}

// Credit badge shown in header
function CreditBadge({ credits, onUpgrade }) {
  const plan = PLANS[credits.plan] || PLANS["free"];
  const [pulse, setPulse] = useState(false);
  const prevBalance = useRef(credits.balance);
  useEffect(() => {
    if (credits.balance !== prevBalance.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      prevBalance.current = credits.balance;
    }
  }, [credits.balance]);
  const total = plan.creditsPerDay ?? plan.monthly;
  const pct   = total ? Math.round((credits.balance / total) * 100) : 100;
  const low   = pct <= 20;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, cursor: low ? "pointer" : "default" }}
      onClick={low ? onUpgrade : undefined}
      title={`${credits.balance} credits remaining`} style={{transition:"transform .1s",transform:pulse?"scale(1.15)":"scale(1)"}}>
      <div style={{
        background: low ? "rgba(239,68,68,0.12)" : "rgba(26,130,255,0.1)",
        border: `0.5px solid ${low ? "rgba(239,68,68,0.35)" : "rgba(26,130,255,0.25)"}`,
        borderRadius: 8, padding: "4px 10px", display:"flex", alignItems:"center", gap:6,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={low?"#ef4444":"#5ba4ff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span style={{ fontSize:12, fontWeight:600, color: low?"#ef4444":"#7db8ff", fontVariantNumeric:"tabular-nums" }}>
          {credits.balance.toLocaleString()}
        </span>
        <span style={{ fontSize:10, color:"var(--t4)" }}>/ {plan.label}</span>
      </div>
      {low && (
        <button onClick={onUpgrade} style={{
          background:"linear-gradient(135deg,#1a82ff,#5b4fff)", color:"#fff", border:"none",
          borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
        }}>Upgrade</button>
      )}
    </div>
  );
}

// Modal shown when out of credits or trying to upgrade
function UpgradeModal({ onClose, credits }) {
  const [loading, setLoading] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("lp_user") || "{}");

  const STRIPE_PRICES = {
    sdr:      "price_1T94U1A1MErAKbCi3MOZydEy",
    salespro: "price_1T94U1A1MErAKbCiPMitkjPc",
    team:     "price_1T94U0A1MErAKbCioJt6SdZa",
  };

  const plans = [
    { key:"free",     label:"Free",      price:"Free", period:"",    features:["4 credits / day","Single export only"], current: credits.plan === "free" },
    { key:"sdr",      label:"SDR",       price:"$19",  period:"/mo", features:["300 credits / month","Bulk send + export"], current: credits.plan === "sdr" },
    { key:"salespro", label:"Sales Pro", price:"$29",  period:"/mo", features:["2 000 credits / month","Everything in SDR"], highlight: true, current: credits.plan === "salespro" },
    { key:"team",     label:"Team",      price:"$59",  period:"/mo", features:["10 000 credits / month","Up to 5 seats"], current: credits.plan === "team" },
  ];

  const handleUpgrade = async (plan) => {
    if (plan.key === "free" || plan.current) return;
    const priceId = STRIPE_PRICES[plan.key];
    if (!priceId) return;
    setLoading(plan.key);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    setLoading(null);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:700 }}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{t("upgrade.title")}</div>
            <div className="modal-sub">{t("upgrade.sub")}</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
            {plans.map(p => (
              <div key={p.key} style={{
                border: `1px solid ${p.highlight ? "rgba(26,130,255,0.5)" : "rgba(255,255,255,0.07)"}`,
                borderRadius:14, padding:"18px 16px",
                background: p.highlight ? "rgba(26,130,255,0.08)" : "rgba(255,255,255,0.02)",
                display:"flex", flexDirection:"column", gap:10,
              }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", color: p.highlight?"#5ba4ff":"rgba(255,255,255,0.4)", textTransform:"uppercase" }}>{p.label}</div>
                <div style={{ fontSize:28, fontWeight:800, letterSpacing:"-1.5px", color:"#fff", lineHeight:1 }}>
                  {p.price}<span style={{ fontSize:12, color:"var(--t3)", fontWeight:400 }}>{p.period}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
                  {p.features.map((f,i) => (
                    <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                      <span style={{ color: p.highlight?"#5ba4ff":"var(--t3)", fontSize:11, marginTop:1 }}>✓</span>
                      <span style={{ fontSize:12, color:"var(--t2)", lineHeight:1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled={p.current || loading === p.key}
                  onClick={() => handleUpgrade(p)}
                  style={{
                    background: p.current ? "var(--bg4)" : p.highlight ? "linear-gradient(135deg,#1a82ff,#5b4fff)" : "rgba(255,255,255,0.06)",
                    color: p.current ? "var(--t4)" : "#fff",
                    border: p.highlight?"none":"0.5px solid rgba(255,255,255,0.1)",
                    borderRadius:9, padding:"9px 0", fontSize:12, fontWeight:700,
                    cursor: p.current ? "default" : "pointer", fontFamily:"inherit", width:"100%",
                  }}>
                  {p.current ? "Current plan" : loading === p.key ? "Loading…" : `Get ${p.label}`}
                </button>
              </div>
            ))}
          </div>
        </div>
        {credits.plan !== "free" && (
          <div style={{padding:"16px 24px",borderTop:"0.5px solid var(--sep)",textAlign:"center"}}>
            <button onClick={async () => {
              const user = JSON.parse(sessionStorage.getItem("lp_user")||"{}");
              if (!user.email) return;
              const res = await fetch("/api/portal", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email: user.email }) });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }} style={{background:"none",border:"none",color:"var(--t3)",fontSize:13,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>
              Manage or cancel subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App({ onGoHome, onGoToBlog }) {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("lp_authed"));
  const [authLoading, setAuthLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(() => !!localStorage.getItem("lp_gdpr_consent"));

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      await loadGIS();
      await new Promise((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file",
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
              // Set free plan immediately to prevent flash, Supabase will override below
              sessionStorage.setItem("lp_verified_plan", "free");
              // Sync plan from Supabase
              sbGetUser(user.email).then(row => {
                if (row) {
                  // Check trial — if trial_until is in the future, upgrade to salespro temporarily
                  let effectivePlan = row.plan;
                  if (row.trial_until && new Date(row.trial_until) > new Date()) {
                    effectivePlan = "pro";
                  }
                  sessionStorage.setItem("lp_verified_plan", effectivePlan);
                  const existing = loadCredits();
                  if (!existing || existing.plan !== effectivePlan) {
                    initCredits(effectivePlan);
                  }
                } else {
                  // New user → create with free plan
                  sessionStorage.setItem("lp_verified_plan", "free");
                  initCredits("free");
                  sbUpsertUser(user.email, { plan: "free", name: user.name, picture: user.picture });
                }
                // If user came from pricing page, redirect to Stripe checkout
                const pendingPrice = sessionStorage.getItem("lp_pending_price");
                if (pendingPrice) {
                  sessionStorage.removeItem("lp_pending_price");
                  fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ priceId: pendingPrice, email: user.email }),
                  }).then(r => r.json()).then(data => { if (data.url) window.location.href = data.url; }).catch(() => {});
                }
              }).catch(() => {});
              setAuthed(true);
              // Small delay so React re-renders before hash change (prevents white screen)
              setTimeout(() => {
                if (window.location.hash !== "#app") window.location.hash = "app";
              }, 50);
              resolve();
            })
            .catch(reject);
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
      });
    } catch { /* cancelled */ }
    setAuthLoading(false);
  };

  const sessionUser = JSON.parse(sessionStorage.getItem("lp_user") || "{}");
  const t = useT();

  // If user arrived via pricing page and is already logged in → go to Stripe
  useEffect(() => {
    if (!authed) return;
    const pendingPrice = sessionStorage.getItem("lp_pending_price");
    if (!pendingPrice || !sessionUser.email) return;
    sessionStorage.removeItem("lp_pending_price");
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: pendingPrice, email: sessionUser.email }),
    }).then(r => r.json()).then(data => { if (data.url) window.location.href = data.url; }).catch(() => {});
  }, [authed]);

  const [converting, setConverting] = useState(false);
  const companiesKey = sessionUser.email ? `lp_companies_${sessionUser.email}` : "lp_companies";
  const [companies, setCompanies] = useState(() => {
    try {
      const key = sessionUser.email ? `lp_companies_${sessionUser.email}` : "lp_companies";
      const saved = localStorage.getItem(key);
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
  const [baseImageName, setBaseImageName] = useState(null);
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
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [templates, setTemplates] = useState(() => { try { return JSON.parse(localStorage.getItem("lp_templates") || "[]"); } catch { return []; } });
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [allPreviews, setAllPreviews] = useState([]);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showLaptopModal, setShowLaptopModal] = useState(false);
  const [showMockupModal, setShowMockupModal] = useState(false);
  const [gmailToken, setGmailToken] = useState(() => sessionStorage.getItem("lp_gtoken") || null);
  const [editingDomain, setEditingDomain] = useState({});
  const [editingContact, setEditingContact] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackImg, setFeedbackImg] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { credits, spend, canBulk, topUp, plan: currentPlan } = useCredits();
  const [projectId, setProjectId] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Handle pending Stripe checkout from pricing page ─────────────────────
  useEffect(() => {
    const pendingPrice = sessionStorage.getItem("lp_pending_price");
    if (!pendingPrice || !sessionUser.email) return;
    sessionStorage.removeItem("lp_pending_price");
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: pendingPrice, email: sessionUser.email }),
    }).then(r => r.json()).then(data => { if (data.url) window.location.href = data.url; }).catch(() => {});
  }, []);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const baseImageRef = useRef(null);
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const pendingLoadImgRef = useRef(null); // base image waiting for canvas to mount

  useEffect(() => {
    try { localStorage.setItem(companiesKey, JSON.stringify(companies.map(({ logoEl, ...rest }) => rest))); } catch {}
    if (sessionLoaded) triggerSave();
  }, [companies]);

  useEffect(() => {
    if (sessionLoaded) triggerSave();
  }, [logoInstances, textLayers, symbols, canvasBg, personalisedColors, colorToReplace, myLogoSize, myLogoPos]);

  // ── Load session from Supabase on mount ──────────────────────────────────
  useEffect(() => {
    const email = sessionUser.email;
    if (!email) { setSessionLoaded(true); return; }
    sbLoadProject(email).then(async project => {
      if (!project) { setSessionLoaded(true); return; }
      setProjectId(project.id);
      // Load settings
      const s = project.settings || {};
      if (s.logoInstances) setLogoInstances(s.logoInstances);
      if (s.textLayers) setTextLayers(s.textLayers);
      if (s.symbols) setSymbols(s.symbols);
      if (s.canvasBg) setCanvasBg(s.canvasBg);
      if (s.personalisedColors !== undefined) setPersonalisedColors(s.personalisedColors);
      if (s.colorToReplace) setColorToReplace(s.colorToReplace);
      if (s.myLogoSize) setMyLogoSize(s.myLogoSize);
      if (s.myLogoPos) setMyLogoPos(s.myLogoPos);
      // Load base image from Storage
      if (project.base_image_url) {
        const signedUrl = await sbGetSignedUrl(project.base_image_url);
        if (signedUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            if (canvasRef.current) {
              drawImageToCanvas(img);
            } else {
              // Canvas not mounted yet — store for later
              pendingLoadImgRef.current = img;
            }
          };
          img.src = signedUrl;
        }
      }
      // Load companies (without logos)
      const savedCompanies = await sbLoadCompanies(project.id);
      if (savedCompanies.length > 0) setCompanies(savedCompanies);
      // Load templates
      sbLoadTemplates(email).then(tpls => { if (tpls.length > 0) setTemplates(tpls); });
      setSessionLoaded(true);
    }).catch(() => setSessionLoaded(true));
  }, []);

  // ── Autosave to Supabase (debounced 3s) ──────────────────────────────────
  const saveTimerRef = useRef(null);
  const triggerSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveSession(), 3000);
  };

  const saveSession = async () => {
    const email = sessionUser.email;
    if (!email) return;
    setSaving(true);
    try {
      // Upload base image if exists
      let base_image_url = undefined; // undefined = don't overwrite existing
      if (baseImageRef.current && canvasSizeRef.current.w > 0) {
        const canvas = document.createElement("canvas");
        const { w, h } = canvasSizeRef.current;
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(baseImageRef.current, 0, 0, w, h);
        const uploaded = await sbUploadBaseImage(email, canvas.toDataURL("image/png"));
        if (uploaded) base_image_url = uploaded;
      }
      const settings = { logoInstances, textLayers, symbols, canvasBg, personalisedColors, colorToReplace, myLogoSize, myLogoPos };
      const saveData = base_image_url !== undefined ? { base_image_url, settings } : { settings };
      const project = await sbSaveProject(email, saveData);
      const pid = (Array.isArray(project) ? project[0]?.id : project?.id) || projectId;
      if (pid) {
        setProjectId(pid);
        await sbSaveCompanies(pid, companies);
      }
    } catch {}
    setSaving(false);
  };

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
    setTemplates(updated);
    localStorage.setItem("lp_templates", JSON.stringify(updated));
    setTemplateName("");
    // Save to Supabase
    sbSaveTemplate(sessionUser.email, tpl).catch(() => {});
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
    canvasSizeRef.current = { w, h }; baseImageRef.current = img;
    if (canvasRef.current) {
      canvasRef.current.width = w; canvasRef.current.height = h;
      canvasRef.current.getContext("2d").drawImage(img, 0, 0, w, h);
    }
    setHasImage(true);
  };

  const redrawBaseCanvas = () => {
    if (!canvasRef.current || !baseImageRef.current) return;
    const { w, h } = canvasSizeRef.current;
    canvasRef.current.width = w; canvasRef.current.height = h;
    canvasRef.current.getContext("2d").drawImage(baseImageRef.current, 0, 0, w, h);
  };

  useEffect(() => {
    if (!hasImage) return;
    redrawBaseCanvas();
  }, [hasImage]);

  // Apply pending base image once canvas is mounted
  useEffect(() => {
    if (canvasRef.current && pendingLoadImgRef.current) {
      drawImageToCanvas(pendingLoadImgRef.current);
      pendingLoadImgRef.current = null;
    }
  });

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
    // Credit check
    if (!canBulk(ready.length)) {
      if (credits.plan === "free" && ready.length > 1) {
        showToast("Free plan: single export only. Upgrade for bulk."); setShowUpgradeModal(true); return;
      }
      showToast(`Not enough credits (need ${ready.length}, have ${credits.balance})`); setShowUpgradeModal(true); return;
    }
    if (!spend(ready.length)) { showToast("Out of credits"); setShowUpgradeModal(true); return; }
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
    const targets = ready.length > 0 ? ready : [{ personName: "Alex", companyName: "Acme Corp", logoEl: null }];
    const previews = []; let done = 0;
    targets.forEach((comp, i) => {
      const off = renderComposite(baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w, h, textLayers, symbols, comp.personName, comp.companyName, comp.logoEl || null, { ...canvasBg, personalisedColors, colorToReplace, brandColor: comp.brandColor || null }, true /* watermark */);
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
    // Eyedropper mode: sample color from canvas
    if (eyedropperActive) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const px = Math.round(mx), py = Math.round(my);
        const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;
        const hex = "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
        setColorToReplace(hex);
        setEyedropperActive(false);
        showToast("Colour picked: " + hex);
      }
      e.preventDefault(); return;
    }
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
  const previewPerson = companies[0]?.personName || "Alex";
  const previewCompany = companies[0]?.companyName || "Acme Corp";
  const companyLogoEl = companies.find(c => c.status === "ok")?.logoEl || null;

  if (!authed) return <LoginPage
    onLogin={handleLogin}
    loading={authLoading}
    gdprConsent={gdprConsent}
    onSetGdprConsent={(v) => {
      setGdprConsent(v);
      if (v) localStorage.setItem("lp_gdpr_consent", "1");
      else localStorage.removeItem("lp_gdpr_consent");
    }}
  />;

  if (!sessionLoaded) return (
    <>
      <style>{style}</style>
      <div className="app" style={{pointerEvents:"none"}}>
        <div className="header">
          <div className="header-brand">
            <Logo size={34}/>
            <div><div className="header-name">Logoplacers</div></div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",height:"calc(100vh - 52px)"}}>
          {/* Sidebar skeleton */}
          <div style={{borderRight:"0.5px solid var(--sep)",padding:"16px 12px",display:"flex",flexDirection:"column",gap:12}}>
            {[120,80,200,100,160].map((h,i) => (
              <div key={i} style={{height:h,borderRadius:12,background:"var(--bg3)",overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,.04) 50%,transparent 100%)",animation:"shimmer 1.4s infinite",backgroundSize:"200% 100%"}}/>
              </div>
            ))}
          </div>
          {/* Canvas skeleton */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
            <div style={{width:"70%",maxWidth:600,aspectRatio:"16/10",borderRadius:16,background:"var(--bg3)",overflow:"hidden",position:"relative",boxShadow:"0 8px 40px rgba(0,0,0,0.4)"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,.04) 50%,transparent 100%)",animation:"shimmer 1.4s infinite",backgroundSize:"200% 100%"}}/>
            </div>
          </div>
        </div>
        <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
      </div>
    </>
  );

  return (
    <>
      <style>{style}</style>
      <div className="app" onMouseMove={onMouseMove} onMouseUp={() => setDragging(null)}>
        <div className="header">
          <div className="header-brand" onClick={onGoHome} style={{cursor:"pointer"}} title="Back to home">
            <Logo size={34}/>
            <div><div className="header-name">Logoplacers</div></div>
          </div>
          <div className="header-btns">
            <LangToggle />
            {sessionUser?.picture && (
              <div style={{display:"flex",alignItems:"center",gap:8,marginRight:4}}>
                <img src={sessionUser.picture} alt="" style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid var(--sep)"}} />
                <span style={{fontSize:12,color:"var(--t3)"}}>{sessionUser.name?.split(" ")[0]}</span>
                <button className="btn-s" onClick={() => { sessionStorage.clear(); setAuthed(false); }} style={{fontSize:11,padding:"3px 8px"}}>{t("app.sign_out")}</button>
              </div>
            )}
            <CreditBadge credits={credits} onUpgrade={() => setShowUpgradeModal(true)} />
            {saving && <span style={{fontSize:11,color:"var(--t3)",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>{t("app.saving")}</span>}
            {!saving && sessionLoaded && <span style={{fontSize:11,color:"var(--t3)",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>{t("app.saved")}</span>}
            <button onClick={() => setShowManual(true)} title={t("manual.title")} style={{background:"rgba(255,255,255,.06)",border:"0.5px solid var(--sep)",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--t2)",fontSize:15,fontWeight:700,flexShrink:0}}>?</button>
            <button onClick={() => setShowFeedback(true)} style={{background:"rgba(255,255,255,.06)",border:"0.5px solid var(--sep)",borderRadius:8,padding:"0 10px",height:30,display:"flex",alignItems:"center",gap:5,cursor:"pointer",color:"var(--t2)",fontSize:12,fontWeight:600,fontFamily:"inherit",flexShrink:0}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              {t("app.feedback")}
            </button>
            <button className="btn-s" disabled={!hasImage} onClick={showPreview}>
              <span style={{display:"flex",alignItems:"center",gap:6}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {t("app.preview")}
              </span>
            </button>
            <button className="btn-s" style={{display:"flex",alignItems:"center",gap:6,fontSize:12}} onClick={() => setShowLaptopModal(true)} disabled={!hasImage}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 20h8M12 17v3"/></svg>
              {t("app.macbook_video")}
            </button>
            <button className="btn-s" style={{display:"flex",alignItems:"center",gap:6,fontSize:12}} onClick={() => setShowMockupModal(true)} disabled={!hasImage}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {t("app.product_mockup")}
            </button>
            <button className="btn-s" onClick={() => setShowSendModal(true)} style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
              {t("app.send")}
              {companies.filter(c=>c.email).length > 0 && <span style={{fontSize:10,background:"var(--blue)",color:"#fff",borderRadius:"100px",padding:"1px 5px"}}>{companies.filter(c=>c.email).length}</span>}
            </button>
            <button className="btn-p" style={{width:"auto",padding:"8px 16px",fontSize:13}} disabled={!hasImage || readyCount === 0 || zipping} onClick={downloadZip}>
              {zipping ? t("app.packing") : `${t("app.download")} (${readyCount})`}
            </button>
          </div>
        </div>

        {showUpgradeModal && <UpgradeModal credits={credits} onClose={() => setShowUpgradeModal(false)} />}

        {/* USER MANUAL MODAL */}
        {showManual && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={()=>setShowManual(false)}>
            <div style={{background:"var(--bg2)",border:"0.5px solid var(--sep)",borderRadius:20,width:"100%",maxWidth:620,maxHeight:"85vh",overflow:"auto",padding:"32px 36px"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
                <h2 style={{margin:0,fontSize:20,fontWeight:800,letterSpacing:"-1px"}}>{t("manual.title")}</h2>
                <button onClick={()=>setShowManual(false)} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
              </div>
              {[
                { step:"1", tkey:"manual.step1" },
                { step:"2", tkey:"manual.step2" },
                { step:"3", tkey:"manual.step3" },
                { step:"4", tkey:"manual.step4" },
                { step:"5", tkey:"manual.step5" },
                { step:"6", tkey:"manual.step6" },
              ].map(s => (
                <div key={s.step} style={{display:"flex",gap:16,marginBottom:20}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"var(--blue-dim)",border:"1px solid rgba(26,130,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"var(--blue)",flexShrink:0}}>{s.step}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--t1)",marginBottom:4}}>{t(`${s.tkey}.title`)}</div>
                    <div style={{fontSize:13,color:"var(--t3)",lineHeight:1.6}}>{t(`${s.tkey}.body`)}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:8,padding:"14px 18px",background:"rgba(26,130,255,.06)",border:"1px solid rgba(26,130,255,.15)",borderRadius:12,fontSize:13,color:"var(--t2)",lineHeight:1.7}}>
                {t("app.credits_info")}
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK MODAL */}
        {showFeedback && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={()=>{setShowFeedback(false);setFeedbackSent(false);}}>
            <div style={{background:"var(--bg2)",border:"0.5px solid var(--sep)",borderRadius:20,width:"100%",maxWidth:480,padding:"32px 36px"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <h2 style={{margin:0,fontSize:18,fontWeight:800,letterSpacing:"-0.5px"}}>{t("feedback.title")}</h2>
                <button onClick={()=>{setShowFeedback(false);setFeedbackSent(false);}} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
              </div>
              {feedbackSent ? (
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:32,marginBottom:12}}>✓</div>
                  <div style={{fontSize:15,fontWeight:700,color:"var(--t1)",marginBottom:6}}>{t("feedback.sent_title")}</div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>{t("feedback.sent_body")}</div>
                </div>
              ) : (<>
                <textarea value={feedbackText} onChange={e=>setFeedbackText(e.target.value)}
                  placeholder={t("feedback.placeholder")}
                  style={{width:"100%",minHeight:120,background:"var(--bg3)",border:"0.5px solid var(--sep)",borderRadius:10,padding:"12px 14px",color:"var(--t1)",fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:12}} />
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,color:"var(--t3)",display:"block",marginBottom:6}}>{t("feedback.attach")}</label>
                  <input type="file" accept="image/*" onChange={e=>setFeedbackImg(e.target.files[0])}
                    style={{fontSize:12,color:"var(--t3)"}} />
                </div>
                <button disabled={!feedbackText.trim()} onClick={async () => {
                  const body = new FormData();
                  body.append("feedback", feedbackText);
                  body.append("user", sessionUser?.email || "unknown");
                  if (feedbackImg) body.append("image", feedbackImg);
                  // Send as email via mailto fallback (no backend needed)
                  const subject = encodeURIComponent("Logoplacers feedback from " + (sessionUser?.email || "user"));
                  const bodyText = encodeURIComponent(feedbackText + (feedbackImg ? "\n\n[Image attached — please reply for image]" : ""));
                  window.open(`mailto:adminlogoplacers@gmail.com?subject=${subject}&body=${bodyText}`);
                  setFeedbackSent(true);
                  setFeedbackText("");
                  setFeedbackImg(null);
                }} style={{width:"100%",padding:"11px 0",background:"var(--blue)",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:feedbackText.trim()?1:0.4}}>
                  Send feedback
                </button>
              </>)}
            </div>
          </div>
        )}

        <div className="mode-tabs">
          <button className={`mode-tab${mode === "image" ? " active" : ""}`} onClick={() => setMode("image")}>{t("app.image_mode")}</button>
          <button className={`mode-tab${mode === "video" ? " active" : ""}`} onClick={() => setMode("video")}>{t("app.video_mode")}</button>
        </div>

        {mode === "video" && <VideoMode
          companies={companies}
          resolveTemplateFn={resolveTemplate}
          renderIngredients={hasImage && baseImageRef.current ? { baseImg: baseImageRef.current, logoInstances, myLogoEl, myLogoPos, myLogoSize, w: canvasSizeRef.current.w, h: canvasSizeRef.current.h, textLayers, symbols } : null}
        />}

        {mode === "image" && <div className="workspace">
          <div className="sidebar">
            <span className="s-label">{t("app.base_image")}</span>
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
              {hasImage && (
                <button onClick={() => {
                  const ctx = canvasRef.current?.getContext("2d");
                  if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                  baseImageRef.current = null;
                  setHasImage(false);
                  setBaseImageName(null);
                }} style={{marginTop:8,width:"100%",padding:"6px 0",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,color:"#f87171",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("app.remove_image")}</button>
              )}
            </div></div>

            <div className="card" style={{margin:"0 10px 6px",padding:"10px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:canvasBg.enabled?10:0}}>
                <span style={{fontSize:12,fontWeight:600,color:"var(--t2)"}}>{t("app.background_color")}</span>
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
                  <span style={{fontSize:12,fontWeight:600,color:"var(--t2)"}}>{t("app.match_brand")}</span>
                  <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>{t("app.match_brand_sub")}</div>
                </div>
                <label style={{position:"relative",display:"inline-block",width:32,height:18,cursor:"pointer",flexShrink:0}}>
                  <input type="checkbox" checked={personalisedColors} onChange={e => setPersonalisedColors(e.target.checked)} style={{opacity:0,width:0,height:0,position:"absolute"}}/>
                  <span style={{position:"absolute",inset:0,borderRadius:9,background:personalisedColors?"var(--blue)":"var(--bg4)",transition:"background .2s"}}>
                    <span style={{position:"absolute",top:2,left:personalisedColors?16:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
                  </span>
                </label>
              </div>
              {personalisedColors && (
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  <div style={{fontSize:11,color:"var(--t3)",flexShrink:0}}>Replace:</div>
                  <input type="color" value={colorToReplace} onChange={e => setColorToReplace(e.target.value)}
                    style={{width:32,height:28,borderRadius:6,border:"1.5px solid var(--sep)",cursor:"pointer",padding:2,background:"none",flexShrink:0}} />
                  <button onClick={() => setEyedropperActive(v => !v)} title="Pick colour from image"
                    style={{display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:6,
                      border:`1.5px solid ${eyedropperActive?"var(--blue)":"var(--sep)"}`,
                      background:eyedropperActive?"rgba(26,130,255,.15)":"var(--bg4)",
                      cursor:"pointer",flexShrink:0,transition:"all .15s"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={eyedropperActive?"#5ba4ff":"var(--t2)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L3 14.67V21h6.33L20.84 9.5a5.5 5.5 0 0 0 0-7.78v-.91z"/>
                      <line x1="18" y1="11.5" x2="6" y2="23.5"/>
                    </svg>
                  </button>
                  <div style={{fontSize:10,color:"var(--t4)",fontFamily:"monospace"}}>{colorToReplace}</div>
                  {eyedropperActive && <div style={{fontSize:10,color:"var(--blue)",fontWeight:600}}>Click image to pick</div>}
                </div>
              )}
            </div>

            <div className="s-row">
              <span className="s-label">{t("app.recipient_logo")}</span>
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
              <span className="s-label">{t("app.text_layers")}</span>
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
              <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder={t("app.template_name")} onKeyDown={e => e.key==="Enter" && saveTemplate()}
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
                    <button onClick={() => { const u = templates.filter(t => t.id !== tpl.id); setTemplates(u); localStorage.setItem("lp_templates", JSON.stringify(u)); sbDeleteTemplate(tpl.id).catch(()=>{}); }} style={{fontSize:11,padding:"4px 7px",borderRadius:6,border:"0.5px solid var(--sep)",background:"none",color:"var(--t3)",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <span className="s-label">{t("app.symbols")}</span>
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

            <span className="s-label">{t("app.contacts")}</span>
            <div className="card"><div className="card-pad" style={{display:"flex",flexDirection:"column",gap:8}}>
              <textarea className="paste-area" placeholder={"Paste from CRM / LinkedIn:\n__Carl Hersaeus__\n__Flowlife__\n\nOr: Jordan, Acme Corp"} value={pasteText} onChange={e => setPasteText(e.target.value)} />
              <button className="btn-p" onClick={handlePaste} disabled={!pasteText.trim()}>{t("app.extract_contacts")}</button>
              <div style={{borderTop:"0.5px solid var(--sep)",paddingTop:10,display:"flex",flexDirection:"column",gap:6}}>
                <p style={{fontSize:12,color:"var(--t3)"}}>{t("app.add_manually")}</p>
                <input className="inp sm" placeholder={t("app.person_name")} value={singlePerson} onChange={e => setSinglePerson(e.target.value)} />
                <div style={{display:"flex",gap:7}}>
                  <input className="inp sm" style={{flex:1}} placeholder={t("app.company_placeholder")} value={singleCompany}
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
                <button className="btn-text-red" onClick={() => setCompanies([])}>{t("app.clear_all")}</button>
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
                            <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>{t("contact.name_label")}</div>
                            <input className="domain-inp" value={editingContact.name} placeholder="First Last" onChange={e => setEditingContact(ec => ({...ec, name:e.target.value}))} />
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:"var(--t4)",marginBottom:3}}>{t("contact.email_label")}</div>
                            <input className="domain-inp" value={editingContact.email} placeholder="name@company.com" type="email" onChange={e => setEditingContact(ec => ({...ec, email:e.target.value}))} />
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                          <button className="btn-s" style={{padding:"4px 10px",fontSize:11}} onClick={() => setEditingContact(null)}>{t("modal.cancel")}</button>
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
                  <p className="empty-title">{t("canvas.no_image")}</p>
                  <p className="empty-sub">{t("canvas.no_image_sub")}</p>
                </div>
              ) : (
                <div style={{ width: (cw||0)*canvasZoom, height: (ch||0)*canvasZoom, flexShrink:0 }}>
                <div className="canvas-container" ref={containerRef} onMouseDown={onMouseDown}
                  style={{ width:cw||"auto", height:ch||"auto", cursor: eyedropperActive ? "crosshair" : dragging ? "grabbing" : "default", transform:`scale(${canvasZoom})`, transformOrigin:"top left" }}>
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
                </div>
              )}
            </div>
            <div className="canvas-footer" style={{position:"relative"}}>
              {cw > 0 ? t("canvas.hint") : t("canvas.empty")}
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
                    <button className="btn-s" onClick={() => setPreviewIdx(i => Math.max(i-1,0))} disabled={previewIdx===0}>{t("modal.prev")}</button>
                    <button className="btn-s" onClick={() => setPreviewIdx(i => Math.min(i+1,allPreviews.length-1))} disabled={previewIdx===allPreviews.length-1}>{t("modal.next")}</button>
                  </>
                )}
                <button onClick={() => { setPreviewUrl(null); setAllPreviews([]); }} className="btn-s">Close</button>
                <button onClick={() => { const a=document.createElement("a"); a.href=allPreviews[previewIdx]?.url||previewUrl; a.download=`${allPreviews[previewIdx]?.name||"preview"}.png`; a.click(); }} className="btn-p" style={{width:"auto",padding:"8px 16px"}}>Download</button>
              </div>
            </div>
          </div>
        )}

        {showLaptopModal && (
          <LaptopDemoModal
            getImageBlob={getImageBlob}
            companies={companies}
            onClose={() => setShowLaptopModal(false)}
          />
        )}
        {showMockupModal && (
          <ProductMockupModal
            getImageBlob={getImageBlob}
            companies={companies}
            onClose={() => setShowMockupModal(false)}
          />
        )}
        {showSendModal && (
          <SendModal
            companies={companies}
            getImageBlob={getImageBlob}
            sharedToken={gmailToken}
            onTokenAcquired={t => { setGmailToken(t); sessionStorage.setItem("lp_gtoken", t); }}
            onClose={() => setShowSendModal(false)}
            spendCredits={spend}
            creditsBalance={credits.balance}
            isFreePlan={credits.plan === "free"}
            onUpgrade={() => { setShowSendModal(false); setShowUpgradeModal(true); }}
          />
        )}
        {showUpgradeModal && <UpgradeModal credits={credits} onClose={() => setShowUpgradeModal(false)} />}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
// Add your email here to grant admin access
const ADMIN_EMAILS = [
  "adminlogoplacers@gmail.com", // NOTE: Move to env var if open-sourcing
];

function AdminPanel({ onBack }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("lp_admin_user") || "null");
      return u && ADMIN_EMAILS.includes(u.email) ? u : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState("");

  const PLANS = ["free", "sdr", "salespro", "team"];
  const PLAN_LIMITS = { free: 4, sdr: 300, salespro: 2000, team: 10000 };

  const loginWithGoogle = async () => {
    setLoading(true); setDenied(false);
    try {
      await loadGIS();
      await new Promise((resolve, reject) => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: async (resp) => {
            if (resp.error) { reject(resp.error); return; }
            try {
              const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${resp.access_token}` }
              });
              const u = await r.json();
              if (ADMIN_EMAILS.includes(u.email)) {
                sessionStorage.setItem("lp_admin_user", JSON.stringify(u));
                setAdminUser(u);
                resolve();
              } else {
                setDenied(true);
                resolve();
              }
            } catch(e) { reject(e); }
          },
        }).requestAccessToken({ prompt: "select_account" });
      });
    } catch { /* cancelled */ }
    setLoading(false);
  };

  useEffect(() => {
    if (!adminUser) return;
    sbGetAllUsers().then(rows => setUsers(Array.isArray(rows) ? rows : []));
    // Auto-refresh every 15s for real-time credits
    const interval = setInterval(() => {
      sbGetAllUsers().then(rows => setUsers(Array.isArray(rows) ? rows : []));
    }, 15000);
    return () => clearInterval(interval);
  }, [adminUser]);

  const saveEdit = async () => {
    if (!editing) return;
    const updated = { plan: editing.plan, balance: Number(editing.balance), updated_at: new Date().toISOString() };
    if (editing.trial_until) updated.trial_until = editing.trial_until;
    await sbUpsertUser(editing.email, updated);
    setUsers(us => us.map(u => u.email === editing.email ? { ...u, ...updated } : u));

    // ── Force-sync the user's local credits if they are currently logged in ──
    // We write directly to their localStorage key so the next render picks it up.
    // This works if admin and user share the same browser, and also seeds the
    // correct balance for when the user next opens the app on any device.
    try {
      const userEmail = editing.email;
      const storageKey = `lp_companies_${userEmail}`;
      // Update lp_credits_{email} if it exists
      const credKey = `lp_credits`;
      // Try to patch localStorage for this user's session (same browser)
      const existingRaw = localStorage.getItem(credKey);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        // Only patch if the stored email matches the edited user
        const storedUser = sessionStorage.getItem("lp_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === userEmail) {
            // Same browser session — patch immediately
            const planName = editing.plan;
            const newBalance = Number(editing.balance);
            const now = new Date();
            let resetAt = existing.resetAt;
            // Recalculate resetAt if plan type changed (daily vs monthly)
            if (planName === "free" && !existing.resetAt?.includes("T")) {
              const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1); tomorrow.setHours(0,0,0,0);
              resetAt = tomorrow.toISOString();
            } else if (planName !== "free" && existing.plan !== editing.plan) {
              const nextMonth = new Date(now); nextMonth.setMonth(nextMonth.getMonth()+1); nextMonth.setDate(1); nextMonth.setHours(0,0,0,0);
              resetAt = nextMonth.toISOString();
            }
            localStorage.setItem(credKey, JSON.stringify({ plan: editing.plan, balance: newBalance, resetAt }));
            sessionStorage.setItem("lp_verified_plan", editing.plan);
            // Dispatch storage event so the app tab picks it up instantly
            window.dispatchEvent(new StorageEvent("storage", { key: credKey }));
          }
        }
      }
    } catch(e) { /* non-critical */ }

    setSaved(editing.email); setTimeout(() => setSaved(""), 2000);
    setEditing(null);
  };

  const addUser = async () => {
    const email = prompt("User email:");
    if (!email?.trim()) return;
    const existing = users.find(u => u.email === email.trim());
    if (existing) { alert("User already exists"); return; }
    const fresh = { plan: "free", balance: 4 };
    await sbUpsertUser(email.trim(), fresh);
    setUsers(us => [...us, { email: email.trim(), ...fresh }]);
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  // ── Login screen ──────────────────────────────────────────────────────
  if (!adminUser) return (
    <div style={{minHeight:"100vh",background:"#070b12",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:24,padding:"44px 48px",width:360,display:"flex",flexDirection:"column",gap:20,alignItems:"center",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#1a82ff,#5b4fff)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 32px rgba(26,130,255,.35)"}}>
          <Logo size={24}/>
        </div>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-1px",marginBottom:6}}>Admin</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.6}}>Sign in with your Google account.<br/>Access is restricted to admins.</div>
        </div>
        {denied && <div style={{fontSize:12,color:"#ef4444",padding:"8px 14px",background:"rgba(239,68,68,.1)",borderRadius:8,width:"100%"}}>Access denied — your account is not an admin.</div>}
        <button onClick={loginWithGoogle} disabled={loading}
          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"12px 20px",borderRadius:12,border:"none",background:loading?"rgba(255,255,255,.7)":"rgba(255,255,255,.93)",color:"#111827",fontSize:14,fontWeight:600,fontFamily:"inherit",cursor:loading?"default":"pointer",transition:"all .15s"}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
        <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,.25)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t("modal.back")}</button>
      </div>
    </div>
  );

  // ── Admin dashboard ───────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#070b12",color:"#fff",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",padding:"40px 32px"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <img src={adminUser.picture} alt="" style={{width:36,height:36,borderRadius:"50%",border:"2px solid rgba(255,255,255,.1)"}}/>
            <div>
              <div style={{fontSize:20,fontWeight:800,letterSpacing:"-1px"}}>Admin Panel</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>{adminUser.email}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addUser} style={{padding:"8px 16px",background:"rgba(26,130,255,.15)",border:"1px solid rgba(26,130,255,.3)",color:"#5ba4ff",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Add user</button>
            <button onClick={() => { sessionStorage.removeItem("lp_admin_user"); setAdminUser(null); }}
              style={{padding:"8px 14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.4)",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
            <button onClick={onBack} style={{padding:"8px 14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.4)",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← App</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:24}}>
          {[["Total users", users.length],
            ["Free", users.filter(u=>u.plan==="free"||!u.plan).length],
            ["SDR", users.filter(u=>u.plan==="sdr").length],
            ["Pro", users.filter(u=>u.plan==="pro").length],
            ["Team", users.filter(u=>u.plan==="team").length],
          ].map(([label, val]) => (
            <div key={label} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:"-1px"}}>{val}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by email…"
          style={{width:"100%",padding:"10px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",marginBottom:12,boxSizing:"border-box"}}/>

        {/* User rows */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(u => (
            <div key={u.email} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"14px 18px"}}>
              {editing?.email === u.email ? (
                <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
                  <div style={{fontWeight:600,fontSize:13,flex:"1 1 180px",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                  <select value={editing.plan} onChange={e=>setEditing({...editing,plan:e.target.value})}
                    style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.06)",color:"#fff",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>
                    {PLANS.map(p=><option key={p} value={p}>{p} ({PLAN_LIMITS[p].toLocaleString()}/mo)</option>)}
                  </select>
                  <input type="number" value={editing.balance} onChange={e=>setEditing({...editing,balance:e.target.value})}
                    style={{width:88,padding:"6px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.06)",color:"#fff",fontSize:13,fontFamily:"inherit"}}
                    placeholder="Credits"/>
                  <input type="date" value={editing.trial_until||""} onChange={e=>setEditing({...editing,trial_until:e.target.value})}
                    style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.06)",color:editing.trial_until?"#fff":"rgba(255,255,255,.3)",fontSize:13,fontFamily:"inherit"}}
                    title="Trial until (optional)"/>
                  <button onClick={saveEdit} style={{padding:"6px 16px",background:"#1a82ff",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Save</button>
                  <button onClick={()=>setEditing(null)} style={{padding:"6px 12px",background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.5)",border:"none",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{t("modal.cancel")}</button>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 180px",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13,fontWeight:500}}>{u.email}</div>
                  <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",padding:"3px 9px",borderRadius:6,
                    background:u.plan==="free"||!u.plan?"rgba(255,255,255,.06)":u.plan==="sdr"?"rgba(26,130,255,.15)":u.plan==="pro"?"rgba(91,79,255,.2)":"rgba(16,185,129,.15)",
                    color:u.plan==="free"||!u.plan?"rgba(255,255,255,.4)":u.plan==="sdr"?"#5ba4ff":u.plan==="pro"?"#a78bfa":"#34d399"
                  }}>{u.plan||"free"}</span>
                  {/* Credits live bar */}
                  {(() => {
                    const plan = u.plan || "free";
                    const limits = { free: 4, sdr: 300, pro: 2000, team: 10000 };
                    const total = limits[plan] || 4;
                    const bal = u.balance ?? 0;
                    const used = Math.max(0, total - bal);
                    const pct = Math.min(100, (used / total) * 100);
                    const barColor = pct > 90 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#34d399";
                    return (
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:"0 0 auto"}}>
                        <div style={{width:80,height:5,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:barColor,borderRadius:3,transition:"width .3s"}}/>
                        </div>
                        <span style={{fontSize:12,color:"rgba(255,255,255,.5)",fontVariantNumeric:"tabular-nums",minWidth:70}}>
                          {bal.toLocaleString()} / {total.toLocaleString()}
                        </span>
                      </div>
                    );
                  })()}
                  {u.trial_until && new Date(u.trial_until) > new Date() && <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:5,background:"rgba(251,191,36,.1)",color:"#fbbf24"}}>trial until {u.trial_until}</span>}
                  {saved===u.email && <span style={{fontSize:11,color:"#34d399",fontWeight:600}}>✓ Saved</span>}
                  <button onClick={()=>setEditing({email:u.email,plan:u.plan||"free",balance:u.balance??0,trial_until:u.trial_until||""})}
                    style={{padding:"5px 13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.45)",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginLeft:"auto"}}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div style={{textAlign:"center",color:"rgba(255,255,255,.2)",padding:"48px 0",fontSize:13}}>No users found</div>}
        </div>

        <div style={{marginTop:28,padding:"14px 18px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,.2)",lineHeight:1.7}}>
          Credits synced from Supabase every 15s. Balance shown = remaining credits for this cycle. Bar turns red when &gt; 90% used.
        </div>
      </div>
    </div>
  );
}

function AppRouterInner() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#app") return "app";
    if (hash === "#blog") return "blog";
    if (hash === "#admin") return "admin";
    if (hash === "#privacy") return "privacy";
    if (hash === "#terms") return "terms";
    return "landing";
  });
  useEffect(() => {
    const APP_HASHES = ["#app","#blog","#admin","#privacy","#terms","","#"];
    const onHash = () => {
      const hash = window.location.hash;
      if (hash === "#app") setView("app");
      else if (hash === "#blog") setView("blog");
      else if (hash === "#admin") setView("admin");
      else if (hash === "#privacy") setView("privacy");
      else if (hash === "#terms") setView("terms");
      else if (APP_HASHES.includes(hash)) setView("landing");
      // Otherwise: blog post slug or other sub-hash — don't change view
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const goToApp  = () => { window.location.hash = "app";  setView("app"); };
  const goToBlog = () => { window.location.hash = "blog"; setView("blog"); };
  const goHome   = () => { window.location.hash = "";     setView("landing"); };

  if (view === "app")   return <App onGoHome={goHome} onGoToBlog={goToBlog} />;
  if (view === "blog")  return <Blog onEnterApp={goToApp} onBack={goHome} />;
  if (view === "admin") return <AdminPanel onBack={goHome} />;
  if (view === "privacy") return <Legal page="privacy" onBack={goHome} />;
  if (view === "terms")   return <Legal page="terms" onBack={goHome} />;
  return <Landing onEnterApp={goToApp} onOpenBlog={goToBlog} />;
}

// ── Cookie/Privacy notice ─────────────────────────────────────────────────────
function CookieNotice() {
  const [hidden, setHidden] = useState(() => !!localStorage.getItem("lp_cookie_ok"));
  if (hidden) return null;
  return (
    <div style={{
      position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)",
      zIndex:9999, background:"rgba(10,16,26,0.96)", backdropFilter:"blur(20px)",
      border:"1px solid rgba(255,255,255,0.1)", borderRadius:14,
      padding:"14px 20px", display:"flex", alignItems:"center", gap:16,
      boxShadow:"0 8px 40px rgba(0,0,0,0.6)", maxWidth:520, width:"calc(100% - 40px)",
    }}>
      <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5,flex:1}}>
        Vi använder localStorage för att spara din session och inställningar — inga spårningscookies.
        {" "}<a href="#privacy" style={{color:"rgba(100,180,255,0.7)"}}>Integritetspolicy</a>
      </span>
      <button onClick={()=>{localStorage.setItem("lp_cookie_ok","1");setHidden(true);}} style={{
        background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",border:"none",
        borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",
        fontFamily:"inherit",flexShrink:0,
      }}>OK</button>
    </div>
  );
}


export default function AppRouter() {
  return <LanguageProvider><AppRouterInner /><CookieNotice /></LanguageProvider>;
}
