import { Response } from "express";
import {
  getDashboardAdmin,
  getPendaftar,
  seleksiSiswa,
  validasiDokumen,
} from "../services/admin.service";

export const handleGetDashboardAdmin = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;

    const data = await getDashboardAdmin(adminId);

    return res.json({
      success: true,
      message: "Dashboard admin berhasil diambil",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil dashboard admin",
    });
  }
};

export const handleGetPendaftar = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;

    const data = await getPendaftar(adminId);

    return res.json({
      success: true,
      message: "Berhasil mengambil data pendaftar",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan",
    });
  }
};

export const handleSeleksi = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { pilihanId, status, alasan, jenisPenolakan } = req.body;

    if (!pilihanId || !status) {
      return res.status(400).json({
        success: false,
        message: "pilihanId dan status wajib diisi",
      });
    }

    if (!["DITERIMA", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status harus DITERIMA atau DITOLAK",
      });
    }

    if (
      status === "DITOLAK" &&
      !["DOKUMEN", "ZONASI", "LAINNYA"].includes(jenisPenolakan)
    ) {
      return res.status(400).json({
        success: false,
        message: "Jenis penolakan harus DOKUMEN, ZONASI, atau LAINNYA",
      });
    }

    const result = await seleksiSiswa(
      adminId,
      pilihanId,
      status,
      alasan,
      jenisPenolakan,
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan",
    });
  }
};

export const handleValidasiDokumen = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { dokumenId, status } = req.body;

    if (!dokumenId || !status) {
      return res.status(400).json({
        success: false,
        message: "dokumenId dan status wajib diisi",
      });
    }

    if (!["DITERIMA", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status harus DITERIMA atau DITOLAK",
      });
    }

    const result = await validasiDokumen(adminId, dokumenId, status);

    return res.json({
      success: true,
      message: "Dokumen berhasil divalidasi",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan",
    });
  }
};