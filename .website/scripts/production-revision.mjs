import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Fingerprint all served artifacts; an unchanged HTML shell alone is insufficient. */
export async function productionRevision() {
    const root = fileURLToPath(new URL("../docs-dist/", import.meta.url));
    const hash = createHash("sha256");
    let files = 0;
    let bytes = 0;
    async function visit(directory) {
        const entries = await readdir(path.join(root, directory), { withFileTypes: true });
        entries.sort((a, b) => a.name.localeCompare(b.name, "en"));
        for (const entry of entries) {
            const relative = path.join(directory, entry.name);
            if (entry.isDirectory()) await visit(relative);
            else if (entry.isFile()) {
                const content = await readFile(path.join(root, relative));
                hash.update(relative.replaceAll("\\", "/") + "\0");
                hash.update(createHash("sha256").update(content).digest());
                files++;
                bytes += content.length;
            }
        }
    }
    await visit("");
    return { sha256: hash.digest("hex"), files, bytes };
}
