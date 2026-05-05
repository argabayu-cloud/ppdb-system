import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    // cek format Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Format token salah" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau expired" });
  }
};

export { verifyToken };
