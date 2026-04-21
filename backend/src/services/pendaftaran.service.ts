import prisma from '../config/database';
import { PendaftaranDTO } from '../types';
import { calculateHaversineDistance } from '../utils/haversine';
import { StatusPendaftaran } from '@prisma/client';

export class PendaftaranService {
  async createPendaftaran(userId: string, data: PendaftaranDTO) {
    // Check if user already has a pendaftaran
    const existingPendaftaran = await prisma.pendaftaran.findFirst({
      where: { userId },
    });

    if (existingPendaftaran) {
      throw new Error('Anda sudah memiliki pendaftaran aktif');
    }

    // Check if NISN already exists
    const existingNISN = await prisma.pendaftaran.findUnique({
      where: { nisn: data.nisn },
    });

    if (existingNISN) {
      throw new Error('NISN sudah terdaftar');
    }

    // Check if NIK already exists
    const existingNIK = await prisma.pendaftaran.findUnique({
      where: { nik: data.nik },
    });

    if (existingNIK) {
      throw new Error('NIK sudah terdaftar');
    }

    // Get sekolah data for distance calculation
    const sekolah1 = await prisma.sekolah.findUnique({
      where: { id: data.pilihan1SekolahId },
    });

    const sekolah2 = await prisma.sekolah.findUnique({
      where: { id: data.pilihan2SekolahId },
    });

    if (!sekolah1 || !sekolah2) {
      throw new Error('Sekolah tidak ditemukan');
    }

    // Calculate distance using Haversine formula
    const jarak1 = calculateHaversineDistance(
      data.latitude,
      data.longitude,
      sekolah1.latitude,
      sekolah1.longitude
    );

    const jarak2 = calculateHaversineDistance(
      data.latitude,
      data.longitude,
      sekolah2.latitude,
      sekolah2.longitude
    );

    // Create pendaftaran with pilihan sekolah
    const pendaftaran = await prisma.pendaftaran.create({
      data: {
        userId,
        nisn: data.nisn,
        nik: data.nik,
        namaLengkap: data.namaLengkap,
        tempatLahir: data.tempatLahir,
        tanggalLahir: new Date(data.tanggalLahir),
        jenisKelamin: data.jenisKelamin,
        agama: data.agama,
        alamatLengkap: data.alamatLengkap,
        latitude: data.latitude,
        longitude: data.longitude,
        nomorTelepon: data.nomorTelepon,
        namaAyah: data.namaAyah,
        namaIbu: data.namaIbu,
        pekerjaanAyah: data.pekerjaanAyah,
        pekerjaanIbu: data.pekerjaanIbu,
        nomorTeleponOrtu: data.nomorTeleponOrtu,
        status: StatusPendaftaran.MENUNGGU,
        pilihanSekolah: {
          create: [
            {
              sekolahId: data.pilihan1SekolahId,
              pilihanKe: 1,
              jarak: jarak1,
            },
            {
              sekolahId: data.pilihan2SekolahId,
              pilihanKe: 2,
              jarak: jarak2,
            },
          ],
        },
      },
      include: {
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
        },
      },
    });

    return pendaftaran;
  }

  async getPendaftaranByUserId(userId: string) {
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { userId },
      include: {
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
          orderBy: {
            pilihanKe: 'asc',
          },
        },
        dokumen: true,
        hasilSeleksi: {
          include: {
            sekolahDiterima: true,
          },
        },
      },
    });

    return pendaftaran;
  }

  async getAllPendaftaran() {
    const pendaftaran = await prisma.pendaftaran.findMany({
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
          orderBy: {
            pilihanKe: 'asc',
          },
        },
        hasilSeleksi: {
          include: {
            sekolahDiterima: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pendaftaran;
  }

  async getPendaftaranById(id: string) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
          orderBy: {
            pilihanKe: 'asc',
          },
        },
        dokumen: true,
        hasilSeleksi: {
          include: {
            sekolahDiterima: true,
          },
        },
      },
    });

    if (!pendaftaran) {
      throw new Error('Pendaftaran tidak ditemukan');
    }

    return pendaftaran;
  }
}