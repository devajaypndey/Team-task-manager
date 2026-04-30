import { HiOutlineUser, HiOutlineCalendar } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const statusColor = {
  "To Do": "bg-surface-600/30 text-surface-300",
  "In Progress": "bg-amber-500/20 text-amber-300",
  Done: "bg-emerald-500/20 text-emerald-300",
};

const priorityDot = {
  High: "bg-rose-400",
  Medium: "bg-amber-400",
  Low: "bg-emerald-400",
};

export default function TaskCard({ task, onEdit, onStatusChange, isAdmin }) {
  const { user } = useAuth();
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";

  return (
    <div
      className={`group p-4 rounded-xl bg-surface-800/50 border transition-all duration-200 hover:shadow-lg hover:shadow-surface-900/50 ${
        isOverdue
          ? "border-rose-500/30 hover:border-rose-500/50"
          : "border-surface-700/30 hover:border-surface-600/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
          <h4 className="text-sm font-medium text-surface-100 truncate">{task.title}</h4>
        </div>
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 text-xs text-surface-400 hover:text-primary-300 transition-all cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-surface-400 mb-3 line-clamp-2 pl-4">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2 text-xs text-surface-400 min-w-0">
          {task.assignedTo && (
            <span className="flex items-center gap-1 truncate">
              <HiOutlineUser className="w-3 h-3 shrink-0" />
              {task.assignedTo.name}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? "text-rose-400" : ""}`}>
              <HiOutlineCalendar className="w-3 h-3 shrink-0" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Status dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          disabled={!isAdmin && task.assignedTo?._id !== user?._id}
          className={`text-xs px-2 py-1 rounded-lg border-0 ${
            (!isAdmin && task.assignedTo?._id !== user?._id) 
              ? "opacity-50 cursor-not-allowed" 
              : "cursor-pointer focus:outline-none"
          } ${statusColor[task.status]}`}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
}
