import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Changelog", description: "The live Devcanon CLI and Studio release timeline, notes, fixes, and downloads." };
export const revalidate = 3600;

type GitHubRelease = { id: number; tag_name: string; name: string | null; published_at: string; html_url: string; body: string | null; prerelease: boolean };
type Release = GitHubRelease & { channel: "CLI" | "Studio" };
const fallback: Release[] = [{ id: 211, tag_name: "v2.1.1", name: "Devcanon 2.1.1", published_at: "2026-08-06T20:57:11Z", html_url: "https://github.com/KaReeeeeeeeEM/devcanon/releases", body: "- Branded the local Studio sidebar.\n- Rendered standards navigation safely.\n- Fixed release verification so version bumps cannot hang CI.", prerelease: false, channel: "CLI" }];

async function repositoryReleases(repository: string, channel: Release["channel"]): Promise<Release[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/KaReeeeeeeeEM/${repository}/releases?per_page=30`, { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return ((await response.json()) as GitHubRelease[]).map(release => ({ ...release, channel }));
  } catch { return []; }
}

function version(tag: string) { return tag.replace(/^studio-v|^v/, ""); }
function notes(body: string | null) {
  if (!body) return ["Open the complete GitHub release notes for details, fixes, and upgrade guidance."];
  const items = body.split("\n").map(line => line.trim()).filter(line => /^[-*] /.test(line)).map(line => line.replace(/^[-*]\s+/, "")).slice(0, 6);
  return items.length ? items : [body.replace(/[#*_`]/g, "").trim().slice(0, 240)];
}

export default async function Changelog() {
  const [cli, studio] = await Promise.all([repositoryReleases("devcanon", "CLI"), repositoryReleases("devcanon-website", "Studio")]);
  const releases = [...cli, ...studio].sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  const visible = releases.length ? releases : fallback;
  return <main><section className="page-hero"><Reveal><p className="section-kicker">Live release timeline</p><h1 className="section-title mt-5">Every release, fix, and download.</h1><p className="section-copy mt-5 max-w-2xl">This timeline reads published CLI and Studio releases directly from GitHub. New releases appear automatically without a website code change.</p></Reveal></section><section className="mx-auto max-w-4xl px-5 pb-28 lg:px-8"><div className="relative ml-2 border-l border-border pl-8 sm:pl-12">{visible.map((release, index) => <Reveal key={`${release.channel}-${release.id}`} delay={index * .04}><article className="relative pb-16 last:pb-0"><span className="absolute -left-[2.39rem] top-2 size-3 rounded-full border-2 border-background bg-cyan-500 sm:-left-[3.39rem]"/><div className="flex flex-wrap items-center gap-3"><h2 className="font-mono text-2xl font-semibold text-foreground">v{version(release.tag_name)}</h2><span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300">{release.channel}</span>{release.prerelease ? <span className="rounded-full border border-amber-500/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-500">Preview</span> : null}</div><p className="mt-2 text-sm text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(release.published_at))}</p><ul className="mt-5 space-y-2 text-muted-foreground">{notes(release.body).map(item => <li key={item}>— {item}</li>)}</ul><div className="mt-6 flex flex-wrap gap-3 text-sm"><a className="button-secondary min-h-10!" href={release.html_url} target="_blank" rel="noreferrer"><Download className="size-4"/>Release and downloads</a>{release.channel === "CLI" ? <a className="button-secondary min-h-10!" href={`https://www.npmjs.com/package/devcanon/v/${version(release.tag_name)}`} target="_blank" rel="noreferrer">View on npm <ExternalLink className="size-3"/></a> : null}</div></article></Reveal>)}</div></section></main>;
}
