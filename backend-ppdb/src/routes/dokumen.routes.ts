import { Router } from "express";
import { handleUpload } from "../controllers/dokumen.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  handleUpload
);

export default router;