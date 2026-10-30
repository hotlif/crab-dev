import test from "node:test";
import assert from "node:assert/strict";
import { parsePublishedVisualOptions } from "./visual/published-job.mjs";
import { publicSourceFiles, renderingManifest } from "./visual/evidence-inputs.mjs";
import { validateVisualSpec } from "./visual/specification.mjs";
import { assessMatrix, expectedMatrix, expectedEnvironments, assessEnvironments, isFilteredVisualRun, parseEnvironmentAnnotation } from "./visual/matrix-contract.mjs";
import { assertLocalDockerEndpoint } from "./visual/local-docker.mjs";
import { assertVisualStorage, copyImmutableYarnCache } from './visual/local-storage.mjs';
import { indexJsonAttachments } from './visual/evidence-attachments.mjs';
import { hasSnapshotUpdateOption, transferNativeBaselines } from './visual/baseline-transfer.mjs';
import { assertRelativeChild, assertUnlinkedChild, resolveNativeAttachment } from './visual/evidence-paths.mjs';
import { visualCaptureScope } from './visual/argument-intent.mjs';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rename, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('explicit native snapshot update aliases share the canonical-environment guard', () => {
    for (const args of [['-u'], ['-uall'], ['-uchanged'], ['-umissing'], ['-unone'], ['-udefault'], ['-xuall'], ['-xumissing'], ['--update-snapshots'], ['--update-snapshots=all'], ['--update-snapshots', 'missing']]) assert.equal(hasSnapshotUpdateOption(args), true, args.join(' '));
    for (const args of [[], ['--candidate'], ['--project', 'chromium'], ['--update-source-method=overwrite'], ['-gu'], ['-g-uall'], ['-g', '-u'], ['--grep', '--update-snapshots=all'], ['-juall'], ['--', '-u'], ['--', '-uall']]) assert.equal(hasSnapshotUpdateOption(args), false, args.join(' '));
});

test('all native projects bound browser startup for managed and explicit executables', async () => {
    const previous = process.env.CRAB_TEST_BROWSER_PATH;
    try {
        for (const executable of [undefined, path.resolve('configured-browser.exe')]) {
            if (executable) process.env.CRAB_TEST_BROWSER_PATH = executable;
            else delete process.env.CRAB_TEST_BROWSER_PATH;
            const url = new URL('../test/visual/playwright.config.mjs', import.meta.url);
            url.searchParams.set('startup-budget', executable ? 'explicit' : 'managed');
            const { default: config } = await import(url.href);
            assert.equal(config.timeout, 45_000);
            assert.equal(config.projects.length, 3);
            for (const project of config.projects) {
                assert.equal(project.use.launchOptions.timeout, 30_000);
                assert.equal(project.use.launchOptions.executablePath, project.name === 'chromium' ? executable : undefined);
            }
        }
    } finally {
        if (previous === undefined) delete process.env.CRAB_TEST_BROWSER_PATH;
        else process.env.CRAB_TEST_BROWSER_PATH = previous;
    }
});

test('capture scope respects native short clusters, option values and positional separators', () => {
    for (const args of [['-gu'], ['-g-uall'], ['-xgu'], ['-Gpattern'], ['-g', '-u'], ['--grep', '--update-snapshots=all'], ['--', '-u'], ['--', 'field.spec.mjs'], ['--ignore-snapshots'], ['--project=chromium', 'field.spec.mjs'], ['--project=chromium', 'firefox', '-xumissing']]) assert.equal(isFilteredVisualRun(args), true, args.join(' '));
    for (const args of [['-xuall'], ['-xumissing'], ['-j2'], ['-cplaywright.config.mjs'], ['--trace', 'on'], ['--project', 'chromium', 'firefox'], ['--shuffle', '17'], ['--'], ['--update-snapshots', '--workers', '2']]) assert.equal(isFilteredVisualRun(args), false, args.join(' '));
    assert.equal(hasSnapshotUpdateOption(['-xgu', '-uall']), true);
    assert.equal(hasSnapshotUpdateOption(['--project', '-uall']), false);
});

test('native and Linux host scopes distinguish complete packages from the complete repository', () => {
    for (const args of [[], ['--workers', '1'], ['--project', 'chromium', 'firefox'], ['-xuall']]) assert.equal(visualCaptureScope(args), 'repository');
    for (const args of [['--package', 'rc-number-edit'], ['--package', 'rc-number-edit', '--workers', '1', '--global-timeout', '2400000'], ['-uall', '--package', 'rc-card']]) {
        assert.equal(visualCaptureScope(args), 'package');
        assert.doesNotThrow(() => assertVisualStorage(1024 ** 3, visualCaptureScope(args) === 'repository' ? 'repository' : 'filtered'));
    }
    for (const args of [['--list'], ['--package', 'rc-number-edit', '--grep', 'scientific'], ['--grep', '--package'], ['--', '--package']]) assert.equal(visualCaptureScope(args), 'filtered');
    assert.throws(() => assertVisualStorage(1024 ** 3, visualCaptureScope([]) === 'repository' ? 'repository' : 'filtered'), /Insufficient local visual storage/);
});

test('native evidence rebasing accepts both capture platforms and rejects foreign paths', () => {
    const root = path.resolve('owned-native-run');
    for (const original of ['/crab/run/results/case/actual.png', 'C:\\capture\\results\\case\\actual.png']) assert.equal(resolveNativeAttachment(root, original), path.join(root, 'results/case/actual.png'));
    for (const original of ['actual.png', '/run/results/', '/run/results/.', '/run/results/../outside.png', '/run/results/D:/outside.png', '/run/results/D:outside.png', '/run/results//outside.png']) assert.throws(() => resolveNativeAttachment(root, original), /attachment path|escapes/);
    assert.throws(() => assertRelativeChild(path.join(root, 'screens/component'), path.resolve(root, 'screens/component', '../../../../../outside')), /escapes/);
    assert.equal(assertRelativeChild(root, path.join(root, '..valid.png')), '..valid.png');
});

test('native evidence rejects source and destination junction ancestors', async () => withBaselineFixture(async ({ root, put }) => {
    const other = path.join(root, 'other');
    await put(other, 'actual.png', 'fixture only');
    for (const parent of ['results', 'review']) {
        const directory = path.join(root, parent);
        await mkdir(directory);
        await symlink(other, path.join(directory, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
        const file = path.join(directory, 'linked', parent === 'results' ? 'actual.png' : 'new-review');
        await assert.rejects(assertUnlinkedChild(root, file), /cannot follow links/);
    }
    await assertUnlinkedChild(root, path.join(root, 'review/new-review/screens/component/chromium'));
    assert.equal(await readFile(path.join(other, 'actual.png'), 'utf8'), 'fixture only');
}));

async function withBaselineFixture(run) {
    const tempRoot = await import('node:fs/promises').then(fs => fs.realpath(tmpdir()));
    const root = await mkdtemp(path.join(tempRoot, 'crab-visual-baselines-'));
    const input = path.join(root, 'snapshot/native-baselines'), history = path.join(root, 'snapshot/baseline-history');
    const put = async (directory, relative, bytes) => {
        const file = path.join(directory, relative);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, bytes);
        return file;
    };
    try { await run({ root, input, history, put }); }
    finally {
        assert.equal(path.dirname(root), tempRoot);
        assert.ok(path.basename(root).startsWith('crab-visual-baselines-'));
        await rm(root, { recursive: true, force: true });
    }
}

test('native baseline return archives old bytes and preserves unchanged expectations', async () => withBaselineFixture(async ({ root, input, history, put }) => {
    const before = {};
    for (const [engine, oldBytes, newBytes] of [['chromium', undefined, 'new'], ['firefox', 'old', 'revised'], ['webkit', 'same', 'same']]) {
        const relative = `linux/${engine}/component/frame.png`;
        await put(input, relative, newBytes);
        if (oldBytes) {
            const key = `test/visual/baselines/${relative}`;
            await put(root, key, oldBytes);
            before[key] = createHash('sha256').update(oldBytes).digest('hex');
        }
    }
    const records = await transferNativeBaselines({ root, input, history, before });
    assert.deepEqual(records.map(record => record.status), ['created', 'replaced', 'unchanged']);
    assert.equal(await readFile(path.join(root, 'test/visual/baselines/linux/chromium/component/frame.png'), 'utf8'), 'new');
    assert.equal(await readFile(path.join(root, 'test/visual/baselines/linux/firefox/component/frame.png'), 'utf8'), 'revised');
    assert.equal(await readFile(path.join(history, 'test/visual/baselines/linux/firefox/component/frame.png'), 'utf8'), 'old');
    assert.equal(await readFile(path.join(input, 'linux/firefox/component/frame.png'), 'utf8'), 'revised');
    assert.equal(await readFile(path.join(root, 'test/visual/baselines/linux/webkit/component/frame.png'), 'utf8'), 'same');
}));

test('a local baseline edit after snapshot creation rejects the entire return before writes', async () => withBaselineFixture(async ({ root, input, history, put }) => {
    await put(input, 'linux/chromium/a.png', 'new baseline');
    await put(input, 'linux/chromium/z.png', 'container update');
    const key = 'test/visual/baselines/linux/chromium/z.png';
    await put(root, key, 'local user edit');
    await assert.rejects(transferNativeBaselines({ root, input, history, before: { [key]: createHash('sha256').update('snapshot value').digest('hex') } }), /changed after the Linux snapshot/);
    await assert.rejects(readFile(path.join(root, 'test/visual/baselines/linux/chromium/a.png')), { code: 'ENOENT' });
    assert.equal(await readFile(path.join(root, key), 'utf8'), 'local user edit');
    assert.equal(await readFile(path.join(input, 'linux/chromium/z.png'), 'utf8'), 'container update');
}));

test('baseline return refuses another platform and paths outside its local repository', async () => withBaselineFixture(async ({ root, input, history, put }) => {
    await put(input, 'win32/chromium/frame.png', 'foreign platform');
    await assert.rejects(transferNativeBaselines({ root, input, history, before: {} }), /Only Linux project baselines/);
    await assert.rejects(transferNativeBaselines({ root, input: path.dirname(root), history, before: {} }), /escapes the repository/);
    await assert.rejects(readFile(path.join(root, 'test/visual/baselines/win32/chromium/frame.png')), { code: 'ENOENT' });
}));

test('baseline return rejects linked destination directories without touching their contents', async () => withBaselineFixture(async ({ root, input, history, put }) => {
    await put(input, 'linux/chromium/frame.png', 'native update');
    const destination = path.join(root, 'user-files');
    await put(destination, 'frame.png', 'retained user bytes');
    const parent = path.join(root, 'test/visual/baselines/linux');
    await mkdir(parent, { recursive: true });
    await symlink(destination, path.join(parent, 'chromium'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(transferNativeBaselines({ root, input, history, before: {} }), /cannot follow links/);
    assert.equal(await readFile(path.join(destination, 'frame.png'), 'utf8'), 'retained user bytes');
}));

test('evidence indexes retain every native snapshot target in multi-capture tests', () => {
    const json = (name, value) => ({ name, contentType: 'application/json', body: Buffer.from(JSON.stringify(value)).toString('base64') });
    const attachments = [
        json('snapshot-target', { path: 'linux/chromium/frame.png' }),
        { name: 'actual', contentType: 'image/png', body: 'cG5n' },
        json('snapshot-target', { path: 'linux/chromium/focus.png' }),
        { name: 'actual', contentType: 'image/png', body: 'cG5n' },
        { name: 'diagnostic', contentType: 'application/json', body: Buffer.from('{malformed').toString('base64') },
        json('candidate-inputs', { source: 'frozen' }),
    ];
    const before = structuredClone(attachments);
    const indexed = indexJsonAttachments(attachments);
    assert.deepEqual(indexed.map(item => [item.attachmentIndex, item.name]), [[0, 'snapshot-target'], [2, 'snapshot-target'], [5, 'candidate-inputs']]);
    assert.deepEqual(indexed.filter(item => item.name === 'snapshot-target').map(item => item.value.path), ['linux/chromium/frame.png', 'linux/chromium/focus.png']);
    assert.deepEqual(attachments, before, 'The original report and invalid diagnostic bytes remain unchanged');
});

test('visual capture rejects insufficient storage before building or launching browsers', () => {
    for (const scope of ['filtered', 'repository']) {
        assert.throws(() => assertVisualStorage(0, scope), /Insufficient local visual storage/);
        assert.equal(assertVisualStorage(Number.MAX_SAFE_INTEGER, scope).scope, scope);
    }
    assert.throws(() => assertVisualStorage(-1, 'repository'), /Invalid/);
    assert.throws(() => assertVisualStorage(1, 'unknown'), /Invalid/);
});

test('offline snapshots retain immutable archive bytes when the live cache is replaced', async () => {
    const tempRoot = await import('node:fs/promises').then(fs => fs.realpath(tmpdir()));
    const directory = await mkdtemp(path.join(tempRoot, 'crab-visual-cache-'));
    try {
        const source = path.join(directory, 'source'), target = path.join(directory, 'snapshot');
        await mkdir(source);
        await writeFile(path.join(source, 'package.zip'), 'immutable archive bytes');
        await writeFile(path.join(source, '.gitignore'), 'original metadata');
        const result = await copyImmutableYarnCache(source, target);
        assert.equal(result.linkedArchives + result.copiedEntries, 2);
        assert.equal(await readFile(path.join(target, 'package.zip'), 'utf8'), 'immutable archive bytes');
        if (result.linkedArchives) assert.equal((await stat(path.join(source, 'package.zip'), { bigint: true })).ino, (await stat(path.join(target, 'package.zip'), { bigint: true })).ino);
        await writeFile(path.join(target, '.gitignore'), 'independent metadata');
        assert.equal(await readFile(path.join(source, '.gitignore'), 'utf8'), 'original metadata');
        await writeFile(path.join(source, 'replacement.zip'), 'new cache entry');
        await rename(path.join(source, 'replacement.zip'), path.join(source, 'package.zip'));
        assert.equal(await readFile(path.join(target, 'package.zip'), 'utf8'), 'immutable archive bytes');
    } finally {
        assert.equal(path.dirname(directory), tempRoot);
        assert.ok(path.basename(directory).startsWith('crab-visual-cache-'));
        await rm(directory, { recursive: true, force: true });
    }
});

test("published visual compatibility options reject invalid media combinations and path escapes", () => {
    const args = ["--package=components/rc-line-edit", "--fixture=src/__tests__/browser/forced-colors-fixture.tsx", "--api=__fixture"];
    assert.equal(parsePublishedVisualOptions(args).forcedColors, true);
    assert.equal(parsePublishedVisualOptions([...args, "--colors=normal", "--motion=reduce"]).reducedMotion, true);
    for (const extra of [["--motion=reduce"], ["--colors=unknown"], ["--fixture=../../outside.tsx"], ["--api=alert(1)"], ["--validate-only=false"]]) assert.throws(() => parsePublishedVisualOptions([...args, ...extra]));
});

test("matrix acceptance rejects absent, failed, skipped, duplicate and undeclared cells", () => {
    const spec = { sizes: ["small", "large"], densities: ["standard"], states: ["default", "disabled"], crossEngine: { sizes: ["small"], densities: ["standard"], states: ["default"] } };
    const expected = expectedMatrix(spec, ["md3", "apple", "shadcn"], "chromium");
    assert.equal(expected.length, 24);
    assert.equal(expectedMatrix(spec, ["md3", "apple", "shadcn"], "webkit").length, 6);
    const passed = expected.map(cell => ({ ...cell, status: "passed" }));
    assert.deepEqual(assessMatrix(expected, passed).errors, []);
    for (const status of ["skipped", "failed", "timedOut", "interrupted"]) assert.ok(assessMatrix(expected, [{ ...passed[0], status }, ...passed.slice(1)]).errors.length);
    assert.match(assessMatrix(expected, passed.slice(1)).errors.join(" "), /missing/);
    assert.match(assessMatrix(expected, [...passed, passed[0]]).errors.join(" "), /Duplicate/);
    assert.match(assessMatrix(expected, [...passed, { ...passed[0], state: "invented" }]).errors.join(" "), /Undeclared/);
    assert.deepEqual(assessMatrix(expected, passed.slice(1), { complete: false }).errors, []);
    assert.throws(() => expectedMatrix({ ...spec, crossEngine: undefined }, ["md3"], "firefox"));
});

test("explicit visual filters are recorded as partial, ordinary package and engine runs retain coverage checks", () => {
    for (const args of [[], ["--project", "chromium", "--workers", "2"], ["--project=webkit", "--max-failures=1"], ['-u', 'changed', '--workers', '2'], ['--update-snapshots', '--project', 'chromium']]) assert.equal(isFilteredVisualRun(args), false);
    for (const args of [["inventory.visual.spec.mjs"], ["--grep", "focus"], ["--grep=focus"], ["--shard=1/2"], ["--last-failed"], ['-u', 'changed', 'inventory.visual.spec.mjs']]) assert.equal(isFilteredVisualRun(args), true);
});

test("local Linux acceptance cannot silently use a remote Docker context", () => {
    for (const endpoint of ["npipe:////./pipe/dockerDesktopLinuxEngine", "unix:///var/run/docker.sock", "tcp://127.0.0.1:2375", "https://[::1]:2376"]) assert.doesNotThrow(() => assertLocalDockerEndpoint(endpoint));
    for (const endpoint of [undefined, "ssh://build-host", "tcp://example.com:2375", "malformed"]) assert.throws(() => assertLocalDockerEndpoint(endpoint));
});

test("environment coverage accounts for design/mode and explicit package exclusions", () => {
    const expected = expectedEnvironments({ notApplicable: { touch: "No interactive hit target" } }, ["md3", "apple", "shadcn"], [{ id: "narrow" }, { id: "touch" }]);
    assert.equal(expected.length, 6);
    const passed = expected.map(cell => ({ ...cell, status: "passed" }));
    assert.deepEqual(assessEnvironments(expected, passed).errors, []);
    assert.match(assessEnvironments(expected, passed.slice(1)).errors.join(" "), /missing/);
});

test('environment annotations reject missing axes before supplementary filtering', () => {
    const cell = { designSystem: 'md3', colorMode: 'light', id: 'narrow' };
    assert.deepEqual(parseEnvironmentAnnotation(JSON.stringify(cell)), cell);
    const extra = { ...cell, id: 'configuration-retention', size: 'medium' };
    assert.deepEqual(parseEnvironmentAnnotation(JSON.stringify(extra)), extra);
    for (const invalid of [null, [], { ...cell, id: undefined, environment: 'narrow' }, { ...cell, id: ' ' }, { ...cell, designSystem: undefined }, { ...cell, colorMode: 1 }]) assert.throws(() => parseEnvironmentAnnotation(JSON.stringify(invalid)), /missing an axis/);
    assert.throws(() => parseEnvironmentAnnotation('{'), SyntaxError);
});

test("evidence bookkeeping has no circular influence on visual source identity", () => {
    const product = { name: "fixture", path: "components/fixture", designCoverage: { md3: "partial" } };
    const before = { designSystems: [{ id: "md3" }], packages: [product] };
    const after = { ...before, packages: [{ ...product, designCoverage: { md3: "verified" }, verification: { md3: { source: "new fingerprint" } } }] };
    assert.deepEqual(renderingManifest(after), renderingManifest(before));
    assert.notDeepEqual(renderingManifest({ ...before, designSystems: [{ id: "apple" }] }), renderingManifest(before));
});

test('the workbench embedded font is exactly the version recorded by the Linux environment', async () => {
    const css = await readFile(new URL('../components/rc-theme/docs/fonts.css', import.meta.url), 'utf8');
    const encoded = css.match(/data:font\/woff2;base64,([^']+)/)?.[1];
    assert.ok(encoded, 'The workbench must load its actual recorded font');
    assert.deepEqual(Buffer.from(encoded, 'base64'), await readFile(new URL('../.website/docs/assets/fonts/roboto-latin.woff2', import.meta.url)));
});

test('visual source identity includes authored public assets and excludes declared runtime copies', async () => {
    const tempRoot = path.resolve(tmpdir());
    const directory = await mkdtemp(path.join(tempRoot, 'crab-visual-public-'));
    try {
        await mkdir(path.join(directory, 'public/fixtures'), { recursive: true });
        await mkdir(path.join(directory, 'public/runtime'), { recursive: true });
        for (const file of ['fixtures/font.ttf', 'remote-entry.js', 'runtime/worker.js', 'docgen.json']) await writeFile(path.join(directory, 'public', file), file);
        const files = await publicSourceFiles({ directory, packageJson: { crab: { generatedArtifacts: { 'build:library': ['public/runtime/**'] } } } });
        assert.deepEqual(files.map(file => path.relative(directory, file).replaceAll('\\', '/')).sort(), ['public/fixtures/font.ttf', 'public/remote-entry.js']);
    } finally {
        assert.equal(path.dirname(directory), tempRoot);
        assert.ok(path.basename(directory).startsWith('crab-visual-public-'));
        await rm(directory, { recursive: true, force: true });
    }
});

test("component visual axes require real demos, distinct cases and explained exclusions", () => {
    const spec = { schemaVersion: 1, demo: "basic.demo.tsx", sizes: ["s"], densities: ["standard"], states: ["default"], notApplicable: { error: "No error state" } };
    assert.deepEqual(validateVisualSpec(spec, ["basic.demo.tsx"]), []);
    for (const invalid of [{ demo: "missing.demo.tsx" }, { sizes: [] }, { states: ["default", "default"] }, { densities: ["dense"] }, { notApplicable: { error: "" } }]) assert.ok(validateVisualSpec({ ...spec, ...invalid }, ["basic.demo.tsx"]).length > 0);
});
