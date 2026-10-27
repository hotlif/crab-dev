import { mkdir, readFile, writeFile } from 'node:fs/promises';

// This style regression consumes the actual published ESM and compiled CSS.
// test:browser builds the component first; dependency builds are provided by package check
// and the repository build graph. No structural CSS is recreated in the fixture.
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
// Theme is a test-only dependency: all three design contracts must be real CSS.
await collect(new URL('../../rc-theme/', import.meta.url), true);
await collect(new URL('../', import.meta.url), true);
if (styles.length === 0) throw new Error('Build the component libraries before browser layout tests.');
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
