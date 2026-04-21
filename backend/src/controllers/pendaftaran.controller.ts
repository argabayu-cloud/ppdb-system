import { Response } from 'express';
import { PendaftaranService } from '../services/pendaftaran.service';
import { AuthRequest } from '../types';

const pendaftaranService = new PendaftaranService();

export class PendaftaranController {
  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const pendaftaran = await pendaftaranService.createPendaftaran(
        req.user.userId,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Pendaftaran berhasil dibuat',
        data: pendaftaran,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyPendaftaran(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const pendaftaran = await pendaftaranService.getPendaftaranByUserId(
        req.user.userId
      );

      if (!pendaftaran) {
        return res.status(404).json({
          success: false,
          message: 'Anda belum memiliki pendaftaran',
        });
      }

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

  async getStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const pendaftaran = await pendaftaranService.getPendaftaranByUserId(
        req.user.userId
      );

      if (!pendaftaran) {
        return res.status(404).json({
          success: false,
          message: 'Anda belum memiliki pendaftaran',
        });
      }

      // Format response untuk status tracking
      const statusInfo = {
        status: pendaftaran.status,
        pilihan1: pendaftaran.pilihanSekolah.find((p) => p.pilihanKe === 1),
        pilihan2: pendaftaran.pilihanSekolah.find((p) => p.pilihanKe === 2),
        hasilFinal: pendaftaran.hasilSeleksi,
      };

      res.status(200).json({
        success: true,
        data: statusInfo,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}