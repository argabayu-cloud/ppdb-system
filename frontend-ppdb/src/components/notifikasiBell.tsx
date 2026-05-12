"use client";

import { useEffect, useState } from "react";
import BellNotificationIcon from "@/components/ui/BellNotificationIcon";

type Notif = {
  id: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notif, setNotif] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotif = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch("http://localhost:5000/notifikasi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Status error:", res.status);
        return;
      }

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("Bukan JSON:", text);
        return;
      }

      const data = await res.json();
      setNotif(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/notifikasi/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchNotif();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotif();

    const interval = setInterval(fetchNotif, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notif.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* BUTTON ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center hover:scale-110 transition duration-200"
      >
        <BellNotificationIcon
          size={26}
          color="#ffffff"
          shadow={2}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border border-slate-100 p-3 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700">
              Notifikasi
            </h3>

            <span className="text-xs text-slate-400">
              {notif.length} pesan
            </span>
          </div>

          {notif.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Tidak ada notifikasi
            </p>
          )}

          <div className="max-h-80 overflow-y-auto">
            {notif.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                  n.isRead
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                <p className="text-sm text-slate-700">
                  {n.pesan}
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  {new Date(n.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}