import { Response } from "express";
import { getHasilUser } from "../services/hasil.service";

export const getHasil = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await getHasilUser(userId);

    return res.status(200).json({
      success: true,
      message: result
        ? "Berhasil mengambil hasil"
        : "Hasil seleksi belum tersedia",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil hasil seleksi",
    });
  }
};