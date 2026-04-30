import { Router } from "express";
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createTask);
router.get("/project/:projectId", getProjectTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
