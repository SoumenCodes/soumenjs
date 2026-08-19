"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { SEED_CARDS } from "@/data/seed";

const STORAGE_KEY = "wanderlist_cards_v1";

const CardsContext = createContext(null);

export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [ready, setReady] = useState(false);

  // Load once on mount, seeding on first run.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCards(JSON.parse(raw));
      } else {
        setCards(SEED_CARDS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CARDS));
      }
    } catch (err) {
      console.error("Failed to load cards from storage", err);
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
      console.error("Failed to save cards to storage", err);
    }
  }, []);

  const addCard = useCallback(
    (card) => {
      const withId = {
        id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString().slice(0, 10),
        ...card,
      };
      persist([withId, ...cards]);
      return withId;
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

  return (
    <CardsContext.Provider
      value={{ cards, ready, addCard, deleteCard, resetToSeed }}
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
