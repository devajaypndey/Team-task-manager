import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineLogout,
  HiOutlineUsers,
} from "react-icons/hi";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { to: "/projects", label: "Projects", icon: HiOutlineFolder },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass flex flex-col z-30">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-surface-700/50">
        <h1 className="text-xl font-bold gradient-text tracking-tight">TaskFlow</h1>
        <p className="text-xs text-surface-400 mt-1">Team Task Manager</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-600/20 text-primary-300 shadow-lg shadow-primary-600/10"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
        {user?.role === "Admin" && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-600/20 text-primary-300 shadow-lg shadow-primary-600/10"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
              }`
            }
          >
            <HiOutlineUsers className="w-5 h-5" />
            Users
          </NavLink>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-surface-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-100 truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
