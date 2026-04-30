import { useState } from "react";

export default function ProjectForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">
          Project Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Marketing Campaign Q3"
          className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the project..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-medium text-sm hover:from-primary-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {loading ? "Creating…" : "Create Project"}
      </button>
    </form>
  );
}
