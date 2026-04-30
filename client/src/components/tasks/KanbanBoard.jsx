import TaskCard from "./TaskCard";

const columns = [
  { key: "To Do", label: "To Do", accent: "bg-surface-400" },
  { key: "In Progress", label: "In Progress", accent: "bg-amber-400" },
  { key: "Done", label: "Done", accent: "bg-emerald-400" },
];

export default function KanbanBoard({ tasks, onStatusChange, onEdit, isAdmin }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map(({ key, label, accent }) => {
        const colTasks = tasks.filter((t) => t.status === key);
        return (
          <div key={key} className="flex flex-col">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${accent}`} />
              <h3 className="text-sm font-semibold text-surface-200">{label}</h3>
              <span className="ml-auto text-xs text-surface-500 bg-surface-800/60 px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3 flex-1 min-h-[120px]">
              {colTasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-surface-700/40 text-xs text-surface-500">
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
