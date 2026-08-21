"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { SEED_CARDS } from "@/data/seed";

const STORAGE_KEY = "builtbysoumen_projects_v2";

const CardsContext = createContext(null);

export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [ready, setReady] = useState(false);

  // Load once on mount, seeding on first run.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
        } else {
          setCards(SEED_CARDS);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CARDS));
        }
      } else {
        setCards(SEED_CARDS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CARDS));
      }
    } catch (err) {
      console.error("Failed to load projects from storage", err);
      setCards(SEED_CARDS);
    }
    setReady(true);
  }, []);

  // Keep tabs in sync with each other.
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCards(JSON.parse(e.newValue));
        } catch {
          // ignore malformed payloads from other tabs
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const persist = useCallback((next) => {
    setCards(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save projects to storage", err);
    }
  }, []);

  const addCard = useCallback(
    (card) => {
      const withId = {
        id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: card.date || new Date().toISOString().slice(0, 7),
        status: card.status || "Live Demo",
        images: card.images && card.images.length > 0 ? card.images : [card.image],
        skills: Array.isArray(card.skills) ? card.skills : (card.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
        ...card,
      };
      persist([withId, ...cards]);
      return withId;
    },
    [cards, persist]
  );

  const updateCard = useCallback(
    (id, updatedData) => {
      const next = cards.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...updatedData,
            images: updatedData.images && updatedData.images.length > 0 ? updatedData.images : (updatedData.image ? [updatedData.image] : c.images),
            skills: Array.isArray(updatedData.skills)
              ? updatedData.skills
              : (updatedData.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
          };
        }
        return c;
      });
      persist(next);
    },
    [cards, persist]
  );

  const deleteCard = useCallback(
    (id) => {
      persist(cards.filter((c) => c.id !== id));
    },
    [cards, persist]
  );

  const resetToSeed = useCallback(() => {
    persist(SEED_CARDS);
  }, [persist]);

  const importData = useCallback(
    (jsonData) => {
      try {
        const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        if (Array.isArray(parsed)) {
          persist(parsed);
          return { success: true, count: parsed.length };
        }
        return { success: false, error: "Invalid JSON format: expected an array of projects." };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [persist]
  );

  return (
    <CardsContext.Provider
      value={{
        cards,
        ready,
        addCard,
        updateCard,
        deleteCard,
        resetToSeed,
        importData,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
}

export function useCards() {
  const ctx = useContext(CardsContext);
  if (!ctx) throw new Error("useCards must be used within CardsProvider");
  return ctx;
}

