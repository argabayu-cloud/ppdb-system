"use client";

import { useEffect, useState } from "react";

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
      const res = await fetch("http://localhost:5000/notifikasi", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setNotif(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch(`http://localhost:5000/notifikasi/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchNotif();
  };

  useEffect(() => {
    fetchNotif();
  }, []);

  const unreadCount = notif.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 z-50">
          <h3 className="font-semibold mb-2">Notifikasi</h3>

          {notif.length === 0 && (
            <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
          )}

          {notif.map((n) => (
            <div
              key={n.id}
              className={`p-2 mb-2 rounded cursor-pointer ${
                n.isRead ? "bg-gray-100" : "bg-blue-100"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p className="text-sm">{n.pesan}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}