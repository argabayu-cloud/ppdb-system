import { Request, Response } from "express";
import {
  getAllPendaftaran,
  getHasilSeleksi,
  validasiFinal,
} from "../services/superAdmin.service";

export const handleGetAll = async (req: Request, res: Response) => {
  try {
    const data = await getAllPendaftaran();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Terjadi kesalahan",
    });
  }
};

export const handleHasil = async (req: Request, res: Response) => {
  try {
    const data = await getHasilSeleksi();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Terjadi kesalahan",
    });
  }
};

export const handleValidasi = async (req: Request, res: Response) => {
  try {
    const { pendaftaranId, status } = req.body;

    // 🔥 VALIDASI INPUT
    if (!pendaftaranId || !status) {
      return res.status(400).json({
        message: "pendaftaranId dan status wajib diisi",
      });
    }

    // 🔥 VALIDASI STATUS
    if (!["DITERIMA", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        message: "Status harus DITERIMA atau DITOLAK",
      });
    }

    const result = await validasiFinal(pendaftaranId, status);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Terjadi kesalahan",
    });
  }
};