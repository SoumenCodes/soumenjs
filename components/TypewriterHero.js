"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHRASES = [
  {
    line1: "PROJECTS.",
    line2: "BUILT TO SOLVE",
    line3: "REAL PROBLEMS.",
  },
  {
    line1: "PLACES",
    line2: "WORTH",
    line3: "REMEMBERING.",
  },
];

export default function TypewriterHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhrase = PHRASES[phraseIndex];
  const { line1, line2, line3 } = currentPhrase;

  const totalLength = line1.length + line2.length + line3.length;

  useEffect(() => {
    if (isPaused) return;

    // Typing speed & backspacing speed
    const typingSpeed = isDeleting ? 25 : 50;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < totalLength) {
          setCharIndex((prev) => prev + 1);
        } else {
          // Finished typing all 3 lines, pause before deleting
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 6800);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
          }, 400);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, isPaused, totalLength]);

  // Compute text slices for line 1, line 2, line 3
  const l1End = line1.length;
  const l2End = l1End + line2.length;

  let text1 = "";
  let text2 = "";
  let text3 = "";
  let activeLine = 1;

  if (charIndex <= l1End) {
    text1 = line1.slice(0, charIndex);
    activeLine = 1;
  } else if (charIndex <= l2End) {
    text1 = line1;
    text2 = line2.slice(0, charIndex - l1End);
    activeLine = 2;
  } else {
    text1 = line1;
    text2 = line2;
    text3 = line3.slice(0, charIndex - l2End);
    activeLine = 3;
  }

  return (
    <div className="flex flex-col select-none min-h-[170px] sm:min-h-[220px] md:min-h-[270px] lg:min-h-[320px] justify-start">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tighter max-w-5xl"
      >
        {/* Line 1 */}
        <div className="min-h-[1.02em] flex items-baseline">
          <span className="text-white">{text1}</span>
          {activeLine === 1 && (
            <span className="inline-block w-[3px] sm:w-[4px] md:w-[6px] h-[0.78em] bg-[var(--yellow)] ml-1.5 align-baseline animate-pulse shadow-[0_0_14px_var(--yellow)]" />
          )}
        </div>

        {/* Line 2 (Highlighted) */}
        <div className="min-h-[1.02em] flex items-baseline">
          <span className="text-[var(--yellow)]">{text2}</span>
          {activeLine === 2 && (
            <span className="inline-block w-[3px] sm:w-[4px] md:w-[6px] h-[0.78em] bg-[var(--yellow)] ml-1.5 align-baseline animate-pulse shadow-[0_0_14px_var(--yellow)]" />
          )}
        </div>

        {/* Line 3 */}
        <div className="min-h-[1.02em] flex items-baseline">
          <span className="text-white">{text3}</span>
          {activeLine === 3 && (
            <span className="inline-block w-[3px] sm:w-[4px] md:w-[6px] h-[0.78em] bg-[var(--yellow)] ml-1.5 align-baseline animate-pulse shadow-[0_0_14px_var(--yellow)]" />
          )}
        </div>
      </motion.h1>
    </div>
  );
}