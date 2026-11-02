import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolveYarnEntry } from '../scripts/package-manager.mjs';
const require = createRequire(import.meta.url);
// The visual-only snapshot omits review artifacts. Restore the actual authored
// navigation target for full repository link checks, with its content hash.
const documentationFile = '.website/review/component-theme-audit.md';
const documentation = await fs.readFile(documentationFile);
await fs.mkdir(path.dirname(documentationFile), { recursive: true });
await fs.writeFile(documentationFile, documentation);
const exactSnapshot = JSON.parse(await fs.readFile('.tmp/audit-root-source-snapshot.json', 'utf8'));
for (const [file, expected] of Object.entries(exactSnapshot.sourceFiles)) {
    const actual = createHash('sha256').update(await fs.readFile(file)).digest('hex');
    if (actual !== expected) throw Error('Verification source differs at start: ' + file);
}
const physicalChrome = require('@playwright/test').chromium.executablePath();
const chrome = '/workspace/.cache/visual/native-published-gpu/chromium';
await fs.access(chrome);
// Wake and published fixtures both use the Chromium binary supplied by the
// pinned image. Aliases are local to this disposable verification container.
for (const alias of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    let exists = false;
    try {
        const entry = await fs.lstat(alias); exists = true;
        if (!entry.isSymbolicLink()) throw Error('Not an owned disposable browser link: ' + alias);
        const target = path.resolve(path.dirname(alias), await fs.readlink(alias));
        if (target !== physicalChrome && target !== chrome) throw Error('Unexpected browser alias target: ' + target);
        if (target !== chrome) { await fs.unlink(alias); exists = false; }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (!exists) await fs.symlink(chrome, alias);
}
process.env.CRAB_TEST_BROWSER_PATH = chrome;
process.env.CHROME_PATH = chrome;
process.env.CHROME_BIN = chrome;
process.env.RAYON_NUM_THREADS = '2';
process.env.TURBO_CONCURRENCY = '2';
const browserConfiguration = JSON.parse(await fs.readFile('.cache/visual/native-published-gpu/launch.json', 'utf8'));
const yarn = await resolveYarnEntry(process.env.npm_execpath);
const directory = '.cache/visual/repository-final-validation-published-gpu';
await fs.mkdir(directory, { recursive: true });
const report = { startedAt: new Date().toISOString(), platform: process.platform, node: process.version, browser: chrome, physicalBrowser: physicalChrome, browserConfiguration, environment: { RAYON_NUM_THREADS: process.env.RAYON_NUM_THREADS, TURBO_CONCURRENCY: process.env.TURBO_CONCURRENCY }, supplementarySources: [{ file: documentationFile, sha256: createHash('sha256').update(documentation).digest('hex') }], commands: [] };
const save = () => fs.writeFile(path.join(directory, 'validation.json'), JSON.stringify(report, null, 2));
for (const command of ['generate:docs', 'check:docs', 'lint:tools', 'check']) {
    const entry = { command: 'yarn ' + command, startedAt: new Date().toISOString() };
    report.commands.push(entry); await save(); console.log('FINAL VALIDATION START', entry.command);
    const child = spawn(process.execPath, [yarn, command], { stdio: 'inherit', env: process.env });
    entry.exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)); });
    entry.finishedAt = new Date().toISOString(); await save(); console.log('FINAL VALIDATION END', entry.command, entry.exitCode);
    if (entry.exitCode !== 0) { process.exitCode = entry.exitCode; break; }
}
report.finishedAt = new Date().toISOString(); await save();
