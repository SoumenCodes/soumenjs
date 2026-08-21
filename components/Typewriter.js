"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * Parses a string into text segments with *highlighted* or [highlighted] words.
 */
function parseTextToSegments(text) {
  const regex = /(\*([^*]+)\*|\[([^\]]+)\])/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        highlight: false,
      });
    }
    const highlightedText = match[2] || match[3];
    segments.push({
      text: highlightedText,
      highlight: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

/**
 * Universal Typewriter Component
 *
 * Supports wrapping text in children with markdown `*purple text*`:
 *
 * @example Simple single line:
 * <Typewriter simple>Hello *World*</Typewriter>
 *
 * @example Multi-line wrapped text:
 * <Typewriter>
 *   {`PROJECTS.
 *   *BUILT TO SOLVE*
 *   REAL PROBLEMS.`}
 * </Typewriter>
 *
 * @example Rotating phrases separated by `---`:
 * <Typewriter>
 *   {`PROJECTS.
 *   *BUILT TO SOLVE*
 *   REAL PROBLEMS.
 *   ---
 *   PLACES
 *   *WORTH*
 *   REMEMBERING.`}
 * </Typewriter>
 *
 * @example Prop-based phrases:
 * <Typewriter phrases={["First phrase", "Second *highlighted* phrase"]} />
 */
export default function Typewriter({
  children,
  phrases,
  simple = false,
  loop = !simple,
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseTime = 2600,
  className = "",
  highlightClassName = "text-[var(--yellow)]",
  cursorClassName = "",
  showCursor = true,
  hideCursorOnComplete = false,
}) {
  // Normalize input from children or phrases prop
  const normalizedPhrases = useMemo(() => {
    let rawPhrases = [];

    if (children) {
      const childStr = typeof children === "string" ? children : String(children);
      // Split by `---` for multi-phrase cycling
      if (childStr.includes("---")) {
        rawPhrases = childStr.split("---").map((p) => p.trim()).filter(Boolean);
      } else {
        rawPhrases = [childStr.trim()];
      }
    } else if (phrases && Array.isArray(phrases)) {
      rawPhrases = phrases;
    }

    return rawPhrases.map((p) => {
      // If phrase is an object with { lines }
      if (typeof p === "object" && p !== null && p.lines && Array.isArray(p.lines)) {
        return p.lines.map((l, i) => {
          if (typeof l === "string") {
            return {
              segments: parseTextToSegments(l),
            };
          }
          return {
            segments: [{ text: l.text || "", highlight: !!l.highlight }],
          };
        });
      }

      // If phrase is an object with { line1, line2, line3 }
      if (typeof p === "object" && p !== null && p.line1 !== undefined) {
        return [
          { segments: parseTextToSegments(p.line1 || "") },
          { segments: [{ text: p.line2 || "", highlight: p.highlight !== undefined ? p.highlight === 2 : true }] },
          { segments: parseTextToSegments(p.line3 || "") },
        ].filter((line) => line.segments.some((s) => s.text.length > 0));
      }

      // String phrase (may contain multiple lines with \n)
      const str = String(p);
      const lines = str
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      return lines.map((line) => ({
        segments: parseTextToSegments(line),
      }));
    });
  }, [children, phrases]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentLines = normalizedPhrases[phraseIndex] || [];

  // Calculate total characters in current phrase
  const totalLength = useMemo(() => {
    return currentLines.reduce((acc, line) => {
      return acc + line.segments.reduce((segAcc, s) => segAcc + s.text.length, 0);
    }, 0);
  }, [currentLines]);

  useEffect(() => {
    if (normalizedPhrases.length === 0 || isPaused || isComplete) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < totalLength) {
          setCharIndex((prev) => prev + 1);
        } else {
          // Finished typing all characters in this phrase
          if (!loop && phraseIndex === normalizedPhrases.length - 1) {
            setIsComplete(true);
            return;
          }

          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else {
          // Finished deleting, switch to next phrase
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % normalizedPhrases.length);
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
          }, 350);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [
    charIndex,
    isDeleting,
    isPaused,
    isComplete,
    totalLength,
    normalizedPhrases.length,
    phraseIndex,
    loop,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  if (normalizedPhrases.length === 0) return null;

  // Calculate typed text for every segment across all lines
  let remainingChars = charIndex;
  const isMultiLine = currentLines.length > 1;

  const renderedLines = currentLines.map((line, lineIdx) => {
    let isLineActive = false;

    const renderedSegments = line.segments.map((segment) => {
      let text = "";

      if (remainingChars <= 0) {
        text = "";
      } else if (remainingChars < segment.text.length) {
        text = segment.text.slice(0, remainingChars);
        isLineActive = true;
        remainingChars = 0;
      } else {
        text = segment.text;
        remainingChars -= segment.text.length;
        if (remainingChars === 0) {
          isLineActive = true;
        }
      }

      return {
        text,
        highlight: segment.highlight,
      };
    });

    if (lineIdx === currentLines.length - 1 && charIndex >= totalLength) {
      isLineActive = true;
    }

    return {
      segments: renderedSegments,
      isLineActive,
    };
  });

  const shouldRenderCursor = showCursor && (!isComplete || !hideCursorOnComplete);

  const defaultCursor = (
    <span
      className={`inline-block w-[0.08em] h-[0.82em] bg-[var(--yellow)] ml-[0.1em] align-baseline animate-pulse shadow-[0_0_12px_var(--yellow)] ${cursorClassName}`}
    />
  );

  return (
    <span className={`inline-block ${className}`}>
      {renderedLines.map((line, lIdx) => {
        const lineContent = (
          <>
            {line.segments.map((seg, sIdx) => (
              <span key={sIdx} className={seg.highlight ? highlightClassName : undefined}>
                {seg.text}
              </span>
            ))}
            {shouldRenderCursor && line.isLineActive && defaultCursor}
          </>
        );

        if (isMultiLine) {
          return (
            <div key={lIdx} className="min-h-[1.02em] flex items-baseline">
              {lineContent}
            </div>
          );
        }

        return <span key={lIdx}>{lineContent}</span>;
      })}
    </span>
  );
}