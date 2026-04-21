import { z } from 'zod';

// Auth Validators
export const registerSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

// Pendaftaran Validators
export const pendaftaranSchema = z.object({
  nisn: z.string().length(10, 'NISN harus 10 digit'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  tempatLahir: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  tanggalLahir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid',
  }),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']),
  agama: z.enum(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']),
  alamatLengkap: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nomorTelepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  namaAyah: z.string().min(3, 'Nama ayah minimal 3 karakter'),
  namaIbu: z.string().min(3, 'Nama ibu minimal 3 karakter'),
  pekerjaanAyah: z.string().min(3, 'Pekerjaan ayah minimal 3 karakter'),
  pekerjaanIbu: z.string().min(3, 'Pekerjaan ibu minimal 3 karakter'),
  nomorTeleponOrtu: z.string().min(10, 'Nomor telepon orang tua minimal 10 digit'),
  pilihan1SekolahId: z.string().uuid('ID sekolah pilihan 1 tidak valid'),
  pilihan2SekolahId: z.string().uuid('ID sekolah pilihan 2 tidak valid'),
}).refine((data) => data.pilihan1SekolahId !== data.pilihan2SekolahId, {
  message: 'Pilihan sekolah 1 dan 2 tidak boleh sama',
  path: ['pilihan2SekolahId'],
});

// Seleksi Validator
export const seleksiSchema = z.object({
  status: z.enum(['DITERIMA', 'DITOLAK']),
  alasanPenolakan: z.string().optional(),
}).refine((data) => {
  if (data.status === 'DITOLAK' && !data.alasanPenolakan) {
    return false;
  }
  return true;
}, {
  message: 'Alasan penolakan wajib diisi jika status DITOLAK',
  path: ['alasanPenolakan'],
});

// Sekolah Validator
export const sekolahSchema = z.object({
  namaSekolah: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  kuota: z.number().int().positive('Kuota harus bilangan positif'),
});