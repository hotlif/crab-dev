import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { generateDocs } from "./generate-component-docs.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const websiteDirectory = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(websiteDirectory, "..");
const componentsDirectory = path.join(repositoryRoot, "components");
const navigationPath = path.join(websiteDirectory, "docs/navigation.toml");
const require = createRequire(import.meta.url);
const wakeDirectory = path.dirname(require.resolve("@crab-dev/wake/package.json"));
const wakeBin = path.join(wakeDirectory, "bin/wake.mjs");
const REGENERATE_DEBOUNCE_MS = 120;

function isComponentDocsSource(filename) {
    const normalized = String(filename).replaceAll("\\", "/");
    return /^rc-[^/]+\/(?:package\.json|docs\/index\.mdx|docs\/demos\/[^/]+\.demo\.tsx|public\/docgen\.json)$/.test(normalized);
}

await generateDocs();

let debounceTimer;
let generationRunning = false;
let generationQueued = false;
let shuttingDown = false;
let wakeExited = false;
let finalExitCode;
let forceKillTimer;
let wakeProcess;
let componentWatcher;
let docsWatcher;

async function regenerate() {
    if (generationRunning) {
        generationQueued = true;
        return;
    }

    generationRunning = true;
    try {
        await generateDocs();
    } catch (error) {
        console.error("组件文档增量生成失败：", error);
    } finally {
        generationRunning = false;
        if (generationQueued && !shuttingDown) {
            generationQueued = false;
            await regenerate();
        }
    }
}

function scheduleRegeneration() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => void regenerate(), REGENERATE_DEBOUNCE_MS);
}

function closeWatchers() {
    if (shuttingDown) return;
    shuttingDown = true;
    clearTimeout(debounceTimer);
    componentWatcher?.close();
    docsWatcher?.close();
    componentWatcher = undefined;
    docsWatcher = undefined;
}

function stopWake(signal, exitCode) {
    finalExitCode ??= exitCode;
    closeWatchers();
    if (wakeExited) {
        process.exitCode = finalExitCode;
        return;
    }
    if (!wakeProcess?.killed) wakeProcess?.kill(signal);
    if (wakeProcess?.pid && forceKillTimer === undefined) {
        forceKillTimer = setTimeout(() => {
            if (!wakeExited) wakeProcess?.kill("SIGKILL");
        }, 3_000);
        forceKillTimer.unref();
    }
}

function handleWatcherError(error) {
    console.error("文档源文件监听失败：", error);
    stopWake("SIGTERM", 1);
}

try {
    componentWatcher = watch(componentsDirectory, { recursive: true }, (_, filename) => {
        if (filename && isComponentDocsSource(filename)) scheduleRegeneration();
    });
    docsWatcher = watch(path.dirname(navigationPath), (_, filename) => {
        if (String(filename) === path.basename(navigationPath)) scheduleRegeneration();
    });
    componentWatcher.on("error", handleWatcherError);
    docsWatcher.on("error", handleWatcherError);
} catch (error) {
    closeWatchers();
    throw error;
}

wakeProcess = spawn(process.execPath, [wakeBin, "docs", "dev", "."], {
    cwd: websiteDirectory,
    env: process.env,
    stdio: "inherit",
});

process.once("SIGINT", () => stopWake("SIGINT", 130));
process.once("SIGTERM", () => stopWake("SIGTERM", 143));

wakeProcess.once("error", (error) => {
    console.error("无法启动 Wake Docs：", error);
    stopWake("SIGTERM", 1);
});

wakeProcess.once("exit", () => {
    wakeExited = true;
    clearTimeout(forceKillTimer);
});

wakeProcess.once("close", (code, signal) => {
    wakeExited = true;
    clearTimeout(forceKillTimer);
    if (!shuttingDown) closeWatchers();
    process.exitCode = finalExitCode ?? (signal === null ? code ?? 1 : 1);
});
