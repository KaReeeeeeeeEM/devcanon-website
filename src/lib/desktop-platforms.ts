import { Apple, PanelsTopLeft } from "lucide-react";
import { SiLinux } from "@icons-pack/react-simple-icons";

export const desktopPlatforms = {
  macos: { name: "macOS", short: "Mac", icon: Apple, description: "Universal Apple Silicon and Intel builds.", formats: [".dmg", ".app.tar.gz"], pattern: /\.(dmg|app\.tar\.gz)$/i },
  windows: { name: "Windows", short: "Windows", icon: PanelsTopLeft, description: "Native installers for Windows 10 and 11.", formats: [".msi", ".exe"], pattern: /\.(msi|exe)$/i },
  linux: { name: "Linux", short: "Linux", icon: SiLinux, description: "Portable and distribution-friendly packages.", formats: [".AppImage", ".deb", ".rpm"], pattern: /\.(AppImage|deb|rpm)$/i },
} as const;

export type DesktopPlatform = keyof typeof desktopPlatforms;
export const desktopPlatformKeys = Object.keys(desktopPlatforms) as DesktopPlatform[];
