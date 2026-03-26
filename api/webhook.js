import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN = {
  "price_1T94U1A1MErAKbCi3MOZydEy": "sdr",
  "price_1T94U1A1MErAKbCiPMitkjPc": "salespro",
  "price_1T94U0A1MErAKbCioJt6SdZa": "team",
};

// Credits per plan per month
const PLAN_CREDITS = {
  sdr: 300,
  salespro: 2000,
  team: 10000,
  free: 0,
};

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      const subscriptionId = session.subscription;

      if (email && subscriptionId) {
        // Get subscription to find price
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId] || "sdr";
        const credits = PLAN_CREDITS[plan];

        await supabase
          .from("users")
          .update({ plan, balance: credits, stripe_subscription_id: subscriptionId })
          .eq("email", email);

        console.log(`Upgraded ${email} to ${plan}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const customer = await stripe.customers.retrieve(customerId);
      const email = customer.email;

      if (email) {
        await supabase
          .from("users")
          .update({ plan: "free", balance: 0, stripe_subscription_id: null })
          .eq("email", email);

        console.log(`Downgraded ${email} to free`);
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: err.message });
  }

  res.json({ received: true });
}
