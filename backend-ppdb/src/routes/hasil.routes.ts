import { Router } from "express";
import { getHasil } from "../controllers/hasil.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/hasil-saya", authMiddleware, getHasil);

export default router;