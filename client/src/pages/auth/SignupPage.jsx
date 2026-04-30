import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { user, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
          <p className="text-surface-400 text-sm mt-1">Start managing your team's tasks</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-surface-100 mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-surface-300 mb-1.5">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-surface-300 mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-medium hover:from-primary-500 hover:to-violet-500 disabled:opacity-50 transition-all duration-200 pulse-glow cursor-pointer"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-surface-400 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
