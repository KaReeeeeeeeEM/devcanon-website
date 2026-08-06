import type { Metadata } from "next";
import { Apple, ArrowUpRight, Check, Code2, Download as DownloadIcon, Laptop, Package, Terminal, Workflow } from "lucide-react";
import { CopyCommand } from "@/components/copy-command";
import { TechnologyMarquee } from "@/components/technology-marquee";

export const metadata: Metadata = { title: "Download", description: "Install devcanon through npm or download Devcanon Studio for desktop." };
const installs=[{icon:Terminal,title:"Global CLI",copy:"npm install --global devcanon",text:"Keep Devcanon available across every repository."},{icon:Workflow,title:"Run once",copy:"npx devcanon init",text:"Add the standards without a global installation."},{icon:Package,title:"Pin for a team",copy:"npm install --save-dev devcanon",text:"Commit one reproducible version for everyone."}];

export default function Download(){return <main>
  <section className="download-hero">
    <div className="download-glow" aria-hidden="true" />
    <div className="download-mark"><span>D</span><b>›</b></div>
    <p className="section-kicker">Get Devcanon</p>
    <h1>Put your engineering standards one command away.</h1>
    <p className="download-intro">Free, open source, and local-first. Use the CLI in any repository or open the visual Studio on macOS, Windows, and Linux.</p>
    <article className="release-card">
      <div className="release-icon"><DownloadIcon /></div>
      <div className="min-w-0 flex-1"><p className="release-eyebrow">Recommended</p><h2>Install the Devcanon CLI</h2><p>Works anywhere Node.js 20 or newer is available.</p></div>
      <a className="release-action" href="https://www.npmjs.com/package/devcanon" target="_blank" rel="noreferrer">View on npm <ArrowUpRight /></a>
      <div className="release-command"><CopyCommand command="npm install --global devcanon" prominent /></div>
    </article>
    <div className="platforms"><span>Available for</span><div><span><Apple/> macOS</span><span><Laptop/> Windows</span><span><Terminal/> Linux</span></div></div>
    <p className="download-note">Prefer a visual interface? <a href="https://github.com/KaReeeeeeeeEM/devcanon-website/releases" target="_blank" rel="noreferrer">See desktop releases</a>. Found a problem? <a href="https://github.com/KaReeeeeeeeEM/devcanon/issues" target="_blank" rel="noreferrer">Report it on GitHub</a>.</p>
  </section>
  <TechnologyMarquee />
  <section className="download-methods"><div className="mb-10 max-w-2xl"><p className="section-kicker">Choose your workflow</p><h2>One tool, three ways to start.</h2><p>Every installation path produces the same standards and preserves existing repository conventions.</p></div><div className="grid gap-4 md:grid-cols-3">{installs.map(({icon:Icon,title,copy,text})=><article className="install-method" key={title}><div><Icon/><Check className="status-check"/></div><h3>{title}</h3><p>{text}</p><CopyCommand command={copy}/></article>)}</div><div className="mt-8 flex flex-wrap gap-3"><a className="button-secondary" href="/docs">Read installation docs</a><a className="button-secondary" href="https://github.com/KaReeeeeeeeEM/devcanon" target="_blank" rel="noreferrer"><Code2/> View source</a></div></section>
</main>}
