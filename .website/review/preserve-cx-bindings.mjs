import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from '@babel/parser';
import assert from 'node:assert/strict';

// Wake 0.1.38 substitutes direct cx calls after renaming local bindings.
// Retain the public runtime call so its arguments participate in scope analysis.
const changed = [];
const findings = JSON.parse(await readFile('.website/review/site-binding-findings.json', 'utf8'));
const affectedPackages = new Set(findings.filter((finding) => /Style|iconArray|tagBase/.test(finding.message))
    .map((finding) => finding.file.match(/^components\/(rc-[^/]+)\//)?.[1]).filter(Boolean));
const brokenStyles = new Set(findings.map((finding) => finding.message.match(/^'([^']+)'/)?.[1])
    .filter((name) => /Style|iconArray|tagBase/.test(name ?? '')));
for (const file of await readdir('components', { recursive: true })) {
    if (!/^(rc-[^/\\]+)[/\\](src|docs)[/\\].*\.[cm]?tsx?$/.test(file) || file.endsWith('token.ts')) continue;
    const path = resolve('components', file);
    const source = await readFile(path, 'utf8');
    if (!source.includes('cx(')) continue;
    if (!affectedPackages.has(file.split(/[/\\]/)[0])
        || ![...brokenStyles].some((name) => source.includes(`const ${name} =`))) continue;
    const ast = parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    const importsCx = ast.program.body.some((node) => node.type === 'ImportDeclaration'
        && node.source.value === '@crab-dev/css' && node.specifiers.some((item) => item.local.name === 'cx'));
    if (!importsCx) continue;
    const edits = [];
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'cx') {
            edits.push({ start: node.callee.end, end: node.arguments[0]?.start ?? node.end - 1 });
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(ast.program);
    if (!edits.length) continue;
    let updated = source;
    for (const edit of edits.sort((a, b) => b.start - a.start)) {
        updated = updated.slice(0, edit.start) + '.call(undefined, ' + updated.slice(edit.end);
    }
    const normalized = parse(updated.replaceAll('cx.call(undefined, ', 'cx('), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    const structure = (tree) => JSON.stringify(tree, (key, value) =>
        ['start', 'end', 'loc', 'extra', 'tokens'].includes(key) ? undefined : value);
    assert.equal(structure(normalized), structure(ast), `Unexpected non-call edit: ${file}`);
    if (process.argv.includes('--apply')) await writeFile(path, updated);
    changed.push({ file, calls: edits.length });
}
await writeFile('.website/review/cx-binding-changes.json', JSON.stringify(changed, null, 2));
console.log(`${process.argv.includes('--apply') ? 'Applied' : 'Dry run, no component files written'}: ${changed.length} files; ${changed.reduce((sum, file) => sum + file.calls, 0)} calls; all AST round trips identical`);
