"use client";

import {
    BarChart3,
    Building2,
    CheckCircle2,
    ShieldCheck,
    Trophy,
    Users,
} from "lucide-react";

export default function StatistikKotaPage() {
    return (
        <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 p-8 text-white shadow-sm">
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

                <div className="relative">
                    <p className="text-sm font-semibold text-blue-100">
                        Statistik Kota
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Statistik PPDB Zonasi & Prestasi
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                        Pantau perkembangan pendaftaran, verifikasi, dan distribusi jalur
                        Zonasi serta Prestasi dari seluruh sekolah.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Card title="Total Sekolah" value="0" icon={<Building2 />} />
                <Card title="Total Siswa" value="0" icon={<Users />} />
                <Card title="Zonasi" value="0" icon={<ShieldCheck />} />
                <Card title="Prestasi" value="0" icon={<Trophy />} />
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Distribusi Jalur
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Perbandingan jalur Zonasi dan Prestasi.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <Progress
                            label="Zonasi"
                            value={0}
                            color="bg-blue-600"
                        />

                        <Progress
                            label="Prestasi"
                            value={0}
                            color="bg-purple-600"
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Status Verifikasi
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Ringkasan status verifikasi pendaftar.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <StatusCard
                            title="Sudah Diverifikasi"
                            value="0"
                            bg="bg-emerald-50"
                            text="text-emerald-700"
                        />

                        <StatusCard
                            title="Belum Diverifikasi"
                            value="0"
                            bg="bg-amber-50"
                            text="text-amber-700"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                    <h2 className="font-bold text-slate-900">
                        Statistik Sekolah
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Ringkasan statistik pendaftaran tiap sekolah.
                    </p>
                </div>

                <div className="p-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                        <Building2 className="h-8 w-8" />
                    </div>

                    <h3 className="font-bold text-slate-800">
                        Belum ada statistik sekolah
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                        Statistik akan otomatis tampil ketika sekolah sudah memiliki data
                        pendaftar.
                    </p>
                </div>
            </section>
        </div>
    );
}

function Card({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {icon}
            </div>

            <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
            <p className="mt-1 text-sm text-slate-500">{title}</p>
        </div>
    );
}

function Progress({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">{label}</span>

                <span className="font-bold text-slate-800">
                    {value}%
                </span>
            </div>

            <div className="h-3 rounded-full bg-slate-100">
                <div
                    className={`h-3 rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function StatusCard({
    title,
    value,
    bg,
    text,
}: {
    title: string;
    value: string;
    bg: string;
    text: string;
}) {
    return (
        <div className={`rounded-2xl p-5 ${bg}`}>
            <p className="text-sm text-slate-500">{title}</p>

            <h2 className={`mt-2 text-3xl font-bold ${text}`}>
                {value}
            </h2>
        </div>
    );
}