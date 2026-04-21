// src/msalRedirect.js
// Loaded only inside the MSAL popup window.
// Initializes MSAL so it can process the auth response and signal the parent.
import { PublicClientApplication } from "@azure/msal-browser";

const app = new PublicClientApplication({
  auth: {
    clientId: "e8263b7c-da1f-45de-91ce-fd95224247ae",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.href.split("?")[0].split("#")[0],
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
});

await app.initialize();
// initialize() in MSAL v5 handles the redirect response automatically
// and signals the parent window via BroadcastChannel — popup closes itself
