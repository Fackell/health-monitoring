
import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  authenticateToken,
  authorize,
} from "../middleware/authMiddleware.js";

const router = Router();

// Перегляд усіх користувачів — лише адміністратор
router.get("/", authenticateToken, authorize("ADMIN"), getUsers);

// Перегляд, редагування та видалення користувача
// — після авторизації (перевірку власника додамо в контролері)
router.route("/:id")
  .get(authenticateToken, getUserById)
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser);

export default router;
