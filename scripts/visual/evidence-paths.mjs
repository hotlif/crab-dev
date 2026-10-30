import { lstat } from 'node:fs/promises';
import path from 'node:path';

export function assertRelativeChild(root, file, context = 'Evidence') {
    const relative = path.relative(root, file);
    if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw Error(`${context} path escapes the repository: ${file}`);
    return relative;
}

/** New destinations may not exist yet; validate every existing ancestor. */
export async function assertUnlinkedChild(root, file, context = 'Evidence') {
    const relative = assertRelativeChild(root, file, context);
    let current = root;
    for (const part of relative.split(path.sep)) {
        current = path.join(current, part);
        try {
            if ((await lstat(current)).isSymbolicLink()) throw Error(`${context} paths cannot follow links: ${current}`);
        } catch (error) { if (error.code === 'ENOENT') break; throw error; }
    }
}

/** Rebase a native Windows/Linux attachment onto its copied results directory. */
export function resolveNativeAttachment(input, original) {
    const normalized = original.replaceAll('\\', '/'), marker = '/results/';
    const index = normalized.lastIndexOf(marker);
    if (index < 0) throw Error('Invalid native attachment path: missing results directory');
    const suffix = normalized.slice(index + marker.length);
    if (!suffix || path.posix.isAbsolute(suffix) || path.win32.isAbsolute(suffix) || /^[a-z]:/i.test(suffix)) throw Error('Invalid native attachment path: absolute or empty suffix');
    const root = path.resolve(input, 'results'), file = path.resolve(root, suffix);
    assertRelativeChild(root, file);
    return file;
}
