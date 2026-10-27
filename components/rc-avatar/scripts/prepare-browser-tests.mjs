import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Compile the byte-identical public example using Wake's public library API.
// It shares published React/component entries with the browser renderer; Crab
// CSS from the example is appended to the dependency CSS already collected.
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('Avatar demo regression requires Wake 0.1.45.');
const fixture = new URL('../.cache/group-demo-library/', import.meta.url);
await mkdir(new URL('src/demos/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/avatar-group-demo-check', private: true,
    dependencies: { ...manifest.dependencies, '@crab-dev/rc-avatar': 'workspace:^' },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
await writeFile(new URL('src/index.ts', fixture), "export { default } from './demos/group.demo.js';\n");
const source = new URL('../docs/demos/group.demo.tsx', import.meta.url);
const copied = new URL('src/demos/group.demo.tsx', fixture);
const original = await readFile(source);
await writeFile(copied, original);
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
if (!original.equals(await readFile(source)) || !original.equals(await readFile(copied))) {
    throw new Error('Avatar group demo source changed during fixture compilation.');
}
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual group demo ESM and extracted CSS are required.');
const cssFile = new URL('../.cache/browser-css.json', import.meta.url);
const dependencyCss = JSON.parse(await readFile(cssFile, 'utf8'));
await writeFile(cssFile, JSON.stringify(`${dependencyCss}\n${await readFile(demo.cssEntry, 'utf8')}`) + '\n');
await writeFile(new URL('../.cache/group-demo.mjs', import.meta.url), "export { default } from './group-demo-library/esm/index.mjs';\n");
