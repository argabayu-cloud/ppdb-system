import { Request, Response } from "express";
import { uploadDokumen } from "../services/dokumen.service";

export const handleUpload = async (req: any, res: Response) => {
  try {
    const tipeDokumen = req.body.tipeDokumen;

    if (!req.file) {
      return res.status(400).json({ message: "File wajib diupload" });
    }

    if (!tipeDokumen) {
      return res.status(400).json({ message: "Tipe dokumen wajib diisi" });
    }

    const result = await uploadDokumen(
      req.user.id,
      req.file,
      tipeDokumen
    );

    res.json({
      message: "Upload berhasil",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};