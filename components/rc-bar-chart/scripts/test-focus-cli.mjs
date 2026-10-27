import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Dry-run validates actual CLI parsing before imports/files/server/browser.
const entry = '../../scripts/test-published-forced-colors.mjs';
const base = [entry, '--package=.', '--fixture=src/__tests__/browser/normal-focus-bar-fixture.tsx', '--api=__barChartNormalFocus', '--validate-only=true'];
for (const [args, colors, forcedColors] of [[[], 'active', true], [['--colors=active'], 'active', true], [['--colors=normal'], 'normal', false]]) {
    const run = spawnSync(process.execPath, [...base, ...args], { encoding: 'utf8', windowsHide: true });
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.colors, colors);
    assert.equal(result.forcedColors, forcedColors);
    assert.equal(result.reducedMotion, false);
}
for (const invalid of ['--colors=none', '--colors=normal-extra', '--validate-only=false', '--fixture=../../outside.tsx']) {
    const run = spawnSync(process.execPath, [...base, invalid], { encoding: 'utf8', windowsHide: true });
    assert.notEqual(run.status, 0, 'Invalid CLI must fail before browser/output: ' + invalid);
    assert.match(run.stderr, /Invalid colors mode|validate-only must be true|Fixture must be inside/);
    assert.equal(run.stdout, '');
}
console.log('Published color/focus CLI contracts: default active, explicit active/normal and4 invalid invocations passed; no browser launched.');
