exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain;
  if (!domain) return { statusCode: 400, body: "missing domain" };

  const d = domain.replace(/^www\./, "");
  const sources = [
    `https://logo.clearbit.com/${d}`,
    `https://img.logo.dev/${d}?token=pk_R0sMXR3dSE2fZMRCOhPOWg`,
    `https://www.google.com/s2/favicons?domain=${d}&sz=128`,
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${d}&size=128`,
  ];

  for (const src of sources) {
    try {
      const res = await fetch(src);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 50) continue;
      const contentType = res.headers.get("content-type") || "image/png";
      const base64 = Buffer.from(buf).toString("base64");
      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400",
        },
        body: base64,
        isBase64Encoded: true,
      };
    } catch { continue; }
  }

  return { statusCode: 404, body: "not found" };
};
