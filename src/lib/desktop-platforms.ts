import { createElement, type SVGProps } from "react";
import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";

function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
  return createElement("svg", { ...props, viewBox: "0 0 24 24", role: "img", "aria-label": "Microsoft Windows" },
    createElement("path", { fill: "#f25022", d: "M2 2h9v9H2z" }),
    createElement("path", { fill: "#7fba00", d: "M13 2h9v9h-9z" }),
    createElement("path", { fill: "#00a4ef", d: "M2 13h9v9H2z" }),
    createElement("path", { fill: "#ffb900", d: "M13 13h9v9h-9z" }),
  );
}

export const desktopPlatforms = {
  macos: { name: "macOS", short: "Mac", icon: SiApple, description: "Universal Apple Silicon and Intel builds.", formats: [".dmg", ".app.tar.gz"], pattern: /\.(dmg|app\.tar\.gz)$/i },
  windows: { name: "Windows", short: "Windows", icon: MicrosoftIcon, description: "Native installers for Windows 10 and 11.", formats: [".msi", ".exe"], pattern: /\.(msi|exe)$/i },
  linux: { name: "Linux", short: "Linux", icon: SiLinux, description: "Portable and distribution-friendly packages.", formats: [".AppImage", ".deb", ".rpm"], pattern: /\.(AppImage|deb|rpm)$/i },
} as const;

export type DesktopPlatform = keyof typeof desktopPlatforms;
export const desktopPlatformKeys = Object.keys(desktopPlatforms) as DesktopPlatform[];
