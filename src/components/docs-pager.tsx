import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { docsPages } from "@/lib/docs-pages";

export function DocsPager({ slug }: { slug: string }) {
  const index=docsPages.findIndex(page=>page.slug===slug);const previous=docsPages[index-1];const next=docsPages[index+1];
  return <nav className="docs-pager" aria-label="Documentation pagination">{previous?<Link href={previous.href}><ArrowLeft/><span><small>Previous</small>{previous.nav}</span></Link>:<span/>}{next?<Link href={next.href}><span><small>Next</small>{next.nav}</span><ArrowRight/></Link>:<span/>}</nav>;
}
