import { Request, Response } from "express";
import { getPengumumanByUser } from "../services/user.service";

export const getPengumuman = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const data = await getPengumumanByUser(userId);

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};