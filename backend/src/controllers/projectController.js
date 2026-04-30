import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// POST /api/projects — create project, creator becomes Admin
export const createProject = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only global Admins can create projects" });
    }

    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "Admin" }],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects — all projects the user belongs to
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.user._id })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort("-createdAt");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/projects/:id — admin only
export const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = req.project; // set by requireProjectAdmin middleware
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id — admin only
export const deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project and its tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects/:id/members — admin adds member by email
export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = req.project;
    const already = project.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (already) return res.status(400).json({ message: "User is already a member" });

    project.members.push({ user: user._id, role: role || "Member" });
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id/members/:userId — admin removes member
export const removeMember = async (req, res) => {
  try {
    const project = req.project;
    const { userId } = req.params;

    if (project.owner.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove the project owner" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId
    );
    await project.save();

    // Also unassign removed user from tasks in this project
    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { assignedTo: null }
    );

    const populated = await project.populate([
      { path: "owner", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
