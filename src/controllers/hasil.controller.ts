import { Response } from "express";
import { getHasilUser } from "../services/hasil.service";

export const getHasil = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await getHasilUser(userId);

    res.status(200).json({
      message: "Berhasil mengambil hasil",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};