import { Request, Response } from "express";
import * as SekolahService from "../services/sekolah.service";

// helper untuk ambil param biar aman
const getParamId = (param: string | string[]) => {
  if (Array.isArray(param)) return null;
  return param;
};

export const handleCreateSekolah = async (req: Request, res: Response) => {
  try {
    const sekolah = await SekolahService.createSekolah(req.body);

    return res.status(201).json({
      success: true,
      message: "Sekolah berhasil dibuat",
      data: sekolah,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal membuat sekolah",
    });
  }
};

export const handleGetSekolah = async (_: Request, res: Response) => {
  try {
    const data = await SekolahService.getAllSekolah();

    return res.json({
      success: true,
      data,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data sekolah",
    });
  }
};

export const handleGetSekolahById = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak valid",
      });
    }

    const data = await SekolahService.getSekolahById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Sekolah tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil sekolah",
    });
  }
};

export const handleUpdateSekolah = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak valid",
      });
    }

    const data = await SekolahService.updateSekolah(id, req.body);

    return res.json({
      success: true,
      message: "Sekolah berhasil diupdate",
      data,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Gagal update sekolah",
    });
  }
};

export const handleDeleteSekolah = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak valid",
      });
    }

    await SekolahService.deleteSekolah(id);

    return res.json({
      success: true,
      message: "Sekolah berhasil dihapus",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus sekolah",
    });
  }
};