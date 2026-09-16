import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readGlobalTokens } from "./generate-token-reference.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const relative = file => path.relative(root, file).replaceAll("\\", "/");
const packages = [];
for (const name of (await readdir(path.join(root, "components"))).filter(name => name.startsWith("rc-")).sort()) {
    const directory = path.join(root, "components", name);
    const manifest = JSON.parse(await readFile(path.join(directory, "package.json"), "utf8"));
    const files = await readdir(directory, { recursive: true });
    packages.push({
        name: manifest.name,
        source: files.filter(file => /^src[/\\]/.test(file) && /\.tsx?$/.test(file) && !/(?:token(?:-vars)?\.ts|__tests__[/\\])/.test(file)).map(file => relative(path.join(directory, file))),
        tests: files.filter(file => /[/\\]__tests__[/\\]/.test(file) && /\.test\./.test(file)).map(file => relative(path.join(directory, file))),
        tokenSource: files.includes("token.toml") ? relative(path.join(directory, "token.toml")) : null,
        checks: Object.keys(manifest.scripts ?? {}).filter(name => /eslint|typecheck|test|build:library|generate:token/.test(name)),
        review: "pending",
        productionVerification: "pending",
    });
}
const pages = (await readdir(path.join(root, ".website/docs"), { recursive: true }))
    .filter(file => file.endsWith(".mdx")).sort().map(file => ({ path: ".website/docs/" + file.replaceAll("\\", "/"), review: "pending", productionVerification: "pending" }));
const globalValues = Object.fromEntries(readGlobalTokens(await readFile(path.join(root, "components/rc-token-global/token.toml"), "utf8")).map(entry => [entry.key, entry.value]));
const directory = path.join(root, ".website/review/quality");
await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, "baseline.json"), JSON.stringify({ capturedAt: new Date().toISOString(), description: "Source inventory only; entries are not visually verified.", globalValues, packages, pages }, null, 2) + "\n", { flag: "wx" });
console.log("Baseline saved: " + packages.length + " packages, " + pages.length + " MDX pages, " + Object.keys(globalValues).length + " existing L1 values. No review marked passed.");
