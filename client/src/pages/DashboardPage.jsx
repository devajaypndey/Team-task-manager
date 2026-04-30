import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard";
import StatsCard from "../components/dashboard/StatsCard";
import OverdueList from "../components/dashboard/OverdueList";
import Loader from "../components/common/Loader";
import {
  HiOutlineClipboardList,
  HiOutlineFolder,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
} from "react-icons/hi";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) return <Loader />;

  const { totalTasks = 0, totalProjects = 0, byStatus = {}, overdueTasks = [], tasksPerUser = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard icon={HiOutlineClipboardList} label="Total Tasks" value={totalTasks} color="primary" delay={0} />
        <StatsCard icon={HiOutlineFolder} label="Projects" value={totalProjects} color="violet" delay={50} />
        <StatsCard icon={HiOutlineCheckCircle} label="Completed" value={byStatus["Done"] || 0} color="emerald" delay={100} />
        <StatsCard icon={HiOutlineExclamation} label="Overdue" value={overdueTasks.length} color="rose" delay={150} />
      </div>

      {/* Status Breakdown & Team Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-surface-100 mb-5">Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: "To Do", count: byStatus["To Do"] || 0, color: "bg-surface-400" },
              { label: "In Progress", count: byStatus["In Progress"] || 0, color: "bg-amber-400" },
              { label: "Done", count: byStatus["Done"] || 0, color: "bg-emerald-400" },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-surface-300">{label}</span>
                  <span className="text-surface-400">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-800">
                  <div
                    className={`h-2 rounded-full ${color} transition-all duration-700`}
                    style={{ width: totalTasks ? `${(count / totalTasks) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Progress */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-surface-100 mb-5">Team Progress</h3>
          {tasksPerUser.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-8">No task assignments yet</p>
          ) : (
            <div className="space-y-4">
              {tasksPerUser.map(({ user, total, done }) => (
                <div key={user._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-200 truncate">{user.name}</span>
                      <span className="text-surface-400 text-xs">{done}/{total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-800">
                      <div
                        className="h-1.5 rounded-full bg-linear-to-r from-primary-500 to-emerald-400 transition-all duration-700"
                        style={{ width: total ? `${(done / total) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiOutlineClock className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-semibold text-surface-100">Overdue Tasks</h3>
          {overdueTasks.length > 0 && (
            <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
              {overdueTasks.length}
            </span>
          )}
        </div>
        <OverdueList tasks={overdueTasks} />
      </div>
    </div>
  );
}
