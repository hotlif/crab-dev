import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// This layout regression consumes the actual published ESM and compiled CSS.
// test:browser builds Tree first; dependency builds are provided by package check
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
// The clipping regression composes the actual measurement component. Preserve
// its published overflow rules instead of recreating them in test CSS.
await collect(new URL('../../rc-auto-sizer/', import.meta.url), true);
await collect(new URL('../../rc-button/', import.meta.url), true);
await collect(new URL('../', import.meta.url), true);
if (styles.length === 0) throw new Error('Build the component libraries before browser layout tests.');
await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
// Compile byte-identical example inputs through the public library compiler.
// Generic bundle() intentionally does not run Crab CSS extraction. The isolated
// library also leaves React and actual component packages external, so the test
// keeps the same published component graph and React instance as its renderer.
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('The demo regression requires Wake 0.1.45.');
const fixture = new URL('../.cache/inline-demo-library/', import.meta.url);
await mkdir(new URL('src/demos/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/tree-inline-demo-check', private: true,
    dependencies: { ...manifest.dependencies, '@crab-dev/rc-tree': 'workspace:^' },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
await writeFile(new URL('src/index.ts', fixture), "export { default, CustomInput, useKeyboardEditFocus } from './demos/inline-edit.demo.js';\n");
for (const file of ['demos/inline-edit.demo.tsx', 'demo-layout.ts']) {
    await writeFile(new URL(`src/${file}`, fixture), await readFile(new URL(`../docs/${file}`, import.meta.url)));
}
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual inline editor ESM and extracted CSS are required.');
styles.push(await readFile(demo.cssEntry, 'utf8'));
await writeFile(new URL('../.cache/inline-edit-demo.mjs', import.meta.url), "export { default, CustomInput, useKeyboardEditFocus } from './inline-demo-library/esm/index.mjs';\n");
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
