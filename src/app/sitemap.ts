import type { MetadataRoute } from "next";
const routes = ["", "/docs", "/download", "/changelog"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://devcanon.dev${route}`, lastModified: new Date(), changeFrequency: route === "/changelog" ? "weekly" : "monthly", priority: route === "" ? 1 : .8 })); }
