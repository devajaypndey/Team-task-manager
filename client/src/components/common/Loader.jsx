export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-surface-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
      </div>
      <span className="text-xs text-surface-400">Loading…</span>
    </div>
  );

  if (fullScreen)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-950 z-50">
        {spinner}
      </div>
    );

  return <div className="flex items-center justify-center py-20">{spinner}</div>;
}
