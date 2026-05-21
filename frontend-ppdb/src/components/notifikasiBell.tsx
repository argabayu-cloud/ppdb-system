"use client";

import { useEffect, useState } from "react";
import BellNotificationIcon from "@/components/ui/BellNotificationIcon";

type Notif = {
  id: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function NotificationBell() {
  const [notif, setNotif] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotif = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/notifikasi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setNotif([]);
        return;
      }

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        setNotif([]);
        return;
      }

      const data = await res.json();
      setNotif(data.data || []);
    } catch {
      setNotif([]);
    }
  };

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await fetch(`${API_URL}/notifikasi/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotif();
    } catch {
      setNotif((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      );
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchNotif();
    }, 0);

    const interval = setInterval(fetchNotif, 5000);

    return () => {
      window.clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notif.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
        aria-label="Buka notifikasi"
      >
        <BellNotificationIcon size={20} color="#1d4ed8" />

        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">Notifikasi</h3>

            <span className="text-xs text-slate-400">
              {notif.length} pesan
            </span>
          </div>

          {notif.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-500">
              Tidak ada notifikasi
            </p>
          )}

          <div className="max-h-80 overflow-y-auto">
            {notif.map((n) => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`mb-2 w-full rounded-lg p-3 text-left transition ${
                  n.isRead
                    ? "bg-slate-100 hover:bg-slate-200"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                <p className="text-sm text-slate-700">{n.pesan}</p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {new Date(n.createdAt).toLocaleString("id-ID")}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
