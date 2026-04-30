import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, loading, members = [], initial = null }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        assignedTo: initial.assignedTo?._id || initial.assignedTo || "",
        priority: initial.priority || "Medium",
        dueDate: initial.dueDate ? initial.dueDate.split("T")[0] : "",
      });
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      ...form,
      title: form.title.trim(),
      assignedTo: form.assignedTo || null,
      dueDate: form.dueDate || null,
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">
          Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title..."
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Assign To</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className={inputClass}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.user._id} value={m.user._id}>
                {m.user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.title.trim()}
        className="w-full py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-medium text-sm hover:from-primary-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {loading ? "Saving…" : initial ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
