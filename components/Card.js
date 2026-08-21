"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Card({ card, index = 0, onDelete }) {
  const router = useRouter();

  const handleCardClick = (e) => {
    // If clicking an explicit link or button, don't trigger card navigation
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    router.push(`/project/${card.id}`);
  };

  const skills = card.skills || [];
  const displaySkills = skills.slice(0, 3);
  const remainingSkillsCount = skills.length - 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -6 }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--yellow)] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_12px_30px_rgba(97,61,241,0.15)]"
    >
      {/* Media / Thumbnail Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="mono-label text-[9px] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/90 border border-white/10 font-bold">
            {card.category || "Project"}
          </span>

          {card.status && (
            <span className="mono-label text-[9px] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {card.status}
            </span>
          )}
        </div>

        {/* Quick Hover Action Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <div className="flex items-center gap-1.5">
            {card.liveUrl && (
              <a
                href={card.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 mono-label text-[9px] font-bold px-2.5 py-1 rounded-lg bg-[var(--yellow)] text-black hover:brightness-110 shadow-md transition"
              >
                Live Demo ↗
              </a>
            )}
            {card.githubUrl && (
              <a
                href={card.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 mono-label text-[9px] font-bold px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur text-white border border-white/20 hover:border-white/50 transition"
              >
                GitHub ↗
              </a>
            )}
          </div>
          <span className="mono-label text-[8px] text-white/70">
            Click to open →
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-4 gap-2.5">
        <div className="flex items-center justify-between">
          <span className="mono-label text-[9px] text-[var(--muted)]">
            {card.date || "2024"}
          </span>
          <span className="mono-label text-[9px] text-[var(--yellow)] font-bold group-hover:translate-x-0.5 transition-transform">
            Case Study →
          </span>
        </div>

        <h3 className="text-base font-bold leading-snug tracking-tight text-white group-hover:text-[var(--yellow)] transition-colors line-clamp-2">
          {card.title}
        </h3>

        {/* Tech Stack Pills */}
        <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {displaySkills.map((skill, idx) => (
              <span
                key={idx}
                className="mono-label text-[8px] px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5"
              >
                {skill}
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="mono-label text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 text-[var(--muted)]">
                +{remainingSkillsCount}
              </span>
            )}
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="mono-label text-[9px] text-red-400 hover:text-red-300 transition-colors p-1"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

