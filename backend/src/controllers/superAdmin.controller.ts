import { Request, Response } from 'express';
import { SuperAdminService } from '../services/superAdmin.service';
import { AuthRequest } from '../types';
import { StatusFinal } from '@prisma/client';

const superAdminService = new SuperAdminService();

export class SuperAdminController {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const statistik = await superAdminService.getStatistikKeseluruhan();

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

  async getAllPendaftaran(req: Request, res: Response) {
    try {
      const pendaftaran = await superAdminService.getAllPendaftaran();

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

  async getPendaftaranDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pendaftaran = await superAdminService.getPendaftaranDetail(id);

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

  async validasiHasil(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statusFinal, catatan } = req.body;

      const hasil = await superAdminService.validasiHasil(
        id,
        statusFinal as StatusFinal,
        catatan
      );

      res.status(200).json({
        success: true,
        message: 'Validasi hasil berhasil',
        data: hasil,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllSekolah(req: Request, res: Response) {
    try {
      const sekolah = await superAdminService.getAllSekolah();

      res.status(200).json({
        success: true,
        data: sekolah,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createSekolah(req: Request, res: Response) {
    try {
      const sekolah = await superAdminService.createSekolah(req.body);

      res.status(201).json({
        success: true,
        message: 'Sekolah berhasil dibuat',
        data: sekolah,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createAdminSekolah(req: Request, res: Response) {
    try {
      const admin = await superAdminService.createAdminSekolah(req.body);

      res.status(201).json({
        success: true,
        message: 'Admin sekolah berhasil dibuat',
        data: admin,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getLaporanSekolah(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const laporan = await superAdminService.getLaporanSekolah(id);

      res.status(200).json({
        success: true,
        data: laporan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}