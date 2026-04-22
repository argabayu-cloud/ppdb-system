import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export { verifyToken };
