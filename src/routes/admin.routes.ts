import { Router } from "express";
import {
  handleGetPendaftar,
  handleSeleksi,
  handleValidasiDokumen,
} from "../controllers/admin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// 🔹 GET semua pendaftar sesuai sekolah admin
router.get(
  "/pendaftar",
  authMiddleware,
  requireRole("ADMIN"),
  handleGetPendaftar,
);

// 🔹 POST seleksi siswa (terima / tolak)
router.post(
  "/seleksi",
  authMiddleware,
  requireRole("ADMIN"),
  handleSeleksi,
);

// 🔥 POST validasi dokumen
router.post(
  "/validasi-dokumen",
  authMiddleware,
  requireRole("ADMIN"),
  handleValidasiDokumen,
);

export default router;