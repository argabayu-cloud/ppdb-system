import { Router } from "express";
import {
  handleGetNotif,
  handleMarkRead,
} from "../controllers/notifikasi.controller";

import { verifyToken } from "../middlewares/auth.middlewares";

const router = Router();

router.use(verifyToken);

router.get("/", handleGetNotif);
router.put("/:id/read", handleMarkRead);

export default router;