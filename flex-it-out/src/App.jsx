import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/HomePage";
import SignIn from "./Components/Signin";
import SignUp from "./Components/Signup";
import ProfilePage from "./Pages/ProfilePage";

import EditProfile from "./Pages/EditProfile";
import PoseDetection from "./Pages/PoseDetection"; 
import WorkoutPage from "./Pages/WorkOut";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path ="/profile" element={<ProfilePage/>} />

        <Route path ="/edit-profile" element={<EditProfile/>} />

        <Route path="/pose-detection" element={<PoseDetection />} /> {/* ✅ New route */}
        <Route path="/workout" element={<WorkoutPage/>}/>
        <Route path="/pose-detection/:exerciseId" element={<PoseDetection />} />

      </Routes>
    </>
  );
}

export default App;