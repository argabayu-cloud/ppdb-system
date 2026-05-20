import { Router } from "express";
import {
  handleGetDokumenSaya,
  handleUpload,
} from "../controllers/dokumen.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  requireRole("USER"),
  handleGetDokumenSaya,
);

router.post(
  "/upload",
  authMiddleware,
  requireRole("USER"),
  upload.single("file"),
  handleUpload,
);

export default router;