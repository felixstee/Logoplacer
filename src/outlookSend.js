// ─────────────────────────────────────────────────────────────
// outlookSend.js — Microsoft Outlook auth + send (MSAL v5)
// Uses REDIRECT flow — no popup, fully reliable cross-browser.
// ─────────────────────────────────────────────────────────────

import { PublicClientApplication } from "@azure/msal-browser";

// DEBUG — remove after confirming URL format
localStorage.setItem("lp_debug_url", JSON.stringify({
  href: window.location.href,
  search: window.location.search,
  hash: window.location.hash,
  ts: Date.now()
}));

const MS_CLIENT_ID = "e8263b7c-da1f-45de-91ce-fd95224247ae";
const MS_SCOPES = ["openid", "profile", "email", "Mail.Send"];
const MS_REDIRECT_URI = window.location.hostname === "localhost"
  ? "http://localhost:5173"
  : "https://logoplacers.com";

let _msalInstance = null;
let _msalReady = false;
let _msalAccount = null;

async function getMSAL() {
  if (_msalInstance && _msalReady) return _msalInstance;
  if (!_msalInstance) {
    _msalInstance = new PublicClientApplication({
      auth: {
        clientId: MS_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        redirectUri: MS_REDIRECT_URI,
      },
      cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false },
    });
  }
  await _msalInstance.initialize();
  _msalReady = true;
  return _msalInstance;
}

// ── Call on app mount — handles the redirect response if returning from Microsoft ──
// Returns accountData if user just logged in via redirect, null otherwise.
export async function handleMSRedirect() {
  try {
    const instance = await getMSAL();
    const result = await instance.handleRedirectPromise();
    if (!result) return null;
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
  } catch (e) {
    console.warn("MSAL redirect handling failed:", e);
    return null;
  }
}

// ── Initiates redirect to Microsoft login — browser navigates away ──
export async function loginWithMicrosoft() {
  const instance = await getMSAL();
  await instance.loginRedirect({
    scopes: MS_SCOPES,
    redirectUri: MS_REDIRECT_URI,
    prompt: "select_account",
  });
  // Browser navigates away — code below never runs
}

// ── Pre-init on mount ─────────────────────────────────────────
export async function initMSAL() {
  try { await getMSAL(); } catch (e) { console.warn("MSAL pre-init failed:", e); }
}

export function loadMSAL() { return Promise.resolve(); }

export function getMSUser() {
  try {
    const s = sessionStorage.getItem("lp_ms_account");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

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
    const result = await instance.acquireTokenSilent({ scopes: MS_SCOPES, account: _msalAccount });
    return result.accessToken;
  } catch {
    // Silent failed — redirect to re-auth
    await instance.acquireTokenRedirect({ scopes: MS_SCOPES, account: _msalAccount, redirectUri: MS_REDIRECT_URI });
    throw new Error("Redirecting for re-auth...");
  }
}

async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function buildAttachment(blob, name, contentId) {
  const b64 = await blobToBase64(blob);
  return {
    "@odata.type": "#microsoft.graph.fileAttachment",
    name, contentType: blob.type || "image/png",
    contentBytes: b64, isInline: true, contentId,
  };
}

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

export function logoutMicrosoft() {
  sessionStorage.removeItem("lp_provider");
  sessionStorage.removeItem("lp_ms_account");
  _msalInstance = null;
  _msalAccount = null;
  _msalReady = false;
}
