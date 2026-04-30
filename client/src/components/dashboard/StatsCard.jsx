export default function StatsCard({ icon: Icon, label, value, color = "primary", delay = 0 }) {
  const colorMap = {
    primary: "from-primary-500/20 to-primary-600/10 text-primary-400 border-primary-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
    violet: "from-violet-500/20 to-violet-600/10 text-violet-400 border-violet-500/20",
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${c} border p-5 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-surface-100">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-surface-900/40">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {/* Decorative glow */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl" />
    </div>
  );
}
