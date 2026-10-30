import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from 'node:crypto';
import { repositoryRoot, readLibraryMetadata } from "../library-manifest.mjs";
import { linuxVisualImage as image } from "./environment.mjs";
import { assertLocalDockerEndpoint } from "./local-docker.mjs";
import { copyImmutableYarnCache, inspectVisualStorage } from './local-storage.mjs';
import { visualCaptureScope } from './argument-intent.mjs';
import { hasSnapshotUpdateOption, transferNativeBaselines } from './baseline-transfer.mjs';

const args = process.argv.slice(2);
if (!args.length) args.push('test:visual:build');
const hostStorage = await inspectVisualStorage(repositoryRoot, visualCaptureScope(args.slice(1)) === 'repository' ? 'repository' : 'filtered');

const endpoint = process.env.DOCKER_HOST || JSON.parse(execFileSync("docker", ["context", "inspect"], { encoding: "utf8" }))[0]?.Endpoints?.docker?.Host;
assertLocalDockerEndpoint(endpoint);

// A local snapshot includes uncommitted files. Windows native artifacts and PnP
// runtime are not reused by Linux; installation/builds happen only in this copy.
const id = new Date().toISOString().replaceAll(/[:.]/g, "-");
const resources = { cpus: 6, nativeBuildThreads: 2 };
const root = path.join(repositoryRoot, ".tmp", `visual-linux-${id}`);
await mkdir(root, { recursive: true });
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: repositoryRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).split("\0").filter(Boolean);
const copied = [];
const hashes = new Map();
const evidencePaths = readLibraryMetadata().packages.flatMap(product => Object.values(product.verification ?? {}).flatMap(record => record.evidencePaths ?? []));
const requiredEvidence = evidencePaths.map(file => file.startsWith('.website/review/') ? file.split('/').slice(0, 3).join('/') : file);
function included(name) {
    return !name.startsWith('.pnp.') && !name.startsWith('.yarn/cache/') && (!(name.startsWith('.website/review/') || name.startsWith('.reports/')) || requiredEvidence.some(file => name === file || name.startsWith(`${file}/`)));
}
for (const name of files) {
    if (!included(name)) continue;
    const source = path.join(repositoryRoot, name), target = path.join(root, name);
    try {
        const bytes = await readFile(source);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, bytes);
        copied.push(name);
        hashes.set(name, createHash('sha256').update(bytes).digest('hex'));
    } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const offlineCache = await copyImmutableYarnCache(path.join(repositoryRoot, '.yarn/cache'), path.join(root, '.yarn/cache'));
// A candidate must represent one local source state, including uncommitted
// additions. Refuse a torn copy while another package is still being edited.
for (const name of copied) {
    const bytes = await readFile(path.join(repositoryRoot, name));
    if (createHash('sha256').update(bytes).digest('hex') !== hashes.get(name)) throw Error(`Local source changed while preparing the snapshot: ${name}. The incomplete snapshot is retained; freeze sources and retry.`);
}
const latestFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: repositoryRoot, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).split('\0').filter(Boolean);
const initialFiles = new Set(files);
if (latestFiles.some(name => included(name) && !initialFiles.has(name))) throw Error('Local source files were added while preparing the snapshot. The incomplete snapshot is retained; freeze sources and retry.');
if (args.some(argument => argument.includes("\0"))) throw Error("Invalid command argument");
const { packageManager } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (!/^yarn@\d+\.\d+\.\d+(?:\+sha(?:224|512)\.[a-f0-9]+)?$/.test(packageManager)) throw Error('The root packageManager must pin Yarn');
const command = `set -eu\ncorepack enable\ncorepack prepare '${packageManager}' --activate\nyarn install --immutable\nyarn node scripts/visual/provision-browser.mjs\nmkdir -p .cache/visual\n{ node --version; yarn --version; uname -a; fc-list -f '%{family}|%{style}|%{fontversion}|%{file}\\n' | sort; fc-scan -f '%{family}|%{style}|%{fontversion}|%{file}\\n' .website/docs/assets/fonts/*.woff2; sha256sum .website/docs/assets/fonts/*.woff2; } > .cache/visual/linux-environment.txt\nexec xvfb-run -a yarn "$@"`;
await writeFile(path.join(root, "local-linux-snapshot.json"), JSON.stringify({ createdAt: new Date().toISOString(), image, endpoint, resources, hostStorage, offlineCache, files: copied, sourceFiles: Object.fromEntries(hashes), args }, null, 2));
console.log(`Local Linux candidate: ${root}`);
const container = `crab-visual-${id.toLowerCase()}`;
async function docker(arguments_) {
    const child = spawn("docker", arguments_, { cwd: repositoryRoot, stdio: "inherit", windowsHide: true });
    return await new Promise((resolve, reject) => { child.once("error", reject); child.once("exit", code => resolve(code ?? 1)); });
}
// Use the container's Linux filesystem. NTFS bind mounts amplify the native
// compiler's staging allocations and directory traversal cost on Docker Desktop.
let code = await docker(["create", "--init", "--ipc=host", `--cpus=${resources.cpus}`, "--name", container, "--workdir", "/workspace", "--env", "PLAYWRIGHT_FORCE_ASYNC_LOADER=1", "--env", `RAYON_NUM_THREADS=${resources.nativeBuildThreads}`, "--env", `CRAB_VISUAL_IMAGE=${image}`, "--entrypoint", "bash", image, "-lc", command, "crab-local-visual", ...args]);
if (code !== 0) throw Error("Unable to create local visual container");
await writeFile(path.join(root, "container.json"), JSON.stringify({ container, image, args }, null, 2));
code = await docker(["cp", `${root}/.`, `${container}:/workspace`]);
if (code !== 0) throw Error("Unable to copy the local candidate into Linux");
code = await docker(["start", "--attach", container]);
const actualCode = Number(execFileSync("docker", ["inspect", "--format", "{{.State.ExitCode}}", container], { encoding: "utf8" }).trim());
process.exitCode = code || actualCode;
const evidence = path.join(root, "evidence");
await mkdir(evidence, { recursive: true });
await copyFile(path.join(root, 'local-linux-snapshot.json'), path.join(evidence, 'local-linux-snapshot.json'));
const evidenceExitCode = await docker(["cp", `${container}:/workspace/.cache/visual/.`, evidence]);
process.exitCode ||= evidenceExitCode;
let baselineTransfer;
if (!process.exitCode && (args[0] === 'test:visual:update' || hasSnapshotUpdateOption(args)) && !args.some(arg => ['--list', '--help', '--candidate'].includes(arg))) {
    const input = path.join(root, 'native-baselines/linux');
    await mkdir(input, { recursive: true });
    const baselineExitCode = await docker(['cp', `${container}:/workspace/test/visual/baselines/linux/.`, input]);
    process.exitCode ||= baselineExitCode;
    if (!baselineExitCode) {
        try {
            baselineTransfer = await transferNativeBaselines({ root: repositoryRoot, input: path.dirname(input), history: path.join(root, 'baseline-history'), before: Object.fromEntries(hashes) });
            await writeFile(path.join(evidence, 'baseline-transfer.json'), JSON.stringify(baselineTransfer, null, 2));
        } catch (error) {
            process.exitCode = 1;
            baselineTransfer = { error: error.message, input };
            console.error(error.message);
        }
    }
}
await writeFile(path.join(root, "container-result.json"), JSON.stringify({ container, exitCode: process.exitCode, evidence, evidenceExitCode, ...(baselineTransfer ? { baselineTransfer } : {}) }, null, 2));
console.log(`Local Linux evidence: ${evidence}; retained stopped container: ${container}`);
