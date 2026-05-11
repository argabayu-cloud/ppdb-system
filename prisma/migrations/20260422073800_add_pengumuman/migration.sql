/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Sekolah` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sekolah_nama_key" ON "Sekolah"("nama");

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
