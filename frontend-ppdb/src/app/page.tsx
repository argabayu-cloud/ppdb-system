"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white [font-size:20px]">
      <nav className="fixed left-0 top-0 z-30 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-blue-200">Tahun Ajaran 2025 / 2026</p>
            </div>
          </div>

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

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-10">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-300/40 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-100">
                Portal Resmi Penerimaan Peserta Didik Baru
              </span>

              <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                PPDB SMP Terpadu
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-blue-50/90 md:text-xl">
                Daftar sekolah tujuan, pantau status berkas, dan ikuti proses
                seleksi PPDB dengan lebih mudah dalam satu sistem terpadu.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg shadow-blue-950/20 transition hover:bg-blue-50"
                >
                  Daftar Sekarang
                </Link>

                <Link
                  href="/auth/login"
                  className="rounded-2xl border border-white/30 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
                >
                  Masuk Akun
                </Link>
              </div>

              <div className="mt-11 grid max-w-2xl grid-cols-3 gap-5">
                {[
                  { value: "45", label: "Sekolah" },
                  { value: "2", label: "Jalur" },
                  { value: "24/7", label: "Pantauan" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
                  >
                    <p className="text-3xl font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-blue-100">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur">
                  <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-blue-50 lg:h-[420px]">
                    <Image
                      src="/images/ilustrasi.png"
                      alt="Ilustrasi sekolah PPDB"
                      fill
                      priority
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-4 text-center text-xs text-slate-400">
        © 2026 Dinas Pendidikan · PPDB SMP Terpadu. All rights reserved.
      </footer>
    </div>
  );
}