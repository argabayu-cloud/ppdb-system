"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AlertTriangle, UserPlus } from "lucide-react";

import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTlpn, setNoTlpn] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNama = nama.trim();
    const trimmedEmail = email.trim();
    const trimmedNoTlpn = noTlpn.trim();

    setLoading(true);
    setError("");

    if (
      !trimmedNama ||
      !trimmedEmail ||
      !trimmedNoTlpn ||
      !password ||
      !konfirmasiPassword
    ) {
      setError("Semua field wajib diisi");
      setLoading(false);
      return;
    }

    if (password !== konfirmasiPassword) {
      setError("Konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        nama: trimmedNama,
        email: trimmedEmail,
        noTlpn: trimmedNoTlpn,
        password,
        konfirmasiPassword,
      });

      alert("Register berhasil, silakan login");
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="fixed left-0 top-0 z-30 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Image
                src="/images/logo-ppdb.png"
                alt="Logo PPDB"
                width={32}
                height={32}
                priority
              />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">
                PPDB SMP Terpadu
              </p>
              <p className="text-xs text-blue-200">
                Tahun Ajaran 2025 / 2026
              </p>
            </div>
          </Link>

          <Link
            href="/auth/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
          >
            Masuk
          </Link>
        </div>
      </nav>

      <main className="relative min-h-screen overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.88),rgba(37,99,235,0.72))]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden lg:block">
            <div className="max-w-lg">
              <span className="inline-flex rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
                Portal Resmi PPDB Online
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                Mulai Pendaftaran PPDB dengan Akun Peserta
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-blue-50/90">
                Buat akun untuk mengisi data siswa, memilih sekolah tujuan, dan
                memantau proses verifikasi berkas.
              </p>

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur">
                <div className="relative h-64 overflow-hidden rounded-[1.5rem] bg-blue-50">
                  <Image
                    src="/images/ilustrasi.png"
                    alt="Ilustrasi sekolah PPDB"
                    fill
                    priority
                    sizes="480px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl sm:p-8">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>

                  <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Daftar Akun
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Lengkapi data berikut untuk membuat akun PPDB.
                  </p>
                </div>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <span className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                      <span>{error}</span>
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleRegister}
                  className="mt-6 flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Masukkan email aktif"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      No. Telepon / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 08123456789"
                      value={noTlpn}
                      onChange={(e) => setNoTlpn(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Buat password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Konfirmasi
                      </label>
                      <input
                        type="password"
                        placeholder="Ulangi password"
                        value={konfirmasiPassword}
                        onChange={(e) => setKonfirmasiPassword(e.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </button>
                </form>

                <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-center">
                  <p className="text-sm text-slate-600">
                    Sudah punya akun?{" "}
                    <Link
                      href="/auth/login"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-4 text-center text-xs text-slate-400">
        © 2026 Dinas Pendidikan · PPDB SMP Terpadu. All rights reserved.
      </footer>
    </div>
  );
}