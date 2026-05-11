import { Request, Response } from "express";
import { seleksiZonasi, seleksiCascading } from "../services/seleksi.service";

//Seleksi zonasi (Pilihan 1)
export const runSeleksiZonasi = async (req: Request, res: Response) => {
  try {
    const result = await seleksiZonasi();

    res.json({
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};

// 2 cascading (pilihan 2)
export const runCascading = async (req: Request, res: Response) => {
    try {
      const result = await seleksiCascading();

      res.status(200).json({
        message: result.message,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Terjadi kesalahan",
      });
    }
  };