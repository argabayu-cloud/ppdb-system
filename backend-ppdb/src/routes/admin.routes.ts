import { Router } from "express";
import {
  handleGetPendaftar,
  handleSeleksi,
} from "../controllers/admin.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/pendaftar",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  handleGetPendaftar
);

router.post(
  "/seleksi",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  handleSeleksi
);

export default router;