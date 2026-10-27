import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectStandaloneEntry } from './standalone-output.mjs';

test('selects the sole Wake chunk and permits extracted non-runtime metadata/styles', () => {
    assert.equal(selectStandaloneEntry([
        { kind: 'css', path: 'entry-a1.css' }, { kind: 'chunk', path: 'entry-a1.js' },
        { kind: 'html', path: 'index.html' }, { kind: 'manifest', path: 'manifest.json' },
    ]), 'entry-a1.js');
    assert.equal(selectStandaloneEntry([{ kind: 'entry', path: 'assets/editor.js' }]), 'assets/editor.js');
});

test('rejects absent or split JavaScript instead of publishing an incomplete entry', () => {
    for (const files of [[], [{ kind: 'css', path: 'entry.css' }], [
        { kind: 'chunk', path: 'entry.js' }, { kind: 'chunk', path: 'dependency.js' },
    ]]) assert.throws(() => selectStandaloneEntry(files), /exactly one/);
});

test('rejects external runtime assets and unsupported outputs', () => {
    for (const kind of ['asset', 'federation-chunk', 'federation-bootstrap', 'unknown']) {
        assert.throws(() => selectStandaloneEntry([
            { kind: 'chunk', path: 'entry.js' }, { kind, path: 'dependency.bin' },
        ]), /additional outputs/);
    }
});

test('refuses absolute, traversing or non-JavaScript entry paths before publication', () => {
    for (const value of ['/entry.js', 'C:\\entry.js', '..\\entry.js', '../entry.js', 'assets/../entry.js', './entry.js', 'assets//entry.js', 'entry.css', undefined]) {
        assert.throws(() => selectStandaloneEntry([{ kind: 'chunk', path: value }]), /relative JavaScript/);
    }
});
