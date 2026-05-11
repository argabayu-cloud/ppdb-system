import { Router } from "express";
import {
  handleGetNotif,
  handleMarkRead,
} from "../controllers/notifikasi.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.use(authMiddleware);

router.get("/", handleGetNotif);
router.patch("/:id", handleMarkRead);

export default router;