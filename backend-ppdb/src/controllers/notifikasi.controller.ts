import { Request, Response } from "express";
import * as NotifService from "../services/notifikasi.service";
import { getParam } from "../utils/getParam";

export const handleGetNotif = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await NotifService.getNotifikasiByUser(user.id);

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Gagal ambil notifikasi",
    });
  }
};

export const handleMarkRead = async (req: Request, res: Response) => {
  try {
    const id = (req.params.id, "ID notifikasi");
    await NotifService.markAsRead(id);

    return res.json({
      success: true,
      message: "Notifikasi ditandai sudah dibaca",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};