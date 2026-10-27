import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Consume the same extracted styles as an application. The repository build
// graph supplies dependency outputs before required browser checks run.
const styles = [];
const visited = new Set();
async function collect(packageRoot) {
    if (visited.has(packageRoot.href)) return;
    visited.add(packageRoot.href);
    const manifest = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'));
    for (const name of Object.keys(manifest.dependencies ?? {})) {
        if (name.startsWith('@crab-dev/rc-')) await collect(new URL(`../../${name.slice('@crab-dev/'.length)}/`, import.meta.url));
    }
    try {
        styles.push(await readFile(new URL('css/index.css', packageRoot), 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
}
await collect(new URL('../', import.meta.url));
if (styles.length === 0) throw new Error('Build component libraries before browser layout tests.');
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
