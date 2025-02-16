import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "react-router-dom";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Complete Your Payment</h1>
      <p>You selected: <strong>{plan?.toUpperCase()}</strong> plan</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
