const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    console.log("Received plan:", plan, "Type:", typeof plan);

    const prices = {
      basic: 1000,
      standard: 2500,
      premium: 5000,
      student: 2100,
      athlete: 25000,
    };

    if (!plan) {
      console.error("❌ No plan received in request.");
      return res.status(400).json({ error: "Plan is required" });
    }

    if (!prices[plan]) {
      console.error("❌ Invalid Plan Selected:", plan);
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${plan.toUpperCase()} Plan` },
            unit_amount: prices[plan],
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("✅ Checkout session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});

module.exports = router