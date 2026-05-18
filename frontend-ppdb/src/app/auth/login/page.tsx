"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { fetcher } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    setLoading(true);
    setError("");

    if (!trimmedEmail || !password) {
      setError("Email dan password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      if (res.data?.token) {
        const user = res.data.user;
        const role = user?.role;

        localStorage.setItem("token", res.data.token);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        if (role === "SUPER_ADMIN" || trimmedEmail === "superadmin@smp.com") {
          localStorage.removeItem("admin");
          router.push("/superadmin/dashboard");
          return;
        }

        if (
          role === "ADMIN" ||
          (trimmedEmail.startsWith("admin") &&
            trimmedEmail.endsWith("@ppdb-bdl.sch.id"))
        ) {
          const adminData = {
            ...user,
            sekolah:
              user?.namaSekolah ||
              user?.sekolah ||
              user?.schoolName ||
              user?.nama ||
              "Sekolah",
          };

          localStorage.setItem("admin", JSON.stringify(adminData));
          router.push("/adminsekolah/dashboard");
          return;
        }

        localStorage.removeItem("admin");
        router.push("/dashboard");
      } else {
        setError(res.message || "Email atau password salah!");
      }
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
            href="/"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
          >
            Beranda
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
                Masuk ke Sistem PPDB SMP Terpadu
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-blue-50/90">
                Kelola pendaftaran, pantau status berkas, dan akses dashboard
                sesuai peran akun.
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
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-200">
                    🔐
                  </div>

                  <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Masuk Akun
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Gunakan email dan password yang sudah terdaftar.
                  </p>
                </div>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      placeholder="Masukkan email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      placeholder="Masukkan password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {loading ? "Memproses..." : "Masuk"}
                  </button>
                </form>

                <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-center">
                  <p className="text-sm text-slate-600">
                    Belum punya akun?{" "}
                    <Link
                      href="/auth/register"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Daftar di sini
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