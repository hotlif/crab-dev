import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const temporaryRoot = path.resolve(fileURLToPath(new URL("../../.tmp/", import.meta.url)));
await mkdir(temporaryRoot, { recursive: true });
const fixture = await mkdtemp(path.join(temporaryRoot, "crab-source-revision-"));
const repository = path.join(fixture, "worktree");
await mkdir(repository);
// Keep fixture metadata separate from the checkout and the real repository's index.
const inheritedGitEnvironment = { GIT_DIR: process.env.GIT_DIR, GIT_WORK_TREE: process.env.GIT_WORK_TREE, GIT_INDEX_FILE: process.env.GIT_INDEX_FILE };
process.env.GIT_DIR = path.join(fixture, "git-metadata");
process.env.GIT_WORK_TREE = repository;
delete process.env.GIT_INDEX_FILE;
const git = (args, options = {}) => execFileSync("git", args, {
    cwd: repository, encoding: "utf8", windowsHide: true, ...options,
});
const listingArguments = ["ls-files", "--cached", "--others", "--exclude-standard", "-z"];

// Independent reference for the original full-listing, then Node-filtered domain.
async function originalRevision() {
    const listed = git(listingArguments, { maxBuffer: 8 * 1024 * 1024 });
    const files = [...new Set(listed.split("\0").filter(Boolean))].filter(file =>
        !/^\.website\/review\//.test(file)
        && !/^\.yarn\/(?:cache|unplugged)\//.test(file)
        && !/(?:^|\/)(?:\.tmp|\.cache|\.turbo|\.wake|coverage|node_modules|esm|cjs|declarations|css|docs-dist)(?:\/|$)/.test(file)
    ).sort();
    const hash = createHash("sha256");
    let count = 0;
    let bytes = 0;
    for (const file of files) {
        hash.update(file + "\0");
        try {
            const content = await readFile(path.join(repository, file));
            hash.update(createHash("sha256").update(content).digest());
            count++;
            bytes += content.length;
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
            hash.update("deleted\0");
        }
    }
    return { source: { kind: "worktree", ref: `sha256:${hash.digest("hex")}` }, files: count, bytes };
}

try {
    git(["init", "--quiet"]);
    git(["config", "core.autocrlf", "false"]);
    git(["-c", "user.name=Source revision fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "--quiet", "-m", "fixture"]);
    await mkdir(path.join(repository, ".website/scripts"), { recursive: true });
    await copyFile(new URL("./source-revision.mjs", import.meta.url), path.join(repository, ".website/scripts/source-revision.mjs"));
    const write = async (file, content) => {
        const target = path.join(repository, file);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, content);
    };
    await write(".gitignore", "ignored/\n");
    await write("authored.txt", "original source\n");
    await write("中文/source with spaces.txt", "non-ASCII path\n");
    await write("tracked-deleted.txt", "removed after indexing\n");
    await write(".website/reviewer.txt", "similarly named source must remain included\n");
    const excludedFiles = [
        ".website/review/untracked.json", ".yarn/cache/archive.zip", ".yarn/unplugged/package/index.js",
        "nested/.tmp/output.txt", "nested/esm/output.js", ".website/docs-dist/index.html", "ignored/source.txt",
    ];
    for (const file of excludedFiles) await write(file, "excluded original\n");
    git(["add", "authored.txt", "tracked-deleted.txt", ".website/reviewer.txt"]);
    await rm(path.join(repository, "tracked-deleted.txt"));

    // Index-only evidence reproduces the buffer failure without creating 10,000 files.
    const emptyBlob = git(["hash-object", "-w", "--stdin"], { input: "" }).trim();
    const evidencePaths = Array.from({ length: 10000 }, (_, index) =>
        `.website/review/runs/${"component-state-".repeat(8)}${String(index).padStart(5, "0")}.json`);
    git(["update-index", "--index-info"], {
        input: [...evidencePaths, ".yarn/cache/tracked.zip", ".yarn/unplugged/tracked/index.js"]
            .map(file => `100644 ${emptyBlob}\t${file}\n`).join(""),
    });
    assert.ok(Buffer.byteLength(git(listingArguments, { maxBuffer: 8 * 1024 * 1024 })) > 1024 * 1024);
    let overflow;
    try { git(listingArguments); } catch (error) { overflow = error; }
    assert.equal(overflow?.code, "ENOBUFS", "the unfiltered listing must reproduce the default-buffer failure");

    const { sourceRevision } = await import(pathToFileURL(path.join(repository, ".website/scripts/source-revision.mjs")).href);
    const compare = async () => {
        const actual = await sourceRevision();
        assert.deepEqual({ source: actual.source, files: actual.files, bytes: actual.bytes }, await originalRevision());
        assert.equal(actual.head, git(["rev-parse", "HEAD"]).trim());
        return actual;
    };
    const initial = await compare();
    for (const file of excludedFiles) await write(file, "excluded changed and longer\n");
    assert.deepEqual(await compare(), initial, "evidence, caches, ignored files and outputs must not affect the hash");
    await write("authored.txt", "source edit\n");
    const edited = await compare();
    assert.notEqual(edited.source.ref, initial.source.ref);
    await write("tracked-deleted.txt", "restored\n");
    assert.notEqual((await compare()).source.ref, edited.source.ref, "a tracked deletion must stay in the hash domain");
    console.log("PASS: source hash domain matches the original algorithm; 10,000 index-only evidence paths exceed 1 MiB without overflowing the filtered command; excluded mutations, authored edits and tracked deletions verified.");
} finally {
    for (const [name, value] of Object.entries(inheritedGitEnvironment)) {
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
    }
    assert.ok(fixture.startsWith(temporaryRoot + path.sep) && path.basename(fixture).startsWith("crab-source-revision-"));
    await rm(fixture, { recursive: true, force: true });
}
