"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 text-center text-xs text-slate-500 py-4">
      © {new Date().getFullYear()} PPDB SMP Terpadu. All rights reserved.
    </footer>
  );
}