import React from "react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  const handlePayment = (plan) => {
    navigate(`/payment?plan=${plan}`);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Choose Your Plan</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h2>Basic Plan</h2>
          <p>$10/month</p>
          <button onClick={() => handlePayment("basic")}>Select Plan</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h2>Premium Plan</h2>
          <p>$25/month</p>
          <button onClick={() => handlePayment("premium")}>Select Plan</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
