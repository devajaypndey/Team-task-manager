import Task from "../models/Task.js";
import Project from "../models/Project.js";

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    // Get all projects this user belongs to
    const projects = await Project.find({ "members.user": req.user._id });
    const projectIds = projects.map((p) => p._id);

    // Get all tasks from user's projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    const totalTasks = tasks.length;

    // Tasks by status
    const byStatus = {
      "To Do": tasks.filter((t) => t.status === "To Do").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      Done: tasks.filter((t) => t.status === "Done").length,
    };

    // Overdue tasks (due date passed and not done)
    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "Done"
    );

    // Tasks per user (group by assignedTo)
    const perUserMap = {};
    tasks.forEach((t) => {
      if (t.assignedTo) {
        const key = t.assignedTo._id.toString();
        if (!perUserMap[key]) {
          perUserMap[key] = {
            user: { _id: t.assignedTo._id, name: t.assignedTo.name, email: t.assignedTo.email },
            total: 0,
            done: 0,
          };
        }
        perUserMap[key].total++;
        if (t.status === "Done") perUserMap[key].done++;
      }
    });
    const tasksPerUser = Object.values(perUserMap);

    res.json({
      totalTasks,
      totalProjects: projects.length,
      byStatus,
      overdueTasks: overdueTasks.map((t) => ({
        _id: t._id,
        title: t.title,
        project: t.project,
        assignedTo: t.assignedTo,
        dueDate: t.dueDate,
        status: t.status,
        priority: t.priority,
      })),
      tasksPerUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
