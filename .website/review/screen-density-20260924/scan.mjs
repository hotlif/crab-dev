import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only inspection of authored sources; reports stay in this review folder.
const output = dirname(fileURLToPath(import.meta.url));
const root = resolve(output, '../../..');
const componentRoot = join(root, 'components');
const packages = readdirSync(componentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const normalized = path => relative(root, path).replaceAll('\\', '/');
const dimensions = /(?:^|[.\s-])(?:width|height|min-width|max-width|min-height|max-height|padding(?:-[\w-]+)?|gap|font-size|size)(?:[.\s:=]|$)/;

function tokenEntries(name) {
    const path = join(componentRoot, name, 'token.toml');
    if (!existsSync(path)) return [];
    let section = '';
    return readFileSync(path, 'utf8').split(/\r?\n/).flatMap((line, index) => {
        const header = line.match(/^\[([^\]]+)\]/);
        if (header) section = header[1];
        if (section !== 'token' && !section.startsWith('token.')) return [];
        const entry = line.match(/^([\w.-]+)\s*=\s*"(.*)"\s*(?:#.*)?$/);
        if (!entry) return [];
        return [{ key: `${section === 'token' ? '' : section.slice(6) + '.'}${entry[1]}`,
            value: entry[2], file: normalized(path), line: index + 1 }];
    });
}

const entries = Object.fromEntries(packages.map(name => [name, tokenEntries(name)]));
const maps = Object.fromEntries(packages.map(name => [name, Object.fromEntries(entries[name].map(entry => [entry.key, entry.value]))]));
function resolveValue(value, owner, depth = 0) {
    if (depth > 8) return value;
    const upstream = owner === 'rc-token-global' ? [] : owner === 'rc-token-semantic'
        ? ['rc-token-global'] : ['rc-token-semantic', 'rc-token-global'];
    return value.replace(/\$ref\(([^)]+)\)/g, (original, key) => {
        for (const name of upstream) {
            if (maps[name][key] !== undefined) return resolveValue(maps[name][key], name, depth + 1);
        }
        return original;
    });
}

function sourceFiles(dir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        if (entry.name.startsWith('.') || ['__tests__', 'node_modules', 'esm', 'cjs', 'css', 'coverage', 'declarations'].includes(entry.name)) return [];
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return sourceFiles(path);
        return /\.(tsx?|css)$/.test(entry.name) && entry.name !== 'token.ts' ? [path] : [];
    });
}

const result = packages.map(name => {
    const files = sourceFiles(join(componentRoot, name, 'src'));
    const source = files.flatMap(path => readFileSync(path, 'utf8').split(/\r?\n/).map((text, index) => ({ file: normalized(path), line: index + 1, text: text.trim() })));
    const demos = sourceFiles(join(componentRoot, name, 'docs'));
    return {
        name, sourceFiles: files.length,
        tokens: entries[name].filter(entry => dimensions.test(entry.key)).map(entry => ({ ...entry, resolved: resolveValue(entry.value, name) })),
        layout: source.filter(entry => /(?:^|\s)(?:min-|max-)?(?:width|height)|padding|flex-wrap|overflow|grid-template|box-sizing|font-size|(?:row|header|column|item|panel|container|viewport)(?:Width|Height)|\bsize\s*=/.test(entry.text)),
        adaptation: source.filter(entry => /@(?:media|container).*?(?:width|height|pointer|orientation)|matchMedia.*?(?:width|height|pointer)|\bdensity\b|\bcompact\b|devicePixelRatio|screen\.(?:width|height)|\bzoom\s*:/.test(entry.text)),
        demoFixedDimensions: demos.flatMap(path => readFileSync(path, 'utf8').split(/\r?\n/).flatMap((text, index) =>
            /(?:min-|max-)?(?:width|height)\s*:\s*\d+(?:px|rem)|(?:Width|Height|width|height)\s*[=:]\s*\{?\d{2,}/.test(text)
                ? [{ file: normalized(path), line: index + 1, text: text.trim() }] : [])),
    };
});
writeFileSync(join(output, 'source-inventory.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ packages: result.length, sourceFiles: result.reduce((n, p) => n + p.sourceFiles, 0), dimensionTokens: result.reduce((n, p) => n + p.tokens.length, 0), report: normalized(join(output, 'source-inventory.json')) }));
