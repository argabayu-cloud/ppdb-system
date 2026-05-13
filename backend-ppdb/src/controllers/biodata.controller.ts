import { Response } from "express";
import {
  getBiodataByUserId,
  upsertBiodata,
} from "../services/biodata.service";

export const getMe = async (req: any, res: Response) => {
  try {
    const data = await getBiodataByUserId(req.user.id);

    res.json({
      message: "Biodata berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("GET BIODATA ERROR:", error);

    res.status(500).json({
      message: "Gagal mengambil biodata",
    });
  }
};

export const saveMe = async (req: any, res: Response) => {
  try {
    const data = await upsertBiodata(req.user.id, req.body);

    res.json({
      message: "Biodata berhasil disimpan",
      data,
    });
  } catch (error) {
    console.error("SAVE BIODATA ERROR:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Gagal menyimpan biodata",
    });
  }
};