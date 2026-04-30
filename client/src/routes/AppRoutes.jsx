import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
