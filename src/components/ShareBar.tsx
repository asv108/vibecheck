"use client";

import { useState, useSyncExternalStore } from "react";
import type { VibeResult } from "@/lib/vibe";
import { shareSummary, shareTargets, shareText } from "@/lib/share";

const ICONS: Record<string, string> = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  linkedin:
    "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z",
  bluesky:
    "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.789.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8",
};

/** navigator.share support can't change mid-session, so there's nothing to watch. */
const NO_SUBSCRIBE = () => () => {};

function BrandIcon({ id }: { id: string }) {
  const path = ICONS[id];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
      <path d={path} />
    </svg>
  );
}

export default function ShareBar({ result, url }: { result: VibeResult; url: string }) {
  const [copied, setCopied] = useState<"link" | "summary" | null>(null);

  // navigator.share doesn't exist during SSR, so it's read through
  // useSyncExternalStore: false on the server, real value once hydrated. It
  // never changes, hence the no-op subscribe.
  const canNativeShare = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => typeof navigator.share === "function",
    () => false,
  );

  const text = shareText(result);

  const copy = async (kind: "link" | "summary") => {
    const payload = kind === "link" ? url : `${shareSummary(result)}\n${url}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${result.persona.name} — vibecheck`, text, url });
    } catch {
      // The user dismissed the sheet. Nothing to recover from.
    }
  };

  return (
    <div className="mt-8 border-t border-line pt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Share your canary
      </p>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {shareTargets(url, text).map((target) => (
          <a
            key={target.id}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <BrandIcon id={target.id} />
            {target.label}
          </a>
        ))}

        {canNativeShare && (
          <button
            onClick={nativeShare}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
              <path d="M13 3.83 15.59 6.4 17 4.99 12 0 7 4.99 8.41 6.4 11 3.83V15h2zM20 9h-4v2h3v9H5v-9h3V9H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1" />
            </svg>
            More…
          </button>
        )}

        <button
          onClick={() => copy("link")}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
        >
          {copied === "link" ? "Link copied ✓" : "Copy link"}
        </button>

        <button
          onClick={() => copy("summary")}
          className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-foreground"
        >
          {copied === "summary" ? "Copied ✓" : "Copy as text"}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Anyone opening your link sees this exact canary, animated, with the same scores.
      </p>
    </div>
  );
}
