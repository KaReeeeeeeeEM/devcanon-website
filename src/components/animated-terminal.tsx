const banner = [
  "██████╗ ███████╗██╗   ██╗ ██████╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ██╗",
  "██╔══██╗██╔════╝██║   ██║██╔════╝██╔══██╗████╗  ██║██╔═══██╗████╗  ██║",
  "██║  ██║█████╗  ██║   ██║██║     ███████║██╔██╗ ██║██║   ██║██╔██╗ ██║",
  "██║  ██║██╔══╝  ╚██╗ ██╔╝██║     ██╔══██║██║╚██╗██║██║   ██║██║╚██╗██║",
  "██████╔╝███████╗ ╚████╔╝ ╚██████╗██║  ██║██║ ╚████║╚██████╔╝██║ ╚████║",
  "╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝",
];
const animationDelay = (line: number) => ({ "--line-delay": `${.18 + line * .085}s` } as React.CSSProperties);

export function AnimatedTerminal() {
  return <div className="terminal-window hero-terminal" aria-label="Devcanon interactive terminal launching line by line">
    <div className="terminal-bar"><span/><span/><span/><p>devcanon — project</p></div>
    <div className="p-4 font-mono text-[11px] sm:p-6 sm:text-xs">
      <p className="terminal-line" style={animationDelay(0)}><span className="text-cyan-600 dark:text-cyan-400">$</span> devcanon</p>
      <div className="terminal-banner mt-4" aria-hidden="true">{banner.map((value,index)=><div className="terminal-line" style={animationDelay(index+1)} key={value}>{value}</div>)}</div>
      <p className="terminal-line mt-3 font-semibold text-emerald-600 dark:text-emerald-400" style={animationDelay(7)}>Engineering standards, on command · v1.1.1</p>
      <p className="terminal-line mt-4 text-muted-foreground" style={animationDelay(8)}>Current directory: /Users/you/Projects/app</p>
      <p className="terminal-line mt-1 text-muted-foreground" style={animationDelay(9)}>Type <span className="text-cyan-700 dark:text-cyan-300">/help</span> for commands or <span className="text-cyan-700 dark:text-cyan-300">/init</span> to install standards.</p>
      <p className="terminal-line mt-4" style={animationDelay(10)}><span className="font-semibold text-cyan-700 dark:text-cyan-300">devcanon ›</span> <span className="cursor-block" /></p>
    </div>
  </div>;
}
