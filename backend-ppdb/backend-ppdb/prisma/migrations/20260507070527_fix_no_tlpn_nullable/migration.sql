/*
  Warnings:

  - The `status` column on the `Dokumen` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusDokumen" AS ENUM ('MENUNGGU', 'DITERIMA', 'DITOLAK');

-- AlterTable
ALTER TABLE "Dokumen" DROP COLUMN "status",
ADD COLUMN     "status" "StatusDokumen" NOT NULL DEFAULT 'MENUNGGU';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "noTlpn" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
