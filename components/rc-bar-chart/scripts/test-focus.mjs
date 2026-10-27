import { spawn } from 'node:child_process';

// Each actual PNG has one focused subject; use independent ordinary pages.
let failed = false;
for (const subject of ['bar', 'legend', 'hidden-legend']) {
    const args = ['../../scripts/test-published-forced-colors.mjs', '--package=.', '--colors=normal',
        `--fixture=src/__tests__/browser/normal-focus-${subject}-fixture.tsx`, '--api=__barChartNormalFocus'];
    const code = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, args, { stdio: 'inherit', windowsHide: true });
        child.once('error', reject);
        child.once('exit', (exitCode, signal) => resolve(signal ? 1 : exitCode ?? 1));
    });
    if (code !== 0) failed = true;
}
if (failed) process.exitCode = 1;
