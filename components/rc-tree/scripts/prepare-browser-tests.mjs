import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([new URL('../../rc-theme/', import.meta.url), new URL('../../rc-auto-sizer/', import.meta.url), new URL('../../rc-button/', import.meta.url), new URL('../', import.meta.url)]);

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
