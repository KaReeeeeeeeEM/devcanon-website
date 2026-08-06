import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const routes = ["", "/studio", "/docs", "/docs/installation", "/docs/cli", "/docs/desktop", "/docs/presets", "/docs/updates", "/docs/troubleshooting", "/download", "/download/macos", "/download/windows", "/download/linux", "/changelog"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://devcanon-website.vercel.app${route}`, lastModified: new Date(), changeFrequency: route === "/changelog" ? "weekly" : "monthly", priority: route === "" ? 1 : .8 })); }
