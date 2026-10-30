import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { collectPublishedStyles } from './published-styles.mjs';

// Run inside the package after its public library build. Collect real CSS in
// dependency order; missing advertised styles must fail instead of hiding gaps.
const packageRoot = pathToFileURL(`${path.resolve(process.argv[2] ?? '.').replaceAll('\\', '/')}/`);
const componentsRoot = new URL('../components/', import.meta.url);
const styles = await collectPublishedStyles([new URL('rc-theme/', componentsRoot), packageRoot]);
await mkdir(new URL('.cache/', packageRoot), { recursive: true });
await writeFile(new URL('.cache/browser-css.json', packageRoot), `${JSON.stringify(styles.join('\n'))}\n`);
