import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EssayPage from "./components/EssayPage";
import WritingPage from "./components/WritingPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/essays/:id" element={<EssayPage />} />
          <Route path="/edit/:topicId/essay/:essayId" element={<WritingPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
