import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Keep the geometry regression on the real published components and design CSS.
const styles = [];
const visited = new Set();
async function collect(packageRoot, requireStyles = false) {
    const key = packageRoot.href;
    if (visited.has(key)) return;
    visited.add(key);
    const manifest = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'));
    for (const name of Object.keys(manifest.dependencies ?? {})) {
        if (name.startsWith('@crab-dev/rc-')) {
            await collect(new URL(`../../${name.slice('@crab-dev/'.length)}/`, import.meta.url));
        }
    }
    try {
        styles.push(await readFile(new URL('css/index.css', packageRoot), 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT' || requireStyles) throw error;
    }
}
await collect(new URL('../../rc-theme/', import.meta.url), true);
await collect(new URL('../', import.meta.url), true);
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
