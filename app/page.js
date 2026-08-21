"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import TypewriterHero from "@/components/TypewriterHero";
import { useCards } from "@/lib/cards-context";

export default function Home() {
  const { cards, ready } = useCards();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSkill, setActiveSkill] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(cards.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [cards]);

  // Top skills for quick filter pills
  const topSkills = useMemo(() => {
    const skillCounts = {};
    cards.forEach((c) => {
      if (Array.isArray(c.skills)) {
        c.skills.forEach((s) => {
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
      }
    });
    const sorted = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill)
      .slice(0, 8);
    return ["All", ...sorted];
  }, [cards]);

  // Filtered projects
  const filtered = useMemo(() => {
    return cards.filter((card) => {
      const matchCat =
        activeCategory === "All" || card.category === activeCategory;

      const matchSkill =
        activeSkill === "All" ||
        (Array.isArray(card.skills) && card.skills.includes(activeSkill));

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        card.title?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query) ||
        card.tagline?.toLowerCase().includes(query) ||
        card.problemStatement?.toLowerCase().includes(query) ||
        (Array.isArray(card.skills) &&
          card.skills.some((s) => s.toLowerCase().includes(query)));

      return matchCat && matchSkill && matchSearch;
    });
  }, [cards, activeCategory, activeSkill, searchQuery]);

  const liveProjectsCount = useMemo(() => {
    return cards.filter((c) => c.liveUrl).length;
  }, [cards]);

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveSkill("All");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="absolute w-[600px] h-[600px] bg-[var(--yellow)] rounded-full blur-[180px] top-[-250px] left-[-120px] pointer-events-none opacity-20"
          style={{ animation: "pulse 7s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <div className="mono-label text-[10px] px-3.5 py-1.5 rounded-full bg-[var(--yellow)] text-black font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              PORTFOLIO SHOWCASE
            </div>
            <div className="mono-label text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80">
              {cards.length} Projects Cataloged
            </div>
            <div className="mono-label text-[10px] px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {liveProjectsCount} Live Deployments
            </div>
          </motion.div>

          <TypewriterHero />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-[var(--muted)] text-sm sm:text-base leading-relaxed"
          >
            A centralized collection of full-stack applications, developer tooling, and AI platforms built by Soumen. Explore architectural decisions, live websites, and source code in one spot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 h-1 w-28 bg-[var(--yellow)] origin-left"
          />
        </div>
      </section>

      {/* Filter & Search Bar Section */}
      <section className="sticky top-16 z-40 bg-black/85 backdrop-blur-xl border-b border-[var(--line)] py-4">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tag whitespace-nowrap cursor-pointer ${
                  activeCategory === cat ? "tag-active" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, skills, tech..."
              className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 pl-9 text-xs font-medium outline-none focus:border-[var(--yellow)] transition-all placeholder:text-[var(--muted)]"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sub-filter by Top Skills */}
        {topSkills.length > 2 && (
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="mono-label text-[8px] text-[var(--muted)] mr-1 hidden sm:inline">
              STACK:
            </span>
            {topSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setActiveSkill(skill)}
                className={`mono-label text-[8px] px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeSkill === skill
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Projects Grid Section */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-10">
        {!ready ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-[var(--muted)] text-sm">
              <div className="w-5 h-5 border-2 border-[var(--yellow)] border-t-transparent rounded-full animate-spin" />
              Loading portfolio projects...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-[var(--line)] rounded-3xl p-16 text-center max-w-xl mx-auto"
          >
            <p className="text-3xl font-black mb-2">NO MATCHING PROJECTS</p>
            <p className="text-xs text-[var(--muted)] mb-6">
              No projects found matching the selected category, search query, or tech stack.
            </p>
            <button
              onClick={resetFilters}
              className="mono-label text-[10px] px-5 py-2.5 rounded-full bg-[var(--yellow)] text-black font-black hover:brightness-110 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((card, i) => (
              <Card card={card} index={i} key={card.id} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] mx-auto w-full mt-auto">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-[var(--yellow)] rounded-sm" />
            <span className="mono-label text-[10px] text-[var(--muted)] font-bold">
              BuiltBySoumen · Personal Showcase Platform
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="mono-label text-[9px] text-[var(--muted)]">
              Designed for recruiters & engineering teams
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

