"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
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
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex items-center bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-blue-700 text-base tracking-wide uppercase">
            PPDB SMP Terpadu
          </span>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Masuk</h1>
            <p className="text-slate-500 text-sm mt-1">
              Masuk ke portal PPDB SMP Terpadu
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Masukkan email kamu"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                onChange={(e) => setPassword(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-blue-100 text-sm"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2025 Dinas Pendidikan · PPDB SMP Terpadu. All rights reserved.
      </footer>
    </div>
  );
}