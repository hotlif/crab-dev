import { spawn } from 'node:child_process';

// A screenshot has one actual focused element. Keep bar and legend checks in
// separate fixtures/browser runs without changing the shared launcher protocol.
let failed = false;
for (const subject of ['bar', 'legend']) {
    const args = ['../../scripts/test-published-forced-colors.mjs', '--package=.',
        `--fixture=src/__tests__/browser/forced-colors-${subject}-fixture.tsx`, '--api=__barChartForced'];
    const code = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, args, { stdio: 'inherit', windowsHide: true });
        child.once('error', reject);
        child.once('exit', (exitCode, signal) => resolve(signal ? 1 : exitCode ?? 1));
    });
    if (code !== 0) failed = true;
}
if (failed) process.exitCode = 1;
