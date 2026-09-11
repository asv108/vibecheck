import Link from "next/link";
import type { ReactNode } from "react";

const NAV = ["Platform", "Solutions", "Pricing", "Docs"];

/** Nav, ambient background and footer. Shared by the quiz and shared-result pages. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-full flex-col overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hns-glow absolute inset-x-0 top-0 h-[520px]" />
        <div className="hns-grid absolute inset-0" />
      </div>

      {/* Nav */}
      <header className="border-b border-line/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-blue to-violet text-sm font-bold text-white">
              V
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              vibe<span className="text-muted">check</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            {NAV.map((item) => (
              <span key={item} className="cursor-default transition hover:text-foreground">
                {item}
              </span>
            ))}
          </nav>
          <span className="rounded-full border border-line bg-white/5 px-3 py-1.5 font-mono text-[11px] text-muted">
            vibe mode
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-16 sm:pt-24">{children}</main>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted sm:flex-row">
          <span>vibecheck — a sample app for testing Harness Vibe mode.</span>
          <span className="font-mono">no canaries were harmed</span>
        </div>
      </footer>
    </div>
  );
}
