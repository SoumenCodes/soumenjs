# ⌨️ `<Typewriter />` Component Guide

A versatile, unopinionated typing animation component for Next.js and React. It comes with zero hardcoded font sizes or layout constraints, allowing you to style it freely anywhere across your project.

---

## 🚀 Quick Start

### 1. Import the Component
```jsx
import Typewriter from "@/components/Typewriter";
```

### 2. Simple Single Line (`simple` mode)
Types out once and remains on screen (does not delete):

```jsx
<p className="text-sm font-mono text-neutral-400">
  <Typewriter simple>
    Full-stack developer building *scalable cloud systems*.
  </Typewriter>
</p>
```

---

## 🎨 Highlighting Words in Purple

Wrap any word or phrase in `*asterisks*` to highlight it in purple (or your custom highlight color):

```jsx
<h2 className="text-2xl font-bold text-white">
  <Typewriter simple>
    Engineered with *Next.js 16*, *TypeScript*, and *Tailwind CSS*.
  </Typewriter>
</h2>
```

---

## 🔄 Multi-Line & Rotating Phrases

To rotate between multiple phrases or lines, separate each phrase block with `---`:

```jsx
<h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight">
  <Typewriter>
    {`PROJECTS.
    *BUILT TO SOLVE*
    REAL PROBLEMS.
    ---
    PLACES
    *WORTH*
    REMEMBERING.
    ---
    IDEAS.
    *TRANSFORMED INTO*
    PRODUCTION CODE.`}
  </Typewriter>
</h1>
```

---

## 🛠️ Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `string` / `ReactNode` | `undefined` | The text to type out. Use `*word*` for purple highlights and `---` to separate rotating phrases. |
| `phrases` | `Array` | `[]` | Optional array of phrases if passing data programmatically. |
| `simple` | `boolean` | `false` | When `true`, types once and stays without deleting (shorthand for single phrases). |
| `loop` | `boolean` | `!simple` | Whether to loop through phrases continuously. |
| `typingSpeed` | `number` | `50` | Typing delay per character in milliseconds. |
| `deletingSpeed` | `number` | `25` | Backspacing speed per character in milliseconds. |
| `pauseTime` | `number` | `2600` | Delay in milliseconds before deleting a completed phrase. |
| `className` | `string` | `""` | Additional CSS/Tailwind classes for the container. |
| `highlightClassName` | `string` | `"text-[var(--yellow)]"` | Class for highlighted text (defaults to the purple theme color). |
| `cursorClassName` | `string` | `""` | Custom Tailwind classes for the blinking cursor bar. |
| `showCursor` | `boolean` | `true` | Whether to display the blinking cursor. |
| `hideCursorOnComplete`| `boolean` | `false` | Hides the blinking cursor after `simple` mode finishes typing. |

---

## 💡 Practical Examples

### Example 1: Terminal / Code Badge
```jsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 font-mono text-xs text-white">
  <span className="text-emerald-400">$</span>
  <Typewriter simple typingSpeed={40}>
    npm run build -- *production*
  </Typewriter>
</div>
```

### Example 2: Subtitle with Custom Purple Shade
```jsx
<p className="text-lg text-neutral-300">
  <Typewriter
    simple
    highlightClassName="text-purple-400 font-bold"
    typingSpeed={45}
  >
    Specialized in *Distributed Systems* and *AI Engineering*.
  </Typewriter>
</p>
```

### Example 3: Infinite Looping Feature List
```jsx
<span className="text-base font-semibold text-white">
  <Typewriter pauseTime={2000}>
    {`Zero-latency *WebSockets*
    ---
    Sub-second *Edge Caching*
    ---
    Self-healing *Kubernetes Clusters*`}
  </Typewriter>
</span>
```

---

## 📏 Auto-Scaling Cursor Note

The cursor uses CSS `em` units (`w-[0.08em] h-[0.82em]`), meaning it **automatically scales proportionally** to whatever font-size you apply (from `text-xs` up to `text-9xl`), with zero configuration needed.