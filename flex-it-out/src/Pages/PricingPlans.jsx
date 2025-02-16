import React from "react"
import { useNavigate } from "react-router-dom"
import "./PricingPlans.css"

const PricingPage = () => {
  const navigate = useNavigate();

  const handlePayment = (plan) => {
    navigate(`/payment?plan=${plan}`);
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>

      <div className="plans">
        {/* Student Plan */}
        <div className="plan student-plan">
          <h2>Student Plan</h2>
          <p className="price">$21/month</p>
          <ul>
            <li>✔ Access to basic workout plans</li>
            <li>✔ Community support</li>
            <li>✔ Limited exercise tutorials</li>
            <li>✔ Monthly progress tracking</li>
          </ul>
          <button onClick={() => handlePayment("student")}>
            Select Plan
          </button>
        </div>

        {/* Basic Plan */}
        <div className="plan basic-plan">
          <h2>Basic Plan</h2>
          <p className="price">$10/month</p>
          <ul>
            <li>✔ Access to all standard workout plans</li>
            <li>✔ Community support & fitness tips</li>
            <li>✔ Video tutorials for exercises</li>
            <li>✔ Progress tracking & goal setting</li>
          </ul>
          <button onClick={() => handlePayment("basic")}>
            Select Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="plan premium-plan">
          <h2>Premium Plan</h2>
          <p className="price">$50/month</p>
          <ul>
            <li>✔ Unlimited access to premium workouts</li>
            <li>✔ Personalized fitness plan</li>
            <li>✔ Live trainer support</li>
            <li>✔ Advanced progress tracking & analytics</li>
          </ul>
          <button onClick={() => handlePayment("premium")}>
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;