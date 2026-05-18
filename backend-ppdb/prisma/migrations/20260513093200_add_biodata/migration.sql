/*
  Warnings:

  - The values [DOMISILI,AFIRMASI] on the enum `Jalur` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Jalur_new" AS ENUM ('ZONASI', 'PRESTASI');
ALTER TABLE "Pendaftaran" ALTER COLUMN "jalur" TYPE "Jalur_new" USING ("jalur"::text::"Jalur_new");
ALTER TYPE "Jalur" RENAME TO "Jalur_old";
ALTER TYPE "Jalur_new" RENAME TO "Jalur";
DROP TYPE "public"."Jalur_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipeDokumen" ADD VALUE 'IJAZAH';
ALTER TYPE "TipeDokumen" ADD VALUE 'FOTO';
ALTER TYPE "TipeDokumen" ADD VALUE 'SKHU';
ALTER TYPE "TipeDokumen" ADD VALUE 'KIP';

-- AlterTable
ALTER TABLE "Pendaftaran" ADD COLUMN     "jenisPrestasi" TEXT,
ADD COLUMN     "namaSekolahAsal" TEXT,
ADD COLUMN     "nisn" TEXT,
ADD COLUMN     "noPendaftaran" TEXT,
ADD COLUMN     "npsn" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "tahunLulus" TEXT,
ADD COLUMN     "tingkatPrestasi" TEXT;

-- CreateTable
CREATE TABLE "Biodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "nik" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TEXT,
    "jenisKelamin" TEXT,
    "agama" TEXT,
    "anakKe" TEXT,
    "jumlahSaudara" TEXT,
    "beratBadan" TEXT,
    "tinggiBadan" TEXT,
    "alamat" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kotaKabupaten" TEXT,
    "provinsi" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "namaAyah" TEXT,
    "nikAyah" TEXT,
    "pendidikanAyah" TEXT,
    "pekerjaanAyah" TEXT,
    "namaIbu" TEXT,
    "nikIbu" TEXT,
    "pendidikanIbu" TEXT,
    "pekerjaanIbu" TEXT,
    "noHpOrtu" TEXT,
    "alamatOrtu" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biodata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_userId_key" ON "Biodata"("userId");

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
