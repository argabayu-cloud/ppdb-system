import { Router } from "express";
import {
    create,
    me,
    resetZonasi,
    submit,
} from "../controllers/pendaftaran.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/me", authMiddleware, me);
router.post("/", authMiddleware, create);
router.patch("/submit", authMiddleware, submit);

router.delete(
    "/reset-zonasi",
    authMiddleware,
    requireRole("USER"),
    resetZonasi,
);

export default router;