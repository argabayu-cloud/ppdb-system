"use client";

import { useEffect, useState } from "react";
import {
    FileText,
    School,
    Save,
    CheckCircle2,
    Plus,
    Trash2,
    Info,
} from "lucide-react";

export default function PengaturanSekolahPage() {
    const [admin, setAdmin] = useState<any>(null);
    const [kuota, setKuota] = useState(200);

    const berkas = [
        "Kartu Keluarga",
        "Akta Kelahiran",
        "Ijazah / Surat Keterangan Lulus",
        "Pas Foto",
        "Surat Domisili",
    ];

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");

        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    const namaSekolah =
        admin?.namaSekolah ||
        admin?.sekolah ||
        admin?.schoolName ||
        admin?.nama ||
        "Sekolah";

    return (
        <div className="flex flex-col gap-6 bg-slate-50 min-h-screen p-6">
            {/* HEADER */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-lg">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/10 rounded-full" />

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <p className="text-blue-200 text-sm mb-1">
                            Pengaturan Sekolah
                        </p>

                        <h1 className="text-2xl font-bold">
                            Atur PPDB {namaSekolah}
                        </h1>

                        <p className="text-blue-100 text-sm mt-2 max-w-xl">
                            Kelola kuota penerimaan siswa baru dan tentukan berkas
                            persyaratan yang wajib diunggah pendaftar.
                        </p>
                    </div>

                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 min-w-[180px]">
                        <p className="text-xs text-blue-100 mb-1">Status Pengaturan</p>
                        <p className="text-lg font-bold">Aktif</p>
                        <p className="text-xs text-blue-200 mt-1">PPDB 2025/2026</p>
                    </div>
                </div>
            </section>

            {/* INFO */}
            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                    Perubahan kuota dan berkas hanya berlaku untuk sekolah admin yang
                    sedang login.
                </p>
            </section>

            {/* CONTENT */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KUOTA */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <School className="w-6 h-6" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Kuota Sekolah
                            </h2>
                            <p className="text-sm text-slate-500">
                                Tentukan jumlah siswa yang dapat diterima.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-5">
                        <p className="text-xs text-slate-500 mb-1">Nama Sekolah</p>
                        <p className="font-semibold text-slate-800">{namaSekolah}</p>
                    </div>

                    <label className="text-sm font-semibold text-slate-700">
                        Jumlah Kuota Penerimaan
                    </label>

                    <input
                        type="number"
                        value={kuota}
                        onChange={(e) => setKuota(Number(e.target.value))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-blue-50 p-4">
                            <p className="text-xs text-blue-600">Kuota Saat Ini</p>
                            <p className="text-xl font-bold text-blue-700">{kuota}</p>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-xs text-emerald-600">Status</p>
                            <p className="text-xl font-bold text-emerald-700">Aktif</p>
                        </div>
                    </div>

                    <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Simpan Kuota
                    </button>
                </div>

                {/* BERKAS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Berkas Persyaratan
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Dokumen wajib untuk pendaftar.
                                </p>
                            </div>
                        </div>

                        <button className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {berkas.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {item}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Wajib diunggah pendaftar
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-5 h-5 accent-blue-600"
                                    />

                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Simpan Berkas
                    </button>
                </div>
            </section>
        </div>
    );
}