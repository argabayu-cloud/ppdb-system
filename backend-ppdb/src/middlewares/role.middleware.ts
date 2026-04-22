export const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};

export const requireSuperAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};