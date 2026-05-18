"use client";

import { useEffect, useState } from "react";
import {
    Check,
    FileText,
    Save,
    Trophy,
    Users,
    X,
} from "lucide-react";

const masterBerkas = [
    "Kartu Keluarga",
    "Akta Kelahiran",
    "Rapor Semester",
    "Ijazah / SKL",
    "Pas Foto",
    "KTP Orang Tua",
    "Piagam Prestasi",
    "Surat Keterangan Domisili",
];

export default function PengaturanPage() {
    const [kuotaZonasi, setKuotaZonasi] = useState(0);
    const [kuotaPrestasi, setKuotaPrestasi] = useState(0);
    const [selectedBerkas, setSelectedBerkas] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("pengaturan-admin");

        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);

            setKuotaZonasi(parsed.kuotaZonasi || 0);
            setKuotaPrestasi(parsed.kuotaPrestasi || 0);
            setSelectedBerkas(parsed.selectedBerkas || []);
        } catch {
            localStorage.removeItem("pengaturan-admin");
        }
    }, []);

    const toggleBerkas = (nama: string) => {
        setSelectedBerkas((prev) =>
            prev.includes(nama)
                ? prev.filter((item) => item !== nama)
                : [...prev, nama]
        );
    };

    const simpanPengaturan = () => {
        const data = {
            kuotaZonasi,
            kuotaPrestasi,
            selectedBerkas,
        };

        localStorage.setItem("pengaturan-admin", JSON.stringify(data));

        alert("Pengaturan berhasil disimpan");
    };

    return (
        <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

                <div className="relative">
                    <p className="text-sm font-semibold text-blue-100">
                        Pengaturan Sekolah
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Atur Kuota dan Berkas
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                        Atur kuota penerimaan untuk jalur Zonasi dan Prestasi, serta
                        tentukan berkas yang wajib diunggah oleh pendaftar.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">Kuota Zonasi</h2>
                            <p className="text-sm text-slate-500">
                                Kuota siswa berdasarkan jarak domisili.
                            </p>
                        </div>
                    </div>

                    <input
                        type="number"
                        min={0}
                        value={kuotaZonasi}
                        onChange={(e) => setKuotaZonasi(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Masukkan kuota zonasi"
                    />

                    <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                        <p className="text-xs text-blue-600">Kuota Saat Ini</p>
                        <p className="mt-1 text-3xl font-bold text-blue-700">
                            {kuotaZonasi}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                            <Trophy className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">Kuota Prestasi</h2>
                            <p className="text-sm text-slate-500">
                                Kuota siswa berdasarkan nilai dan prestasi.
                            </p>
                        </div>
                    </div>

                    <input
                        type="number"
                        min={0}
                        value={kuotaPrestasi}
                        onChange={(e) => setKuotaPrestasi(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        placeholder="Masukkan kuota prestasi"
                    />

                    <div className="mt-4 rounded-2xl bg-purple-50 p-4">
                        <p className="text-xs text-purple-600">Kuota Saat Ini</p>
                        <p className="mt-1 text-3xl font-bold text-purple-700">
                            {kuotaPrestasi}
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <FileText className="h-6 w-6" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Pilih Berkas Persyaratan
                        </h2>

                        <p className="text-sm text-slate-500">
                            Klik dokumen yang wajib diunggah siswa.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {masterBerkas.map((item) => {
                        const active = selectedBerkas.includes(item);

                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleBerkas(item)}
                                className={`flex items-center justify-between rounded-2xl border p-4 transition ${active
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                    }`}
                            >
                                <span className="text-sm font-medium text-slate-700">
                                    {item}
                                </span>

                                {active ? (
                                    <Check className="h-5 w-5 text-blue-600" />
                                ) : (
                                    <X className="h-5 w-5 text-slate-300" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                    <p className="mb-3 font-semibold text-slate-700">
                        Berkas Terpilih ({selectedBerkas.length})
                    </p>

                    {selectedBerkas.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Belum ada berkas dipilih.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {selectedBerkas.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={simpanPengaturan}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <Save className="h-5 w-5" />
                    Simpan Pengaturan
                </button>
            </div>
        </div>
    );
}