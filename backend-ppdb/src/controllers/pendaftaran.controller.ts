import { Response } from "express";
import {
  createPendaftaran,
  getDashboardPendaftaran,
  resetPendaftaranZonasi,
  submitPendaftaran,
} from "../services/pendaftaran.service";

export const create = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    const result = await createPendaftaran(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil disimpan",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Terjadi kesalahan",
    });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const result = await getDashboardPendaftaran(req.user.id);

    return res.json({
      success: true,
      message: "Data dashboard berhasil diambil",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Gagal mengambil data dashboard",
    });
  }
};

export const submit = async (req: any, res: Response) => {
  try {
    const result = await submitPendaftaran(req.user.id);

    return res.json({
      success: true,
      message: "Pendaftaran berhasil dikirim",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Gagal mengirim pendaftaran",
    });
  }
};

export const resetZonasi = async (req: any, res: Response) => {
  try {
    const result = await resetPendaftaranZonasi(req.user.id);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Gagal reset pendaftaran",
    });
  }
};