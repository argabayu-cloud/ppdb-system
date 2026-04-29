import { Response, NextFunction } from "express";

export const roleMiddleware = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    next();
  };
};