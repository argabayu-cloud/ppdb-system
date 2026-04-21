import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';

const adminService = new AdminService();

export class AdminController {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const statistik = await adminService.getStatistik(req.user.userId);

      res.status(200).json({
        success: true,
        data: statistik,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPendaftar(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const pendaftar = await adminService.getPendaftarBySekolah(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: pendaftar,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPendaftarDetail(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const pendaftaran = await adminService.getPendaftarDetail(
        req.user.userId,
        id
      );

      res.status(200).json({
        success: true,
        data: pendaftaran,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async prosesSeleksi(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const result = await adminService.prosesSeleksi(
        req.user.userId,
        id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}