import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([new URL('../../rc-theme/', import.meta.url), new URL('../../rc-avatar/', import.meta.url), new URL('../../rc-button/', import.meta.url), new URL('../', import.meta.url)]);

await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });

// The geometry regression imports the actual example, byte-for-byte. The
// public library compiler extracts Crab CSS while published component entries
// and React stay external, sharing the browser test renderer's React instance.
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('The loading demo regression requires Wake 0.1.45.');
const fixture = new URL('../.cache/loading-demo-library/', import.meta.url);
await mkdir(new URL('src/demos/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/card-loading-demo-check', private: true,
    dependencies: {
        ...manifest.dependencies,
        '@crab-dev/rc-card': 'workspace:^',
        '@crab-dev/rc-avatar': manifest.devDependencies['@crab-dev/rc-avatar'],
        '@crab-dev/rc-button': manifest.devDependencies['@crab-dev/rc-button'],
    },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
await writeFile(new URL('src/index.ts', fixture), "export { default } from './demos/loading.demo.js';\n");
const source = new URL('../docs/demos/loading.demo.tsx', import.meta.url);
const copied = new URL('src/demos/loading.demo.tsx', fixture);
const original = await readFile(source);
await writeFile(copied, original);
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
if (!original.equals(await readFile(source)) || !original.equals(await readFile(copied))) {
    throw new Error('The loading demo source must remain byte-identical throughout fixture compilation.');
}
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual loading demo ESM and extracted CSS are required.');
styles.push(await readFile(demo.cssEntry, 'utf8'));
await writeFile(new URL('../.cache/loading-demo.mjs', import.meta.url), "export { default } from './loading-demo-library/esm/index.mjs';\n");
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
