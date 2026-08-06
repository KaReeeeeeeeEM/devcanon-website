"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const banner = [
  "██████╗ ███████╗██╗   ██╗ ██████╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ██╗",
  "██╔══██╗██╔════╝██║   ██║██╔════╝██╔══██╗████╗  ██║██╔═══██╗████╗  ██║",
  "██║  ██║█████╗  ██║   ██║██║     ███████║██╔██╗ ██║██║   ██║██╔██╗ ██║",
  "██║  ██║██╔══╝  ╚██╗ ██╔╝██║     ██╔══██║██║╚██╗██║██║   ██║██║╚██╗██║",
  "██████╔╝███████╗ ╚████╔╝ ╚██████╗██║  ██║██║ ╚████║╚██████╔╝██║ ╚████║",
  "╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝",
];

export function AnimatedTerminal() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-terminal-line]", { opacity: 0, y: 7, duration: .3, stagger: .095, ease: "power2.out", delay: .25 });
  }, { scope: root });
  return <div ref={root} className="terminal-window hero-terminal" aria-label="Devcanon interactive terminal launching line by line">
    <div className="terminal-bar"><span/><span/><span/><p>devcanon — project</p></div>
    <div className="p-4 font-mono text-[11px] sm:p-6 sm:text-xs">
      <p data-terminal-line><span className="text-cyan-600 dark:text-cyan-400">$</span> devcanon</p>
      <div className="terminal-banner mt-4" aria-hidden="true">{banner.map(line=><div data-terminal-line key={line}>{line}</div>)}</div>
      <p data-terminal-line className="mt-3 font-semibold text-emerald-600 dark:text-emerald-400">Engineering standards, on command · v1.1.1</p>
      <p data-terminal-line className="mt-4 text-muted-foreground">Current directory: /Users/you/Projects/app</p>
      <p data-terminal-line className="mt-1 text-muted-foreground">Type <span className="text-cyan-700 dark:text-cyan-300">/help</span> for commands or <span className="text-cyan-700 dark:text-cyan-300">/init</span> to install standards.</p>
      <p data-terminal-line className="mt-4"><span className="font-semibold text-cyan-700 dark:text-cyan-300">devcanon ›</span> <span className="cursor-block" /></p>
    </div>
  </div>;
}
