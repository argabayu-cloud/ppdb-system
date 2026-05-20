import { Request, Response } from "express";
import {
  getPendaftar,
  seleksiSiswa,
  validasiDokumen,
} from "../services/admin.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const handleGetPendaftar = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await getPendaftar(adminId);

    return res.json({
      success: true,
      message: "Berhasil mengambil data pendaftar",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil data pendaftar",
    });
  }
};

export const handleSeleksi = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id;
    const { pilihanId, status, alasan } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

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

    const result = await seleksiSiswa(adminId, pilihanId, status, alasan);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal melakukan seleksi siswa",
    });
  }
};

export const handleValidasiDokumen = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;
    const { dokumenId, status } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

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
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal validasi dokumen",
    });
  }
};