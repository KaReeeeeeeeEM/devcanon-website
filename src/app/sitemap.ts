import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const routes = ["", "/docs", "/download", "/changelog"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://kareeeeeeeeem.github.io/devcanon-website${route}`, lastModified: new Date(), changeFrequency: route === "/changelog" ? "weekly" : "monthly", priority: route === "" ? 1 : .8 })); }
