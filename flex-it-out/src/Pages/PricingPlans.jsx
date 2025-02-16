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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <div
          style={{ border: "1px solid #ccc", padding: "20px", flex: "1 0 20%" }}
        >
          <h2>Basic Membership</h2>
          <p>$10/month</p>
          <button onClick={() => handlePayment("basic")}>Select Plan</button>
        </div>

        <div
          style={{ border: "1px solid #ccc", padding: "20px", flex: "1 0 20%" }}
        >
          <h2>Standard Membership</h2>
          <p>$25/month</p>
          <button onClick={() => handlePayment("standard")}>Select Plan</button>
        </div>

        <div
          style={{ border: "1px solid #ccc", padding: "20px", flex: "1 0 20%" }}
        >
          <h2>Premium Membership</h2>
          <p>$50/month</p>
          <button onClick={() => handlePayment("premium")}>Select Plan</button>
        </div>

        <div
          style={{ border: "1px solid #ccc", padding: "20px", flex: "1 0 20%" }}
        >
          <h2>Student Plan</h2>
          <p>$21/month</p>
          <button onClick={() => handlePayment("student")}>
            Select Plan
          </button>
        </div>

        <div
          style={{ border: "1px solid #ccc", padding: "20px", flex: "1 0 20%" }}
        >
          <h2>Athlete's Plan</h2>
          <p>$250/year</p>
          <button onClick={() => handlePayment("athlete")}>
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
