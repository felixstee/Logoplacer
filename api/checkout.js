const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { priceId, email } = req.body;
  if (!priceId || !email) return res.status(400).json({ error: "Missing priceId or email" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://logoplacers.com/app?upgrade=success",
      cancel_url: "https://logoplacers.com/app?upgrade=cancel",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
};
