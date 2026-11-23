import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join, normalize, parse, resolve, sep } from "node:path";

/** Present the current project's declared dependency graph to the native compiler's FS callbacks. */
export function typecheckFileSystem(project) {
    const pnp = createRequire(project)("pnpapi");
    const owner = pnp.findPackageLocator(project);
    if (!owner) throw new Error(`No PnP package owns ${project}`);
    const directories = new Map();
    const links = new Map();
    const packages = new Map();
    const locations = new Map();
    const virtualRoot = join(parse(project).root, "__crab_typescript_pnp__");
    const key = path => process.platform === "win32" ? path.toLowerCase() : path;

    function addEntry(directory, entry) {
        const id = key(directory);
        if (!directories.has(id)) directories.set(id, new Set());
        directories.get(id).add(entry);
    }

    function visit(locator) {
        const info = pnp.getPackageInformation(locator);
        const root = resolve(info.packageLocation);
        if (packages.has(root)) return packages.get(root);
        // Give dependencies separate ancestors. An import inside a dependency must
        // not fall through to packages declared only by its parent or the project.
        const id = String(locations.size);
        const canonical = packages.size ? join(virtualRoot, id, "node_modules", locator.name) : root;
        locations.set(id, { root, canonical });
        packages.set(root, canonical);
        const modules = join(canonical, "node_modules");
        for (const [name, reference] of info.packageDependencies) {
            if (reference === null) continue;
            const dependency = pnp.getLocator(name, reference);
            const target = join(modules, name);
            const [scope, part] = name.split("/");
            addEntry(modules, scope);
            if (part) addEntry(dirname(target), part);
            links.set(key(target), visit(dependency));
        }
        return canonical;
    }
    visit(owner);

    // Canonicalize package links while retaining Yarn's peer-specific virtual paths.
    // This also lets TypeScript perform its own exports, subpath and @types resolution.
    const paths = new Map();
    function translate(path) {
        if (paths.has(path)) return paths.get(path);
        const parent = dirname(path);
        const candidate = parent === path ? path : join(translate(parent), basename(path));
        const result = links.get(key(candidate)) ?? candidate;
        paths.set(path, result);
        return result;
    }
    function lookup(input) {
        const path = normalize(input);
        const canonical = translate(path);
        const entries = directories.get(key(canonical));
        if (key(canonical).startsWith(key(virtualRoot + sep))) {
            const [id] = canonical.slice(virtualRoot.length + 1).split(sep, 1);
            const location = locations.get(id);
            if (location && (key(canonical) === key(location.canonical) || key(canonical).startsWith(key(location.canonical + sep)))) {
                return { target: join(location.root, canonical.slice(location.canonical.length)), canonical, entries };
            }
        }
        if (entries || canonical !== path || canonical.includes(`.zip${sep}`) || canonical.includes(`${sep}__virtual__${sep}`)) {
            return { target: canonical, canonical, entries };
        }
    }
    const fs = {
        directoryExists(path) {
            const item = lookup(path);
            if (item) return Boolean(item.entries || statSync(item.target, { throwIfNoEntry: false })?.isDirectory());
        },
        fileExists(path) {
            const item = lookup(path);
            if (item) return !item.entries && Boolean(statSync(item.target, { throwIfNoEntry: false })?.isFile());
        },
        readFile(path) {
            const item = lookup(path);
            if (!item) return undefined;
            if (item.entries || !statSync(item.target, { throwIfNoEntry: false })?.isFile()) return null;
            return readFileSync(item.target, "utf8");
        },
        getAccessibleEntries(path) {
            const item = lookup(path);
            if (!item) return undefined;
            if (item.entries) return { files: [], directories: [...item.entries] };
            const entries = statSync(item.target, { throwIfNoEntry: false })?.isDirectory() ? readdirSync(item.target, { withFileTypes: true }) : [];
            return { files: entries.filter(e => e.isFile()).map(e => e.name), directories: entries.filter(e => e.isDirectory()).map(e => e.name) };
        },
        realpath(path) {
            return lookup(path)?.canonical.replaceAll(sep, "/");
        },
    };
    return { fs, sourcePath: path => lookup(path)?.target ?? path };
}
