import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "Register berhasil",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      message: "Login berhasil",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Terjadi kesalahan",
    });
  }
};