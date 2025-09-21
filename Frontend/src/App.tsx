import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EssayPage from "./components/EssayPage";
import WritingPage from "./components/WritingPage";
import BackofficePage from "./components/BackofficePage";
import ModerationPage from "./components/ModerationPage";
import TopicsPage from "./components/TopicsPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import Forbidden from "./components/Forbidden";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Auth-required (USER) */}
          <Route element={<ProtectedRoute allowedRoles={["USER"]} requiredAuth={true} />}>
            <Route path="homepage" element={<HomePage />} />
            <Route path="essays/:id" element={<EssayPage />} />
            <Route path="topics" element={<TopicsPage />} />
            <Route path="edit/:topicId/essay/:essayId" element={<WritingPage />} />
            <Route path="create/:topicId/essay" element={<WritingPage />} />
          </Route>

          {/* Admin-only */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} requiredAuth={true} />}>
            <Route path="backoffice" element={<BackofficePage />} />
            <Route path="moderation" element={<ModerationPage />} />
          </Route>

          {/* Errors */}
          <Route path="403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
