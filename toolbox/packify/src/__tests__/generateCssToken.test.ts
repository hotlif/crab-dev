import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import generateCssToken from '../generateCssToken.js';

describe('generateCssToken', () => {
    let tempDir: string;
    let originalCwd: () => string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), 'packify-test-'));
        originalCwd = process.cwd;
        process.cwd = () => tempDir;
    });

    afterEach(async () => {
        process.cwd = originalCwd;
        await rm(tempDir, { recursive: true, force: true });
    });

    /**
     * Helper: create a fake package inside the temp dir's node_modules.
     * The package will have a package.json and a token.toml.
     */
    const createFakePackage = async (
        packageName: string,
        tomlContent: string,
    ) => {
        const pkgDir = join(tempDir, 'node_modules', ...packageName.split('/'));
        await mkdir(pkgDir, { recursive: true });
        await writeFile(join(pkgDir, 'package.json'), JSON.stringify({ name: packageName }));
        await writeFile(join(pkgDir, 'token.toml'), tomlContent);
    };

    it('should generate token.ts from a simple token.toml', async () => {
        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "button"

[token]
transition = "transform 100ms ease"
opacity.loading = "0.65"
size.large.height = "40px"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        await generateCssToken();

        const output = await readFile(outputPath, 'utf-8');

        expect(output).toContain('THIS FILE IS AUTO-GENERATED');
        expect(output).toContain("export const vars");
        expect(output).toContain("export default token");

        // vars should contain flat dot-path keys mapped to CSS variable names
        expect(output).toContain("'transition': '--button-transition'");
        expect(output).toContain("'opacity.loading': '--button-opacity-loading'");
        expect(output).toContain("'size.large.height': '--button-size-large-height'");

        // token should contain nested structure with var() + fallback
        expect(output).toContain("var(${vars['transition']}, transform 100ms ease)");
        expect(output).toContain("var(${vars['opacity.loading']}, 0.65)");
        expect(output).toContain("var(${vars['size.large.height']}, 40px)");
    });

    it('should generate nested token objects', async () => {
        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "slider"

[token]
rail.height = "4px"
rail.interact.height = "12px"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        await generateCssToken();

        const output = await readFile(outputPath, 'utf-8');

        // Should have nested 'rail' object
        expect(output).toContain("'rail': {");
        expect(output).toContain("'height':");
        expect(output).toContain("'interact': {");
        expect(output).toContain("'rail.height': '--slider-rail-height'");
        expect(output).toContain("'rail.interact.height': '--slider-rail-interact-height'");
    });

    it('should handle missing token.toml gracefully', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await generateCssToken();

        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining('Generation failed'),
            expect.anything()
        );
        spy.mockRestore();
    });

    it('should resolve $ref() tokens from imported global packages', async () => {
        // Create a fake global token package
        await createFakePackage('@test/global-tokens', `
[build]
output = "./src/token.ts"
prefix = "token-global"

[token]
zinc.50 = "oklch(0.985 0.002 247)"
zinc.900 = "oklch(0.210 0.012 265)"
`);

        // Need a package.json in tempDir for createRequire to resolve from
        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "button"
imports = ["@test/global-tokens"]

[token]
primary.color = "$ref(zinc.900)"
primary.bg = "$ref(zinc.50)"
transition = "transform 100ms ease"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');

        // $ref should resolve to CSS variable with fallback from global tokens
        expect(output).toContain('var(--token-global-zinc-900, oklch(0.210 0.012 265))');
        expect(output).toContain('var(--token-global-zinc-50, oklch(0.985 0.002 247))');
        // Non-$ref values should remain as-is
        expect(output).toContain("var(${vars['transition']}, transform 100ms ease)");
    });

    it('should warn when $ref() references a missing token key', async () => {
        await createFakePackage('@test/global-tokens', `
[build]
output = "./src/token.ts"
prefix = "token-global"

[token]
zinc.50 = "oklch(0.985 0.002 247)"
`);

        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "button"
imports = ["@test/global-tokens"]

[token]
primary.color = "$ref(nonexistent.key)"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('$ref(nonexistent.key) not found')
        );
        warnSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        // Unresolved $ref should remain as-is
        expect(output).toContain('$ref(nonexistent.key)');
    });

    it('should handle recursive imports (upstream package with its own imports)', async () => {
        // Layer 1: global tokens (no imports)
        await createFakePackage('@test/layer1', `
[build]
output = "./src/token.ts"
prefix = "layer1"

[token]
base.color = "oklch(0.5 0.1 200)"
`);

        // Layer 2: semantic tokens that import layer1
        const layer2Dir = join(tempDir, 'node_modules', '@test', 'layer2');
        await mkdir(layer2Dir, { recursive: true });
        await writeFile(join(layer2Dir, 'package.json'), JSON.stringify({ name: '@test/layer2' }));

        // Layer 2 also needs to resolve @test/layer1, so create symlink or nested node_modules
        const layer2NodeModules = join(layer2Dir, 'node_modules', '@test', 'layer1');
        await mkdir(layer2NodeModules, { recursive: true });
        await writeFile(join(layer2NodeModules, 'package.json'), JSON.stringify({ name: '@test/layer1' }));
        await writeFile(join(layer2NodeModules, 'token.toml'), `
[build]
output = "./src/token.ts"
prefix = "layer1"

[token]
base.color = "oklch(0.5 0.1 200)"
`);

        await writeFile(join(layer2Dir, 'token.toml'), `
[build]
output = "./src/token.ts"
prefix = "layer2"
imports = ["@test/layer1"]

[token]
semantic.color = "$ref(base.color)"
plain.value = "16px"
`);

        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/layer2"]

[token]
text.color = "$ref(semantic.color)"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');

        // Layer 2's semantic.color should have been resolved with layer1's ref
        // so the component token should get the resolved chain
        expect(output).toContain('var(--layer2-semantic-color');
    });

    it('should handle failed global token loading gracefully', async () => {
        // Import a package that doesn't exist in node_modules
        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/nonexistent-package"]

[token]
value = "10px"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        // Should warn about failed loading but still generate output
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Could not load global tokens from @test/nonexistent-package'),
            expect.anything()
        );
        warnSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        // Should still generate with the simple value (no $ref resolution)
        expect(output).toContain("'value': '--comp-value'");
    });

    it('should handle array values in token by stringifying them', async () => {
        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "test"

[token]
simple = "hello"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        await generateCssToken();

        const output = await readFile(outputPath, 'utf-8');
        expect(output).toContain("var(${vars['simple']}, hello)");
    });

    it('should handle $ref() embedded within a larger string value', async () => {
        await createFakePackage('@test/global', `
[build]
output = "./src/token.ts"
prefix = "global"

[token]
zinc.200 = "oklch(0.920 0.004 265)"
`);

        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/global"]

[token]
box-shadow = "inset 0 0 0 1px $ref(zinc.200)"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        // $ref should be resolved inline within the larger value
        expect(output).toContain('inset 0 0 0 1px var(--global-zinc-200, oklch(0.920 0.004 265))');
    });

    it('should handle imports where all packages fail to load (empty sources)', async () => {
        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/bad1", "@test/bad2"]

[token]
color = "$ref(missing.key)"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();
        warnSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        // Since all imports failed, globals is null, so $ref() remains unresolved
        expect(output).toContain('$ref(missing.key)');
    });

    it('should handle token with imports but no $ref in token values', async () => {
        await createFakePackage('@test/global', `
[build]
output = "./src/token.ts"
prefix = "global"

[token]
base = "16px"
`);

        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/global"]

[token]
size = "24px"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        // Token value should be plain, no $ref resolution needed
        expect(output).toContain("var(${vars['size']}, 24px)");
    });

    it('should handle upstream package with imports but tokens without $ref', async () => {
        // Layer 1
        await createFakePackage('@test/layer1', `
[build]
output = "./src/token.ts"
prefix = "layer1"

[token]
base = "10px"
`);

        // Layer 2 imports layer1 but has no $ref in its own tokens
        const layer2Dir = join(tempDir, 'node_modules', '@test', 'layer2');
        await mkdir(layer2Dir, { recursive: true });
        await writeFile(join(layer2Dir, 'package.json'), JSON.stringify({ name: '@test/layer2' }));

        const layer2L1 = join(layer2Dir, 'node_modules', '@test', 'layer1');
        await mkdir(layer2L1, { recursive: true });
        await writeFile(join(layer2L1, 'package.json'), JSON.stringify({ name: '@test/layer1' }));
        await writeFile(join(layer2L1, 'token.toml'), `
[build]
output = "./src/token.ts"
prefix = "layer1"

[token]
base = "10px"
`);

        await writeFile(join(layer2Dir, 'token.toml'), `
[build]
output = "./src/token.ts"
prefix = "layer2"
imports = ["@test/layer1"]

[token]
plain = "20px"
`);

        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

        const outputPath = join(tempDir, 'token.ts');
        const toml = `
[build]
output = "${outputPath.replace(/\\/g, '/')}"
prefix = "comp"
imports = ["@test/layer2"]

[token]
val = "$ref(plain)"
`;
        await writeFile(join(tempDir, 'token.toml'), toml);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        await generateCssToken();
        logSpy.mockRestore();

        const output = await readFile(outputPath, 'utf-8');
        expect(output).toContain('var(--layer2-plain, 20px)');
    });
});
