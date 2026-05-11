/*
  Warnings:

  - Added the required column `tipe` to the `Dokumen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ukuran` to the `Dokumen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noTlpn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipeDokumen" AS ENUM ('KK', 'AKTA', 'RAPOR', 'PRESTASI');

-- AlterTable
ALTER TABLE "Dokumen" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'MENUNGGU',
ADD COLUMN     "tipe" TEXT NOT NULL,
ADD COLUMN     "tipeDokumen" "TipeDokumen",
ADD COLUMN     "ukuran" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "noTlpn" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Dokumen_pendaftaranId_idx" ON "Dokumen"("pendaftaranId");
