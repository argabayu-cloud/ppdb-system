import { Router } from "express";
import { create, me, submit } from "../controllers/pendaftaran.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/me", authMiddleware, me);
router.post("/", authMiddleware, create);
router.patch("/submit", authMiddleware, submit);

export default router;