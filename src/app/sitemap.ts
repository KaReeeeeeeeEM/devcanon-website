import type { MetadataRoute } from "next";
import { desktopPlatformKeys } from "@/lib/desktop-platforms";
import { docsPages } from "@/lib/docs-pages";

const siteUrl = "https://devcanon-website.vercel.app";

const primaryRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/download", changeFrequency: "weekly", priority: 0.9 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/studio", changeFrequency: "monthly", priority: 0.7 },
] as const;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const documentationRoutes = docsPages.map((page) => ({
    path: page.href,
    changeFrequency: "monthly" as const,
    priority: page.href === "/docs" ? 0.9 : 0.8,
  }));

  const downloadRoutes = desktopPlatformKeys.map((platform) => ({
    path: `/download/${platform}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...primaryRoutes, ...documentationRoutes, ...downloadRoutes].map(
    ({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}${path}`,
      changeFrequency,
      priority,
    }),
  );
}
