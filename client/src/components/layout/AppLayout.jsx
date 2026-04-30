import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Loader from "../common/Loader";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <Header />
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
