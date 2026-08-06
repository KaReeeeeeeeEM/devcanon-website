import { ArrowRight, BookOpen, Check, GitPullRequest, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";

const standards = ["Architecture", "Product design", "Frontend", "Backend", "API design", "Database", "Security", "Accessibility", "Testing", "Deployment", "Observability", "AI features"];

export default function Home() {
  return (
    <main>
      <section className="hero-grid border-b border-white/8">
        <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 py-28 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <div className="eyebrow"><Sparkles className="size-3.5" /> Engineering standards, on command</div>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.35rem] lg:leading-[.98]">Give every AI agent your engineering judgment.</h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-400 sm:text-xl">Devcanon installs a durable, modular engineering handbook into any repository—so architecture, design, security, testing, and delivery stay consistent without repeating yourself.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row"><CopyCommand command="npx devcanon init" prominent /><Link href="/docs" className="button-secondary">Read the docs <ArrowRight className="size-4" /></Link></div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Check className="size-4 text-cyan-400" /> Existing repos first</span><span className="inline-flex items-center gap-2"><Check className="size-4 text-cyan-400" /> Zero runtime dependencies</span><span className="inline-flex items-center gap-2"><Check className="size-4 text-cyan-400" /> Safe by default</span></div>
          </div>
          <div className="terminal-window" aria-label="Devcanon terminal example">
            <div className="terminal-bar"><span/><span/><span/><p>devcanon — project</p></div>
            <div className="space-y-5 p-5 font-mono text-sm sm:p-7"><p><span className="text-cyan-400">$</span> devcanon</p><pre className="overflow-hidden text-[9px] leading-[1.15] text-cyan-300 sm:text-xs" aria-hidden="true">{`██████╗ ███████╗██╗   ██╗ ██████╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██║   ██║██╔════╝██╔══██╗████╗  ██║██╔═══██╗████╗  ██║
██║  ██║█████╗  ██║   ██║██║     ███████║██╔██╗ ██║██║   ██║██╔██╗ ██║
██████╔╝███████╗ ╚████╔╝ ╚██████╗██║  ██║██║ ╚████║╚██████╔╝██║ ╚████║`}</pre><p className="text-slate-500">Engineering standards, on command</p><div className="space-y-2"><p><span className="text-cyan-400">devcanon ›</span> /init</p><p className="text-emerald-400">✓ 43 standards installed</p><p className="text-emerald-400">✓ Existing instructions preserved</p><p className="text-emerald-400">✓ Repository ready for AI-assisted work</p></div><p><span className="text-cyan-400">devcanon ›</span> <span className="cursor-block"> </span></p></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="section-kicker">One install. Shared judgment.</p><h2 className="section-title mt-4">A real engineering handbook, not another prompt file.</h2><p className="section-copy mt-5">Each concern has one authoritative home. Agents read only what the task requires, while precedence rules keep decisions coherent.</p></div><div className="grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">{standards.map((standard, index) => <div key={standard} className="bg-[#0a111d] p-5 text-sm text-slate-300"><span className="mr-3 font-mono text-xs text-cyan-500">{String(index + 1).padStart(2, "0")}</span>{standard}</div>)}</div></div></section>
      <section className="border-y border-white/8 bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-24 md:grid-cols-3 lg:px-8"><article className="feature-card"><Terminal/><h3>Works where you work</h3><p>Run it globally, through npx, or pin it to a project. Existing repositories are the primary workflow.</p></article><article className="feature-card"><ShieldCheck/><h3>Preserves local intent</h3><p>Missing files are added. Local changes are reported and never replaced unless you explicitly use <code>--force</code>.</p></article><article className="feature-card"><GitPullRequest/><h3>Built for teams</h3><p>Version standards alongside code, validate them in CI, and review handbook upgrades like any other meaningful change.</p></article></div></section>
      <section className="mx-auto max-w-4xl px-5 py-28 text-center"><BookOpen className="mx-auto size-8 text-cyan-400" /><h2 className="section-title mt-6">Stop re-explaining how good work should look.</h2><p className="section-copy mx-auto mt-5 max-w-2xl">Install devcanon, open your AI coding tool, and move from idea to implementation with the standards already in the room.</p><div className="mt-9 flex justify-center"><CopyCommand command="npm install --global devcanon" prominent /></div></section>
    </main>
  );
}
