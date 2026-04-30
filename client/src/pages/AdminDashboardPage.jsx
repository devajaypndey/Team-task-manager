import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, createUser, deleteUser } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  const qc = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "Member" });

  if (user?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: fetchAllUsers,
  });

  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_users"] });
      setShowAddModal(false);
      setAddForm({ name: "", email: "", password: "", role: "Member" });
      toast.success("User created!");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to create user"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User deleted!");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to delete user"),
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    createMut.mutate(addForm);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-100">Users Management</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-surface-400">Total Users: {users?.length || 0}</span>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white text-sm font-medium hover:from-primary-500 hover:to-violet-500 transition-all cursor-pointer">
            <HiOutlinePlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-surface-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-800/80 border-b border-surface-700/50">
                <th className="px-6 py-4 text-xs font-semibold text-surface-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-300 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50">
              {users?.map((u) => (
                <tr key={u._id} className="hover:bg-surface-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-surface-100">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-surface-300">{u.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "Admin" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {u._id !== user._id && (
                      <button 
                        onClick={() => { if (confirm("Delete this user?")) deleteMut.mutate(u._id); }} 
                        className="p-2 inline-flex rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-surface-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Name</label>
            <input type="text" required value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 focus:outline-none focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
            <input type="email" required value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 focus:outline-none focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
            <input type="password" required minLength="6" value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 focus:outline-none focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Role</label>
            <select value={addForm.role} onChange={(e) => setAddForm({...addForm, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700 text-surface-100 focus:outline-none focus:border-primary-500 transition-all cursor-pointer">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={createMut.isPending} className="w-full py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-medium hover:from-primary-500 hover:to-violet-500 disabled:opacity-50 transition-all duration-200 cursor-pointer">
            {createMut.isPending ? "Creating..." : "Create User"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
