"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsPages } from "@/lib/docs-pages";

export function DocsNav(){
  const pathname=usePathname();
  return <aside className="docs-nav"><p className="mb-3 px-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Documentation</p><nav>{docsPages.map(page=>{const active=pathname===page.href;return <Link key={page.href} href={page.href} className={active?"active":""} aria-current={active?"page":undefined}>{page.nav}</Link>})}</nav><div className="mt-8 border-t border-border px-3 pt-6 text-xs leading-5 text-muted-foreground">Current npm release<br/><strong className="font-mono font-normal text-foreground">v1.1.1</strong></div></aside>
}
