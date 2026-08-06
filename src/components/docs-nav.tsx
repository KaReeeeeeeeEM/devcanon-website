"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [{href:"/docs",label:"Introduction",section:"introduction"},{href:"/docs#get-started",label:"Get started",section:"get-started"},{href:"/docs#interactive",label:"Interactive CLI",section:"interactive"},{href:"/docs#commands",label:"Commands",section:"commands"},{href:"/docs#updates",label:"Safe updates",section:"updates"},{href:"/download",label:"Install & download"},{href:"/changelog",label:"Changelog"}];
const sectionIds = ["get-started", "interactive", "commands", "updates"];

export function DocsNav(){
  const [activeSection,setActiveSection]=useState("introduction");
  useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;const current=sectionIds.reduce((active,id)=>{const heading=document.getElementById(id);return heading&&heading.getBoundingClientRect().top<=150?id:active;},"introduction");setActiveSection(current);};
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("hashchange",update);
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("hashchange",update);if(frame)cancelAnimationFrame(frame);};
  },[]);
  return <aside className="docs-nav"><p className="mb-3 px-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Documentation</p><nav>{links.map(link=>{const active=link.section===activeSection;return <Link key={link.href} href={link.href} className={active?"active":""} aria-current={active?"location":undefined}>{link.label}</Link>})}</nav><div className="mt-8 border-t border-border px-3 pt-6 text-xs leading-5 text-muted-foreground">Current npm release<br/><strong className="font-mono font-normal text-foreground">v1.1.0</strong></div></aside>
}
