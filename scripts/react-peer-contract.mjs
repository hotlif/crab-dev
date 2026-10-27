import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

// useEffectEvent establishes the library's React 19.2 API floor; development runs 19.3.
export const reactPeerRanges = { react: "^19.2.0", "react-dom": "^19.2.0" };

/** Peer contracts must pass through every runtime ancestor, including wrapper components. */
export function requiredReactPeers(manifest, inspection, externalPeers = new Map()) {
    const packages = new Map(manifest.packages.map((entry) => [entry.name, entry]));
    const result = new Map(manifest.packages.map((entry) => [entry.name, new Set([
        ...Object.keys(reactPeerRanges).filter((name) => inspection.get(entry.name).productionImports.has(name)),
        ...externalPeers.get(entry.name) ?? [],
    ])]));
    let changed;
    do {
        changed = false;
        for (const entry of manifest.packages) {
            const peers = result.get(entry.name);
            for (const dependency of Object.keys(entry.packageJson.dependencies ?? {})) {
                if (!packages.has(dependency)) continue;
                for (const peer of result.get(dependency)) {
                    if (!peers.has(peer)) { peers.add(peer); changed = true; }
                }
            }
        }
    } while (changed);
    return result;
}

export async function loadReactPeerRequirements(manifest, inspection) {
    const pnp = createRequire(import.meta.url)("pnpapi");
    const names = new Set(manifest.packages.map((entry) => entry.name));
    const externalPeers = new Map();
    for (const entry of manifest.packages) {
        const peers = new Set();
        for (const dependency of Object.keys(entry.packageJson.dependencies ?? {})) {
            if (names.has(dependency)) continue;
            const path = pnp.resolveToUnqualified(dependency, resolve(entry.directory, "package.json"));
            const location = pnp.getPackageInformation(pnp.findPackageLocator(path)).packageLocation;
            const pkg = JSON.parse(await readFile(resolve(location, "package.json"), "utf8"));
            for (const peer of Object.keys(reactPeerRanges)) {
                if (pkg.peerDependencies?.[peer] && !pkg.peerDependenciesMeta?.[peer]?.optional) peers.add(peer);
            }
        }
        externalPeers.set(entry.name, peers);
    }
    return requiredReactPeers(manifest, inspection, externalPeers);
}
