import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);
const wasm = await readFile(require.resolve('@embedpdf/pdfium/pdfium.wasm'));
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/pdfium.wasm', root), wasm);
// Wake Docs serves public assets. Both copies are generated, never hand-edited.
await mkdir(new URL('public/runtime/', root), { recursive: true });
await writeFile(new URL('public/runtime/pdfium.wasm', root), wasm);
const worker = await readFile(new URL('dist/pdf-editor.worker.js', root), 'utf8');
await writeFile(new URL('public/runtime/pdf-editor.worker.js', root), worker);
const pdfiumRoot = dirname(dirname(require.resolve('@embedpdf/pdfium')));
for (const destination of ['dist/licenses/', 'public/runtime/licenses/']) {
    await mkdir(new URL(destination, root), { recursive: true });
    await writeFile(new URL(`${destination}LICENSE.embedpdf`, root), await readFile(join(pdfiumRoot, 'LICENSE')));
    await writeFile(new URL(`${destination}LICENSE.pdfium`, root), await readFile(join(pdfiumRoot, 'LICENSE.pdfium')));
}
// Wake Browser 测试通过模块加载二进制，不把测试载荷发布到文档站。
await mkdir(new URL('.fixtures/', root), { recursive: true });
await writeFile(new URL('.fixtures/test-wasm.json', root), JSON.stringify(wasm.toString('base64')));
await writeFile(new URL('.fixtures/test-worker.json', root), JSON.stringify(worker));
