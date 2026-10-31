import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { extractPackageImports, findDependencyCycle, inspectPackage, libraryBuildGraph, packageName } from "./library-graph.mjs";
import { createTurboConfig } from "./generate-library-tasks.mjs";
import { validateReleaseEvent } from "./check-release.mjs";
import { resolveYarnEntry, runYarn } from "./package-manager.mjs";
import { generatedContentChanges, generatedLibraryPaths } from "./check-generated.mjs";
import { exportTargets, verifyTarget } from "./check-exports.mjs";
import { validateReactPeers } from "./check-library.mjs";
import { requiredReactPeers } from "./react-peer-contract.mjs";
import { validateDesignVerification } from "./design-verification.mjs";
import { missingWakeWorkspaceResolutions, readWorkspaceManifests, requiredCheckScripts } from "./check-commands.mjs";
import { requiredCheckPlan } from "./check-required.mjs";
import { waitForOwnDevTools } from "./published-browser-readiness.mjs";
import { repositoryCheckPlan, workspaceCheckPlan } from "./check-plan.mjs";
import { libraryMetadataOutputs } from "./generate-library-metadata.mjs";
import { loadLibraryManifest, readLibraryMetadata, repositoryRoot } from "./library-manifest.mjs";

test('Wake controls stay on local workspaces after version bumps', () => {
    const wake = { dependencies: { '@crab-dev/rc-alert': '^0.0.2', external: '^1.0.0' } };
    const workspaces = [{ packageJson: { name: '@crab-dev/rc-alert' } }];
    assert.deepEqual(missingWakeWorkspaceResolutions({ resolutions: {} }, wake, workspaces), ['@crab-dev/rc-alert']);
    assert.deepEqual(missingWakeWorkspaceResolutions({ resolutions: { '@crab-dev/rc-alert': 'workspace:^' } }, wake, workspaces), []);
});

test('declared generated files preserve LF on Windows checkouts', async () => {
    const paths = [...generatedLibraryPaths(await loadLibraryManifest()), 'turbo.json'];
    const attributes = (await readFile(join(repositoryRoot, '.gitattributes'), 'utf8')).split(/\r?\n/).map(line => line.trim().split(/\s+/));
    for (const file of paths) assert.ok(attributes.some(([pattern, ...values]) => values.includes('eol=lf') && posix.matchesGlob(file, pattern.replace(/^\//, ''))), `${file} must preserve generated LF bytes`);
});

test("published runtime rejects relative imports into another package or the documentation environment", async () => {
    const directory = await mkdtemp(join(tmpdir(), "crab-boundary-"));
    try {
        await mkdir(join(directory, "src", "__tests__"), { recursive: true });
        await mkdir(join(directory, "src", ".cache"));
        await writeFile(join(directory, "src", "index.ts"), `export * from "./engine.js"; import "../../.website/runtime.js"; export type { Protocol } from "../../rc-other/src/protocol.js";`);
        await writeFile(join(directory, "src", "__tests__", "engine.test.ts"), 'import "../../../test/fixture.js";');
        await writeFile(join(directory, "src", ".cache", "stale.ts"), 'import "@crab-dev/stale";');
        const facts = await inspectPackage({ directory });
        assert.deepEqual(facts.boundaryImports.map(item => item.specifier).sort(), ["../../.website/runtime.js", "../../rc-other/src/protocol.js"]);
        assert.ok(!facts.productionImports.has("@crab-dev/stale"));
    } finally { await rm(directory, { recursive: true, force: true }); }
});

test("shared verification plans reference real scripts and retain every registered regression", async () => {
    const root = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
    assert.equal(new Set(repositoryCheckPlan).size, repositoryCheckPlan.length);
    assert.ok(!repositoryCheckPlan.includes("check"));
    assert.ok(!repositoryCheckPlan.includes("test:visual"));
    for (const name of repositoryCheckPlan) assert.ok(root.scripts[name], `Missing root script: ${name}`);
    for (const { packageJson: pkg } of await readWorkspaceManifests()) {
        const plan = workspaceCheckPlan(pkg);
        assert.ok(!plan.some(step => step.args[0] === "run" && step.args[1] === "test:visual"), pkg.name);
        if (pkg.scripts["build:library"]) {
            assert.equal(plan[0].root, true);
            assert.ok(plan[0].args.includes("build:library"));
        }
        for (const name of requiredCheckScripts(pkg)) assert.equal(plan.filter(step => step.args[0] === "run" && step.args[1] === name).length, 1, pkg.name);
    }
});

test("design registry and selectors follow authored identities instead of a second name table", () => {
    const manifest = readLibraryMetadata();
    const before = libraryMetadataOutputs(manifest);
    manifest.designSystems[0].title = "Updated registry title";
    const after = libraryMetadataOutputs(manifest);
    assert.equal(before.length, 1);
    assert.notEqual(before[0].content, after[0].content);
    assert.ok(after[0].content.includes("Updated registry title"));
    for (const design of manifest.designSystems) assert.ok(after[0].content.includes(`data-crab-design=\\\"${design.id}\\\"`));
});

const browserAlive = () => ({ exitCode: null, signalCode: null, launchError: undefined });
const browserNotExited = new Promise(() => {});

test("own DevTools readiness retries transport/status failures and records the exact endpoint and cause", async () => {
    const trace = {}, targets = [{ type: "page", url: "about:blank" }];
    let attempt = 0;
    const result = await waitForOwnDevTools({ readPort: async () => 65533, processState: browserAlive, processExited: browserNotExited, trace, pollMs: 0,
        fetchImpl: async (endpoint) => {
            assert.equal(endpoint, "http://127.0.0.1:65533/json/list");
            if (++attempt === 1) throw new TypeError("fetch failed", { cause: Object.assign(new Error("connect refused"), { code: "ECONNREFUSED", address: "127.0.0.1", port: 65533 }) });
            if (attempt === 2) return { ok: false, status: 503 };
            return { ok: true, status: 200, json: async () => targets };
        },
    });
    assert.deepEqual(result.targets, targets); assert.equal(result.port, 65533); assert.equal(trace.status, "ready");
    assert.deepEqual(trace.requests.map(request => request.status), [null, 503, 200]);
    assert.equal(trace.requests[0].error.cause.code, "ECONNREFUSED"); assert.equal(trace.requests[0].error.cause.port, 65533);
    assert.equal(trace.timeoutMs, 10000); assert.equal(trace.requests[2].ready, true);
});

test("own DevTools readiness shares one budget across port discovery and a hanging fetch", async () => {
    const trace = {}; let reads = 0, aborted = false;
    await assert.rejects(waitForOwnDevTools({ readPort: async () => ++reads < 2 ? null : 23456, processState: browserAlive, processExited: browserNotExited, trace, timeoutMs: 40, pollMs: 0,
        fetchImpl: async (_, { signal }) => { signal.addEventListener("abort", () => { aborted = true; }); return new Promise(() => {}); },
    }), /Timed out: own Chrome DevTools readiness/);
    assert.equal(trace.status, "failed"); assert.equal(trace.timeoutMs, 40); assert.equal(trace.requests.length, 1); assert.equal(aborted, true);
});

test("own Chrome exit interrupts a pending readiness request without waiting for the startup timeout", async () => {
    const trace = {}; let state = browserAlive(), notifyExit, aborted = false;
    const processExited = new Promise(resolve => { notifyExit = resolve; });
    await assert.rejects(waitForOwnDevTools({ readPort: async () => 23456, processState: () => state, processExited, trace, timeoutMs: 1000,
        fetchImpl: async (_, { signal }) => {
            signal.addEventListener("abort", () => { aborted = true; });
            queueMicrotask(() => { state = { exitCode: 7, signalCode: null }; notifyExit(state); });
            return new Promise(() => {});
        },
    }), /Own Chrome exited before DevTools readiness/);
    assert.equal(trace.processState.exitCode, 7); assert.equal(trace.requests.length, 1); assert.equal(aborted, true); assert.ok(trace.elapsedMs < 1000);
});

test("already exited Chrome refuses before reading or fetching any endpoint", async () => {
    const trace = {};
    await assert.rejects(waitForOwnDevTools({ readPort: () => { throw Error("must not read"); }, fetchImpl: () => { throw Error("must not fetch"); }, processState: () => ({ exitCode: 9, signalCode: null }), processExited: browserNotExited, trace }), /Own Chrome exited before DevTools readiness/);
    assert.deepEqual(trace.requests, []); assert.deepEqual(trace.portReads, []);
});

test("port-file readiness is separate from the unchanged unique blank-page acceptance", async () => {
    const trace = {}; let reads = 0;
    const targets = [{ type: "page", url: "not-blank" }, { type: "page", url: "about:blank" }];
    const result = await waitForOwnDevTools({
        readPort: async () => { if (++reads === 1) throw Object.assign(new Error("not yet created"), { code: "ENOENT" }); return reads === 2 ? NaN : 23456; },
        processState: browserAlive, processExited: browserNotExited, trace, pollMs: 0,
        fetchImpl: async () => ({ ok: true, status: 200, json: async () => targets }),
    });
    assert.equal(trace.portReads.length, 3); assert.equal(trace.portReads[0].error.code, "ENOENT"); assert.equal(trace.portReads[1].port, null);
    assert.strictEqual(result.targets, targets); // Launcher must reject these pages; helper must never select or hide one.
});

test("required workspace checks reject malformed, duplicate, missing and non-test declarations", () => {
    const pkg = { name: "component", scripts: { "test:browser": "wake test --environment browser" } };
    assert.deepEqual(requiredCheckScripts(pkg), []);
    assert.deepEqual(requiredCheckScripts({ ...pkg, crab: { requiredChecks: ["test:browser"] } }), ["test:browser"]);
    for (const requiredChecks of [null, "test:browser", ["test:browser", "test:browser"], ["test:missing"], ["build"], ["test"], ["test:"], [42]]) {
        assert.throws(() => requiredCheckScripts({ ...pkg, crab: { requiredChecks } }));
    }
    assert.throws(() => requiredCheckScripts({ ...pkg, scripts: { "test:browser": " " }, crab: { requiredChecks: ["test:browser"] } }));
});

test("root additional checks derive only from explicit workspace registrations", () => {
    const workspaces = [
        { packageJson: { name: "registered", scripts: { "test:browser": "browser" }, crab: { requiredChecks: ["test:browser"] } } },
        { packageJson: { name: "explicit-only", scripts: { "test:browser": "browser" } } },
        { packageJson: { name: "regular", scripts: { test: "dom" } } },
    ];
    assert.deepEqual(requiredCheckPlan(workspaces), [{ workspace: "registered", task: "test:browser" }]);
    assert.throws(() => requiredCheckPlan([...workspaces, { packageJson: { name: "broken", crab: { requiredChecks: ["test:missing"] } } }]));
});

test("workspace discovery follows root declarations and rejects unsupported patterns", async () => {
    const root = await mkdtemp(join(tmpdir(), "crab-workspaces-"));
    try {
        for (const path of ["packages/one", "site", "unused"]) {
            await mkdir(join(root, path), { recursive: true });
            await writeFile(join(root, path, "package.json"), JSON.stringify({ name: path }));
        }
        const writeRoot = (workspaces) => writeFile(join(root, "package.json"), JSON.stringify({ workspaces }));
        await writeRoot(["packages/*", "site", "site"]);
        assert.deepEqual((await readWorkspaceManifests({ root })).map((entry) => entry.path), ["packages/one", "site"]);
        await writeRoot(["packages/**"]);
        await assert.rejects(readWorkspaceManifests({ root }), /Unsupported workspace pattern/);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test("wildcard export targets require matching files within the package", async () => {
    const root = await mkdtemp(join(tmpdir(), "crab-exports-"));
    try {
        await mkdir(join(root, "dist", "nested"), { recursive: true });
        await writeFile(join(root, "dist", "readme.txt"), "unrelated");
        assert.equal(await verifyTarget(root, "./dist/*.js"), false);
        assert.equal(await verifyTarget(root, "./dist/nested*"), false);
        assert.equal(await verifyTarget(root, "../outside/*"), false);
        await writeFile(join(root, "dist", "nested", "entry.js"), "export {};");
        assert.equal(await verifyTarget(root, "./dist/*.js"), true);
        assert.equal(await verifyTarget(root, "./dist/*/entry.js"), true);
        assert.equal(await verifyTarget(root, "./dist/*.css"), false);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test("verified design coverage requires source, artifact, matrix and recorded evidence", () => {
    const coverage = { md3: "verified", apple: "partial", shadcn: "partial" };
    const ids = ["md3", "apple", "shadcn"];
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: {} }, ids).length > 0);
    const record = {
        source: { kind: "worktree", ref: `sha256:${"a".repeat(64)}` },
        artifactFingerprint: `sha256:${"b".repeat(64)}`,
        matrixScope: { colorModes: ["light", "dark"], sizes: ["medium"], densities: ["comfortable"], directions: ["ltr"], locales: ["zh-CN"], states: ["default", "focus"] },
        evidencePaths: ["review/button/md3.md"],
    };
    assert.deepEqual(validateDesignVerification({ designCoverage: coverage, verification: { md3: record } }, ids), []);
    assert.deepEqual(validateDesignVerification({ designCoverage: coverage, verification: { md3: { ...record, matrixScope: { ...record.matrixScope, sizes: ["xs", "s", "m", "l", "xl"] } } } }, ids), []);
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: { md3: { ...record, source: { kind: "commit", ref: "" } } } }, ids).length > 0);
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: { md3: { ...record, artifactFingerprint: "" } } }, ids).length > 0);
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: { md3: { ...record, matrixScope: {} } } }, ids).length > 0);
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: { md3: { ...record, evidencePaths: ["../outside.md"] } } }, ids).length > 0);
    assert.ok(validateDesignVerification({ designCoverage: coverage, verification: { apple: record } }, ids).length > 0);
});

test("local generated freshness compares content snapshots independently of uncommitted changes", () => {
    assert.deepEqual(generatedContentChanges(new Map([["token.ts", "same"]]), new Map([["token.ts", "same"]])), []);
    assert.deepEqual(generatedContentChanges(new Map([["token.ts", "old"], ["removed.ts", "hash"]]), new Map([["token.ts", "new"], ["added.ts", "hash"]])), ["added.ts", "removed.ts", "token.ts"]);
});

test("React peers propagate through runtime wrappers and external peer requirements", () => {
    const manifest = { packages: [
        { name: "page", packageJson: { dependencies: { dialog: "workspace:^" } } },
        { name: "dialog", packageJson: { dependencies: { positioning: "1.0.0" } } },
        { name: "tokens", packageJson: {} },
    ] };
    const facts = new Map(manifest.packages.map(({ name }) => [name, { productionImports: new Set() }]));
    const peers = requiredReactPeers(manifest, facts, new Map([["dialog", new Set(["react", "react-dom"])]]));
    assert.deepEqual([...peers.get("page")], ["react", "react-dom"]);
    assert.deepEqual([...peers.get("tokens")], []);
});

test("React runtime imports require explicit supported peers and retain development dependencies", () => {
    const imports = new Set(["react"]);
    assert.deepEqual(validateReactPeers({ peerDependencies: { react: "^19.2.0" }, devDependencies: { react: "19.3.0" } }, imports), []);
    assert.equal(validateReactPeers({ devDependencies: { react: "19.3.0" } }, imports).length, 1);
    assert.ok(validateReactPeers({ dependencies: { react: "19.3.0" } }, imports).some((error) => error.includes("bundled")));
    assert.ok(validateReactPeers({ peerDependencies: { "react-dom": "^19.2.0" } }, new Set()).some((error) => error.includes("unused")));
});

test("export verification follows root and internal condition targets without treating CSS as JavaScript", () => {
    const targets = exportTargets({
        ".": { types: "./declarations/index.d.ts", import: "./esm/index.mjs", require: "./cjs/index.cjs" },
        "./internal": { types: "./declarations/_wake/src/internal.d.ts", import: "./esm/_wake/src/internal.mjs" },
        "./css/index.css": "./css/index.css",
    });
    assert.equal(targets.length, 6);
    assert.deepEqual(targets.at(-1), { subpath: "./css/index.css", condition: "default", target: "./css/index.css" });
    assert.equal(targets.filter(({ subpath, condition }) => subpath === "./internal" && condition === "types").length, 1);
});

test("additional generated density artifacts participate in CI freshness checks", () => {
    const packages = [{ path: "components/tokens", packageJson: {
        scripts: { "generate:token": "generate" },
        crab: { generatedArtifacts: { "generate:token": ["src/token.ts", "src/density-geometry.ts"] } },
    } }];
    assert.deepEqual(generatedLibraryPaths({ packages }), ["components/tokens/src/density-geometry.ts", "components/tokens/src/token.ts"]);
});

test('generated runtime assets are restored by their owning build cache without hashing themselves as source', () => {
    const entry = { name: 'assets', packageJson: { scripts: {}, crab: { generatedArtifacts: { 'build:library': ['public/runtime/**', 'public/runtime/**'] } } } };
    const other = { name: 'other', packageJson: { scripts: {} } };
    const manifest = { packages: [entry, other] };
    const inspection = new Map(manifest.packages.map(product => [product.name, { productionImports: new Set(), testImports: new Set(), tokenImports: new Set() }]));
    const tasks = createTurboConfig(manifest, inspection).tasks;
    assert.equal(tasks['assets#build:library'].outputs.filter(file => file === 'public/runtime/**').length, 1);
    assert.ok(tasks['assets#build:library'].inputs.includes('!public/runtime/**'));
    assert.ok(!tasks['other#build:library'].outputs.includes('public/runtime/**'));
    for (const invalid of [null, 'public/runtime/**', [''], ['../source/**'], ['/root/**'], ['C:/outside/**'], ['public\\runtime\\**'], ['!public/runtime/**']]) {
        entry.packageJson.crab.generatedArtifacts['build:library'] = invalid;
        assert.throws(() => createTurboConfig(manifest, inspection), /relative positive output patterns/);
    }
});

test("workspace checks resolve both direct Yarn entries and Windows shell wrappers", async () => {
    assert.equal(await resolveYarnEntry("/tools/yarn.cjs"), "/tools/yarn.cjs");
    const entry = "C:\\Program Files\\nodejs\\node_modules\\corepack\\dist\\yarn.js";
    const wrapper = `#!/bin/sh\nexec "C:\\Program Files\\nodejs\\node.exe" '${entry}' "$@"\n`;
    assert.equal(await resolveYarnEntry("C:\\Temp\\xfs-123\\yarn", async () => wrapper), entry);
    await assert.rejects(() => resolveYarnEntry("/tmp/yarn", async () => "#!/bin/sh\necho invalid"));
});

test("workspace check runner preserves child exit codes", async () => {
    assert.equal(await runYarn("-e", ["process.exit(0)"]), 0);
    assert.equal(await runYarn("-e", ["process.exit(7)"]), 7);
});

test("release authorization rejects a different checkout or action SHA, failed run and pull request trigger", () => {
    const run = { conclusion: "success", event: "push", head_branch: "canary", head_repository: { full_name: "owner/library" }, head_sha: "abc" };
    assert.equal(validateReleaseEvent({ workflow_run: run }, "owner/library", "abc", "abc"), true);
    assert.equal(validateReleaseEvent({ workflow_run: run }, "owner/library", "def", "abc"), false);
    assert.equal(validateReleaseEvent({ workflow_run: run }, "owner/library", "abc", "def"), false);
    assert.equal(validateReleaseEvent({ workflow_run: run }, "owner/library", "abc", undefined), false);
    assert.equal(validateReleaseEvent({ workflow_run: { ...run, conclusion: "failure" } }, "owner/library", "abc", "abc"), false);
    assert.equal(validateReleaseEvent({ workflow_run: { ...run, event: "pull_request" } }, "owner/library", "abc", "abc"), false);
    assert.equal(validateReleaseEvent({ workflow_run: run }, "fork/library", "abc", "abc"), false);
});

test("dependency extraction includes public type contracts and lazy runtime imports", () => {
    const imports = extractPackageImports(`
        import type { Row } from '@crab-dev/rc-table';
        export { Button } from '@crab-dev/rc-button';
        import '@crab-dev/css';
        const module = import('elkjs/lib/elk.bundled.js');
        // import Broken from 'not-a-dependency';
    `);
    assert.deepEqual([...imports].sort(), ["@crab-dev/css", "@crab-dev/rc-button", "@crab-dev/rc-table", "elkjs"]);
    assert.equal(packageName("node:fs"), null);
    assert.equal(packageName("../../src/index.js"), null);
});

test("dependency extraction preserves comment markers in strings and ignores actual comments", () => {
    const imports = extractPackageImports(`
        const marker = "/*";
        import { Button } from '@crab-dev/rc-button';
        /* import Missing from 'not-a-dependency'; */
        const end = "*/";
        const url = "https://example.test"; // import('ignored')
        import('@crab-dev/rc-table');
    `);
    assert.deepEqual([...imports].sort(), ["@crab-dev/rc-button", "@crab-dev/rc-table"]);
});

test("cycles report the dependency path instead of silently omitting prerequisites", () => {
    assert.deepEqual(findDependencyCycle(new Map([["button", ["spin"]], ["spin", ["button"]]])), ["button", "spin", "button"]);
    assert.equal(findDependencyCycle(new Map([["button", ["spin"]], ["spin", []]])), null);
});

test("documentation cycles do not enter library builds while token and runtime prerequisites remain", () => {
    const manifest = { packages: [
        { name: "button", packageJson: { dependencies: { spin: "workspace:^" }, devDependencies: { preview: "workspace:^", tokens: "workspace:^" }, scripts: {} } },
        { name: "spin", packageJson: { scripts: {} } },
        { name: "preview", packageJson: { dependencies: { button: "workspace:^" }, scripts: {} } },
        { name: "tokens", packageJson: { scripts: {} } },
    ] };
    const empty = () => ({ productionImports: new Set(), testImports: new Set(), tokenImports: new Set() });
    const inspection = new Map(manifest.packages.map((entry) => [entry.name, empty()]));
    inspection.get("button").tokenImports.add("tokens");
    const graph = libraryBuildGraph(manifest, inspection);
    assert.deepEqual(graph.get("button"), ["spin", "tokens"]);
    assert.equal(findDependencyCycle(graph), null);
    const config = createTurboConfig(manifest, inspection);
    assert.equal(config.tasks.test.cache, false);
    assert.equal(config.tasks['@crab-dev/standards-typescript-preset#test'].cache, false);
    for (const variable of ['RAYON_NUM_THREADS', 'TEMP', 'TMP', 'TMPDIR', 'PLAYWRIGHT_BROWSERS_PATH', 'CRAB_TEST_BROWSER_PATH']) assert.ok(config.globalPassThroughEnv.includes(variable));
    assert.ok(!config.globalPassThroughEnv.includes('*'));
    assert.deepEqual(config.tasks["preview#build:library"].dependsOn, ["button#build:library"]);
    assert.deepEqual(config.tasks["preview#build:library"].outputs, config.tasks["build:library"].outputs);
});
