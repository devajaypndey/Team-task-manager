import { HiOutlineExclamation } from "react-icons/hi";

export default function OverdueList({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-surface-400 text-sm">
        No overdue tasks 
      </div>
    );
  }

  const priorityColor = {
    High: "bg-rose-500/20 text-rose-300",
    Medium: "bg-amber-500/20 text-amber-300",
    Low: "bg-emerald-500/20 text-emerald-300",
  };

  return (
    <div className="space-y-3 stagger-children">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-200"
        >
          <div className="p-1.5 rounded-lg bg-rose-500/15">
            <HiOutlineExclamation className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-100 truncate">{task.title}</p>
            <p className="text-xs text-surface-400">
              {task.project?.name} · Due {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority] || ""}`}
          >
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  );
}
