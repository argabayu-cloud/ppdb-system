import { Request, Response } from "express";
import { getPendaftar, seleksiSiswa } from "../services/admin.service";

// 🔹 ambil pendaftar
export const handleGetPendaftar = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;

    const data = await getPendaftar(adminId);

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 seleksi siswa
export const handleSeleksi = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { pilihanId, status, alasan } = req.body;

    const result = await seleksiSiswa(
      adminId,
      pilihanId,
      status,
      alasan
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};