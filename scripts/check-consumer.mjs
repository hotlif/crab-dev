import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadLibraryManifest, repositoryRoot } from "./library-manifest.mjs";
import { resolveYarnEntry } from "./package-manager.mjs";
import { exportTargets } from "./check-exports.mjs";

function run(command, args, options) {
    return new Promise((resolveRun, reject) => {
        let output = "";
        const child = spawn(command, args, { windowsHide: true, ...options, stdio: ["ignore", "pipe", "pipe"] });
        child.stdout.on("data", (chunk) => { output += chunk; });
        child.stderr.on("data", (chunk) => { output += chunk; });
        child.once("error", reject);
        child.once("exit", (code) => code === 0 ? resolveRun(output) : reject(new Error(`${args.join(" ")} failed (${code}):\n${output}`)));
    });
}

/** Pack real publish artifacts, then install them outside the repository without network access. */
export async function checkConsumer() {
    const { packages } = await loadLibraryManifest();
    const yarn = await resolveYarnEntry(process.env.npm_execpath);
    const rootPackage = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8"));
    const directory = await mkdtemp(join(tmpdir(), "crab-library-consumer-"));
    const archives = join(directory, "packages");
    await mkdir(archives);
    // Parent Yarn's injected PnP loaders would make a consumer accidentally resolve workspace source.
    const env = { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: "false", YARN_ENABLE_NETWORK: "false" };
    delete env.NODE_OPTIONS;
    delete env.NODE_PATH;
    const dependencies = {};
    for (let offset = 0; offset < packages.length; offset += 4) {
        const batch = packages.slice(offset, offset + 4);
        const results = await Promise.allSettled(batch.map(async (entry) => {
            const archive = join(archives, `${entry.slug}.tgz`);
            await run(process.execPath, [yarn, "pack", "--out", archive], { cwd: entry.directory, env });
            dependencies[entry.name] = `file:./packages/${entry.slug}.tgz`;
        }));
        const failures = results.filter((result) => result.status === "rejected");
        if (failures.length) throw new AggregateError(failures.map((result) => result.reason), "Library packing failed.");
    }
    await copyFile(join(repositoryRoot, "yarn.lock"), join(directory, "yarn.lock"));
    await writeFile(join(directory, "package.json"), JSON.stringify({
        name: "crab-library-consumer-check", private: true, type: "module", packageManager: rootPackage.packageManager,
        dependencies: { ...dependencies, typescript: rootPackage.devDependencies.typescript, react: rootPackage.devDependencies.react, "react-dom": rootPackage.devDependencies["react-dom"], "@types/react": "^19.3.0", "@types/react-dom": "^19.3.0" },
        resolutions: dependencies,
    }, null, 4));
    await writeFile(join(directory, ".yarnrc.yml"), JSON.stringify({
        nodeLinker: "pnp", pnpFallbackMode: "none", enableScripts: false, enableNetwork: false, enableGlobalCache: false,
        cacheFolder: join(repositoryRoot, ".yarn", "cache"),
        // Third-party package metadata fixes; no library package receives injected dependencies.
        packageExtensions: {
            "elkjs@0.12.0": { dependencies: { "web-worker": "1.4.1" } },
            "lucide-react@*": { dependencies: { "@types/react": "^19.3.0" } },
        },
    }, null, 4));
    console.log(`Packed ${packages.length} libraries; installing independent PnP consumer without network (${directory}).`);
    await run(process.execPath, [yarn, "install", "--mode=skip-build"], { cwd: directory, env });
    await run(process.execPath, [yarn, "install", "--immutable", "--mode=skip-build"], { cwd: directory, env });
    const targets = packages.flatMap((entry) => exportTargets(entry.packageJson.exports).map((target) => ({ ...target, name: entry.name })));
    const javascript = packages.filter((entry) => exportTargets(entry.packageJson.exports).some((target) => target.subpath === "." && target.condition === "import"));
    await writeFile(join(directory, "consume.mjs"), `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pnp = require('pnpapi');
const keys = module => Object.keys(module).filter(key => key !== '__esModule').sort();
const errors = [];
for (const name of ${JSON.stringify(javascript.map(({ name }) => name))}) {
    try {
        const location = pnp.getPackageInformation(pnp.findPackageLocator(require.resolve(name))).packageLocation;
        assert.ok(!location.includes('/components/') && !location.includes('\\\\components\\\\'), name + ' resolved workspace source');
        assert.deepEqual(keys(await import(name)), keys(require(name)), name + ' ESM/CJS exports differ');
    } catch (error) { errors.push(name + ': ' + error.message); }
}
for (const {name, subpath, target} of ${JSON.stringify(targets)}) {
    if (target.includes('*')) continue;
    try { require.resolve(name + (subpath === '.' ? '' : subpath.slice(1))); }
    catch (error) { errors.push(name + subpath + ': ' + error.message); }
}
for (const {name, subpath, target, condition} of ${JSON.stringify(targets)}) {
    if (subpath === '.' || condition !== 'import' || !/\\.[cm]?js$/.test(target) || target.includes('*')) continue;
    const specifier = name + subpath.slice(1);
    try { assert.deepEqual(keys(await import(specifier)), keys(require(specifier)), specifier + ' ESM/CJS exports differ'); }
    catch (error) { errors.push(specifier + ': ' + error.message); }
}
try {
    const hooks = await import('@crab-dev/rc-hooks');
    const internal = await import('@crab-dev/rc-hooks/internal');
    assert.equal(typeof internal.registerOverlayLayer, 'function');
    assert.ok(!('registerOverlayLayer' in hooks));
    assert.equal(typeof hooks.uniqueId(), 'string');
    const config = await import('@crab-dev/rc-config-provider');
    const configInternal = await import('@crab-dev/rc-config-provider/internal');
    assert.equal(typeof configInternal.useConfigStyleBoundary, 'function');
    assert.ok(!('useConfigStyleBoundary' in config));
    assert.ok(!('createScopedBrandCss' in config));
    assert.ok(!('createScopedBrandCss' in configInternal));
    const cron = await import('@crab-dev/rc-cron-picker');
    const value = cron.parseCron('* * * * *');
    assert.ok(value);
    assert.equal(typeof cron.describeCron(value), 'string');
    const card = (await import('@crab-dev/rc-card')).default;
    const commonCard = require('@crab-dev/rc-card').default;
    for (const part of ['Cover', 'Header', 'Body', 'Footer', 'Meta']) {
        assert.equal(typeof card[part], 'function', 'Card.' + part + ' missing from ESM');
        assert.equal(typeof commonCard[part], 'function', 'Card.' + part + ' missing from CommonJS');
    }
} catch (error) { errors.push('Internal entrypoint: ' + error.message); }
if (errors.length) throw new Error(errors.join('\\n\\n'));
console.log('Independent packaged ESM/CommonJS, internal and asset entrypoints verified.');
`);
    const failures = [];
    try {
        const output = await run(process.execPath, [yarn, "node", "consume.mjs"], { cwd: directory, env });
        process.stdout.write(output);
    } catch (error) { failures.push(error.message); }
    const imports = javascript.map(({ name }, index) => `import * as Package${index} from ${JSON.stringify(name)};\nvoid Package${index};`).join("\n");
    await writeFile(join(directory, "consumer.tsx"), `${imports}
import { uniqueId } from '@crab-dev/rc-hooks';
import { useDevicePixelRatio } from '@crab-dev/rc-hooks/internal';
import type { OverlayLayer } from '@crab-dev/rc-hooks/internal';
import type { RefObject } from 'react';
import { useConfigStyleBoundary } from '@crab-dev/rc-config-provider/internal';
import type { ConfigStyleBoundary } from '@crab-dev/rc-config-provider/internal';
import { describeCron, parseCron } from '@crab-dev/rc-cron-picker';
import { useEdgeRouting } from '@crab-dev/rc-flow-diagram';
import type { RealmProps } from '@crab-dev/rc-realm';
type DefaultRealmProps = RealmProps;
type TypedRealmProps = RealmProps<{ message: string }>;
const id: string = uniqueId();
void id;
const cron = parseCron('* * * * *');
if (cron) { const text: string = describeCron(cron); void text; }
export function useOptionalRoutingContract() { return useEdgeRouting({}, []); }
export function useInternalConfigBoundaryContract(): ConfigStyleBoundary { return useConfigStyleBoundary(); }
export function useInternalRasterContract(target: RefObject<Element | null>) {
    const inherited: number = useDevicePixelRatio(target);
    const explicit: number = useDevicePixelRatio(target, false);
    const defaulted: number = useDevicePixelRatio(target, undefined);
    // @ts-expect-error The internal flag accepts booleans, never string values.
    useDevicePixelRatio(target, 'false');
    return { inherited, explicit, defaulted };
}
export type { OverlayLayer, DefaultRealmProps, TypedRealmProps };
`);
    await copyFile(join(repositoryRoot, "components", "rc-card", "src", "__tests__", "card-public.typecheck.tsx"), join(directory, "card-public.typecheck.tsx"));
    await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ESNext", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false, types: ["react", "react-dom"], lib: ["ESNext", "DOM", "DOM.Iterable"] }, include: ["consumer.tsx", "card-public.typecheck.tsx"] }, null, 4));
    try {
        await run(process.execPath, [yarn, "exec", "tsc", "--noEmit"], { cwd: directory, env });
    } catch (error) { failures.push(error.message); }
    if (failures.length) throw new Error(failures.join("\n\n"));
    assert.equal(packages.length, Object.keys(dependencies).length);
    console.log(`Independent packed consumer verified for ${packages.length} packages (${directory}).`);
    return { directory, packages: packages.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        await checkConsumer();
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
