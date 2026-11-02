import { realpath, stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export const slash = path => path.split(sep).join("/");
export const within = (path, parent) => path === parent || path.startsWith(`${parent}/`);
export const reference = (path, purpose) => ({ path, purpose });

async function exists(path) {
    try { await stat(path); return true; }
    catch (error) { if (error.code === "ENOENT" || error.code === "ENOTDIR") return false; throw error; }
}

export async function existing(root, entries) {
    const results = await Promise.all(entries.map(async entry => await exists(resolve(root, entry.path)) ? entry : null));
    return results.filter(Boolean);
}

export async function inheritedRules(root, target) {
    const absolute = resolve(root, target);
    const location = relative(root, absolute);
    if (location === ".." || location.startsWith(`..${sep}`) || isAbsolute(location)) throw new Error("规则目标必须在仓库内。");
    const info = await stat(absolute);
    let directory = info.isDirectory() ? absolute : dirname(absolute);
    const result = [];
    while (true) {
        const rule = resolve(directory, "AGENTS.md");
        if (await exists(rule)) result.unshift(reference(slash(relative(root, rule)), "适用规则（由外到内继承）"));
        if (relative(root, directory) === "") break;
        directory = dirname(directory);
    }
    return result;
}

export function artifactKind(path) {
    if (path === "MILESTONE.md" || /(^|\/)(?:\.reports|review)(?:\/|$)/.test(path)) return "history";
    if (/(^|\/)(?:\.tmp|\.cache|\.turbo|\.wake[^/]*|coverage|node_modules|docs-dist|dist|esm|cjs|declarations|css)(?:\/|$)/.test(path)
        || within(path, ".yarn")) return "artifact";
    return "source";
}


export async function resolveTarget(root, target, named) {
    const absolute = resolve(root, named?.path ?? target.replaceAll("\\", "/"));
    const inside = path => { const result = relative(root, path); return result !== ".." && !result.startsWith(`..${sep}`) && !isAbsolute(result); };
    if (!inside(absolute)) throw new Error("目标必须在仓库内。");
    if (!await exists(absolute)) throw new Error(`未知目标：${target}。请提供已有包名或仓库相对路径。`);
    const canonical = await realpath(absolute);
    if (!inside(canonical)) throw new Error("目标实际路径必须在仓库内。");
    const path = slash(relative(root, canonical)) || ".";
    return path;
}
