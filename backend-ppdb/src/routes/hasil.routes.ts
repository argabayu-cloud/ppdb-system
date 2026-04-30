import { Router } from "express";
import { getHasil } from "../controllers/hasil.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/", authMiddleware, getHasil);

export default router;