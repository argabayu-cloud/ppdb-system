import { Router } from "express";
import {
  handleGetAll,
  handleHasil,
  handleValidasi,
} from "../controllers/superAdmin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireSuperAdmin } from "../middlewares/role.middleware";

const router = Router();

// 🔥 WAJIB: authMiddleware dulu baru role
router.get("/pendaftaran", authMiddleware, requireSuperAdmin, handleGetAll);

router.get("/hasil", authMiddleware, requireSuperAdmin, handleHasil);

router.post("/validasi", authMiddleware, requireSuperAdmin, handleValidasi);

export default router;