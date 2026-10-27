import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const base = ['../../scripts/test-published-forced-colors.mjs', '--package=.', '--fixture=src/__tests__/browser/reduced-motion-fixture.tsx', '--api=__spinReducedMotion', '--validate-only=true'];
for (const [args, expected] of [[[], false], [['--colors=normal'], false], [['--colors=normal', '--motion=reduce'], true]]) {
    const run = spawnSync(process.execPath, [...base, ...args], { encoding: 'utf8', windowsHide: true });
    assert.equal(run.status, 0, run.stderr); assert.equal(JSON.parse(run.stdout).reducedMotion, expected);
}
for (const arg of ['--motion=invalid', '--motion=reduce']) {
    const run = spawnSync(process.execPath, [...base, arg], { encoding: 'utf8', windowsHide: true });
    assert.notEqual(run.status, 0); assert.match(run.stderr, /Invalid motion mode/); assert.equal(run.stdout, '');
}
console.log('Published motion CLI: existing default/normal unchanged, explicit reduce and invalid combinations checked; no browser.');
