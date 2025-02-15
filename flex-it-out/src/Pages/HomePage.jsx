
// import React from "react";
// import "./HomePage.css";

// const HomePage = () => {
//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero">
//         <h1>Transform Your Body, Transform Your Life</h1>
//         <p>Join the best fitness community and achieve your goals today!</p>
//         <button className="cta-button">Get Started</button>
//       </section>

//       {/* Features Section */}
//       <section className="features">
//         <div className="feature-card">
//           <h3>Personalized Training</h3>
//           <p>Work with expert trainers and get customized workouts.</p>
//         </div>
//         <div className="feature-card">
//           <h3>24/7 Access</h3>
//           <p>Workout anytime with our flexible gym hours.</p>
//         </div>
//         <div className="feature-card">
//           <h3>Nutrition Guidance</h3>
//           <p>Get diet plans that suit your fitness journey.</p>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta">
//         <h2>Ready to Get Started?</h2>
//         <button className="cta-button">Join Now</button>
//       </section>
//     </div>
//   );
// };

// export default HomePage;



import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate()

    const handleRegister = () => {
        navigate('/signup')
    }


  return (
    <div className="home-container">

      <section className="hero">
        <h1>Transform Your Body, Transform Your Life</h1>
        <p>Join the best fitness community and achieve your goals today!</p>
        <button 
          className="cta-button" 
          onClick={() => navigate("/pose-detection")} // ✅ Navigates to PoseDetection page
        >
          Get Started
        </button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Personalized Training</h3>
          <p>Work with expert trainers and get customized workouts.</p>
        </div>
        <div className="feature-card">
          <h3>24/7 Access</h3>
          <p>Workout anytime with our flexible gym hours.</p>
        </div>
        <div className="feature-card">
          <h3>Nutrition Guidance</h3>
          <p>Get diet plans that suit your fitness journey.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <button className="cta-button" onClick={() => navigate("/signup")}>
          Join Now
        </button>
        <button onClick={ handleRegister } className="cta-button">Join Now</button>
      </section>
    </div>
  )
}
}

export default HomePage;