import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CliGuide, DesktopGuide, InstallationGuide, PresetsGuide, TroubleshootingGuide, UpdatesGuide } from "@/components/docs-content";
import { DocsPager } from "@/components/docs-pager";
import { Reveal } from "@/components/reveal";
import { docsPages } from "@/lib/docs-pages";

const pages={installation:{title:"Install Devcanon on any operating system",description:"Complete CLI and desktop installation instructions for macOS, Windows, and Linux.",content:<InstallationGuide/>},cli:{title:"Use the Devcanon CLI",description:"Learn commands, interactive shortcuts, automation, and validation.",content:<CliGuide/>},desktop:{title:"Use Devcanon Studio",description:"Install and use the Devcanon desktop interface with any repository.",content:<DesktopGuide/>},presets:{title:"Configure presets and Studio",description:"Create portable engineering-standard presets from web, desktop, or terminal.",content:<PresetsGuide/>},updates:{title:"Update standards safely",description:"Preview, review, and apply Devcanon updates without losing local intent.",content:<UpdatesGuide/>},troubleshooting:{title:"Troubleshoot Devcanon",description:"Resolve installation, path, version, and standards-conflict problems.",content:<TroubleshootingGuide/>}} as const;
type PageSlug=keyof typeof pages;
export function generateStaticParams(){return Object.keys(pages).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const page=pages[slug as PageSlug];if(!page)return{};return{title:page.title,description:page.description,alternates:{canonical:`/docs/${slug}`},openGraph:{title:page.title,description:page.description,url:`/docs/${slug}`}};}
export default async function DocumentationPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const page=pages[slug as PageSlug];if(!page||!docsPages.some(item=>item.slug===slug))notFound();return <Reveal><article className="docs-article"><p className="section-kicker">Documentation / {docsPages.find(item=>item.slug===slug)?.nav}</p><h1 className="mt-4">{page.title}</h1><p className="text-lg! leading-8!">{page.description}</p>{page.content}<DocsPager slug={slug}/></article></Reveal>}
