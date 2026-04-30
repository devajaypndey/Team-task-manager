import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import { protect, requireProjectAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect); // all project routes require auth

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", requireProjectAdmin, updateProject);
router.delete("/:id", requireProjectAdmin, deleteProject);
router.post("/:id/members", requireProjectAdmin, addMember);
router.delete("/:id/members/:userId", requireProjectAdmin, removeMember);

export default router;
