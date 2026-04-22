import { Router } from "express";
import { create } from "../controllers/pendaftaran.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", authMiddleware, create);

export default router;