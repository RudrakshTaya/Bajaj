import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext"; // Make sure the AuthContext is correctly imported

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
import TrackProgressPage from "./Pages/TrackProgressPage";
import CommunityPage from "./Pages/CommunityPage";
import GroupPage from "./Pages/GroupPage";

function App() {
  // Fetching the user data from AuthContext inside the component
  const { user,membership} = useContext(AuthContext); 
   console.log(membership);
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
        {/* Only allow premium users to access NutritionPage */}
        <Route
          path="/nutrition"
          element={ membership === "premium" ? <NutritionPage /> : <PricingPlans />}
        />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/meal/:mealId" element={<MealPage />} />
        <Route path="/video-chat/:id" element={<VideoChat />} />
        <Route path="/track-progress" element={<TrackProgressPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/group/:id" element={<GroupPage />} />
      </Routes>
    </>
  );
}

export default App;
