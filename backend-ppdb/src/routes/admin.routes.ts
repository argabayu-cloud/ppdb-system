import { Router } from "express";
import {
  handleGetDashboardAdmin,
  handleGetPendaftar,
  handleSeleksi,
  handleValidasiDokumen,
} from "../controllers/admin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  requireRole("ADMIN"),
  handleGetDashboardAdmin,
);

router.get(
  "/pendaftar",
  authMiddleware,
  requireRole("ADMIN"),
  handleGetPendaftar,
);

router.post(
  "/seleksi",
  authMiddleware,
  requireRole("ADMIN"),
  handleSeleksi,
);

router.post(
  "/validasi-dokumen",
  authMiddleware,
  requireRole("ADMIN"),
  handleValidasiDokumen,
);

export default router;