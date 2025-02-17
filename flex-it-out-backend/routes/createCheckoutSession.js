const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.error("Stripe API keys are missing from environment variables.");
  process.exit(1);
}

// Plan prices (can be extended or updated)
const prices = {
  basic: 1000,
  premium: 5000,
  student: 2100,
};

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan, userId } = req.body;

    // Validate plan input
    if (!prices[plan]) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: { userId, plan }, // Store user ID and plan in metadata
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
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Payment session creation failed" });
  }
});

// Stripe Webhook to Update User Membership
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    console.error("Missing Stripe signature");
    return res.status(400).send("Missing Stripe signature");
  }

  let event;

  try {
    if (!endpointSecret) {
      console.error("Stripe Webhook secret is not set");
      return res.status(400).send("Webhook secret missing");
    }

    // Verify webhook signature and construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Log the event to debug
    console.log("Received Event:", event);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, plan } = session.metadata;

      console.log(`Payment Successful for User ID: ${userId}, Plan: ${plan}`);

      if (userId) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1); // Membership valid for 1 month

        // Update user membership in database
        try {
          await User.findByIdAndUpdate(userId, {
            membership: { plan, expiresAt: expiryDate },
          });

          console.log("Membership Updated for User ID:", userId);
        } catch (err) {
          console.error("Error updating user membership:", err);
          return res.status(500).send(`Failed to update user membership: ${err.message}`);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
