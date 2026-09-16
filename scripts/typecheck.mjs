import { spawn, execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { access, mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setTimeout } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const toolchain = JSON.parse(await readFile(new URL("./typescript-pnp.lock.json", import.meta.url), "utf8"));
const platform = `${process.platform}-${process.arch}`;
const cacheRoot = join(repositoryRoot, ".cache", "typescript-pnp");
const revisionRoot = join(cacheRoot, toolchain.revision);
const binaryRoot = join(revisionRoot, platform);
const executable = join(binaryRoot, process.platform === "win32" ? "tsc.exe" : "tsc");
const manifestPath = join(binaryRoot, "manifest.json");

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
    }
}

async function sha256(path) {
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    return hash.digest("hex");
}

function run(command, args, options = {}) {
    return new Promise((resolveRun, reject) => {
        const child = spawn(command, args, { stdio: "inherit", windowsHide: true, ...options });
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (signal) reject(new Error(`${command} terminated by ${signal}`));
            else resolveRun(code ?? 1);
        });
    });
}

async function checkedRun(command, args, options) {
    const code = await run(command, args, options);
    if (code !== 0) throw new Error(`${command} failed with exit code ${code}`);
}

async function cacheIsValid() {
    if (!await exists(executable) || !await exists(manifestPath)) return false;
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    return manifest.revision === toolchain.revision
        && manifest.compilerVersion === toolchain.compilerVersion
        && manifest.goVersion === toolchain.goVersion
        && manifest.platform === platform
        && manifest.sha256 === await sha256(executable);
}

async function probeGo(command) {
    try {
        const { stdout } = await execFileAsync(command, ["version"], { windowsHide: true });
        return stdout.startsWith(`go version go${toolchain.goVersion} `);
    } catch {
        return false;
    }
}

async function ensureGo() {
    if (process.env.CRAB_GO) {
        if (!await probeGo(process.env.CRAB_GO)) throw new Error(`CRAB_GO must run Go ${toolchain.goVersion}`);
        return process.env.CRAB_GO;
    }
    if (await probeGo("go")) return "go";

    const archive = toolchain.goArchives[platform];
    if (!archive) throw new Error(`No pinned Go SDK for ${platform}; set CRAB_GO to Go ${toolchain.goVersion}`);
    const sdkRoot = join(cacheRoot, `go-${toolchain.goVersion}`, platform);
    const go = join(sdkRoot, "go", "bin", process.platform === "win32" ? "go.exe" : "go");
    if (await probeGo(go)) return go;

    await mkdir(sdkRoot, { recursive: true });
    const archivePath = join(sdkRoot, archive.filename);
    if (!await exists(archivePath) || await sha256(archivePath) !== archive.sha256) {
        const response = await fetch(`https://go.dev/dl/${archive.filename}`);
        if (!response.ok || !response.body) throw new Error(`Go SDK download failed: HTTP ${response.status}`);
        const partial = `${archivePath}.partial`;
        await pipeline(Readable.fromWeb(response.body), createWriteStream(partial));
        if (await sha256(partial) !== archive.sha256) throw new Error("Go SDK SHA256 mismatch");
        await rename(partial, archivePath);
    }
    if (process.platform === "win32") {
        await checkedRun("pwsh", ["-NoProfile", "-Command",
            "[System.IO.Compression.ZipFile]::ExtractToDirectory($env:CRAB_GO_ARCHIVE, $env:CRAB_GO_DIRECTORY, $true)"], {
            env: { ...process.env, CRAB_GO_ARCHIVE: archivePath, CRAB_GO_DIRECTORY: sdkRoot },
        });
    } else {
        await checkedRun("tar", ["-xzf", archivePath, "-C", sdkRoot]);
    }
    if (!await probeGo(go)) throw new Error("Extracted Go SDK has the wrong version");
    return go;
}

async function prepareSource() {
    const source = join(revisionRoot, "source");
    await mkdir(source, { recursive: true });
    if (!await exists(join(source, ".git"))) {
        await checkedRun("git", ["init", "--quiet", source]);
        await checkedRun("git", ["-C", source, "remote", "add", "origin", toolchain.repository]);
    }
    const { stdout: origin } = await execFileAsync("git", ["-C", source, "remote", "get-url", "origin"]);
    if (origin.trim() !== toolchain.repository) throw new Error("Compiler source has an unexpected Git remote");
    let revision;
    try {
        revision = (await execFileAsync("git", ["-C", source, "rev-parse", "HEAD"])).stdout.trim();
    } catch {
        // An interrupted first fetch can leave an initialized repository without HEAD.
    }
    if (revision !== toolchain.revision) {
        if (revision) throw new Error("Compiler source has an unexpected revision");
        await checkedRun("git", ["-C", source, "fetch", "--depth=1", "--filter=blob:none", "origin", toolchain.revision]);
        await checkedRun("git", ["-C", source, "sparse-checkout", "set", "tsc/cmd", "tsc/internal", "tsc/testdata/fixtures/pnp"]);
        await checkedRun("git", ["-C", source, "checkout", "--detach", toolchain.revision]);
    }
    const { stdout: changes } = await execFileAsync("git", ["-C", source, "status", "--porcelain", "--untracked-files=no"]);
    if (changes.trim()) throw new Error("Compiler source has local modifications; refusing an unpinned build");
    return source;
}

async function buildCompiler() {
    console.error(`Preparing TypeScript ${toolchain.compilerVersion} with native PnP (${toolchain.revision.slice(0, 12)})`);
    const go = await ensureGo();
    const source = await prepareSource();
    const options = {
        cwd: join(source, "tsc"),
        env: {
            ...process.env,
            GOWORK: "off",
            GOTOOLCHAIN: "local",
            GOCACHE: process.env.GOCACHE || join(cacheRoot, "go-build-cache"),
            GOMODCACHE: process.env.GOMODCACHE || join(cacheRoot, "go-mod-cache"),
            GOPATH: process.env.GOPATH || join(cacheRoot, "go-path"),
        },
    };
    const temporaryExecutable = join(binaryRoot, process.platform === "win32" ? "tsc.build.exe" : "tsc.build");
    await checkedRun(go, ["build", "-trimpath", "-o", temporaryExecutable, "./cmd/tsc"], options);
    await checkedRun(go, ["test", "./internal/pnp", "./internal/vfs/pnpvfs"], options);
    const { stdout } = await execFileAsync(temporaryExecutable, ["--version"], { windowsHide: true });
    if (stdout.trim() !== `Version ${toolchain.compilerVersion}`) throw new Error("Unexpected TypeScript compiler version");
    await rename(temporaryExecutable, executable);
    await writeFile(manifestPath, JSON.stringify({
        revision: toolchain.revision,
        compilerVersion: toolchain.compilerVersion,
        goVersion: toolchain.goVersion,
        platform,
        sha256: await sha256(executable),
    }, null, 4) + "\n");
}

async function ensureCompiler() {
    if (await cacheIsValid()) return;
    await mkdir(binaryRoot, { recursive: true });
    // One preparation per revision also protects the shared source and SDK directories.
    const lockPath = join(revisionRoot, "prepare.lock");
    const deadline = Date.now() + 20 * 60 * 1000;
    let lock;
    while (!lock) {
        try {
            lock = await open(lockPath, "wx");
            await lock.writeFile(JSON.stringify({ pid: process.pid }));
        } catch (error) {
            if (error.code !== "EEXIST") throw error;
            if (await cacheIsValid()) return;
            try {
                const { pid } = JSON.parse(await readFile(lockPath, "utf8"));
                if (Number.isInteger(pid) && pid > 0) process.kill(pid, 0);
            } catch (ownerError) {
                if (ownerError.code === "ESRCH") await unlink(lockPath).catch(error => {
                    if (error.code !== "ENOENT") throw error;
                });
            }
            if (Date.now() > deadline) throw new Error(`Timed out waiting for ${lockPath}`);
            await setTimeout(500);
        }
    }
    try {
        if (!await cacheIsValid()) await buildCompiler();
    } finally {
        await lock.close();
        await unlink(lockPath);
    }
}

try {
    await ensureCompiler();
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === "--prepare") {
        console.error(`TypeScript ${toolchain.compilerVersion} / native PnP / ${toolchain.revision.slice(0, 12)}`);
    } else {
        process.exitCode = await run(executable, args);
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
}
