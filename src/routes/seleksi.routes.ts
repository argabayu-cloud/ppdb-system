import { Router } from "express";
import { runSeleksiZonasi, runCascading } from "../controllers/seleksi.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// 1. SELEKSI ZONASI (PILIHAN 1)
router.post(
  "/zonasi",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  runSeleksiZonasi
);

// 2. CASCADING (PILIHAN 2)
router.post(
  "/cascading",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  runCascading
);
export default router;