const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return res.status(404).json({ error: "No customer found" });

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: "https://logoplacers.com/app",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    res.status(500).json({ error: err.message });
  }
};
