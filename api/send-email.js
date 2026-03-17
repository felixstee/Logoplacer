export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { raw, token } = req.body;

  console.log("Token received (first 20):", token?.substring(0, 20));
  console.log("Raw length:", raw?.length);

  if (!raw || !token) {
    return res.status(400).json({ error: "Missing raw or token" });
  }

  try {
    const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    const data = await gmailRes.json();

    if (!gmailRes.ok) {
      console.error("Gmail error:", data);
      return res.status(gmailRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
