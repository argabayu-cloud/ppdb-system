import { Router } from "express";
import {
    handleCreateSekolah,
    handleGetSekolah,
    handleGetSekolahById,
    handleUpdateSekolah,
    handleDeleteSekolah,
} from "../controllers/sekolah.controller";

import { verifyToken } from "../middlewares/auth.middlewares";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(verifyToken);
router.use(requireRole("SUPER_ADMIN"));

router.post("/", handleCreateSekolah);
router.get("/", handleGetSekolah);
router.get("/:id", handleGetSekolahById);
router.put("/:id", handleUpdateSekolah);
router.delete("/:id", handleDeleteSekolah);

export default router;