export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: "missing domain" });

  const d = domain.replace(/^www\./, "").toLowerCase().trim();

  const sources = [
    `https://logo.clearbit.com/${d}`,
    `https://icons.duckduckgo.com/ip3/${d}.ico`,
    `https://www.google.com/s2/favicons?sz=128&domain_url=https://${d}`,
    `https://${d}/favicon.ico`,
  ];

  for (const url of sources) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "follow",
      });
      if (!r.ok) continue;
      const buf = await r.arrayBuffer();
      if (!buf.byteLength) continue;
      const ct = r.headers.get("content-type") || "image/png";
      if (ct.includes("text/html")) continue;

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", ct);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(Buffer.from(buf));
    } catch { continue; }
  }

  res.status(404).json({ error: "no logo found" });
}