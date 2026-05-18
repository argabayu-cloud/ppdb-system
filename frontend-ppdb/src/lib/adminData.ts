export type PendaftaranItem = {
    id: string;

    jalur: "ZONASI" | "PRESTASI";

    status:
    | "MENUNGGU"
    | "DIPROSES_1"
    | "DITOLAK_1"
    | "DIPROSES_2"
    | "DITERIMA"
    | "DITOLAK";

    user?: {
        nama?: string;
        email?: string;
    };

    createdAt?: string;
};

export type AdminStats = {
    total: number;
    zonasi: number;
    prestasi: number;

    menunggu: number;
    diterima: number;
    ditolak: number;

    progress: number;
};

export const emptyStats: AdminStats = {
    total: 0,

    zonasi: 0,
    prestasi: 0,

    menunggu: 0,
    diterima: 0,
    ditolak: 0,

    progress: 0,
};

export function hitungStats(
    data: PendaftaranItem[]
): AdminStats {
    const total = data.length;

    const zonasi = data.filter(
        (item) => item.jalur === "ZONASI"
    ).length;

    const prestasi = data.filter(
        (item) => item.jalur === "PRESTASI"
    ).length;

    const menunggu = data.filter(
        (item) =>
            item.status === "MENUNGGU" ||
            item.status === "DIPROSES_1" ||
            item.status === "DIPROSES_2"
    ).length;

    const diterima = data.filter(
        (item) => item.status === "DITERIMA"
    ).length;

    const ditolak = data.filter(
        (item) =>
            item.status === "DITOLAK" ||
            item.status === "DITOLAK_1"
    ).length;

    const progress =
        total === 0
            ? 0
            : Math.round((diterima / total) * 100);

    return {
        total,

        zonasi,
        prestasi,

        menunggu,
        diterima,
        ditolak,

        progress,
    };
}

export async function getPendaftaran() {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(
            `${baseUrl}/pendaftaran`,
            {
                cache: "no-store",
            }
        );

        const result = await res.json();

        return result.data || result || [];
    } catch {
        return [];
    }
}