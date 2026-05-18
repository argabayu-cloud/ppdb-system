import { Router } from "express";
import { getPengumuman, updateBiodata } from "../controllers/user.controller";

import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.get("/pengumuman", authMiddleware, getPengumuman);

router.put("/biodata", authMiddleware, updateBiodata);

export default router;
