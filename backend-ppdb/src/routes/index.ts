import { Router } from "express";
import authRoutes from "./auth.routes";
import pendaftaranRoutes from "./pendaftaran.routes";
import adminRoutes from "./admin.routes";
import superAdminRoutes from "./superAdmin.routes";
import userRoutes from "./user.routes";
import seleksiRoutes from "./seleksi.routes";
import hasilRoutes from "./hasil.routes";
import dokumenRoutes from "./dokumen.routes";
import sekolahRoutes from "./sekolah.routes";
import notifikasiRoutes from "./notifikasi.routes";
import biodataRoutes from "./biodata.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pendaftaran", pendaftaranRoutes);
router.use("/admin", adminRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/user", userRoutes);
router.use("/seleksi", seleksiRoutes);
router.use("/hasil", hasilRoutes);
router.use("/dokumen", dokumenRoutes);
router.use("/sekolah", sekolahRoutes);
router.use("/notifikasi", notifikasiRoutes);
router.use("/biodata", biodataRoutes);

router.get("/health", (_req, res) => {
  res.json({ message: "API OK" });
});

// Diagnostic: cek koneksi Supabase Storage
router.get("/health/storage", async (_req, res) => {
  try {
    const { supabase } = await import("../config/supabase");
    const bucket = process.env.SUPABASE_BUCKET || "ppdb-dokumen";
    const { data, error } = await supabase.storage.getBucket(bucket);
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Supabase storage error",
        detail: error.message,
        supabaseUrl: process.env.SUPABASE_URL,
        bucket,
      });
    }
    return res.json({
      success: true,
      message: "Supabase storage OK",
      bucket: data?.name,
      public: data?.public,
      supabaseUrl: process.env.SUPABASE_URL,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Gagal terhubung ke Supabase",
      detail: err?.message,
      supabaseUrl: process.env.SUPABASE_URL,
    });
  }
});

export default router;