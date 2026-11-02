import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { captureVisualInputs } from '../scripts/visual/evidence-inputs.mjs';
const manifestBytes = await fs.readFile('.tmp/audit-root-source-snapshot.json');
const snapshot = JSON.parse(manifestBytes);
const mismatches = [];
for (const [file, expected] of Object.entries(snapshot.sourceFiles)) {
    const actual = createHash('sha256').update(await fs.readFile(file)).digest('hex');
    if (actual !== expected) mismatches.push({ file, expected, actual });
}
const validation = JSON.parse(await fs.readFile('.cache/visual/repository-final-validation-published-gpu/validation.json', 'utf8'));
if (!validation.finishedAt || validation.commands.length !== 4 || validation.commands.some(command => command.exitCode !== 0)) throw Error('Final public validation is not complete');
if (mismatches.length) throw Error('Verified snapshot source changed: ' + JSON.stringify(mismatches));
for (const key of ['CRAB_VISUAL_PACKAGE', 'CRAB_VISUAL_TARGETS', 'CRAB_VISUAL_WORKBENCH_ROOT']) delete process.env[key];
const inputs = await captureVisualInputs();
const report = {
    capturedAt: new Date().toISOString(),
    provenance: 'Read-only fingerprint in the same isolated container after all final public repository commands completed; no source mutation or rebuild is performed by this proof.',
    baseImage: snapshot.image,
    node: process.version,
    yarn: execFileSync('yarn', ['--version'], { encoding: 'utf8' }).trim(),
    platform: process.platform,
    sourceSnapshotManifestSha256: createHash('sha256').update(manifestBytes).digest('hex'),
    checkedSnapshotSourceFiles: Object.keys(snapshot.sourceFiles).length,
    mismatches,
    validation,
    inputs,
};
await fs.mkdir('.cache/visual/repository-final-proof', { recursive: true });
await fs.writeFile('.cache/visual/repository-final-proof/inputs.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ sourceFiles: report.checkedSnapshotSourceFiles, mismatches: mismatches.length, source: inputs.source.fingerprint, artifact: inputs.artifact.fingerprint, siteBuild: inputs.siteBuild.fingerprint, artifactFiles: inputs.artifact.files.length, siteBuildFiles: inputs.siteBuild.files.length }));
