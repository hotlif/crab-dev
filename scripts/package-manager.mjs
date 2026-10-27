import { readFile } from "node:fs/promises";

/** Yarn may expose a generated shell launcher as npm_execpath, including on Windows. */
export async function resolveYarnEntry(launcher, read = readFile) {
    if (!launcher) throw new Error("Run workspace checks through yarn check.");
    if (/\.[cm]?js$/i.test(launcher)) return launcher;
    const source = await read(launcher, "utf8");
    const entries = [...source.matchAll(/(["'])([^"'\r\n]+\.[cm]?js)\1/g)]
        .map((match) => match[2])
        .filter((entry) => /(?:^|[/\\])(?:yarn(?:-[^/\\]+)?|corepack)\.[cm]?js$/i.test(entry));
    if (entries.length !== 1) throw new Error("Unable to resolve the Yarn JavaScript entry from its launcher.");
    return entries[0];
}
