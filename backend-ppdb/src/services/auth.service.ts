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
  let { nama, email, noTlpn, password } = data;

  if (!nama || !email || !noTlpn || !password) {
    throw new Error("Semua field wajib diisi");
  }

  email = email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah digunakan");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      noTlpn,
      password: hashedPassword,
      // role default USER dari schema → tidak perlu di-set di sini
    },
    select: {
      id: true,
      nama: true,
      email: true,
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
    where: { email },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Password salah");
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // jangan kirim password ke client
  const safeUser = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
  };

  return {
    token,
    user: safeUser,
  };
};