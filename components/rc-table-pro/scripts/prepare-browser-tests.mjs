import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([new URL('../../rc-theme/', import.meta.url), new URL('../', import.meta.url)]);

await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('Sidebar regression requires Wake0.1.45');
const fixture = new URL('../.cache/sidebar-demo-library/', import.meta.url);
await mkdir(new URL('src/demos/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/table-pro-sidebar-demo-check', private: true,
    dependencies: { ...manifest.dependencies, '@crab-dev/rc-table-pro': 'workspace:^' },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
await writeFile(new URL('src/index.ts', fixture), "export { default } from './demos/sidebar.demo.js';\n");
await writeFile(new URL('src/table.ts', fixture), "export { default } from '@crab-dev/rc-table-pro';\n");
await writeFile(new URL('src/types.ts', fixture), "export type * from '@crab-dev/rc-table-pro';\n");
const source = new URL('../docs/demos/sidebar.demo.tsx', import.meta.url);
const copy = new URL('src/demos/sidebar.demo.tsx', fixture);
const bytes = await readFile(source);
await writeFile(copy, bytes);
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
if (!bytes.equals(await readFile(source)) || !bytes.equals(await readFile(copy))) throw new Error('Actual sidebar demo changed during compilation');
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual sidebar demo ESM and extracted CSS are required');
styles.push(await readFile(demo.cssEntry, 'utf8'));
await writeFile(new URL('../.cache/sidebar-demo.mjs', import.meta.url), "export { default } from './sidebar-demo-library/esm/index.mjs';\n");
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
