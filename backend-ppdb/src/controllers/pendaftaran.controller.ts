import { Response } from "express";
import {
  createPendaftaran,
  getDashboardPendaftaran,
  submitPendaftaran,
} from "../services/pendaftaran.service";

export const create = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User tidak terautentikasi",
      });
    }

    const result = await createPendaftaran(req.user.id, req.body);

    res.status(201).json({
      message: "Pendaftaran berhasil disimpan",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || "Terjadi kesalahan",
    });
  }
};

export const submit = async (req: any, res: Response) => {
  try {
    const result = await submitPendaftaran(req.user.id);

    res.json({
      message: "Pendaftaran berhasil dikirim",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || "Gagal mengirim pendaftaran",
    });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const result = await getDashboardPendaftaran(req.user.id);

    res.json({
      message: "Data dashboard berhasil diambil",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error?.message || "Gagal mengambil data dashboard",
    });
  }
};