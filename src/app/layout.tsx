import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";

const siteUrl="https://devcanon.almareem.com";
export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:"Devcanon — Vibe the idea. Ship it with standards.",template:"%s · Devcanon"},
  description:"Install a production-ready AI engineering handbook into any new or existing repository. Configure architecture, design, security, testing, and delivery once.",
  applicationName:"Devcanon",authors:[{name:"Kareem",url:"https://github.com/KaReeeeeeeeEM"}],creator:"Kareem",publisher:"Devcanon",
  keywords:["AI engineering standards","AI coding agents","vibe coding","Codex","Claude Code","repository standards","developer CLI","engineering handbook","Next.js development"],
  alternates:{canonical:"/"},manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/icon.svg?v=3",type:"image/svg+xml"}],shortcut:"/icon.svg?v=3",apple:"/icon.svg?v=3"},
  openGraph:{type:"website",locale:"en_US",url:"/",siteName:"Devcanon",title:"Devcanon — Vibe the idea. Ship it with standards.",description:"Give every AI coding agent your engineering judgment—architecture, design, security, testing, and delivery included.",images:[{url:"/opengraph-image",width:1200,height:630,alt:"Devcanon — engineering standards for AI coding agents"}]},
  twitter:{card:"summary_large_image",title:"Devcanon — Vibe the idea. Ship it with standards.",description:"A reusable engineering handbook for every AI coding agent.",images:["/opengraph-image"]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
  category:"technology",
};
const structuredData={"@context":"https://schema.org","@type":"SoftwareApplication",name:"Devcanon",applicationCategory:"DeveloperApplication",operatingSystem:"macOS, Windows, Linux",description:"AI engineering standards infrastructure for any repository.",url:siteUrl,downloadUrl:"https://www.npmjs.com/package/devcanon",softwareVersion:"1.1.5",license:"https://github.com/KaReeeeeeeeEM/devcanon/blob/main/LICENSE",author:{"@type":"Person",name:"Kareem"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body className="min-h-screen bg-background font-sans text-foreground antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/><ThemeProvider><PwaRegister/><SiteHeader/>{children}<SiteFooter/></ThemeProvider></body></html>}
