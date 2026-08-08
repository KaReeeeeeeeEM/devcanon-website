const assert = require("node:assert/strict");
const test = require("node:test");
const { commandArguments, isHandbookFile, relativeHandbookLabel } = require("../dist/core.cjs");

test("builds shell-free command arguments for each action", () => {
  const workspace = "/tmp/a project";
  assert.deepEqual(commandArguments("initialize", workspace), ["--yes", "devcanon", "init", workspace]);
  assert.deepEqual(commandArguments("check", workspace), ["--yes", "devcanon", "check", workspace]);
  assert.deepEqual(commandArguments("previewUpdate", workspace), ["--yes", "devcanon", "update", "--dry-run", workspace]);
  assert.deepEqual(commandArguments("update", workspace), ["--yes", "devcanon", "update", workspace]);
});

test("recognizes handbook paths on every supported operating system", () => {
  assert.equal(isHandbookFile(".ai/AGENTS.md"), true);
  assert.equal(isHandbookFile(".ai\\security.md"), true);
  assert.equal(isHandbookFile("src/.ai-note.md"), false);
});

test("removes only the handbook directory prefix from labels", () => {
  assert.equal(relativeHandbookLabel(".ai/security.md"), "security.md");
  assert.equal(relativeHandbookLabel(".ai\\prompts\\crud.md"), "prompts/crud.md");
});
