import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserRole,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { UserRole } from "../models/roles";

const router = Router();

router.post("/users/register", registerUser);

router.post("/users/login", loginUser);

router.get("/users/me", authenticate, getCurrentUser);

router.put(
  "/users/:id/role",
  authenticate,
  authorize(UserRole.Admin),
  updateUserRole
);

export default router;
