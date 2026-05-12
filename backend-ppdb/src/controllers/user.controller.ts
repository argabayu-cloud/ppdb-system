import { Request, Response } from "express";
import prisma from "../config/prisma";
import { getPengumumanByUser } from "../services/user.service";

export const getPengumuman = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const data = await getPengumumanByUser(userId);

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan",
    });
  }
};

export const updateBiodata = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { alamat, kelurahan, kecamatan, noTlpn, latitude, longitude } =
      req.body;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        alamat,
        kelurahan,
        kecamatan,
        noTlpn,
        latitude,
        longitude,
      },
    });

    return res.status(200).json({
      message: "Biodata berhasil disimpan",
      data: user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};
