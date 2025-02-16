const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const PricingPlan = require("../models/PricingPlan");

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Process Payment
router.post("/", async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await PricingPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan.name },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Payment Failed" });
  }
});

module.exports = router;
