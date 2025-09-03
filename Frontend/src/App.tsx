import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EssayPage from "./components/EssayPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/essay/:id" element={<EssayPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
