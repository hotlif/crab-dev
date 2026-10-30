import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { after, test } from "node:test";
import { promisify } from "node:util";
import { buildContext, formatContext } from "./ai-context.mjs";
import { repositoryRoot } from "./library-manifest.mjs";
import { readWorkspaceManifests } from "./check-commands.mjs";

const paths = entries => entries.map(item => item.path);
const run = promisify(execFile);
const fixture = await mkdtemp(resolve(tmpdir(), "crab-ai-context-"));
const outside = await mkdtemp(resolve(tmpdir(), "crab-ai-outside-"));
after(async () => { await rm(fixture, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); });
async function put(path, content) {
    const file = resolve(fixture, path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, typeof content === "string" ? content : JSON.stringify(content));
}
const failIfExecuted = "node -e \"throw new Error('query executed a command')\"";
await mkdir(resolve(fixture, "standards"));
await put("package.json", { workspaces: ["components/*", "standards/*", ".website"], scripts: { "check:architecture": failIfExecuted, "lint:tools": failIfExecuted } });
await put("AGENTS.md", "# Root\n");
await put("components/AGENTS.md", "# Components\n");
await put(".website/package.json", { name: "@fixture/website", scripts: { check: failIfExecuted } });
const packages = ["first", "second", "third", "token-only"].map(name => ({ name: `@crab-dev/rc-${name}`, path: `components/rc-${name}` }));
await put("library.manifest.json", { packages });
for (const entry of packages) {
    await put(`${entry.path}/package.json`, { name: entry.name, scripts: { check: failIfExecuted },
        ...(entry.name === "@crab-dev/rc-second" ? { dependencies: { "@crab-dev/rc-first": "workspace:^" } } : {}) });
    await put(`${entry.path}/src/index.ts`, entry.name === "@crab-dev/rc-third" ? 'export { value } from "@crab-dev/rc-second";' : "export const value = 1;");
}
await put("components/rc-second/docs/demo.tsx", 'import { value } from "@crab-dev/rc-first";');
await put("components/rc-second/token.toml", 'imports = ["@crab-dev/rc-first"]');
await put("components/rc-token-only/token.toml", 'imports = ["@crab-dev/rc-first"]');
await put("components/rc-first/AGENTS.md", "# First\n");
await put("components/rc-first/src/nested/AGENTS.md", "# Nested\n");
await put("components/rc-first/src/nested/file.ts", "export {};");
await put("components/rc-first/css/index.css", ".generated {}");

test("package name, slug, relative path and Windows separators resolve to the same workspace", async () => {
    const contexts = await Promise.all(["@crab-dev/rc-first", "rc-first", "components/rc-first", "components\\rc-first"].map(target => buildContext(target, { root: fixture })));
    for (const context of contexts) {
        assert.equal(context.target, "components/rc-first");
        assert.equal(context.workspace, "@crab-dev/rc-first");
        assert.deepEqual(paths(context.rules), ["AGENTS.md", "components/AGENTS.md", "components/rc-first/AGENTS.md"]);
    }
});

test("rules inherit only through target ancestors, including a file-level nested scope", async () => {
    const context = await buildContext("components/rc-first/src/nested/file.ts", { root: fixture });
    assert.deepEqual(paths(context.rules), ["AGENTS.md", "components/AGENTS.md", "components/rc-first/AGENTS.md", "components/rc-first/src/nested/AGENTS.md"]);
    const sibling = await buildContext("@crab-dev/rc-second", { root: fixture });
    assert.deepEqual(paths(sibling.rules), ["AGENTS.md", "components/AGENTS.md"]);
});

test("direct dependency roles stay separate and reverse traversal does not include indirect users", async () => {
    const first = await buildContext("@crab-dev/rc-first", { root: fixture, dependents: true });
    assert.deepEqual(first.dependents, { production: ["@crab-dev/rc-second"], docs: ["@crab-dev/rc-second"], token: ["@crab-dev/rc-second", "@crab-dev/rc-token-only"] });
    assert.deepEqual(first.dependencies.production, []);
    const second = await buildContext("@crab-dev/rc-second", { root: fixture });
    assert.deepEqual(second.dependencies, { production: ["@crab-dev/rc-first"], docs: ["@crab-dev/rc-first"], token: ["@crab-dev/rc-first"] });
    assert.equal("dependents" in second, false);
});

test("unknown paths, nonexistent package names and paths outside the repository fail", async () => {
    for (const target of ["missing", "@fixture/missing", "package.json/not-a-directory"]) await assert.rejects(buildContext(target, { root: fixture }), /未知目标/);
    for (const target of ["..", "../other"]) await assert.rejects(buildContext(target, { root: fixture }), /仓库内/);
});

test("a symbolic link cannot escape the repository", async context => {
    try { await symlink(outside, resolve(fixture, "outside-link"), process.platform === "win32" ? "junction" : "dir"); }
    catch (error) {
        if (error.code !== "EPERM") throw error;
        context.skip("Host does not permit creating symbolic links; lexical path boundaries are covered separately.");
        return;
    }
    await assert.rejects(buildContext("outside-link", { root: fixture }), /实际路径必须在仓库内/);
});

test("missing optional files and scripts do not produce fabricated entries or commands", async () => {
    const context = await buildContext("@crab-dev/rc-first", { root: fixture });
    assert.deepEqual(paths(context.sources), ["components/rc-first/package.json", "components/rc-first/src/index.ts", "components/rc-first/src"]);
    assert.deepEqual(context.commands.map(item => item.script), ["check"]);
    assert.deepEqual(paths(context.documents), []);
});

test("explicit build artifacts and historical records remain accessible without becoming source entries", async () => {
    const artifact = await buildContext("components/rc-first/css/index.css", { root: fixture });
    assert.equal(artifact.kind, "artifact");
    assert.deepEqual(artifact.sources, []);
    assert.deepEqual(artifact.commands, []);
    const history = await buildContext("MILESTONE.md");
    assert.equal(history.kind, "history");
    assert.deepEqual(history.sources, []);
    const root = await buildContext(".");
    assert.equal(root.kind, "source");
    assert.ok(paths(root.navigation).includes("scripts/AGENTS.md"));
    assert.ok(!JSON.stringify(root.sources).includes(".reports"));
    assert.ok(!JSON.stringify(root.navigation).includes("MILESTONE"));
});

test("Button, Form, tokens, teaching examples and engineering scripts expose task-specific entrypoints", async () => {
    const [button, form, token, teaching, tooling] = await Promise.all([
        "rc-button", "components/rc-form/src/item.tsx", "components/rc-token-semantic/token.toml",
        ".website/docs/examples/rc-button/step-1.tsx", "scripts/check-library.mjs",
    ].map(target => buildContext(target)));
    assert.ok(!paths(button.rules).some(path => path.includes("rc-form")));
    assert.ok(paths(button.sources).includes("components/rc-button/src/__tests__"));
    assert.ok(paths(form.rules).includes("components/rc-form/AGENTS.md"));
    assert.ok(form.commands.some(item => item.script === "test:browser"));
    assert.ok(paths(token.skills).includes(".agents/skills/token-change/SKILL.md"));
    assert.ok(paths(token.generated).includes("components/rc-token-semantic/src/density-geometry.ts"));
    assert.ok(paths(teaching.documents).includes(".website/content/rc-button.json"));
    assert.ok(paths(teaching.documents).includes("components/rc-button/docs/demos"));
    assert.ok(paths(teaching.generated).includes(".website/docs/_generated_tutorials/rc-button.ts"));
    assert.ok(paths(tooling.rules).includes("scripts/AGENTS.md"));
    assert.ok(tooling.commands.some(item => item.script === "lint:tools"));
    for (const context of [button, form, token, teaching, tooling]) {
        const output = formatContext(context);
        assert.ok(!output.includes("# crab-dev 工作入口"));
        assert.ok(!output.includes("# 组件实现约定"));
    }
});

test("generated tokens, API, tutorials, component pages and topology resolve back to editing sources", async () => {
    const cases = [
        ["components/rc-button/src/token.ts", "components/rc-button/token.toml", "generate:token"],
        ["components/rc-token-semantic/src/density-geometry.ts", "components/rc-token-semantic/scripts", "generate:token"],
        ["components/rc-button/public/docgen.json", "components/rc-button/src", "generate:docgen"],
        [".website/docs/_generated_api/rc-button-ButtonGroupProps.ts", "components/rc-button/src", "generate:docs"],
        [".website/docs/components/rc-button.mdx", "components/rc-button/docs/index.mdx", "generate:docs"],
        [".website/docs/_generated_tutorials/rc-button.ts", ".website/docs/examples/rc-button", "generate:docs"],
        [".website/docs/_generated/globalTokenReference.ts", "components/rc-token-global/token.toml", "generate:docs"],
        ["turbo.json", "scripts/generate-library-tasks.mjs", "generate:architecture"],
    ];
    for (const [target, source, script] of cases) {
        const context = await buildContext(target);
        assert.equal(context.kind, "generated", target);
        assert.ok(paths(context.sources).includes(source), `${target} → ${source}`);
        assert.ok(!paths(context.sources).includes(target), target);
        assert.ok(context.commands.some(item => item.script === script), target);
        assert.ok(paths(context.generated).includes(target));
        if (target.includes(".website/docs/_generated_api")) assert.ok(paths(context.relatedRules).includes("components/AGENTS.md"));
    }
});

test("inventory changes expose derived outputs while README keeps its handwritten editing boundary", async () => {
    const inventory = await buildContext("library.manifest.json");
    assert.ok(paths(inventory.generated).includes("turbo.json"));
    assert.ok(paths(inventory.generated).includes(".website/docs/navigation.toml"));
    assert.ok(inventory.commands.some(item => item.script === "generate:architecture"));
    assert.ok(inventory.commands.some(item => item.script === "generate:docs"));
    const readme = await buildContext("README.md");
    assert.equal(readme.kind, "source");
    assert.ok(paths(readme.sources).includes("README.md"));
    assert.ok(paths(readme.sources).includes("library.manifest.json"));
    assert.ok(readme.notes.length > 0);
});

test("every emitted command names an existing public script and query leaves relevant files untouched", async () => {
    const rootPackage = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
    const workspaces = await readWorkspaceManifests();
    const tracked = ["package.json", "library.manifest.json", "yarn.lock", ".pnp.cjs", ".pnp.loader.mjs", "components/rc-button/src/token.ts", "components/rc-button/public/docgen.json"];
    const snapshot = () => Promise.all(tracked.map(async path => createHash("sha256").update(await readFile(resolve(repositoryRoot, path))).digest("hex")));
    const before = await snapshot();
    for (const target of [".", "rc-button", "rc-form", ".website", "standards/typescript-preset", "scripts", "library.manifest.json", ".pnp.cjs"]) {
        const context = await buildContext(target);
        for (const item of context.commands) {
            const pkg = item.workspace ? workspaces.find(workspace => workspace.packageJson.name === item.workspace)?.packageJson : rootPackage;
            assert.ok(pkg?.scripts?.[item.script], item.command);
            assert.equal(item.command, `yarn ${item.workspace ? `workspace ${item.workspace} ` : ""}${item.script}`);
        }
    }
    assert.deepEqual(await snapshot(), before);
});

test("CLI emits parseable JSON, human help and nonzero actionable errors", async () => {
    const script = resolve(repositoryRoot, "scripts/ai-context.mjs");
    const { stdout } = await run(process.execPath, [script, "rc-button", "--json"], { cwd: tmpdir(), windowsHide: true });
    assert.equal(JSON.parse(stdout).workspace, "@crab-dev/rc-button");
    const help = await run(process.execPath, [script, "--help"], { windowsHide: true });
    assert.match(help.stdout, /--dependents/);
    for (const args of [["missing"], ["--wrong"], ["rc-button", "rc-form"]]) {
        await assert.rejects(run(process.execPath, [script, ...args], { windowsHide: true }), error => error.code === 1 && error.stderr.trim().length > 0);
    }
});

async function brokenLinks(file, source) {
    const failures = [];
    for (const match of source.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const target = match[1].split("#")[0];
        if (!target || /^(?:[a-z]+:|\/)/i.test(target)) continue;
        try { await stat(resolve(dirname(file), decodeURIComponent(target))); }
        catch (error) { if (error.code !== "ENOENT") throw error; failures.push(target); }
    }
    return failures;
}

test("maintained task navigation, local rules and skills contain no broken local links", async () => {
    const files = ["AGENTS.md", "README.md", "components/AGENTS.md", "scripts/AGENTS.md", ".agents/README.md", ".website/README.md"];
    for (const name of await readdir(resolve(repositoryRoot, "components"))) {
        const file = `components/${name}/AGENTS.md`;
        try { await stat(resolve(repositoryRoot, file)); files.push(file); }
        catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    for (const name of await readdir(resolve(repositoryRoot, ".agents/skills"))) files.push(`.agents/skills/${name}/SKILL.md`);
    for (const file of files) assert.deepEqual(await brokenLinks(resolve(repositoryRoot, file), await readFile(resolve(repositoryRoot, file), "utf8")), [], file);
    assert.deepEqual(await brokenLinks(resolve(fixture, "AGENTS.md"), "[missing](does-not-exist.md)"), ["does-not-exist.md"]);
});
