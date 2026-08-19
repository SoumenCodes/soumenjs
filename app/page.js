"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { useCards } from "@/lib/cards-context";

export default function Home() {
  const { cards, ready } = useCards();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(cards.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [cards]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return cards;
    return cards.filter((c) => c.category === activeCategory);
  }, [cards, activeCategory]);

  return (
    <div className="flex flex-col flex-1">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute w-[500px] h-[500px] bg-[var(--yellow)] rounded-full blur-[160px] top-[-200px] left-[-100px] pointer-events-none" style={{ animation: "pulse 6s ease-in-out infinite" }} />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="mono-label text-[10px] px-4 py-2 rounded-full bg-[var(--yellow)] text-black font-bold">
              {String(cards.length).padStart(3, "0")} places
            </div>
            <div className="h-px w-12 bg-[var(--yellow)]/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter max-w-5xl"
          >
            PLACES
            <br />
            <span className="text-[var(--yellow)]">WORTH</span>
            <br />
            REMEMBERING.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-sm text-[var(--muted)] text-sm leading-relaxed"
          >
            Postcards someone meant to send. Pinned up, sorted by mood, never finished. Add yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 h-1 w-32 bg-[var(--yellow)] origin-left"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 md:px-12 pt-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag ${activeCategory === cat ? "tag-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-10">
        {!ready ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-[var(--muted)] text-sm">
              <div className="w-5 h-5 border-2 border-[var(--yellow)] border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-[var(--line)] rounded-3xl p-20 text-center"
          >
            <p className="text-4xl font-black mb-3">EMPTY.</p>
            <p className="text-sm text-[var(--muted)]">
              Nothing here yet. Go add something.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((card, i) => (
              <Card card={card} index={i} key={card.id} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[var(--line)] mx-auto w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-[var(--yellow)] rounded-sm" />
            <span className="mono-label text-[9px] text-[var(--muted)]">
              Wanderlist
            </span>
          </div>
          <span className="mono-label text-[9px] text-[var(--muted)]">
            Local storage. Your browser.
          </span>
        </div>
      </footer>
    </div>
  );
}
