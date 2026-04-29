import { Response } from "express";
import { createPendaftaran } from "../services/pendaftaran.service";

export const create = async (req: any, res: Response) => {
  try {
    // ❗ validasi user dari middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User tidak terautentikasi",
      });
    }

    const userId = req.user.id;

    const result = await createPendaftaran(userId, req.body);

    res.status(201).json({
      message: "Pendaftaran berhasil",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || "Terjadi kesalahan",
    });
  }
};