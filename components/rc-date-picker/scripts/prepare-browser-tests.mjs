import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// The required browser regression consumes published ESM and actual extracted
// theme/component CSS. Dependency outputs come from the repository build graph.
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

// Compile the actual docs example byte-for-byte with the public library API.
// Its relative DatePicker import resolves through a test-only bridge to the
// published component; the unchanged formatting utility remains real source.
// Neither css() nor positioning/middleware is mocked.
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('Viewport demo compilation requires Wake0.1.45');
const fixture = new URL('../.cache/viewport-demo-library/', import.meta.url);
await mkdir(new URL('src/demos/', fixture), { recursive: true });
await mkdir(new URL('src/datePicker/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/date-viewport-demo-check', private: true,
    dependencies: { ...manifest.dependencies, '@crab-dev/rc-date-picker': 'workspace:^' },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
await writeFile(new URL('src/index.ts', fixture), "export { default } from './demos/datePicker.demo.js';\n");
await writeFile(new URL('src/datePicker/datePicker.ts', fixture), "export { default } from '@crab-dev/rc-date-picker';\n");
const copiedSources = [
    { source: new URL('../docs/demos/datePicker.demo.tsx', import.meta.url), copy: new URL('src/demos/datePicker.demo.tsx', fixture) },
    { source: new URL('../src/util.ts', import.meta.url), copy: new URL('src/util.ts', fixture) },
    { source: new URL('../src/type.d.ts', import.meta.url), copy: new URL('src/type.d.ts', fixture) },
];
for (const source of copiedSources) {
    source.bytes = await readFile(source.source);
    await writeFile(source.copy, source.bytes);
}
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
for (const source of copiedSources) {
    if (!source.bytes.equals(await readFile(source.source)) || !source.bytes.equals(await readFile(source.copy))) throw new Error('Actual viewport demo/utility changed during compilation');
}
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual viewport demo ESM/CSS required');
styles.push(await readFile(demo.cssEntry, 'utf8'));
await writeFile(new URL('../.cache/viewport-demo.mjs', import.meta.url), "export { default } from './viewport-demo-library/esm/index.mjs';\n");
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
