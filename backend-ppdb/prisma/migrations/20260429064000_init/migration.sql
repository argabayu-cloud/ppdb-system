/*
  Warnings:

  - A unique constraint covering the columns `[pendaftaranId,pilihanKe]` on the table `PilihanSekolah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jalur` to the `Pendaftaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pendaftaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PilihanSekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kuota` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Jalur" AS ENUM ('ZONASI', 'DOMISILI', 'PRESTASI', 'AFIRMASI');

-- AlterTable
ALTER TABLE "Dokumen" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "HasilSeleksi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Pendaftaran" ADD COLUMN     "jalur" "Jalur" NOT NULL,
ADD COLUMN     "nilaiPrestasi" DOUBLE PRECISION,
ADD COLUMN     "nilaiRapor" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PilihanSekolah" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sekolah" ADD COLUMN     "kuota" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alamat" TEXT,
ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "kelurahan" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "VerifikasiLog" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifikasiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PilihanSekolah_pendaftaranId_pilihanKe_key" ON "PilihanSekolah"("pendaftaranId", "pilihanKe");

-- AddForeignKey
ALTER TABLE "VerifikasiLog" ADD CONSTRAINT "VerifikasiLog_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifikasiLog" ADD CONSTRAINT "VerifikasiLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
