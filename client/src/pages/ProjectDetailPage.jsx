import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProject, addMember, removeMember, deleteProject } from "../api/projects";
import { fetchProjectTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { fetchAllUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUserAdd, HiOutlineX } from "react-icons/hi";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");

  const { data: project, isLoading: projLoading } = useQuery({ queryKey: ["project", id], queryFn: () => fetchProject(id) });
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({ queryKey: ["tasks", id], queryFn: () => fetchProjectTasks(id) });
  const { data: allUsers = [] } = useQuery({ queryKey: ["users"], queryFn: fetchAllUsers, enabled: !!project });

  const myRole = project?.members?.find((m) => m.user._id === user?._id)?.role;
  const isAdmin = myRole === "Admin";

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["tasks", id] });
    qc.invalidateQueries({ queryKey: ["project", id] });
  };

  const taskCreateMut = useMutation({
    mutationFn: (d) => createTask({ ...d, projectId: id }),
    onSuccess: () => { invalidate(); setShowTaskModal(false); toast.success("Task created!"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const taskUpdateMut = useMutation({
    mutationFn: ({ taskId, ...d }) => updateTask(taskId, d),
    onSuccess: () => { invalidate(); setEditingTask(null); toast.success("Task updated!"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const taskDeleteMut = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => { invalidate(); setEditingTask(null); toast.success("Task deleted!"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const addMemberMut = useMutation({
    mutationFn: (email) => addMember(id, email, "Member"),
    onSuccess: () => { invalidate(); setMemberEmail(""); toast.success("Member added!"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const removeMemberMut = useMutation({
    mutationFn: (userId) => removeMember(id, userId),
    onSuccess: () => { invalidate(); toast.success("Member removed!"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const deleteProjectMut = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => { toast.success("Project deleted!"); navigate("/projects"); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const handleStatusChange = (taskId, status) => taskUpdateMut.mutate({ taskId, status });

  if (projLoading || tasksLoading) return <Loader />;
  if (!project) return <div className="text-center text-surface-400 py-20">Project not found</div>;

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-100">{project.name}</h2>
            {project.description && <p className="text-sm text-surface-400 mt-1">{project.description}</p>}
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300">
              {myRole}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            {isAdmin && (
              <>
                <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600/20 text-primary-300 text-sm hover:bg-primary-600/30 transition-colors cursor-pointer">
                  <HiOutlinePlus className="w-4 h-4" /> Add Task
                </button>
                <button onClick={() => { if (confirm("Delete this project and all tasks?")) deleteProjectMut.mutate(); }} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-surface-200 mb-4">Members ({project.members?.length})</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.members?.map((m) => (
            <div key={m.user._id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/60 border border-surface-700/50">
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">{m.user.name.charAt(0)}</div>
              <span className="text-sm text-surface-200">{m.user.name}</span>
              <span className="text-xs text-surface-500">{m.role}</span>
              {isAdmin && m.user._id !== project.owner._id && (
                <button onClick={() => removeMemberMut.mutate(m.user._id)} className="ml-1 text-surface-500 hover:text-rose-400 transition-colors cursor-pointer"><HiOutlineX className="w-3.5 h-3.5" /></button>
              )}
            </div>
          ))}
        </div>
        {isAdmin && (
          <form onSubmit={(e) => { e.preventDefault(); if (memberEmail.trim()) addMemberMut.mutate(memberEmail.trim()); }} className="flex gap-2">
            <select
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-700 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-all cursor-pointer"
            >
              <option value="">Select user to add...</option>
              {allUsers
                .filter((u) => !project.members?.some((m) => m.user._id === u._id))
                .map((u) => (
                  <option key={u._id} value={u.email}>
                    {u.name} ({u.email}) - {u.role}
                  </option>
                ))}
            </select>
            <button type="submit" disabled={!memberEmail.trim() || addMemberMut.isPending} className="px-3 py-2 rounded-xl bg-primary-600/20 text-primary-300 text-sm hover:bg-primary-600/30 disabled:opacity-50 transition-colors cursor-pointer"><HiOutlineUserAdd className="w-4 h-4" /></button>
          </form>
        )}
      </div>

      {/* Kanban Board */}
      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} onEdit={(t) => setEditingTask(t)} isAdmin={isAdmin} />

      {/* Create Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Create Task">
        <TaskForm onSubmit={(d) => taskCreateMut.mutate(d)} loading={taskCreateMut.isPending} members={project.members || []} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <div className="space-y-4">
            <TaskForm onSubmit={(d) => taskUpdateMut.mutate({ taskId: editingTask._id, ...d })} loading={taskUpdateMut.isPending} members={project.members || []} initial={editingTask} />
            <button onClick={() => { if (confirm("Delete this task?")) taskDeleteMut.mutate(editingTask._id); }} className="w-full py-2 rounded-xl border border-rose-500/30 text-rose-400 text-sm hover:bg-rose-500/10 transition-colors cursor-pointer">Delete Task</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
