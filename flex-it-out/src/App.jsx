import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";

function App() {
  return (
        <Router>
            <Routes>
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    )
}

export default App