import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Run inside the package after its public library build. Collect real CSS in
// dependency order; missing advertised styles must fail instead of hiding gaps.
const packageRoot = pathToFileURL(`${path.resolve(process.argv[2] ?? '.').replaceAll('\\', '/')}/`);
const componentsRoot = new URL('../components/', import.meta.url);
const styles = [];
const visited = new Set();
async function collect(root) {
    if (visited.has(root.href)) return;
    visited.add(root.href);
    const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
        if (dependency.startsWith('@crab-dev/rc-')) await collect(new URL(`${dependency.slice('@crab-dev/'.length)}/`, componentsRoot));
    }
    try {
        styles.push(await readFile(new URL('css/index.css', root), 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT' || manifest.exports?.['./css/index.css']) throw error;
    }
}
await collect(new URL('rc-theme/', componentsRoot));
await collect(packageRoot);
await mkdir(new URL('.cache/', packageRoot), { recursive: true });
await writeFile(new URL('.cache/browser-css.json', packageRoot), `${JSON.stringify(styles.join('\n'))}\n`);
