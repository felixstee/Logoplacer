export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { raw, token } = req.body ?? {};

  console.log("Body keys:", Object.keys(req.body ?? {}));
  console.log("Token (first 20):", token?.substring(0, 20));
  console.log("Raw length:", raw?.length);

  if (!raw || !token) {
    return res.status(400).json({ error: "Missing raw or token", bodyType: typeof req.body, keys: Object.keys(req.body ?? {}) });
  }

  try {
    const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    });
    const data = await gmailRes.json();
    if (!gmailRes.ok) { console.error("Gmail error:", JSON.stringify(data)); return res.status(gmailRes.status).json(data); }
    console.log("Send success:", data.id);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
