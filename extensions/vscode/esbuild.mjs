import { build, context } from "esbuild";

const options = {
  bundle: true,
  entryPoints: ["src/extension.ts"],
  external: ["vscode"],
  format: "cjs",
  logLevel: "info",
  outfile: "dist/extension.js",
  platform: "node",
  sourcemap: true,
  target: "node20",
};

await build({
  bundle: true,
  entryPoints: ["src/core.ts"],
  format: "cjs",
  logLevel: "silent",
  outfile: "dist/core.cjs",
  platform: "node",
  target: "node20",
});

if (process.argv.includes("--watch")) {
  const buildContext = await context(options);
  await buildContext.watch();
} else {
  await build(options);
}
