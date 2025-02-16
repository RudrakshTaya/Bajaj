import React from "react"
import { useNavigate } from "react-router-dom"
import "./HomePage.css"

const HomePage = () => {
  const navigate = useNavigate()
  const handleRegister = () => {
    navigate('/signup');
  }

  const nutritionPage = () => {
    navigate('/nutrition')
  }

  return (
    <div className="home-container">
      <div className="hero-bg">
      <section className="hero">
        <h1>CRUSH WORKOUTS, ANYTIME, ANYWHERE.</h1>
        <p>Train like a beast, transform like a legend!</p>
        <button 
          className="cta-button" 
          onClick={() => navigate("/workout")}
        >
          Get Started
        </button>
      </section>
      </div>

      <section className="features">
        <div className="feature-card">
          <h3>Personalized Training</h3>
          <p>Work with expert trainers and get customized workouts.</p>
        </div>
        <div className="feature-card">
          <h3>24/7 Access</h3>
          <p>Workout anytime with our flexible gym hours.</p>
        </div>
        <div className="feature-card" onClick={ nutritionPage }>
          <h3>Nutrition Guidance</h3>
          <p>Get diet plans that suit your fitness journey.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>

        <button onClick={handleRegister} className="cta-button">
          Join Now
        </button>

        <button onClick={() => window.location.href = '/pricing'}className="cta-button">Join Now</button>
      </section>
    </div>
  );
};

export default HomePage;