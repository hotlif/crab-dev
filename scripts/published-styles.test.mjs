import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectPublishedStyles } from "./published-styles.mjs";

test("published styles follow dependencies, deduplicate roots and reject missing advertised CSS", async () => {
    const root = await mkdtemp(join(tmpdir(), "crab-published-styles-"));
    try {
        const entries = ["base", "view", "headless"].map(name => ({ name: `@fixture/${name}`, path: name }));
        await writeFile(join(root, "library.manifest.json"), JSON.stringify({ packages: entries }));
        for (const entry of entries) {
            await mkdir(join(root, entry.path, "css"), { recursive: true });
            await writeFile(join(root, entry.path, "package.json"), JSON.stringify({ name: entry.name,
                dependencies: entry.path === "view" ? { "@fixture/base": "workspace:^" } : {},
                exports: entry.path === "headless" ? {} : { "./css/index.css": "./css/index.css" },
            }));
            if (entry.path !== "headless") await writeFile(join(root, entry.path, "css/index.css"), entry.path);
        }
        assert.deepEqual(await collectPublishedStyles([join(root, "view"), join(root, "base"), join(root, "headless")], { root }), ["base", "view"]);
        await rm(join(root, "base", "css/index.css"));
        await assert.rejects(collectPublishedStyles([join(root, "view")], { root }), { code: "ENOENT" });
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});
