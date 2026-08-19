"use client";

import { motion } from "framer-motion";

const NUMBERS = ["01", "02", "03", "04", "05", "06"];

export default function Card({ card, index = 0, onDelete }) {
  const num = NUMBERS[index % NUMBERS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -4, scale: 1.015 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--surface)] border-2 border-[var(--yellow)] transition-all duration-200"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <span className="absolute top-2.5 left-2.5 mono-label text-[8px] px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white/80 border border-white/10">
          {card.coords || "—"}
        </span>

        <span className="absolute top-2.5 right-2.5 mono-label text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--yellow)] text-black">
          {num}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--yellow)]" />
          <span className="mono-label text-[8px] text-[var(--muted)]">
            {card.category || "Uncategorised"}
          </span>
          <span className="mono-label text-[8px] text-[var(--muted)] ml-auto">
            {card.date}
          </span>
        </div>

        <h3 className="text-lg font-black leading-tight tracking-tight text-white">
          {card.title}
        </h3>

        <p className="text-[11px] leading-snug text-[var(--muted)] line-clamp-2">
          {card.description}
        </p>

        {onDelete && (
          <button
            onClick={() => onDelete(card.id)}
            className="mono-label text-[8px] text-[var(--muted)] hover:text-[var(--yellow)] transition-colors mt-1 self-start"
          >
            Delete
          </button>
        )}
      </div>
    </motion.article>
  );
}
