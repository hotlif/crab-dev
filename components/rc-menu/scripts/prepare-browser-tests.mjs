import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Layout regressions consume published styles. The dependency build graph must
// supply the same Menu and theme outputs that an application would import.
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
        if (error.code !== 'ENOENT' || manifest.exports?.['./css/index.css']) throw error;
    }
}
await collect(new URL('../../rc-theme/', import.meta.url));
await collect(new URL('../', import.meta.url));
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
