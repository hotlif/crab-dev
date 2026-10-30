import { copyFile, mkdir, readFile, readdir, realpath, rename, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { constants } from 'node:fs';
import { visualArgumentIntent } from './argument-intent.mjs';
import { assertUnlinkedChild } from './evidence-paths.mjs';

export function hasSnapshotUpdateOption(args) {
    return visualArgumentIntent(args).update;
}

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function bytesIfPresent(file) {
    try { return await readFile(file); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
}

async function assertLocalPath(root, file) {
    await assertUnlinkedChild(root, file, 'Baseline');
}

/** Transfer native Playwright outputs only after an explicit, successful update.
 * Keep old bytes and refuse to replace a baseline edited since the snapshot. */
export async function transferNativeBaselines({ root, input, history, before }) {
    root = await realpath(root);
    input = path.resolve(input);
    history = path.resolve(history);
    await assertLocalPath(root, input);
    await assertLocalPath(root, history);
    const files = [];
    async function visit(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await visit(file);
            else if (entry.isFile() && entry.name.endsWith('.png')) files.push(file);
            else throw Error(`Unexpected native baseline entry: ${file}`);
        }
    }
    await visit(input);
    if (!files.length) throw Error('The successful baseline update produced no native PNG files');
    const records = [];
    for (const file of files.sort()) {
        const relative = path.relative(input, file).replaceAll('\\', '/');
        if (!/^linux\/[^/]+\/.+\.png$/.test(relative)) throw Error(`Only Linux project baselines can be returned: ${relative}`);
        const repositoryPath = `test/visual/baselines/${relative}`;
        const target = path.join(root, repositoryPath);
        await assertLocalPath(root, target);
        const bytes = await readFile(file), existing = await bytesIfPresent(target);
        const sha256 = hash(bytes), previous = existing && hash(existing);
        if (previous !== sha256 && previous !== before[repositoryPath]) throw Error(`Baseline changed after the Linux snapshot: ${repositoryPath}. Native outputs and the local baseline are retained.`);
        records.push({ path: repositoryPath, sha256, previous, status: previous === sha256 ? 'unchanged' : existing ? 'replaced' : 'created', bytes, existing, target });
    }
    // Validate the entire plan before writing, then archive every replaced file.
    for (const record of records.filter(record => record.status === 'replaced')) {
        const backup = path.join(history, record.path);
        await assertLocalPath(root, backup);
        await mkdir(path.dirname(backup), { recursive: true });
        await copyFile(record.target, backup, constants.COPYFILE_EXCL);
    }
    for (const record of records.filter(record => record.status !== 'unchanged')) {
        await mkdir(path.dirname(record.target), { recursive: true });
        const temporary = `${record.target}.${randomUUID()}.tmp`;
        await writeFile(temporary, record.bytes, { flag: 'wx' });
        await rename(temporary, record.target);
    }
    return records.map(({ bytes, existing, target, ...record }) => record);
}
