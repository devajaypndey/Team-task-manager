import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";

// Protect routes - verify JWT from cookie
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Check if user is admin of a project (reads :projectId or :id from params)
export const requireProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || member.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.project = project;
    next();
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Check if user is a member of the project
export const requireProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    req.project = project;
    next();
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
