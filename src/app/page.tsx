import SiteShell from "@/components/SiteShell";
import VibeQuiz from "@/components/VibeQuiz";
import { siteUrl } from "@/lib/share";

export default function Home() {
  return (
    <SiteShell>
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="hns-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3.5 py-1.5 text-xs text-muted">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
          Powered by Harness Vibe Mode
        </span>
        <h1
          className="hns-rise mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          Deploy your day with a <span className="hns-gradient-text">canary</span> first.
        </h1>
        <p
          className="hns-rise mx-auto mt-6 max-w-xl text-pretty text-lg text-muted"
          style={{ animationDelay: "160ms" }}
        >
          Five questions. Four vibe signals. One animated canary that tells you whether today is
          safe to promote to production.
        </p>
      </div>

      <div className="mt-14 hns-rise" style={{ animationDelay: "240ms" }}>
        <VibeQuiz origin={siteUrl()} />
      </div>
    </SiteShell>
  );
}
