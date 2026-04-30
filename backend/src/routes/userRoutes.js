import { Router } from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = Router();

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only: create a new user without logging them in
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can create users" });
    }

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role: role || "Member" });
    
    // Do not return password
    const userRes = user.toObject();
    delete userRes.password;
    
    res.status(201).json(userRes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only: delete a user
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can delete users" });
    }

    // Prevent deleting oneself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cascade delete: 
    // 1. Delete all projects owned by the user
    const userProjects = await Project.find({ owner: req.params.id });
    const projectIds = userProjects.map(p => p._id);
    if (projectIds.length > 0) {
      await Task.deleteMany({ project: { $in: projectIds } });
      await Project.deleteMany({ _id: { $in: projectIds } });
    }

    // 2. Remove user from members arrays of other projects
    await Project.updateMany(
      { "members.user": req.params.id },
      { $pull: { members: { user: req.params.id } } }
    );

    // 3. Unassign user from any tasks
    await Task.updateMany(
      { assignedTo: req.params.id },
      { assignedTo: null }
    );

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
