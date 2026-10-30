import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([new URL('../../rc-theme/', import.meta.url), new URL('../', import.meta.url)]);

await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });

// Compile the actual docs example byte-for-byte with the public library API.
// Its relative DatePicker import resolves through a test-only bridge to the
// published component; formatting and its transitive dependencies remain real source.
// Neither css() nor positioning/middleware is mocked.
const require = createRequire(import.meta.url);
const wake = require('@crab-dev/wake');
if (wake.version() !== '0.1.45') throw new Error('Viewport demo compilation requires Wake0.1.45');
// A fresh fixture cannot accidentally resolve a removed module from a prior
// build. Historical preparation failures and artifacts remain available.
const fixturePath = await mkdtemp(fileURLToPath(new URL('../.cache/viewport-demo-library-', import.meta.url)));
const fixture = pathToFileURL(`${fixturePath}${sep}`);
const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url));
const sources = (await readdir(sourceRoot, { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile() && !relative(sourceRoot, join(entry.parentPath, entry.name)).split(sep).includes('__tests__'));
const copiedSources = await Promise.all(sources.map(async entry => {
    const source = join(entry.parentPath, entry.name);
    const copy = join(fixturePath, 'src', relative(sourceRoot, source));
    const bytes = await readFile(source);
    return { source, copy, bytes, expectedCopy: bytes };
}));
await cp(sourceRoot, new URL('src/', fixture), { recursive: true, filter: source => basename(source) !== '__tests__' });
await mkdir(new URL('src/demos/', fixture), { recursive: true });
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await writeFile(new URL('package.json', fixture), JSON.stringify({ ...manifest,
    name: '@crab-dev/date-viewport-demo-check', private: true,
    dependencies: { ...manifest.dependencies, '@crab-dev/rc-date-picker': 'workspace:^' },
}));
await writeFile(new URL('tsconfig.json', fixture), JSON.stringify({ extends: '@crab-dev/standards-typescript-preset/tsconfig.browser.react.json' }));
const fixtureEntries = new Map([
    ['index.ts', "export { default } from './demos/datePicker.demo.js';\n"],
    ['datePicker/datePicker.tsx', "export { default } from '@crab-dev/rc-date-picker';\n"],
]);
for (const [name, source] of fixtureEntries) {
    const copy = new URL(`src/${name}`, fixture);
    const bytes = Buffer.from(source);
    await writeFile(copy, bytes);
    const original = copiedSources.find(entry => entry.copy === fileURLToPath(copy));
    if (!original) throw new Error(`Missing source for explicit viewport bridge: ${name}`);
    original.expectedCopy = bytes;
}
const demoSource = new URL('../docs/demos/datePicker.demo.tsx', import.meta.url);
const demoCopy = new URL('src/demos/datePicker.demo.tsx', fixture);
const demoBytes = await readFile(demoSource);
await writeFile(demoCopy, demoBytes);
copiedSources.push({ source: demoSource, copy: demoCopy, bytes: demoBytes, expectedCopy: demoBytes });
const demo = await wake.buildLibrary({ cwd: fileURLToPath(fixture) });
for (const diagnostic of demo.diagnostics) {
    if (diagnostic.severity === 'warning' || diagnostic.severity === 'error') throw new Error(diagnostic.message);
}
for (const source of copiedSources) {
    if (!source.bytes.equals(await readFile(source.source)) || !source.expectedCopy.equals(await readFile(source.copy))) throw new Error('Actual viewport demo/source changed during compilation');
}
if (!demo.esmEntry || !demo.cssEntry) throw new Error('Actual viewport demo ESM/CSS required');
styles.push(await readFile(demo.cssEntry, 'utf8'));
await writeFile(new URL('../.cache/viewport-demo.mjs', import.meta.url), `export { default } from './${basename(fixturePath)}/esm/index.mjs';\n`);
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
