import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject } from "../api/projects";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineFolder } from "react-icons/hi";

export default function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMut = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setShowCreate(false);
      toast.success("Project created!");
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-surface-400">{projects?.length || 0} project(s)</p>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white text-sm font-medium hover:from-primary-500 hover:to-violet-500 transition-all cursor-pointer">
          <HiOutlinePlus className="w-4 h-4" /> New Project
        </button>
      </div>

      {!projects?.length ? (
        <EmptyState icon={HiOutlineFolder} title="No projects yet" description="Create your first project to get started." action={<button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-xl bg-primary-600/20 text-primary-300 text-sm font-medium hover:bg-primary-600/30 transition-colors cursor-pointer">Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <ProjectForm onSubmit={(d) => createMut.mutate(d)} loading={createMut.isPending} />
      </Modal>
    </div>
  );
}
