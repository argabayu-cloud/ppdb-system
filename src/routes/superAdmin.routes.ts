import { Router } from "express";
import {
  handleGetAll,
  handleHasil,
  handleValidasi,
} from "../controllers/superAdmin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// 🔥 WAJIB: auth dulu baru role
router.get(
  "/pendaftaran",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleGetAll
);

router.get(
  "/hasil",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleHasil
);

router.post(
  "/validasi",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleValidasi
);

export default router;