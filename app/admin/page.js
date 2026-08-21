"use client";

import { useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCards } from "@/lib/cards-context";

const VALID_PASSCODES = ["builtbysoumen", "soumencodes", "wanderlist", "admin"];

const PRESET_CATEGORIES = [
  "Full Stack",
  "AI / ML",
  "Frontend",
  "Cloud & DevOps",
  "Mobile",
  "Dev Tools",
  "Open Source",
];

const PRESET_STATUSES = ["Live Demo", "In Production", "Beta", "In Development", "Open Source"];

const SUGGESTED_SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "WebSockets",
  "OpenAI API",
  "GraphQL",
  "Prisma",
  "Stripe API",
  "AWS",
  "Vercel",
];

function GateScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (VALID_PASSCODES.includes(value.trim().toLowerCase())) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-[var(--surface)] border-2 border-[var(--yellow)] p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[var(--yellow)]" />
          <p className="mono-label text-[10px] text-[var(--yellow)] font-bold">
            Creator Studio Access
          </p>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-2">
          ADMIN
          <br />
          AUTHENTICATION.
        </h1>
        <p className="text-xs text-[var(--muted)] mb-6">
          Enter your admin passcode to manage, upload, or edit showcase projects.
        </p>

        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Enter Passcode (e.g. builtbysoumen)"
          className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
        />

        {error && (
          <p className="mt-3 text-xs text-red-400 font-medium">
            Incorrect passcode. Passcode: "builtbysoumen" or "admin".
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--yellow)] text-black font-black text-sm py-3.5 hover:brightness-110 shadow-lg shadow-[var(--yellow)]/20 transition cursor-pointer"
        >
          UNLOCK STUDIO
        </button>
      </motion.form>
    </div>
  );
}

function ProjectForm({ editingProject, onCancelEdit, onSaved }) {
  const { addCard, updateCard } = useCards();
  const fileRef = useRef(null);

  // Form states
  const [title, setTitle] = useState(editingProject?.title || "");
  const [tagline, setTagline] = useState(editingProject?.tagline || "");
  const [description, setDescription] = useState(editingProject?.description || "");
  const [problemStatement, setProblemStatement] = useState(editingProject?.problemStatement || "");
  const [solution, setSolution] = useState(editingProject?.solution || "");
  const [category, setCategory] = useState(editingProject?.category || "Full Stack");
  const [status, setStatus] = useState(editingProject?.status || "Live Demo");
  const [date, setDate] = useState(editingProject?.date || new Date().toISOString().slice(0, 7));
  const [liveUrl, setLiveUrl] = useState(editingProject?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(editingProject?.githubUrl || "");

  // Photos state (Array of images)
  const [images, setImages] = useState(
    editingProject?.images && editingProject.images.length > 0
      ? editingProject.images
      : editingProject?.image
      ? [editingProject.image]
      : []
  );

  const [customImageUrl, setCustomImageUrl] = useState("");
  const [skills, setSkills] = useState(
    Array.isArray(editingProject?.skills)
      ? editingProject.skills
      : editingProject?.skills
      ? String(editingProject.skills).split(",").map((s) => s.trim())
      : ["Next.js", "React", "TypeScript"]
  );
  const [skillInput, setSkillInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);

  // Read single or multiple files
  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const readers = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        if (!file.type.startsWith("image/")) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setImages((prev) => [...prev, ...valid]);
      }
    });
  }

  function handleAddImageUrl(e) {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
  }

  function removeImage(indexToRemove) {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  function setCoverImage(index) {
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  }

  function addSkillTag(tag) {
    const trimmed = tag.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
  }

  function handleSkillKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkillTag(skillInput);
      setSkillInput("");
    }
  }

  function removeSkill(skillToRemove) {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0 || !title.trim() || !tagline.trim()) {
      setToast({
        type: "error",
        msg: "Please provide at least 1 image, a title, and a 2-line description.",
      });
      return;
    }

    const payload = {
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      problemStatement: problemStatement.trim(),
      solution: solution.trim(),
      category: category.trim() || "Full Stack",
      status: status.trim() || "Live Demo",
      date: date.trim() || new Date().toISOString().slice(0, 7),
      image: images[0],
      images: images,
      skills: skills,
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
    };

    if (editingProject) {
      updateCard(editingProject.id, payload);
      setToast({ type: "success", msg: "Project updated successfully!" });
      setTimeout(() => {
        onSaved?.();
      }, 1000);
    } else {
      addCard(payload);
      setToast({ type: "success", msg: "Project published to showcase!" });
      // Reset form
      setImages([]);
      setTitle("");
      setTagline("");
      setDescription("");
      setProblemStatement("");
      setSolution("");
      setLiveUrl("");
      setGithubUrl("");
      setSkills(["Next.js", "React", "TypeScript"]);
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-[var(--surface)] border-2 border-[var(--yellow)] p-6 md:p-8 flex flex-col gap-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mono-label text-[10px] text-[var(--yellow)] mb-1">
            {editingProject ? "Editing Project" : "New Project Upload"}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {editingProject ? "EDIT PROJECT" : "UPLOAD PROJECT."}
          </h2>
        </div>
        {editingProject && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="mono-label text-[10px] px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition"
          >
            Cancel Edit ✕
          </button>
        )}
      </div>

      {/* 1. Multi-photo Upload & Gallery Manager */}
      <div className="flex flex-col gap-2">
        <label className="mono-label text-[10px] text-[var(--muted)] flex items-center justify-between">
          <span>Project Photos & Screenshots ({images.length} added)</span>
          <span className="text-[var(--yellow)] font-bold">First image is Cover</span>
        </label>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? "border-[var(--yellow)] bg-[var(--yellow)]/10 scale-[1.01]"
              : "border-[var(--line)] hover:border-[var(--muted)] bg-black/30"
          }`}
        >
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center text-[var(--yellow)] text-xl font-bold">
              +
            </div>
            <p className="text-sm font-bold text-white mb-1">
              Drop screenshots or click to browse
            </p>
            <p className="mono-label text-[9px] text-[var(--muted)]">
              PNG, JPG, WEBP — Select single or multiple files
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Custom Image URL adder */}
        <div className="flex gap-2 mt-1">
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="Or paste an image / mockup URL (e.g. Unsplash or Cloudinary)..."
            className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:border-[var(--yellow)] transition"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="mono-label text-[10px] px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition cursor-pointer"
          >
            Add URL
          </button>
        </div>

        {/* Thumbnail Preview Strip */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-neutral-900"
              >
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    {idx === 0 ? (
                      <span className="mono-label text-[7px] px-1.5 py-0.5 rounded bg-[var(--yellow)] text-black font-bold">
                        COVER
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCoverImage(idx)}
                        className="mono-label text-[7px] px-1.5 py-0.5 rounded bg-black/80 text-white hover:bg-[var(--yellow)] hover:text-black transition"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="mono-label text-[8px] text-red-400 hover:text-red-300 px-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Title & Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)]">Project Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. DevPulse — Real-Time Cloud Infrastructure Monitor"
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-bold outline-none focus:border-[var(--yellow)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs font-bold outline-none focus:border-[var(--yellow)] transition-colors text-white"
          >
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-black text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. 2-Line Tagline / Short Description */}
      <div className="flex flex-col gap-1.5">
        <label className="mono-label text-[10px] text-[var(--muted)] flex items-center justify-between">
          <span>Card Tagline (2-line summary for discovery grid)</span>
          <span className="text-[var(--yellow)]">{tagline.length} chars</span>
        </label>
        <textarea
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="A unified telemetry dashboard monitoring Kubernetes clusters, serverless metrics, and distributed microservice logs with real-time alerting."
          rows={2}
          className="resize-none rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--yellow)] transition-colors"
        />
      </div>

      {/* 4. Live URL & GitHub URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Website / Demo Link (Vercel, etc.)
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://my-app.vercel.app"
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs outline-none focus:border-[var(--yellow)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/soumenjs/project-repo"
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs outline-none focus:border-[var(--yellow)] transition-colors"
          />
        </div>
      </div>

      {/* 5. Problem Statement (Detailed) */}
      <div className="flex flex-col gap-1.5">
        <label className="mono-label text-[10px] text-[var(--muted)]">
          Problem Statement (Why you built this / What problem it solves)
        </label>
        <textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Engineering teams frequently struggle with fragmented monitoring tools leading to slow incident response and developer fatigue..."
          rows={3}
          className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--yellow)] transition-colors"
        />
      </div>

      {/* 6. Solution & Architecture (Detailed) */}
      <div className="flex flex-col gap-1.5">
        <label className="mono-label text-[10px] text-[var(--muted)]">
          Solution & Key Technical Choices
        </label>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Engineered an event-driven architecture with Next.js 16, ClickHouse time-series data, and WebSocket log tails for sub-second latency..."
          rows={3}
          className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--yellow)] transition-colors"
        />
      </div>

      {/* 7. Skills / Tech Stack Tag Adder */}
      <div className="flex flex-col gap-2">
        <label className="mono-label text-[10px] text-[var(--muted)]">
          Skills & Technologies ({skills.length} tagged)
        </label>

        {/* Added skill tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="mono-label text-[9px] px-2.5 py-1 rounded-md bg-white/10 text-white flex items-center gap-1.5 font-bold"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-[var(--muted)] hover:text-red-400 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          placeholder="Type skill & press Enter (e.g. Next.js, Docker, WebSockets)..."
          className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-xs outline-none focus:border-[var(--yellow)] transition-colors"
        />

        {/* Preset quick suggestions */}
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="mono-label text-[8px] text-[var(--muted)] mr-1 self-center">
            Quick add:
          </span>
          {SUGGESTED_SKILLS.slice(0, 10).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSkillTag(s)}
              className="mono-label text-[8px] px-2 py-0.5 rounded bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/15 transition cursor-pointer"
            >
              +{s}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Status & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)]">Project Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs font-bold outline-none focus:border-[var(--yellow)] transition-colors text-white"
          >
            {PRESET_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-black text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="mono-label text-[10px] text-[var(--muted)]">Release Date</label>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-xs font-bold outline-none focus:border-[var(--yellow)] transition-colors text-white"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 rounded-xl bg-[var(--yellow)] text-black font-black text-sm py-4 hover:brightness-110 shadow-lg shadow-[var(--yellow)]/20 transition cursor-pointer"
      >
        {editingProject ? "SAVE CHANGES TO PROJECT" : "PUBLISH PROJECT TO SHOWCASE"}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl text-xs font-bold text-center ${
              toast.type === "error"
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function ManageList({ onEditProject }) {
  const { cards, deleteCard, resetToSeed, importData } = useCards();
  const [search, setSearch] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.tagline?.toLowerCase().includes(q)
    );
  }, [cards, search]);

  const handleExport = () => {
    const jsonStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `builtbysoumen_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importData(event.target.result);
      if (res.success) {
        setImportStatus(`Successfully restored ${res.count} projects!`);
      } else {
        setImportStatus(`Import failed: ${res.error}`);
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-3xl bg-[var(--surface)] border-2 border-[var(--line)] p-6 md:p-8 flex flex-col gap-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mono-label text-[10px] text-[var(--yellow)] mb-1">
            {cards.length} Projects Live
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            PROJECT VAULT.
          </h2>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="mono-label text-[9px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            title="Download JSON backup"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mono-label text-[9px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            title="Restore from JSON backup"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={() => {
              if (confirm("Reset all projects back to the default portfolio showcase seeds?")) {
                resetToSeed();
              }
            }}
            className="mono-label text-[9px] px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
          >
            Reset Seed
          </button>
        </div>
      </div>

      {importStatus && (
        <p className="mono-label text-[10px] text-[var(--yellow)] p-2 rounded-lg bg-[var(--yellow)]/10 text-center font-bold">
          {importStatus}
        </p>
      )}

      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter project list..."
        className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-xs outline-none focus:border-[var(--yellow)] transition"
      />

      {/* Projects List */}
      <div className="flex flex-col divide-y divide-[var(--line)] max-h-[640px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 py-4 group"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-14 w-20 rounded-xl object-cover flex-shrink-0 border border-[var(--line)] bg-neutral-900"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate text-white group-hover:text-[var(--yellow)] transition-colors">
                  {card.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="mono-label text-[8px] text-[var(--yellow)] font-bold">
                    {card.category}
                  </span>
                  <span className="text-[var(--muted)] text-[8px]">·</span>
                  <span className="mono-label text-[8px] text-[var(--muted)]">
                    {card.date}
                  </span>
                  {card.liveUrl && (
                    <span className="mono-label text-[8px] text-emerald-400 font-bold hidden sm:inline">
                      · Live
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/project/${card.id}`}
                  target="_blank"
                  className="mono-label text-[9px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition"
                >
                  View ↗
                </Link>

                <button
                  type="button"
                  onClick={() => onEditProject(card)}
                  className="mono-label text-[9px] px-2.5 py-1 rounded bg-[var(--yellow)]/10 text-[var(--yellow)] hover:bg-[var(--yellow)] hover:text-black font-bold transition cursor-pointer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete project "${card.title}"?`)) {
                      deleteCard(card.id);
                    }
                  }}
                  className="mono-label text-[9px] px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCards.length === 0 && (
          <p className="py-12 text-center text-xs text-[var(--muted)] font-bold">
            NO PROJECTS FOUND.
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleEdit = (project) => {
    setEditingProject(project);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />

      {!unlocked ? (
        <GateScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <section className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--line)]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="mono-label text-[11px] text-[var(--yellow)] font-bold">
                  Creator Studio & CMS
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                MANAGE <span className="text-[var(--yellow)]">PORTFOLIO.</span>
              </h1>
            </div>

            <Link
              href="/"
              className="mono-label text-[10px] px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition self-start sm:self-auto"
            >
              ← Back to Live Showcase
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <ProjectForm
              key={editingProject?.id || "new"}
              editingProject={editingProject}
              onCancelEdit={() => setEditingProject(null)}
              onSaved={() => setEditingProject(null)}
            />
            <ManageList onEditProject={handleEdit} />
          </div>
        </section>
      )}
    </div>
  );
}

