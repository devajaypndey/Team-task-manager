import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
};

export default function Header() {
  const { pathname } = useLocation();

  // Determine page title
  let title = pageTitles[pathname] || "";
  if (pathname.startsWith("/projects/")) title = "Project Details";

  return (
    <header className="h-16 glass-light flex items-center justify-between px-8 rounded-2xl mb-6">
      <h2 className="text-lg font-semibold text-surface-100">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-surface-400">Online</span>
      </div>
    </header>
  );
}
