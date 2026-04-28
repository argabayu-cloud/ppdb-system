import { Router } from "express";
import { runSeleksi } from "../controllers/seleksi.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/zonasi",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  runSeleksi
);

export default router;