import { Request, Response } from "express";
import { createPendaftaran } from "../services/pendaftaran.service";

export const create = async (req: any, res: Response) => {
  try {
    const userId = req.user.id; // dari JWT
    const result = await createPendaftaran(userId, req.body);

    res.json({
      message: "Pendaftaran berhasil",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};