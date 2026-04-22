import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: any) => {
  const { nama, email, password } = data;

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
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

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

  return {
    token,
    user,
  };
};