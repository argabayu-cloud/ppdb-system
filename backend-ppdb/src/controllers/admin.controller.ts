import { Request, Response } from "express";
import { getPendaftar, seleksiSiswa } from "../services/admin.service";

// 🔹 ambil pendaftar
export const handleGetPendaftar = async (req: any, res: Response) => {
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

    const result = await seleksiSiswa(
      adminId,
      pilihanId,
      status,
      alasan
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};