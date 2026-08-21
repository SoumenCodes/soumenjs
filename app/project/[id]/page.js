"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useCards } from "@/lib/cards-context";

export default function ProjectDetailPage({ params }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams?.id;
  const { cards, ready } = useCards();
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Find project
  const project = useMemo(() => {
    return cards.find((c) => String(c.id) === String(projectId));
  }, [cards, projectId]);

  // Next and previous projects for navigation
  const { prevProject, nextProject } = useMemo(() => {
    if (!cards.length || !project) return { prevProject: null, nextProject: null };
    const currentIndex = cards.findIndex((c) => String(c.id) === String(projectId));
    const prev = currentIndex > 0 ? cards[currentIndex - 1] : cards[cards.length - 1];
    const next = currentIndex < cards.length - 1 ? cards[currentIndex + 1] : cards[0];
    return { prevProject: prev, nextProject: next };
  }, [cards, project, projectId]);

  // Gallery images array
  const galleryImages = useMemo(() => {
    if (!project) return [];
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    return project.image ? [project.image] : [];
  }, [project]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[var(--muted)] text-sm">
            <div className="w-5 h-5 border-2 border-[var(--yellow)] border-t-transparent rounded-full animate-spin" />
            Loading project...
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="mono-label text-xs text-[var(--yellow)] mb-3">404 NOT FOUND</p>
          <h1 className="text-4xl font-black mb-4">PROJECT NOT FOUND</h1>
          <p className="text-[var(--muted)] text-sm mb-8 max-w-md">
            The project you are looking for might have been deleted or the link is invalid.
          </p>
          <Link
            href="/"
            className="mono-label text-xs px-6 py-3 rounded-full bg-[var(--yellow)] text-black font-black hover:brightness-110 transition"
          >
            ← Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = galleryImages[activeImageIndex] || project.image;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-white">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 md:px-12 py-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mono-label text-[11px] text-[var(--muted)] hover:text-white transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Collection
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="mono-label text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-[var(--muted)] hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied ? "Link Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="mono-label text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/90 font-bold">
              {project.category || "Full Stack"}
            </span>

            {project.status && (
              <span className="mono-label text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {project.status}
              </span>
            )}

            <span className="mono-label text-[10px] text-[var(--muted)] ml-auto">
              Released {project.date || "2024"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl">
            {project.tagline || project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--yellow)] text-black font-black text-sm hover:brightness-110 shadow-lg shadow-[var(--yellow)]/20 transition-all hover:scale-[1.02]"
              >
                <span>Visit Live Website</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--surface)] text-white font-bold text-sm border border-[var(--line)] hover:border-white/40 transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
              </a>
            )}
          </div>
        </header>

        {/* Media & Screenshot Gallery */}
        <section className="mb-14">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[var(--line)] bg-neutral-950 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 mono-label text-[10px] px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-[var(--yellow)] hover:text-[var(--yellow)] transition flex items-center gap-1.5"
              >
                <span>Live Preview</span>
                <span className="text-[12px]">↗</span>
              </a>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-18 w-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[var(--yellow)] scale-105 shadow-md shadow-[var(--yellow)]/30"
                      : "border-[var(--line)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Case Study Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Problem & Solution */}
          <div className="lg:col-span-2 space-y-10">
            {/* Problem Section */}
            <section className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="mono-label text-[11px] text-[var(--yellow)] font-bold">
                  Problem Statement
                </h2>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">
                What problem does this project solve?
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
                {project.problemStatement ||
                  "During the development of this application, the core focus was to eliminate friction and latency for users, modernizing workflows that traditionally required manual overhead or multiple disjointed tools."}
              </p>
            </section>

            {/* Solution & Architecture */}
            <section className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="mono-label text-[11px] text-emerald-400 font-bold">
                  Solution & Architecture
                </h2>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">
                How it was engineered
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
                {project.solution ||
                  project.description ||
                  "Built with modular modern web architecture, utilizing high-performance frontend state management, reactive data pipelines, and optimized cloud deployments for maximum reliability."}
              </p>
            </section>
          </div>

          {/* Sidebar: Skills, Specs & Quick Card */}
          <aside className="space-y-6">
            {/* Skills & Technologies */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6">
              <h3 className="mono-label text-[11px] text-[var(--yellow)] font-bold mb-4">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills && project.skills.length > 0 ? (
                  project.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="mono-label text-[10px] px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-white/90 font-medium hover:border-[var(--yellow)] hover:text-[var(--yellow)] transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[var(--muted)]">No specific skills listed.</span>
                )}
              </div>
            </div>

            {/* Project Specs */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6 space-y-4">
              <h3 className="mono-label text-[11px] text-[var(--muted)] font-bold">
                Project Details
              </h3>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="mono-label text-[10px] text-[var(--muted)]">Category</span>
                <span className="text-xs font-bold text-white">{project.category || "Full Stack"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="mono-label text-[10px] text-[var(--muted)]">Status</span>
                <span className="text-xs font-bold text-emerald-400">{project.status || "Completed"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="mono-label text-[10px] text-[var(--muted)]">Timeline</span>
                <span className="text-xs font-bold text-white">{project.date || "2024"}</span>
              </div>

              {project.liveUrl && (
                <div className="pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 mono-label text-[10px] py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition"
                  >
                    Open Live Deployment ↗
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Bottom Project Navigation */}
        <section className="mt-20 pt-8 border-t border-[var(--line)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProject && (
              <Link
                href={`/project/${prevProject.id}`}
                className="group flex flex-col p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--yellow)] transition-all"
              >
                <span className="mono-label text-[9px] text-[var(--muted)] mb-1 group-hover:text-[var(--yellow)] transition-colors">
                  ← Previous Project
                </span>
                <span className="text-base font-bold text-white group-hover:text-[var(--yellow)] transition-colors truncate">
                  {prevProject.title}
                </span>
              </Link>
            )}

            {nextProject && (
              <Link
                href={`/project/${nextProject.id}`}
                className="group flex flex-col p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--yellow)] transition-all sm:text-right"
              >
                <span className="mono-label text-[9px] text-[var(--muted)] mb-1 group-hover:text-[var(--yellow)] transition-colors">
                  Next Project →
                </span>
                <span className="text-base font-bold text-white group-hover:text-[var(--yellow)] transition-colors truncate">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] mx-auto w-full mt-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-[var(--yellow)] rounded-sm" />
            <span className="mono-label text-[10px] text-[var(--muted)]">
              BuiltBySoumen · Portfolio Vault
            </span>
          </div>
          <span className="mono-label text-[10px] text-[var(--muted)]">
            Explore. Build. Iterate.
          </span>
        </div>
      </footer>
    </div>
  );
}