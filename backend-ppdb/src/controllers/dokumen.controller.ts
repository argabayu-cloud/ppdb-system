import { Response } from "express";
import { TipeDokumen } from "@prisma/client";
import { getDokumenSaya, uploadDokumen } from "../services/dokumen.service";

export const handleGetDokumenSaya = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const data = await getDokumenSaya(userId);

    return res.json({
      success: true,
      message: "Berhasil mengambil dokumen",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Gagal mengambil dokumen",
    });
  }
};

export const handleUpload = async (req: any, res: Response) => {
  try {
    const tipeDokumen = req.body.tipeDokumen as TipeDokumen;

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File wajib diupload",
      });
    }

    if (!tipeDokumen) {
      return res.status(400).json({
        success: false,
        message: "Tipe dokumen wajib diisi",
      });
    }

    if (!Object.values(TipeDokumen).includes(tipeDokumen)) {
      return res.status(400).json({
        success: false,
        message: "Tipe dokumen tidak valid",
      });
    }

    const result = await uploadDokumen(req.user.id, req.file, tipeDokumen);

    return res.json({
      success: true,
      message: "Upload berhasil",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Gagal upload dokumen",
    });
  }
};