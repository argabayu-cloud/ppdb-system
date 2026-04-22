import { Request, Response } from "express";
import {
  getAllPendaftaran,
  getHasilSeleksi,
  validasiFinal,
} from "../services/superAdmin.service";

export const handleGetAll = async (req: Request, res: Response) => {
  const data = await getAllPendaftaran();
  res.json(data);
};

export const handleHasil = async (req: Request, res: Response) => {
  const data = await getHasilSeleksi();
  res.json(data);
};

export const handleValidasi = async (req: Request, res: Response) => {
  const { pendaftaranId, status } = req.body;

  const result = await validasiFinal(pendaftaranId, status);

  res.json({
    message: "Validasi berhasil",
    data: result,
  });
};