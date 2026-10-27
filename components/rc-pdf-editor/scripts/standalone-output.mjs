import path from 'node:path';

/** Wake build reports its sole browser entry as a chunk in 0.1.45. */
export function selectStandaloneEntry(files) {
    const scripts = files.filter(file => file.kind === 'chunk' || file.kind === 'entry');
    if (scripts.length !== 1) throw new Error(`Standalone PDF requires exactly one JavaScript output; received ${scripts.length}`);
    const unsupported = files.filter(file => !['chunk', 'entry', 'css', 'html', 'manifest'].includes(file.kind));
    if (unsupported.length) throw new Error(`Standalone PDF cannot depend on additional outputs: ${unsupported.map(file => `${file.kind}:${file.path}`).join(', ')}`);
    const entry = scripts[0].path;
    if (typeof entry !== 'string' || !entry.endsWith('.js') || path.posix.isAbsolute(entry) || path.win32.isAbsolute(entry)
        || entry.split(/[\\/]/).some(segment => segment === '..' || segment === '' || segment === '.')) {
        throw new Error('Standalone PDF entry must be a relative JavaScript path within the build output');
    }
    return entry;
}
