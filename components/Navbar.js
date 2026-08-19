"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--yellow)] text-black text-[12px] font-black tracking-tight transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
            W
          </div>
          <span className="text-lg font-black tracking-tight uppercase">
            Wanderlist
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`mono-label text-[10px] px-4 py-2 rounded-full transition-all duration-200 ${
              pathname === "/"
                ? "bg-[var(--yellow)] text-black font-bold"
                : "text-[var(--muted)] hover:text-white hover:bg-[var(--surface)]"
            }`}
          >
            Collection
          </Link>
          <Link
            href="/admin"
            className={`mono-label text-[10px] px-4 py-2 rounded-full transition-all duration-200 ${
              pathname === "/admin"
                ? "bg-[var(--yellow)] text-black font-bold"
                : "text-[var(--muted)] hover:text-white hover:bg-[var(--surface)]"
            }`}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
