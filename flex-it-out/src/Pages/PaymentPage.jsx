import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCreditCard, FaSpinner } from "react-icons/fa";
import "./PaymentPage.css";

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
    <motion.div
      className="payment-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="payment-page-card">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Complete Your Payment
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          You selected: <strong>{plan?.toUpperCase()}</strong>
        </motion.p>
        <motion.button
          onClick={handlePayment}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {loading ? (
            <>
              <FaSpinner className="payment-page-spinner" /> Processing...
            </>
          ) : (
            <>
              <FaCreditCard /> Pay Now
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PaymentPage;