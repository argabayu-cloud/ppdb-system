import { Request, Response } from "express";
import { seleksiZonasi } from "../services/seleksi.service";

export const runSeleksi = async (req: Request, res: Response) => {
  try {
    const result = await seleksiZonasi();

    res.json({
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};