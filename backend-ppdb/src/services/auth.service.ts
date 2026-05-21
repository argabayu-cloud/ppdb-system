import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

type RegisterInput = {
  nama: string;
  email: string;
  noTlpn: string;
  password: string;
  konfirmasiPassword: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterInput) => {
  let { nama, email, noTlpn, password, konfirmasiPassword } = data;

  if (!nama || !email || !noTlpn || !password || !konfirmasiPassword) {
    throw new Error("Semua field wajib diisi");
  }

  email = email.toLowerCase().trim();
  noTlpn = noTlpn.trim();

  if (password !== konfirmasiPassword) {
    throw new Error("Konfirmasi password tidak cocok");
  }

  // ========================
  // VALIDASI EMAIL
  // ========================
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email sudah digunakan");
  }

  // ========================
  // VALIDASI NOMOR TELEPON
  // ========================
  const existingPhone = await prisma.user.findUnique({
    where: {
      noTlpn,
    },
  });

  if (existingPhone) {
    throw new Error("Nomor telepon sudah digunakan");
  }

  // ========================
  // HASH PASSWORD
  // ========================
  const hashedPassword = await bcrypt.hash(password, 10);

  // ========================
  // CREATE USER
  // ========================
  const user = await prisma.user.create({
    data: {
      nama,
      email,
      noTlpn,
      password: hashedPassword,
    },
    select: {
      id: true,
      nama: true,
      email: true,
      noTlpn: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  let { email, password } = data;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  email = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Password salah");
  }

  const adminSekolah = await prisma.adminSekolah.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      sekolah: true,
    },
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      namaSekolah: adminSekolah?.sekolah.nama || null,
    },
  };
};