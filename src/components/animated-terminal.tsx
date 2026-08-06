"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function AnimatedTerminal() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-terminal-line]", { opacity: 0, x: -12, duration: .45, stagger: .14, ease: "power2.out", delay: .3 });
  }, { scope: root });
  return <div ref={root} className="terminal-window" aria-label="Devcanon terminal example">
    <div className="terminal-bar"><span/><span/><span/><p>devcanon — project</p></div>
    <div className="space-y-4 p-5 font-mono text-xs sm:p-7 sm:text-sm"><p data-terminal-line><span className="text-cyan-500">$</span> devcanon init --preset dc1_...</p><p data-terminal-line className="text-muted-foreground">Reading repository conventions</p><p data-terminal-line className="text-emerald-500">✓ 43 standards installed</p><p data-terminal-line className="text-emerald-500">✓ Existing instructions preserved</p><p data-terminal-line className="text-emerald-500">✓ Preset applied safely</p><p data-terminal-line><span className="text-cyan-500">devcanon ›</span> <span className="cursor-block"> </span></p></div>
  </div>;
}
