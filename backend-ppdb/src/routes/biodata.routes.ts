import { Router } from "express";
import { getMe, saveMe } from "../controllers/biodata.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/", authMiddleware, getMe);
router.put("/", authMiddleware, saveMe);

export default router;