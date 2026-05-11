import { Router } from "express";
import { getPengumuman } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/pengumuman", authMiddleware, getPengumuman);

export default router;