import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { nama, email, noTlpn, password } = req.body;

    // ✅ validasi input
    if (!nama || !email || !noTlpn || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    const user = await registerUser({
      nama,
      email,
      noTlpn,
      password,
    });

    res.status(201).json({
      message: "Register berhasil",
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: "Terjadi kesalahan",
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ validasi sederhana
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      message: "Login berhasil",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: "Terjadi kesalahan",
      });
    }
  }
};