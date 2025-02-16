import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import NutritionPage from "./Pages/NutritionGuidance";
import Home from "./Pages/HomePage";
import SignIn from "./Components/Signin";
import SignUp from "./Components/Signup";
import ProfilePage from "./Pages/ProfilePage";
import EditProfile from "./Pages/EditProfile";
import PoseDetection from "./Pages/PoseDetection";
import WorkoutPage from "./Pages/WorkOut";
import PricingPlans from "./Pages/PricingPlans";
import PaymentPage from "./Pages/PaymentPage";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import MealPage from "./Pages/MealDescription";
import VideoChat from "./Components/VideoChat";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/pose-detection" element={<PoseDetection />} />
        <Route path="/pose-detection/:exerciseId" element={<PoseDetection />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/meal/:mealId" element={<MealPage />} />
        <Route path="/video-chat" element={<VideoChat />} />
      </Routes>
    </>
  );
}

export default App;
