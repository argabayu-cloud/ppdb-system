import { Router } from "express";
import {
  handleGetPendaftar,
  handleSeleksi,
  handleValidasiDokumen,
} from "../controllers/admin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// 🔹 GET semua pendaftar sesuai sekolah admin
router.get(
  "/pendaftar",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  handleGetPendaftar,
);

// 🔹 POST seleksi siswa (terima / tolak)
router.post(
  "/seleksi",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  handleSeleksi,
);

// 🔥 POST validasi dokumen
router.post(
  "/validasi-dokumen",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  handleValidasiDokumen,
);

export default router;
