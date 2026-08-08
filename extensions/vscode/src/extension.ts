import { spawn } from "node:child_process";
import path from "node:path";
import * as vscode from "vscode";
import { commandArguments, HANDBOOK_DIRECTORY, HANDBOOK_ENTRY, type DevcanonAction } from "./core";

const STUDIO_URL = vscode.Uri.parse("https://devcanon.almareem.com/download");

type HandbookNode = {
  kind: "directory" | "file" | "workspace";
  label: string;
  uri: vscode.Uri;
  workspace: vscode.WorkspaceFolder;
};

class HandbookProvider implements vscode.TreeDataProvider<HandbookNode>, vscode.Disposable {
  private readonly changed = new vscode.EventEmitter<HandbookNode | undefined>();
  private readonly watchers: vscode.FileSystemWatcher[] = [];

  readonly onDidChangeTreeData = this.changed.event;

  constructor() {
    this.resetWatchers();
  }

  refresh(): void {
    this.changed.fire(undefined);
  }

  resetWatchers(): void {
    for (const watcher of this.watchers.splice(0)) watcher.dispose();
    for (const workspace of vscode.workspace.workspaceFolders ?? []) {
      const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(workspace, `${HANDBOOK_DIRECTORY}/**/*`),
      );
      watcher.onDidChange(() => this.refresh());
      watcher.onDidCreate(() => this.refresh());
      watcher.onDidDelete(() => this.refresh());
      this.watchers.push(watcher);
    }
  }

  getTreeItem(node: HandbookNode): vscode.TreeItem {
    const collapsibleState = node.kind === "file"
      ? vscode.TreeItemCollapsibleState.None
      : vscode.TreeItemCollapsibleState.Expanded;
    const item = new vscode.TreeItem(node.label, collapsibleState);
    item.resourceUri = node.uri;
    item.contextValue = `devcanon.${node.kind}`;
    item.iconPath = node.kind === "workspace"
      ? new vscode.ThemeIcon("repo")
      : node.kind === "directory"
        ? vscode.ThemeIcon.Folder
        : vscode.ThemeIcon.File;
    if (node.kind === "file") {
      item.command = {
        command: "vscode.open",
        title: "Open handbook file",
        arguments: [node.uri],
      };
    }
    return item;
  }

  async getChildren(node?: HandbookNode): Promise<HandbookNode[]> {
    const workspaces = vscode.workspace.workspaceFolders ?? [];
    if (!node) {
      if (workspaces.length === 1) return this.handbookChildren(workspaces[0], vscode.Uri.joinPath(workspaces[0].uri, HANDBOOK_DIRECTORY));
      return workspaces.map((workspace) => ({
        kind: "workspace",
        label: workspace.name,
        uri: vscode.Uri.joinPath(workspace.uri, HANDBOOK_DIRECTORY),
        workspace,
      }));
    }
    if (node.kind === "file") return [];
    return this.handbookChildren(node.workspace, node.uri);
  }

  private async handbookChildren(workspace: vscode.WorkspaceFolder, uri: vscode.Uri): Promise<HandbookNode[]> {
    try {
      const entries = await vscode.workspace.fs.readDirectory(uri);
      return entries
        .filter(([name]) => !name.startsWith("."))
        .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]))
        .map(([name, fileType]) => ({
          kind: fileType === vscode.FileType.Directory ? "directory" : "file",
          label: name,
          uri: vscode.Uri.joinPath(uri, name),
          workspace,
        }));
    } catch (error) {
      if (error instanceof vscode.FileSystemError && error.code === "FileNotFound") return [];
      throw error;
    }
  }

  dispose(): void {
    this.changed.dispose();
    for (const watcher of this.watchers) watcher.dispose();
  }
}

async function selectWorkspace(): Promise<vscode.WorkspaceFolder | undefined> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (!folders.length) {
    void vscode.window.showInformationMessage("Open a local repository before running a Devcanon command.");
    return undefined;
  }
  if (folders.length === 1) return folders[0];
  return vscode.window.showWorkspaceFolderPick({ placeHolder: "Choose the repository Devcanon should manage" });
}

function requireTrustedWorkspace(): boolean {
  if (vscode.workspace.isTrusted) return true;
  void vscode.window.showWarningMessage("Trust this workspace before running Devcanon commands.");
  return false;
}

function formatCommand(args: string[]): string {
  return [process.platform === "win32" ? "npx.cmd" : "npx", ...args]
    .map((value) => value.includes(" ") ? JSON.stringify(value) : value)
    .join(" ");
}

async function runDevcanon(
  action: DevcanonAction,
  output: vscode.OutputChannel,
  refresh: () => void,
): Promise<void> {
  if (!requireTrustedWorkspace()) return;
  const workspace = await selectWorkspace();
  if (!workspace || workspace.uri.scheme !== "file") {
    if (workspace) void vscode.window.showErrorMessage("Devcanon requires a local filesystem workspace.");
    return;
  }

  const args = commandArguments(action, workspace.uri.fsPath);
  const executable = process.platform === "win32" ? "npx.cmd" : "npx";
  output.show(true);
  output.appendLine(`\n$ ${formatCommand(args)}`);

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: `Devcanon: ${action}`, cancellable: false },
    () => new Promise<void>((resolve) => {
      let didFailToStart = false;
      const child = spawn(executable, args, {
        cwd: workspace.uri.fsPath,
        env: process.env,
        shell: false,
        windowsHide: true,
      });
      child.stdout.on("data", (chunk: Buffer) => output.append(chunk.toString()));
      child.stderr.on("data", (chunk: Buffer) => output.append(chunk.toString()));
      child.on("error", (error) => {
        didFailToStart = true;
        output.appendLine(`Devcanon could not start: ${error.message}`);
        void vscode.window.showErrorMessage("Devcanon could not start. Confirm Node.js 20 or newer is installed.");
        resolve();
      });
      child.on("close", (exitCode) => {
        if (didFailToStart) return;
        if (exitCode === 0) {
          refresh();
          void vscode.window.showInformationMessage("Devcanon completed successfully.");
        } else {
          void vscode.window.showErrorMessage(`Devcanon exited with code ${exitCode ?? "unknown"}. Open the Devcanon output for details.`);
        }
        resolve();
      });
    }),
  );
}

async function handbookExists(workspace: vscode.WorkspaceFolder): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.joinPath(workspace.uri, HANDBOOK_ENTRY));
    return true;
  } catch {
    return false;
  }
}

async function updateStatus(status: vscode.StatusBarItem): Promise<void> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  const states = await Promise.all(folders.map(handbookExists));
  const configured = states.filter(Boolean).length;
  status.text = configured === folders.length && folders.length
    ? "$(pass-filled) Devcanon ready"
    : "$(warning) Devcanon setup";
  status.tooltip = folders.length
    ? `${configured} of ${folders.length} workspace repositories contain a Devcanon handbook.`
    : "Open a repository to use Devcanon.";
  status.command = configured ? "devcanon.check" : "devcanon.initialize";
  status.show();
}

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel("Devcanon");
  const provider = new HandbookProvider();
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 80);
  const refresh = () => {
    provider.refresh();
    void updateStatus(status);
  };

  context.subscriptions.push(
    output,
    provider,
    status,
    vscode.window.registerTreeDataProvider("devcanon.handbook", provider),
    vscode.commands.registerCommand("devcanon.initialize", () => runDevcanon("initialize", output, refresh)),
    vscode.commands.registerCommand("devcanon.check", () => runDevcanon("check", output, refresh)),
    vscode.commands.registerCommand("devcanon.previewUpdate", () => runDevcanon("previewUpdate", output, refresh)),
    vscode.commands.registerCommand("devcanon.update", async () => {
      const choice = await vscode.window.showWarningMessage(
        "Update missing packaged handbook files while preserving local changes?",
        { modal: true },
        "Update handbook",
      );
      if (choice === "Update handbook") await runDevcanon("update", output, refresh);
    }),
    vscode.commands.registerCommand("devcanon.refresh", refresh),
    vscode.commands.registerCommand("devcanon.openStudio", () => vscode.env.openExternal(STUDIO_URL)),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      provider.resetWatchers();
      refresh();
    }),
  );

  refresh();
}

export function deactivate(): void {}
