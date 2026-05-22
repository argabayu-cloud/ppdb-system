"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ClipboardList, FileUp, Megaphone, UserRound } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardPendaftaran } from "@/lib/api";

type Step = {
  label: string;
  done: boolean;
};

type DashboardData = {
  user: {
    nama?: string;
    email?: string;
  };
  pendaftaran: {
    id: string;
    noPendaftaran?: string | null;
    status?: string;
    submittedAt?: string | null;
    pilihan?: {
      pilihanKe: number;
      sekolah?: {
        nama: string;
      };
    }[];
  } | null;
  progressPercent: number;
  noPendaftaran: string;
  statusLabel: string;
  steps: Step[];
};

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
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const res = await getDashboardPendaftaran();
        setDashboard(res.data);
      } catch (error) {
        console.error(error);

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        setDashboard({
          user: {
            nama: user?.nama || "Peserta PPDB",
            email: user?.email,
          },
          pendaftaran: null,
          progressPercent: 25,
          noPendaftaran: "-",
          statusLabel: "BELUM TERDAFTAR",
          steps: [
            { label: "Buat Akun", done: true },
            { label: "Isi Biodata", done: false },
            { label: "Pendaftaran", done: false },
            { label: "Upload Berkas", done: false },
            { label: "Selesai", done: false },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const steps = dashboard?.steps || [];
  const progressPercent = dashboard?.progressPercent || 0;
  const noPendaftaran = dashboard?.noPendaftaran || "-";
  const statusLabel = dashboard?.statusLabel || "BELUM TERDAFTAR";
  const isRegistered = statusLabel === "TERDAFTAR";

  const pilihanPertama = dashboard?.pendaftaran?.pilihan?.find(
    (p) => p.pilihanKe === 1,
  );

  const stepDone = (label: string) =>
    steps.find((step) => step.label === label)?.done || false;

  const statusCards = [
    {
      label: "Biodata",
      status: stepDone("Isi Biodata") ? "Lengkap" : "Belum Lengkap",
      href: "/dashboard/biodata",
      color: stepDone("Isi Biodata") ? "bg-blue-50" : "bg-amber-50",
      icon: <UserRound className="h-6 w-6" />,
    },
    {
      label: "Pendaftaran",
      status: stepDone("Pendaftaran") ? "Sudah Diisi" : "Belum Diisi",
      href: "/dashboard/pendaftaran",
      color: stepDone("Pendaftaran") ? "bg-blue-50" : "bg-red-50",
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      label: "Upload Berkas",
      status: stepDone("Upload Berkas") ? "Berkas Lengkap" : "Belum Upload",
      href: "/dashboard/upload",
      color: stepDone("Upload Berkas") ? "bg-blue-50" : "bg-red-50",
      icon: <FileUp className="h-6 w-6" />,
    },
    {
      label: "Status",
      status: isRegistered ? "Menunggu Verifikasi" : "Belum Dikirim",
      href: "/dashboard/pengumuman",
      color: isRegistered ? "bg-emerald-50" : "bg-slate-100",
      icon: <Megaphone className="h-6 w-6" />,
    },
  ];

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
              {dashboard?.user?.nama || "Peserta PPDB"}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              {isRegistered
                ? `Terima kasih sudah mendaftar. Berkas kamu sedang menunggu verifikasi dari ${
                    pilihanPertama?.sekolah?.nama || "sekolah pilihan pertama"
                  }.`
                : "Lengkapi biodata, pilih sekolah tujuan, upload berkas, dan pantau status pendaftaran kamu melalui dashboard peserta."}
            </p>
          </div>

          <div className="min-w-[170px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">No. Pendaftaran</p>

            <p className="mt-1 text-2xl font-bold tracking-widest text-white">
              {noPendaftaran}
            </p>

            <p
              className={`mx-auto mt-2 w-fit rounded-full px-3 py-1 text-[11px] font-bold ${
                isRegistered
                  ? "bg-emerald-400/20 text-emerald-50"
                  : "bg-white/10 text-blue-100"
              }`}
            >
              {statusLabel}
            </p>
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
              {isRegistered
                ? "Pendaftaran sudah terkirim dan masuk proses verifikasi sekolah."
                : "Selesaikan semua tahapan untuk masuk proses verifikasi."}
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

      {isRegistered && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-700">
                Pendaftaran berhasil dikirim
              </p>

              <p className="mt-1 text-sm leading-6 text-emerald-700/80">
                Terima kasih sudah mendaftar di PPDB SMP Terpadu. Silakan pantau
                notifikasi dan halaman pengumuman untuk melihat hasil verifikasi.
              </p>
            </div>

            <Link
              href="/dashboard/pengumuman"
              className="w-fit rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              Pantau Pengumuman
            </Link>
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusCards.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-blue-600 ${item.color}`}
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

          <Skeleton className="h-24 w-full rounded-2xl bg-white/20 sm:w-[170px]" />
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