import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_TO_PLAN = {
  "price_1T93cHA4VuVPCb7FUKN5KA8T": "sdr",
  "price_1T93cnA4VuVPCb7FI0eQ5lKa": "salespro",
  "price_1T93dSA4VuVPCb7Ff4DvV8zW": "team",
};

const PLAN_CREDITS = { sdr: 300, salespro: 2000, team: 10000 };

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY; // service role key (not anon)

async function updateUserPlan(email, plan) {
  const balance = PLAN_CREDITS[plan] ?? 4;
  await fetch(`${SB_URL}/rest/v1/users`, {
    method: "POST",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({ email, plan, balance }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const email = session.customer_email || session.metadata?.email;
    const subId = session.subscription;
    if (email && subId) {
      const sub = await stripe.subscriptions.retrieve(subId);
      const priceId = sub.items.data[0]?.price?.id;
      const plan = PRICE_TO_PLAN[priceId];
      if (plan) await updateUserPlan(email, plan);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = session;
    const customer = await stripe.customers.retrieve(sub.customer);
    const email = customer.email;
    if (email) await updateUserPlan(email, "free");
  }

  res.status(200).json({ received: true });
}

export const config = { api: { bodyParser: false } };
