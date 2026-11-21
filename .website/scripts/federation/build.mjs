import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "@crab-dev/wake";
import { loadLibraryManifest } from "../../../scripts/library-manifest.mjs";
import { isStandaloneDemo } from "../../docs/site/demoDelivery.mjs";

const website = fileURLToPath(new URL("../../", import.meta.url));
const staging = path.join(website, ".tmp");
const publish = path.join(website, "public/federated-demos");
const manifestFile = "wake-federation.json";
const remoteName = "crab_docs_demos";

async function generateLoaders() {
    const { packages } = await loadLibraryManifest();
    const registry = [];
    for (const { slug } of packages) {
        const files = await readdir(path.join(website, "../components", slug, "docs/demos"));
        for (const file of files.sort()) {
            if (!file.endsWith(".demo.tsx")) continue;
            const id = slug + "/docs/demos/" + file;
            if (isStandaloneDemo(id)) continue;
            const source = "../../components/" + id.replace(/\.tsx$/, ".js");
            registry.push("    " + JSON.stringify(id) + ": () => import(" + JSON.stringify(source) + "),");
        }
    }
    await mkdir(staging, { recursive: true });
    await writeFile(path.join(staging, "federated-demo-loaders.ts"), "export const loaders = {\n" + registry.join("\n") + "\n};\n");
}

function collectAssets(manifest) {
    const assets = [manifest.remoteEntry, manifest.types, manifest.remoteEntrySourceMap];
    for (const expose of Object.values(manifest.exposes)) {
        assets.push(expose.entry, expose.sourceMap, ...expose.css, ...expose.synchronousAssets, ...expose.asynchronousAssets);
    }
    return Object.fromEntries(assets.filter(Boolean).map(({ url, integrity }) => [url, integrity]));
}

export async function buildFederatedDemos() {
    await generateLoaders();
    const outdir = path.join(staging, "federated-demos");
    await build({
        cwd: website,
        entry: "scripts/federation/entry.ts",
        outdir,
        federation: {
            enabled: true,
            name: remoteName,
            exposes: {
                "./demo": {
                    entry: "scripts/federation/demo.tsx",
                    mode: "isolated",
                    scope: "docs-demos",
                    shadow: "open",
                },
            },
        },
    });
    const rawManifest = await readFile(path.join(outdir, manifestFile));
    const manifest = JSON.parse(rawManifest);
    const allowedAssets = collectAssets(manifest);
    const destination = path.join(publish, manifest.buildId);
    await mkdir(destination, { recursive: true });
    await Promise.all(Object.keys(allowedAssets).map(async (asset) => {
        const target = path.join(destination, asset);
        await mkdir(path.dirname(target), { recursive: true });
        await copyFile(path.join(outdir, asset), target);
    }));
    await writeFile(path.join(destination, manifestFile), rawManifest);
    const lock = {
        buildId: manifest.buildId,
        hasExposes: true,
        manifestIntegrity: "sha384-" + createHash("sha384").update(rawManifest).digest("base64"),
        typesIntegrity: manifest.types.integrity,
        allowedAssets,
    };
    // Publish the pointer after all resources for this build are present.
    const pending = path.join(staging, "federated-demos-lock.json");
    await writeFile(pending, JSON.stringify(lock));
    await rename(pending, path.join(publish, "lock.json"));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await buildFederatedDemos();
}
