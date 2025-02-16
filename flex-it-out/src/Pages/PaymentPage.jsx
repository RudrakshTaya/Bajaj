import React, { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useSearchParams } from "react-router-dom"
import './PaymentPage.css'

const stripePromise = loadStripe("pk_test_51QrIYaP7TDcxXgwZjsg5PRmU9NAATaVt87I42XPl2gLOjSRd2Jw2qxgo1bGKMCkJbau5oKHcEHuqgeSbaoahbk2G00H4yaXvcf");

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const handlePayment = async () => {
    setLoading(true);
    const stripe = await stripePromise;
  
    console.log("Selected Plan:", plan, "Type:", typeof plan); // Debugging log
  
    try {
      const requestBody = JSON.stringify({ plan });
      console.log("🔹 Request Body:", requestBody); // Log the request body
  
      const response = await fetch("http://localhost:5001/api/checkout/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
  
      const data = await response.json();
      console.log("🔹 Checkout Session Response:", data); // Log the response
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to create session");
      }
  
      if (!data.id) {
        throw new Error("❌ No sessionId received from backend");
      }
  
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("❌ Payment Error:", error);
    }
  
    setLoading(false);
  };
  

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Complete Your Payment</h1>
      <p>You selected: <strong>{plan?.toUpperCase()}</strong></p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
