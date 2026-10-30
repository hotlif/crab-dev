import { copyFile, cp, link, mkdir, readdir, statfs } from 'node:fs/promises';
import path from 'node:path';

const gibibyte = 1024 ** 3;
const minimumBytes = { repository: 8 * gibibyte, filtered: gibibyte };

export function assertVisualStorage(availableBytes, scope) {
    const required = minimumBytes[scope];
    if (!Number.isSafeInteger(required) || !Number.isSafeInteger(availableBytes) || availableBytes < 0) throw Error('Invalid visual storage budget');
    if (availableBytes < required) throw Error(`Insufficient local visual storage: ${(availableBytes / gibibyte).toFixed(2)} GiB available; ${required / gibibyte} GiB minimum for ${scope} capture. Free local space before starting. Existing evidence is retained.`);
    return { availableBytes, minimumBytes: required, scope };
}

export async function inspectVisualStorage(directory, scope) {
    const storage = await statfs(directory, { bigint: true });
    return assertVisualStorage(Number(storage.bavail * storage.bsize), scope);
}

/** Yarn zip archives are immutable; metadata and other files remain independent. */
export async function copyImmutableYarnCache(source, target) {
    await mkdir(target, { recursive: true });
    const result = { linkedArchives: 0, copiedEntries: 0 };
    for (const entry of await readdir(source, { withFileTypes: true })) {
        const from = path.join(source, entry.name), to = path.join(target, entry.name);
        if (entry.isFile() && entry.name.endsWith('.zip')) {
            try { await link(from, to); result.linkedArchives++; }
            catch (error) {
                if (!['EXDEV', 'EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) throw error;
                await copyFile(from, to); result.copiedEntries++;
            }
        } else {
            await cp(from, to, { recursive: true }); result.copiedEntries++;
        }
    }
    return result;
}
