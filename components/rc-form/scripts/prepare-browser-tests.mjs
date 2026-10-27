import { mkdir, readFile, writeFile } from 'node:fs/promises';

// These integration regressions need the actual extracted cascade, including
// the wrappers of composite controls; no copied layout CSS or css() mock.
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
for (const name of ['rc-theme', 'rc-line-edit', 'rc-date-picker', 'rc-select', 'rc-form']) {
    await collect(new URL(`../../${name}/`, import.meta.url));
}
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
