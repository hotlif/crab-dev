import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

/** Authored and generated inputs, excluding evidence, caches and build outputs. */
export async function sourceRevision() {
    // Exclude evidence before Git writes the listing: it is outside the hash
    // domain and a full visual matrix can exceed execFileSync's output buffer.
    // Keep the filters below as a second boundary for every listed path.
    const listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", ".",
        ":(exclude,glob).website/review/**", ":(exclude,glob).yarn/cache/**", ":(exclude,glob).yarn/unplugged/**",
    ], { cwd: repositoryRoot, encoding: "utf8" });
    const paths = [...new Set(listed.split("\0").filter(Boolean))].filter(file =>
        !/^\.website\/review\//.test(file)
        && !/^\.yarn\/(?:cache|unplugged)\//.test(file)
        && !/(?:^|\/)(?:\.tmp|\.cache|\.turbo|\.wake|coverage|node_modules|esm|cjs|declarations|css|docs-dist)(?:\/|$)/.test(file)
    ).sort();
    const hash = createHash("sha256");
    let files = 0;
    let bytes = 0;
    for (const file of paths) {
        hash.update(file + "\0");
        try {
            const content = await readFile(path.join(repositoryRoot, file));
            hash.update(createHash("sha256").update(content).digest());
            files++;
            bytes += content.length;
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
            hash.update("deleted\0");
        }
    }
    return {
        source: { kind: "worktree", ref: `sha256:${hash.digest("hex")}` },
        head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" }).trim(),
        files, bytes,
        scope: "Git tracked and nonignored working-tree inputs; excludes review evidence, Yarn archives/unplugged, caches, and library/site build outputs. Includes token/docgen/aggregate generated sources and install metadata.",
    };
}
