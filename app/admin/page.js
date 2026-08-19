"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useCards } from "@/lib/cards-context";

const ADMIN_PASSCODE = "wanderlist";

function GateScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (value.trim().toLowerCase() === ADMIN_PASSCODE) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl bg-[var(--surface)] border-2 border-[var(--yellow)] p-8"
      >
        <p className="mono-label text-[10px] text-[var(--yellow)] mb-3">
          Admin desk
        </p>
        <h1 className="text-3xl font-black tracking-tight mb-6">
          ENTER
          <br />
          PASSCODE.
        </h1>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Passcode"
          className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
        />
        {error && (
          <p className="mt-3 text-xs text-[var(--muted)] font-medium">
            Wrong. Try "wanderlist" (demo only).
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--yellow)] text-black font-black text-sm py-3 hover:brightness-110 transition"
        >
          UNLOCK
        </button>
      </motion.form>
    </div>
  );
}

function UploadForm() {
  const { addCard } = useCards();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coords, setCoords] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);

  function readFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    readFile(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!preview || !title.trim() || !description.trim()) {
      setToast({ type: "error", msg: "Image + title + description required." });
      return;
    }
    addCard({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "Uncategorised",
      coords: coords.trim(),
      image: preview,
    });
    setPreview(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setCoords("");
    if (fileRef.current) fileRef.current.value = "";
    setToast({ type: "success", msg: "Added." });
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-[var(--surface)] border-2 border-[var(--yellow)] p-6 md:p-8 flex flex-col gap-5"
    >
      <div>
        <p className="mono-label text-[10px] text-[var(--yellow)] mb-1">
          New card
        </p>
        <h2 className="text-3xl font-black tracking-tight">
          ADD A PLACE.
        </h2>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          dragActive
            ? "border-[var(--yellow)] bg-[var(--yellow)]/5 scale-[1.02]"
            : "border-[var(--line)] hover:border-[var(--muted)]"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="text-center px-4">
            <p className="text-4xl font-black text-[var(--muted)] mb-2">+</p>
            <p className="mono-label text-[10px] text-[var(--muted)]">
              Drop image or click
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => readFile(e.target.files?.[0])}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="mono-label text-[10px] text-[var(--muted)]">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Salar de Uyuni"
          className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="mono-label text-[10px] text-[var(--muted)]">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Keep it short."
          rows={2}
          className="resize-none rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="mono-label text-[10px] text-[var(--muted)]">
            Category
          </span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Coastline"
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="mono-label text-[10px] text-[var(--muted)]">
            Coords
          </span>
          <input
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            placeholder="41.9N 12.5E"
            className="rounded-xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--yellow)] transition-colors"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-xl bg-[var(--yellow)] text-black font-black text-sm py-3 hover:brightness-110 transition"
      >
        ADD CARD
      </button>

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs font-bold ${
              toast.type === "error" ? "text-[var(--muted)]" : "text-[var(--yellow)]"
            }`}
          >
            {toast.msg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function ManageList() {
  const { cards, deleteCard, resetToSeed } = useCards();

  return (
    <div className="rounded-3xl bg-[var(--surface)] border-2 border-[var(--line)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="mono-label text-[10px] text-[var(--yellow)] mb-1">
            {cards.length} filed
          </p>
          <h2 className="text-3xl font-black tracking-tight">
            ALL CARDS.
          </h2>
        </div>
        <button
          onClick={resetToSeed}
          className="mono-label text-[9px] text-[var(--muted)] hover:text-[var(--yellow)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col divide-y divide-[var(--line)] max-h-[520px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-4 py-4"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-14 w-14 rounded-xl object-cover flex-shrink-0 border-2 border-[var(--line)]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{card.title}</p>
                <p className="mono-label text-[9px] text-[var(--muted)] truncate">
                  {card.category} · {card.date}
                </p>
              </div>
              <button
                onClick={() => deleteCard(card.id)}
                className="mono-label text-[9px] text-[var(--muted)] hover:text-[var(--yellow)] transition-colors flex-shrink-0 font-bold"
              >
                X
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {cards.length === 0 && (
          <p className="py-10 text-center text-sm text-[var(--muted)] font-bold">
            NOTHING HERE.
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      {!unlocked ? (
        <GateScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <section className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-16">
          <p className="mono-label text-[11px] text-[var(--yellow)] mb-3">
            Admin desk
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-10">
            MANAGE
            <br />
            <span className="text-[var(--yellow)]">THE collection.</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <UploadForm />
            <ManageList />
          </div>
        </section>
      )}
    </div>
  );
}
