import path from "node:path";

export const HANDBOOK_DIRECTORY = ".ai";
export const HANDBOOK_ENTRY = path.join(HANDBOOK_DIRECTORY, "AGENTS.md");

export type DevcanonAction = "check" | "initialize" | "previewUpdate" | "update";

export function commandArguments(action: DevcanonAction, workspacePath: string): string[] {
  switch (action) {
    case "initialize":
      return ["--yes", "devcanon", "init", workspacePath];
    case "check":
      return ["--yes", "devcanon", "check", workspacePath];
    case "previewUpdate":
      return ["--yes", "devcanon", "update", "--dry-run", workspacePath];
    case "update":
      return ["--yes", "devcanon", "update", workspacePath];
  }
}

export function isHandbookFile(relativePath: string): boolean {
  const normalized = relativePath.replaceAll("\\", "/");
  return normalized === HANDBOOK_DIRECTORY || normalized.startsWith(`${HANDBOOK_DIRECTORY}/`);
}

export function relativeHandbookLabel(relativePath: string): string {
  const normalized = relativePath.replaceAll("\\", "/");
  return normalized.replace(/^\.ai\/?/, "") || HANDBOOK_DIRECTORY;
}
