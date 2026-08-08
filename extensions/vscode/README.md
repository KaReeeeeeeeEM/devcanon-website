# Devcanon Studio for VS Code

Bring the Devcanon engineering handbook into VS Code and compatible editors.

## Features

- Browse every file under `.ai` from the Devcanon activity-bar view.
- Initialize a handbook in the current repository.
- Run `devcanon check` and inspect complete output without leaving the editor.
- Preview or apply handbook updates while preserving local changes.
- See workspace handbook health in the status bar.
- Work safely: commands require a trusted, local workspace and never execute through a shell.

## Requirements

- VS Code 1.95 or newer, or a compatible editor.
- Node.js 20 or newer for Devcanon commands.
- A local repository opened as a workspace.

## Getting started

1. Open a repository.
2. Select the Devcanon icon in the activity bar.
3. Run **Devcanon: Initialize Handbook** from the Command Palette if the repository is not configured.
4. Browse and edit standards under **Engineering Handbook**.
5. Run **Devcanon: Check Handbook** before committing.

Devcanon invokes the published CLI through `npx` so the extension and CLI use the same authoritative handbook behavior.

## Privacy and trust

The extension does not collect telemetry. Handbook files remain local. Commands are disabled for untrusted or virtual workspaces and child processes are launched with argument arrays rather than shell command strings.

## Support

Report issues at [github.com/KaReeeeeeeeEM/devcanon-website/issues](https://github.com/KaReeeeeeeeEM/devcanon-website/issues).
