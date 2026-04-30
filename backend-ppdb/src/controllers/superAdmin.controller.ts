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
    res.status(500).json({ message: error?.message || "Terjadi kesalahan" });
  }
};

export const handleHasil = async (req: Request, res: Response) => {
  try {
    const data = await getHasilSeleksi();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Terjadi kesalahan" });
  }
};

export const handleValidasi = async (req: Request, res: Response) => {
  try {
    const { pendaftaranId, status } = req.body;

    const result = await validasiFinal(pendaftaranId, status);

    res.json({
      message: "Validasi berhasil",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Terjadi kesalahan" });
  }
};