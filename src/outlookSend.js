// ─────────────────────────────────────────────────────────────
// outlookSend.js — Microsoft Outlook auth + send (MSAL v5)
// ─────────────────────────────────────────────────────────────
// Completely isolated from Gmail code.
// Gmail send path in App.jsx is NEVER touched by this file.
// ─────────────────────────────────────────────────────────────

import { PublicClientApplication } from "@azure/msal-browser";

const MS_CLIENT_ID = "e8263b7c-da1f-45de-91ce-fd95224247ae";
const MS_SCOPES = ["openid", "profile", "email", "Mail.Send"];
const MS_POPUP_REDIRECT = window.location.hostname === "localhost"
  ? "http://localhost:5173/auth-redirect.html"
  : "https://logoplacers.com/auth-redirect.html";

let _msalInstance = null;
let _msalAccount = null;
let _msalReady = false;

// ── Init MSAL instance (idempotent, v5) ──────────────────────
async function getMSAL() {
  if (_msalInstance && _msalReady) return _msalInstance;
  if (!_msalInstance) {
    _msalInstance = new PublicClientApplication({
      auth: {
        clientId: MS_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        redirectUri: MS_POPUP_REDIRECT,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
    });
  }
  // In MSAL v5, initialize() also handles any pending redirect response
  await _msalInstance.initialize();
  _msalReady = true;
  return _msalInstance;
}

// ── Pre-init on mount — wrapped so errors don't block the button ──
export async function initMSAL() {
  try { await getMSAL(); } catch (e) { console.warn("MSAL pre-init failed:", e); }
}

// ── loadMSAL — no-op, kept for compat ────────────────────────
export function loadMSAL() { return Promise.resolve(); }

// ── Login popup — returns { email, name } ────────────────────
export async function loginWithMicrosoft() {
  const instance = await getMSAL();
  const result = await instance.loginPopup({
    scopes: MS_SCOPES,
    redirectUri: MS_POPUP_REDIRECT,
  });
  _msalAccount = result.account;
  const accountData = {
    homeAccountId: result.account.homeAccountId,
    username: result.account.username,
    name: result.account.name,
    email: result.account.username,
  };
  sessionStorage.setItem("lp_provider", "microsoft");
  sessionStorage.setItem("lp_ms_account", JSON.stringify(accountData));
  return accountData;
}

// ── Get current MS user from session ─────────────────────────
export function getMSUser() {
  try {
    const s = sessionStorage.getItem("lp_ms_account");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// ── Acquire token silently (auto-refresh) ────────────────────
async function getMSToken() {
  const instance = await getMSAL();
  if (!_msalAccount) {
    const stored = sessionStorage.getItem("lp_ms_account");
    if (stored) {
      const parsed = JSON.parse(stored);
      const accounts = instance.getAllAccounts();
      _msalAccount = accounts.find(a => a.homeAccountId === parsed.homeAccountId) || accounts[0];
    }
  }
  if (!_msalAccount) throw new Error("No Microsoft account — please log in again.");
  try {
    const result = await instance.acquireTokenSilent({
      scopes: MS_SCOPES,
      account: _msalAccount,
    });
    return result.accessToken;
  } catch {
    const result = await instance.acquireTokenPopup({
      scopes: MS_SCOPES,
      account: _msalAccount,
      redirectUri: MS_POPUP_REDIRECT,
    });
    return result.accessToken;
  }
}

// ── Convert Blob to base64 ────────────────────────────────────
async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// ── Build Graph API attachment object ────────────────────────
async function buildAttachment(blob, name, contentId) {
  const b64 = await blobToBase64(blob);
  return {
    "@odata.type": "#microsoft.graph.fileAttachment",
    name,
    contentType: blob.type || "image/png",
    contentBytes: b64,
    isInline: true,
    contentId,
  };
}

// ── Send via Microsoft Graph ──────────────────────────────────
export async function sendWithOutlook({ to, subject, bodyHtml, attachBlob, filename, attachments }) {
  const token = await getMSToken();
  let graphAttachments = [];

  if (attachments && attachments.length > 1) {
    graphAttachments = await Promise.all(
      attachments.map((blob, i) => buildAttachment(blob, `image_${i}.png`, `img_${i}@logoplacers`))
    );
  } else if (attachBlob) {
    graphAttachments = [await buildAttachment(attachBlob, filename || "image.png", "img_0@logoplacers")];
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "HTML", content: bodyHtml },
        toRecipients: [{ emailAddress: { address: to } }],
        attachments: graphAttachments,
      },
      saveToSentItems: true,
    }),
  });

  if (res.status === 401) throw new Error("OUTLOOK_TOKEN_EXPIRED");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return true;
}

// ── Sign out ──────────────────────────────────────────────────
export function logoutMicrosoft() {
  sessionStorage.removeItem("lp_provider");
  sessionStorage.removeItem("lp_ms_account");
  _msalInstance = null;
  _msalAccount = null;
  _msalReady = false;
}
