import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { mkdtemp, rm, writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

// Mock rollup and all heavy plugins to avoid real bundling
const mockWrite = jest.fn<(options: unknown) => Promise<void>>().mockResolvedValue(undefined);
const mockRollup = jest.fn<(options: unknown) => Promise<{ write: typeof mockWrite }>>().mockResolvedValue({ write: mockWrite });

jest.unstable_mockModule('rollup', () => ({
    rollup: mockRollup,
}));

jest.unstable_mockModule('@rollup/plugin-node-resolve', () => ({
    default: jest.fn(() => ({ name: 'node-resolve' })),
}));

jest.unstable_mockModule('@rollup/plugin-terser', () => ({
    default: jest.fn(() => ({ name: 'terser' })),
}));

jest.unstable_mockModule('@wyw-in-js/rollup', () => ({
    default: jest.fn(() => ({ name: 'wyw' })),
}));

jest.unstable_mockModule('rollup-plugin-css-only', () => ({
    default: jest.fn(() => ({ name: 'css-only' })),
}));

jest.unstable_mockModule('@rollup/plugin-babel', () => ({
    default: jest.fn(() => ({ name: 'babel' })),
}));

jest.unstable_mockModule('rollup-plugin-dts', () => ({
    dts: jest.fn(() => ({ name: 'dts' })),
}));

const { build, generateCssToken } = await import('../index.js');

describe('index exports', () => {
    it('should export build as a function', () => {
        expect(typeof build).toBe('function');
    });

    it('should export generateCssToken as a function', () => {
        expect(typeof generateCssToken).toBe('function');
    });
});

describe('build', () => {
    let tempDir: string;
    let originalCwd: () => string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), 'packify-build-'));
        originalCwd = process.cwd;
        process.cwd = () => tempDir;

        // Create directories that build() will try to rm
        await mkdir(join(tempDir, 'esm'), { recursive: true });
        await mkdir(join(tempDir, 'cjs'), { recursive: true });
        await mkdir(join(tempDir, 'declarations'), { recursive: true });
        await mkdir(join(tempDir, 'css'), { recursive: true });

        mockRollup.mockClear();
        mockWrite.mockClear();
    });

    afterEach(async () => {
        process.cwd = originalCwd;
        await rm(tempDir, { recursive: true, force: true });
    });

    it('should clean output directories and call rollup', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await build();

        // Verify directories were cleaned (rm is called with force so no error even if empty)
        // Rollup should be called twice: once for the main bundle, once for types
        expect(mockRollup).toHaveBeenCalledTimes(2);

        // Main bundle should have write called twice (esm + cjs)
        // Types bundle should have write called once
        expect(mockWrite).toHaveBeenCalledTimes(3);

        // First write: ESM
        expect(mockWrite).toHaveBeenNthCalledWith(1, expect.objectContaining({
            dir: 'esm',
            format: 'es',
            entryFileNames: '[name].mjs',
        }));

        // Second write: CJS
        expect(mockWrite).toHaveBeenNthCalledWith(2, expect.objectContaining({
            dir: 'cjs',
            format: 'cjs',
            exports: 'auto',
            entryFileNames: '[name].cjs',
        }));

        // Third write: declarations
        expect(mockWrite).toHaveBeenNthCalledWith(3, expect.objectContaining({
            file: 'declarations/index.d.ts',
            format: 'es',
        }));

        logSpy.mockRestore();
    });

    it('should pass correct input and external function to rollup', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await build();

        // Check the first rollup call (main bundle)
        const mainCallArgs = mockRollup.mock.calls[0]![0] as { input: string; external: (id: string) => boolean };
        expect(mainCallArgs.input).toBe(join(tempDir, 'src', 'index.ts'));

        // External function: true for non-relative, non-absolute paths
        const externalFn = mainCallArgs.external;
        expect(externalFn('react')).toBe(true);
        expect(externalFn('@crab-dev/something')).toBe(true);
        expect(externalFn('./util.js')).toBe(false);
        expect(externalFn('../helper.js')).toBe(false);
        // Absolute path should return false
        expect(externalFn(join(tempDir, 'src', 'util.ts'))).toBe(false);

        logSpy.mockRestore();
    });

    it('should clean esm, cjs, declarations, css directories', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // Put a file in each directory to verify cleanup
        await writeFile(join(tempDir, 'esm', 'old.mjs'), 'old');
        await writeFile(join(tempDir, 'cjs', 'old.cjs'), 'old');
        await writeFile(join(tempDir, 'declarations', 'old.d.ts'), 'old');
        await writeFile(join(tempDir, 'css', 'old.css'), 'old');

        await build();

        // After build, the directories should have been removed
        const entries = await readdir(tempDir);
        expect(entries).not.toContain('esm');
        expect(entries).not.toContain('cjs');
        expect(entries).not.toContain('declarations');
        expect(entries).not.toContain('css');

        logSpy.mockRestore();
    });
});
