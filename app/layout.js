import "./globals.css";
import { CardsProvider } from "@/lib/cards-context";

export const metadata = {
  title: "BuiltBySoumen — Personal Project Showcase Platform",
  description:
    "Explore full-stack applications, developer tooling, and AI platforms built by Soumen. View architecture breakdowns, live deployments, and source repositories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] antialiased">
        <div className="noise-overlay" aria-hidden />
        <CardsProvider>{children}</CardsProvider>
      </body>
    </html>
  );
}
