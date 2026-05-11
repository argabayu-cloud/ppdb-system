-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('MENUNGGU', 'DIPROSES_1', 'DITOLAK_1', 'DIPROSES_2', 'DITERIMA', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusPilihan" AS ENUM ('MENUNGGU', 'DIPROSES', 'DITERIMA', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusFinal" AS ENUM ('DITERIMA', 'DITOLAK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSekolah" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sekolahId" TEXT NOT NULL,

    CONSTRAINT "AdminSekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendaftaran" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "StatusPendaftaran" NOT NULL DEFAULT 'MENUNGGU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilihanSekolah" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "sekolahId" TEXT NOT NULL,
    "pilihanKe" INTEGER NOT NULL,
    "status" "StatusPilihan" NOT NULL DEFAULT 'MENUNGGU',
    "jarak" DOUBLE PRECISION,
    "alasanPenolakan" TEXT,

    CONSTRAINT "PilihanSekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokumen" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "urlFile" TEXT NOT NULL,

    CONSTRAINT "Dokumen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasilSeleksi" (
    "id" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "sekolahDiterimaId" TEXT,
    "statusFinal" "StatusFinal" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "HasilSeleksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSekolah_userId_key" ON "AdminSekolah"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSekolah_sekolahId_key" ON "AdminSekolah"("sekolahId");

-- CreateIndex
CREATE UNIQUE INDEX "Pendaftaran_userId_key" ON "Pendaftaran"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HasilSeleksi_pendaftaranId_key" ON "HasilSeleksi"("pendaftaranId");

-- AddForeignKey
ALTER TABLE "AdminSekolah" ADD CONSTRAINT "AdminSekolah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSekolah" ADD CONSTRAINT "AdminSekolah_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendaftaran" ADD CONSTRAINT "Pendaftaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanSekolah" ADD CONSTRAINT "PilihanSekolah_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanSekolah" ADD CONSTRAINT "PilihanSekolah_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokumen" ADD CONSTRAINT "Dokumen_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilSeleksi" ADD CONSTRAINT "HasilSeleksi_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilSeleksi" ADD CONSTRAINT "HasilSeleksi_sekolahDiterimaId_fkey" FOREIGN KEY ("sekolahDiterimaId") REFERENCES "Sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;
