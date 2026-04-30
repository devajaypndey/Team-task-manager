import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
          <p className="text-surface-400 text-sm mt-1">Manage tasks with your team</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-surface-100 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-surface-300 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-medium hover:from-primary-500 hover:to-violet-500 disabled:opacity-50 transition-all duration-200 pulse-glow cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-surface-400 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
