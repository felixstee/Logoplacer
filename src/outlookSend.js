// ─────────────────────────────────────────────────────────────
// outlookSend.js — Microsoft Outlook auth + send module
// ─────────────────────────────────────────────────────────────
// Completely isolated from Gmail code.
// Gmail send path in App.jsx is NEVER touched by this file.
// ─────────────────────────────────────────────────────────────

import { PublicClientApplication } from "@azure/msal-browser";

const MS_CLIENT_ID = "e8263b7c-da1f-45de-91ce-fd95224247ae";
const MS_SCOPES = ["openid", "profile", "email", "Mail.Send"];

let _msalInstance = null;
let _msalAccount = null;

// ── Init MSAL instance (idempotent) ──────────────────────────
async function getMSAL() {
  if (_msalInstance) return _msalInstance;
  _msalInstance = new PublicClientApplication({
    auth: {
      clientId: MS_CLIENT_ID,
      authority: "https://login.microsoftonline.com/common",
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  });
  await _msalInstance.initialize();
  return _msalInstance;
}

// ── Pre-init — call on mount so popup fires instantly on click ──
export async function initMSAL() {
  await getMSAL();
}

// ── loadMSAL — kept for backwards compat, no-op now ──────────
export function loadMSAL() { return Promise.resolve(); }

// ── Login popup — returns { email, name } ────────────────────
// _msalInstance must already be set via initMSAL() on mount,
// so loginPopup fires in the same call stack as the click event.
export async function loginWithMicrosoft() {
  if (!_msalInstance) await getMSAL(); // fallback
  const result = await _msalInstance.loginPopup({ scopes: MS_SCOPES });
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
    // Silent failed — try popup (token expired)
    const result = await instance.acquireTokenPopup({ scopes: MS_SCOPES, account: _msalAccount });
    return result.accessToken;
  }
}

// ── Convert Blob to base64 string ────────────────────────────
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

// ── Main send function — mirrors Gmail send signature ─────────
// Params match what EmailSender already prepares:
//   { to, subject, bodyHtml, attachBlob, filename, attachments }
// Returns true on success, throws on error.
export async function sendWithOutlook({ to, subject, bodyHtml, attachBlob, filename, attachments }) {
  const token = await getMSToken();

  let graphAttachments = [];
  let finalHtml = bodyHtml;

  if (attachments && attachments.length > 1) {
    // Multi-image send
    graphAttachments = await Promise.all(
      attachments.map((blob, i) => {
        const cid = `img_${i}@logoplacers`;
        const name = `image_${i}.png`;
        return buildAttachment(blob, name, cid);
      })
    );
  } else if (attachBlob) {
    const cid = `img_0@logoplacers`;
    const name = filename || "image.png";
    graphAttachments = [await buildAttachment(attachBlob, name, cid)];
  }

  const message = {
    subject,
    body: {
      contentType: "HTML",
      content: finalHtml,
    },
    toRecipients: [{ emailAddress: { address: to } }],
    attachments: graphAttachments,
  };

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
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
}
