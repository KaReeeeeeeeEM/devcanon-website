import { DocsNav } from "@/components/docs-nav";

export default function DocsLayout({children}:{children:React.ReactNode}){return <main className="docs-shell"><DocsNav/>{children}<aside className="toc"><p className="font-mono uppercase tracking-widest">Devcanon docs</p><a href="https://github.com/KaReeeeeeeeEM/devcanon" target="_blank" rel="noreferrer">Source repository</a><a href="https://www.npmjs.com/package/devcanon" target="_blank" rel="noreferrer">npm package</a><a href="https://github.com/KaReeeeeeeeEM/devcanon/issues" target="_blank" rel="noreferrer">Get support</a></aside></main>}
