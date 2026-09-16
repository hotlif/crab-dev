import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Linter } from 'eslint';
import globals from 'globals';

const linter = new Linter();
const site = process.argv.includes('--site');
const root = resolve(site ? '.website/docs-dist' : 'components');
const results = [];
for (const pkg of (site ? ['.'] : await readdir(root))) {
    const dir = site ? root : resolve(root, pkg, 'esm');
    let files;
    try { files = await readdir(dir, { recursive: true }); } catch { continue; }
    for (const file of files.filter((file) => /\.m?js$/.test(file))) {
        const path = resolve(dir, file);
        const messages = linter.verify(await readFile(path, 'utf8'), [{
            languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: {
                ...globals.browser, ...globals.es2025, Temporal: 'readonly', __webpack_init_sharing__: 'readonly', __webpack_share_scopes__: 'readonly',
            } },
            rules: { 'no-undef': 'error' },
        }], { filename: file });
        for (const message of messages) results.push({ package: pkg, file, line: message.line, message: message.message });
    }
}
await writeFile(site ? '.website/review/site-binding-findings.json' : '.website/review/library-binding-findings.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
