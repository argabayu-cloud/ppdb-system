import { Request } from 'express';
import { Role } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface RegisterDTO {
  nama: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface PendaftaranDTO {
  nisn: string;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  alamatLengkap: string;
  latitude: number;
  longitude: number;
  nomorTelepon: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  nomorTeleponOrtu: string;
  pilihan1SekolahId: string;
  pilihan2SekolahId: string;
}

export interface SeleksiDTO {
  status: 'DITERIMA' | 'DITOLAK';
  alasanPenolakan?: string;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  error?: any;
}