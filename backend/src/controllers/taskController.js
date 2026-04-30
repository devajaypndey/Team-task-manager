import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Helper: check user's role in a project
const getUserRole = (project, userId) => {
  const member = project.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

// POST /api/tasks — create task (admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const role = getUserRole(project, req.user._id);
    if (role !== "Admin") {
      return res.status(403).json({ message: "Only admins can create tasks" });
    }

    // If assigning, verify assignee is a project member
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.user.toString() === assignedTo
      );
      if (!isMember) {
        return res.status(400).json({ message: "Assignee must be a project member" });
      }
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || "Medium",
      dueDate: dueDate || null,
    });

    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tasks/project/:projectId — get tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const role = getUserRole(project, req.user._id);
    if (!role) return res.status(403).json({ message: "Access denied" });

    let filter = { project: projectId };

    // Members see only tasks assigned to them
    if (role === "Member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort("-createdAt");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id — update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    const role = getUserRole(project, req.user._id);

    if (!role) return res.status(403).json({ message: "Access denied" });

    // Members can only update status of their assigned tasks
    if (role === "Member") {
      const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
      if (!isAssigned) return res.status(403).json({ message: "Not your task" });

      // Members can only change status
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update everything
      const { title, description, assignedTo, status, priority, dueDate } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

    await task.save();
    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id — admin only
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    const role = getUserRole(project, req.user._id);

    if (role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
