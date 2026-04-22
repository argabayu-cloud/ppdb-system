import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.json({ message: "Register berhasil", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.json({ message: "Login berhasil", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};