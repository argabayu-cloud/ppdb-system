import { Request, Response } from "express";
import {
  getPendaftar,
  seleksiSiswa,
  validasiDokumen,
} from "../services/admin.service";

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

// 🔹 ambil pendaftar
export const handleGetPendaftar = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user.id;

    const data = await getPendaftar(adminId);

    res.json({
      message: "Berhasil mengambil data pendaftar",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};

// 🔹 seleksi siswa
export const handleSeleksi = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { pilihanId, status, alasan } = req.body;

    // 🔥 VALIDASI INPUT
    if (!pilihanId || !status) {
      return res.status(400).json({
        message: "pilihanId dan status wajib diisi",
      });
    }

    // 🔥 VALIDASI STATUS
    if (!["DITERIMA", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        message: "Status harus DITERIMA atau DITOLAK",
      });
    }

    const result = await seleksiSiswa(adminId, pilihanId, status, alasan);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};

// 🔥 VALIDASI DOKUMEN ADMIN
export const handleValidasiDokumen = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user.id;
    const { dokumenId, status } = req.body;

    // 🔐 VALIDASI INPUT
    if (!dokumenId || !status) {
      return res.status(400).json({
        message: "dokumenId dan status wajib diisi",
      });
    }

    // 🔐 VALIDASI STATUS
    if (!["DITERIMA", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        message: "Status harus DITERIMA atau DITOLAK",
      });
    }

    const result = await validasiDokumen(adminId, dokumenId, status);

    res.json({
      message: "Dokumen berhasil divalidasi",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};
