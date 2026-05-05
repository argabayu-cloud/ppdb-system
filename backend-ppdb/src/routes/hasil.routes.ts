import { Router } from "express";
import { getHasil } from "../controllers/hasil.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/hasil-saya", authMiddleware, requireRole("USER"), getHasil);

export default router;