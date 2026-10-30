import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { repositoryRoot } from '../library-manifest.mjs';
import { indexJsonAttachments } from './evidence-attachments.mjs';
import { assertRelativeChild, assertUnlinkedChild, resolveNativeAttachment } from './evidence-paths.mjs';

const [inputArgument, outputArgument] = process.argv.slice(2);
if (!inputArgument || !outputArgument) throw Error('Pass a native Playwright run directory and a new repository review directory.');
const input = path.resolve(inputArgument), output = path.resolve(outputArgument);
assertRelativeChild(path.join(repositoryRoot, '.website/review'), output);
await assertUnlinkedChild(repositoryRoot, output);
const report = JSON.parse(await fs.readFile(path.join(input, 'results.json'), 'utf8'));
await fs.mkdir(output); // Existing history must never be replaced by a fresh export.
await fs.copyFile(path.join(input, 'results.json'), path.join(output, 'results.json'));
await fs.cp(path.join(input, 'report'), path.join(output, 'report'), { recursive: true });
for (const file of (await fs.readdir(input)).filter(name => /^(?:inputs|rendering)-.*\.json$/.test(name) || ['matrix.json', 'local-storage.json'].includes(name))) await fs.copyFile(path.join(input, file), path.join(output, file));
for (const file of ['linux-environment.txt', 'local-linux-snapshot.json', 'baseline-transfer.json']) {
    try { await fs.copyFile(path.join(path.dirname(input), file), path.join(output, file)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
}

const cases = [];
async function visit(suites) {
    for (const suite of suites) {
        for (const spec of suite.specs ?? []) for (const test of spec.tests) for (const [attempt, result] of test.results.entries()) {
            const product = spec.tags.find(tag => /^@?rc-[a-z0-9-]+$/.test(tag))?.replace(/^@/, '') ?? 'website';
            const record = { id: `${spec.id}/${test.projectName}/${attempt}`, package: product, file: spec.file, title: spec.title, project: test.projectName, attempt, status: result.status, visualReview: 'pending', annotations: test.annotations, images: [], errors: result.errors };
            record.jsonAttachments = indexJsonAttachments(result.attachments);
            // Keep the existing singular lookup for consumers, while the ordered
            // index retains every repeated name and its native attachment position.
            if (record.jsonAttachments.length) record.details = Object.fromEntries(record.jsonAttachments.map(({ name, value }) => [name, value]));
            const directory = path.join(output, 'screens', product, test.projectName);
            assertRelativeChild(path.join(output, 'screens', product), directory);
            await assertUnlinkedChild(output, directory);
            for (const [index, attachment] of result.attachments.entries()) {
                let bytes;
                if (attachment.body) bytes = Buffer.from(attachment.body, 'base64');
                if (attachment.contentType !== 'image/png') continue;
                if (!bytes && attachment.path) {
                    const local = resolveNativeAttachment(input, attachment.path);
                    await assertUnlinkedChild(input, local);
                    try { bytes = await fs.readFile(local); }
                    catch (error) { if (error.code !== 'ENOENT') throw error; }
                }
                if (!bytes) continue;
                await fs.mkdir(directory, { recursive: true });
                const file = path.join(directory, `${String(cases.length + 1).padStart(6, '0')}-${index}-${attachment.name.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}.png`);
                await fs.writeFile(file, bytes);
                record.images.push({ attachmentIndex: index, name: attachment.name, path: path.relative(output, file).replaceAll('\\', '/'), sha256: createHash('sha256').update(bytes).digest('hex') });
            }
            cases.push(record);
        }
        await visit(suite.suites ?? []);
    }
}
await visit(report.suites);
await fs.writeFile(path.join(output, 'cases.json'), JSON.stringify({ nativeStats: report.stats, nativeErrors: report.errors, visualReview: 'pending', cases }, null, 2));
await fs.writeFile(path.join(output, 'README.md'), `# Native Playwright candidate\n\nThe unmodified HTML report is in report/index.html; results.json is the original framework report. cases.json indexes exact PNG attachments and hashes for review. Ordered jsonAttachments and PNG attachmentIndex preserve repeated snapshot targets in multi-capture tests; details retains its existing last-value lookup. No images were edited and no baseline or verified status was established by this export.\n\nNative run statistics: ${JSON.stringify(report.stats)}. Failed, interrupted, skipped and absent cases remain unaccepted. Source/artifact fingerprints and the declared matrix are copied alongside the report when available.\n`);
console.log(`Native candidate export: ${output}; ${cases.length} recorded attempts; visual review pending.`);
