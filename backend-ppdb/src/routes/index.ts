import { Router } from "express";
import authRoutes from "./auth.routes";
import pendaftaranRoutes from "./pendaftaran.routes";
import adminRoutes from "./admin.routes";
import superAdminRoutes from "./superAdmin.routes";
import userRoutes from "./user.routes";
import seleksiRoutes from "./seleksi.routes";
import hasilRoutes from "./hasil.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pendaftaran", pendaftaranRoutes);
router.use("/admin", adminRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/user", userRoutes);
router.use("/seleksi", seleksiRoutes);
router.use("/hasil", hasilRoutes);

router.get("/health", (req, res) => {
  res.json({ message: "API OK" });
});

export default router;