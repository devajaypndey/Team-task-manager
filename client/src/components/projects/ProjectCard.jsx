import { useNavigate } from "react-router-dom";
import { HiOutlineUsers, HiOutlineCalendar } from "react-icons/hi";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group glass rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-600/5 hover:border-primary-500/30"
    >
      {/* Color accent bar */}
      <div className="w-full h-1 rounded-full bg-linear-to-r from-primary-500 to-violet-500 mb-4" />

      <h3 className="text-base font-semibold text-surface-100 group-hover:text-primary-300 transition-colors truncate">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-surface-400 mt-1 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-4 mt-4 text-xs text-surface-400">
        <span className="flex items-center gap-1">
          <HiOutlineUsers className="w-3.5 h-3.5" />
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineCalendar className="w-3.5 h-3.5" />
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
