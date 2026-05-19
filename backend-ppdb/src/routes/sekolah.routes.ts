import { Router } from "express";
import {
  handleCreateSekolah,
  handleDeleteSekolah,
  handleGetSekolah,
  handleGetSekolahById,
  handleUpdateSekolah,
} from "../controllers/sekolah.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/", handleGetSekolah);
router.get("/public", handleGetSekolah);
router.get("/:id", handleGetSekolahById);

router.post(
  "/",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleCreateSekolah,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleUpdateSekolah,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  handleDeleteSekolah,
);

export default router;
