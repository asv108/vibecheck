import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import SiteShell from "@/components/SiteShell";
import { resultFromShareCode, sharePath, siteUrl } from "@/lib/share";

export async function generateMetadata({ params }: PageProps<"/c/[code]">): Promise<Metadata> {
  const { code } = await params;
  const result = resultFromShareCode(code);
  if (!result) return { title: "Canary not found — vibecheck" };

  const { persona, score } = result;
  const title = `${persona.name} — ${score}/100`;
  const description = `${persona.tagline}. ${persona.verdict}. Run your own vibe check.`;

  return {
    title: `${title} · vibecheck`,
    description,
    openGraph: {
      title,
      description,
      url: sharePath(code),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedCanaryPage({ params }: PageProps<"/c/[code]">) {
  const { code } = await params;
  const result = resultFromShareCode(code);
  if (!result) notFound();

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl text-center">
        <span className="hns-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3.5 py-1.5 text-xs text-muted">
          <span className="size-1.5 rounded-full bg-cyan" />
          Shared vibe check
        </span>
        <h1
          className="hns-rise mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          Someone&apos;s day came back as a{" "}
          <span className="hns-gradient-text">{result.persona.name}</span>.
        </h1>
        <p
          className="hns-rise mx-auto mt-5 max-w-xl text-pretty text-muted"
          style={{ animationDelay: "160ms" }}
        >
          Five questions, four vibe signals. Scroll past the bird to run your own.
        </p>
      </div>

      <div className="mt-12 hns-rise" style={{ animationDelay: "240ms" }}>
        <ResultCard result={result} code={code} origin={siteUrl()} />
      </div>
    </SiteShell>
  );
}
