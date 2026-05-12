import { Router } from "express";
import {
  handleCreateSekolah,
  handleGetSekolah,
  handleGetSekolahById,
  handleUpdateSekolah,
  handleDeleteSekolah,
} from "../controllers/sekolah.controller";

import { verifyToken } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// 🔥 PUBLIC
router.get("/", handleGetSekolah);
router.get("/:id", handleGetSekolahById);

// 🔥 SUPER ADMIN ONLY
router.post("/", verifyToken, requireRole("SUPER_ADMIN"), handleCreateSekolah);

router.put(
  "/:id",
  verifyToken,
  requireRole("SUPER_ADMIN"),
  handleUpdateSekolah,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("SUPER_ADMIN"),
  handleDeleteSekolah,
);

export default router;
