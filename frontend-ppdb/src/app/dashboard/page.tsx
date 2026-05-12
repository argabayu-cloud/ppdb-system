"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

type User = {
  nama?: string;
};

const steps = [
  { label: "Buat Akun", done: true },
  { label: "Isi Biodata", done: false },
  { label: "Pendaftaran", done: false },
  { label: "Upload Berkas", done: false },
  { label: "Verifikasi", done: false },
];

const announcements = [
  {
    date: "1 Mei 2025",
    title: "Pendaftaran PPDB Gelombang 1 Dibuka",
    desc: "Pendaftaran gelombang pertama telah resmi dibuka. Segera lengkapi berkas kamu sebelum 30 Mei 2025.",
  },
  {
    date: "28 Apr 2025",
    title: "Persyaratan Dokumen Diperbarui",
    desc: "Cek kembali daftar dokumen yang diperlukan. Ada penambahan surat keterangan domisili.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [router]);

  const doneCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((doneCount / steps.length) * 100);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <span className="w-fit rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Portal Peserta PPDB
            </span>

            <p className="mt-5 text-sm text-blue-100">Selamat Datang 👋</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              {user?.nama || "Peserta PPDB"}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              Lengkapi biodata, pilih sekolah tujuan, upload berkas, dan pantau
              status pendaftaran kamu melalui dashboard peserta.
            </p>
          </div>

          <div className="min-w-[155px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">No. Pendaftaran</p>
            <p className="mt-1 text-xl font-bold tracking-widest text-white">
              -
            </p>
            <p className="mt-1 text-xs text-blue-200">Belum terdaftar</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Progress Pendaftaran
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Selesaikan semua tahapan untuk masuk proses verifikasi.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
            {progressPercent}%
          </span>
        </div>

        <div className="mb-5 h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-5">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`rounded-xl border p-3 ${
                step.done
                  ? "border-blue-100 bg-blue-50"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div
                className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  step.done
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </div>

              <p
                className={`text-xs font-semibold ${
                  step.done ? "text-blue-700" : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Biodata",
            status: "Belum Lengkap",
            href: "/dashboard/biodata",
            color: "bg-amber-50 text-amber-600",
            icon: "👤",
          },
          {
            label: "Pendaftaran",
            status: "Belum Diisi",
            href: "/dashboard/pendaftaran",
            color: "bg-red-50 text-red-500",
            icon: "📋",
          },
          {
            label: "Upload Berkas",
            status: "Belum Upload",
            href: "/dashboard/upload-berkas",
            color: "bg-red-50 text-red-500",
            icon: "📁",
          },
          {
            label: "Pengumuman",
            status: "Ada Info Baru",
            href: "/dashboard/pengumuman",
            color: "bg-blue-50 text-blue-600",
            icon: "📢",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${item.color}`}
            >
              {item.icon}
            </div>

            <p className="text-sm font-bold text-slate-800">{item.label}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {item.status}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Pengumuman Terbaru
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Informasi resmi seputar jadwal dan persyaratan PPDB.
            </p>
          </div>

          <Link
            href="/dashboard/pengumuman"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {announcements.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold text-blue-600">{a.date}</p>
              <h3 className="mt-2 text-sm font-bold text-slate-800">
                {a.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 shadow-xl lg:p-7">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Skeleton className="h-6 w-44 bg-white/20" />
            <Skeleton className="mt-5 h-4 w-32 bg-white/20" />
            <Skeleton className="mt-3 h-10 w-72 bg-white/20" />
            <Skeleton className="mt-4 h-4 w-full max-w-lg bg-white/20" />
            <Skeleton className="mt-2 h-4 w-80 bg-white/20" />
          </div>

          <Skeleton className="h-24 w-full rounded-2xl bg-white/20 sm:w-[155px]" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="mt-2 h-3 w-72" />
          </div>
          <Skeleton className="h-7 w-14 rounded-full" />
        </div>

        <Skeleton className="mb-5 h-3 w-full rounded-full" />

        <div className="grid gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-3 w-72" />

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}