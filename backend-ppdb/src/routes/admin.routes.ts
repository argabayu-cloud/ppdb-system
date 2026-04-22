import { Router } from "express";
import {
  handleGetPendaftar,
  handleSeleksi,
} from "../controllers/admin.controller";

import { verifyToken } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();

// 🔹 ambil pendaftar
router.get("/pendaftar", verifyToken, requireAdmin, handleGetPendaftar);

// 🔹 seleksi siswa
router.post("/seleksi", verifyToken, requireAdmin, handleSeleksi);

export default router;