import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = { title: { default: "devcanon — Engineering standards, on command", template: "%s · devcanon" }, description: "Install a durable AI engineering handbook into any repository.", metadataBase: new URL("https://devcanon.dev"), openGraph: { title: "devcanon", description: "Give every AI agent your engineering judgment.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="dark"><body className="min-h-screen bg-background font-sans text-foreground antialiased"><SiteHeader/>{children}<SiteFooter/></body></html>; }
