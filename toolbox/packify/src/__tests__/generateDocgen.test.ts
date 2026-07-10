import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import generateDocgen from '../generateDocgen.js';

const BUTTON_SOURCE = `
import type { ReactNode } from 'react';

interface ButtonProps {
    /** 按钮内容 */
    children?: ReactNode;
    /** 是否禁用 */
    disabled?: boolean;
}

/** 一个按钮 */
export default function Button({ children, disabled = false }: ButtonProps) {
    return <button disabled={disabled}>{children}</button>;
}
`;

describe('generateDocgen', () => {
    let tempDir: string;
    let originalCwd: () => string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), 'packify-docgen-test-'));
        originalCwd = process.cwd;
        process.cwd = () => tempDir;
        process.exitCode = undefined;
    });

    afterEach(async () => {
        process.cwd = originalCwd;
        process.exitCode = undefined;
        await rm(tempDir, { recursive: true, force: true });
    });

    const scaffold = async (files: Record<string, string>) => {
        for (const [relativePath, content] of Object.entries(files)) {
            const fullPath = join(tempDir, relativePath);
            await mkdir(join(fullPath, '..'), { recursive: true });
            await writeFile(fullPath, content);
        }
    };

    const readDocgen = async (): Promise<Record<string, Array<{ description?: string; props?: Record<string, unknown> }>>> => {
        const raw = await readFile(join(tempDir, 'public', 'docgen.json'), 'utf-8');
        return JSON.parse(raw) as Record<string, Array<{ description?: string; props?: Record<string, unknown> }>>;
    };

    it('should resolve entry from index.ts default export and generate docgen.json', async () => {
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-button' }),
            'src/index.ts': "import Button from './button.js';\nexport default Button;\n",
            'src/button.tsx': BUTTON_SOURCE,
        });

        await generateDocgen();

        const result = await readDocgen();
        expect(Object.keys(result)).toEqual(['./src/button.tsx']);
        expect(result['./src/button.tsx'][0].description).toBe('一个按钮');
        expect(Object.keys(result['./src/button.tsx'][0].props ?? {})).toEqual(['children', 'disabled']);
        expect(process.exitCode).toBeUndefined();
    });

    it('should resolve entry when default import carries extra named bindings', async () => {
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-virtual' }),
            'src/index.ts': "import Virtual, { type VirtualProps } from './virtual.js';\nexport default Virtual;\n",
            'src/virtual.tsx': BUTTON_SOURCE,
        });

        await generateDocgen();

        const result = await readDocgen();
        expect(Object.keys(result)).toEqual(['./src/virtual.tsx']);
    });

    it('should resolve nested entry paths', async () => {
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-color-picker' }),
            'src/index.ts': 'import ColorPicker from "./colorPicker/colorPicker.js";\nexport default ColorPicker;\n',
            'src/colorPicker/colorPicker.tsx': BUTTON_SOURCE,
        });

        await generateDocgen();

        const result = await readDocgen();
        expect(Object.keys(result)).toEqual(['./src/colorPicker/colorPicker.tsx']);
    });

    it('should prefer docgen.entry from package.json over index.ts resolution', async () => {
        await scaffold({
            'package.json': JSON.stringify({
                name: '@crab-dev/rc-date-picker',
                docgen: { entry: './src/panels/panel.tsx' },
            }),
            'src/index.ts': "export { default as DatePicker } from './datePicker/index.js';\n",
            'src/panels/panel.tsx': BUTTON_SOURCE,
        });

        await generateDocgen();

        const result = await readDocgen();
        expect(Object.keys(result)).toEqual(['./src/panels/panel.tsx']);
    });

    it('should fail with exit code when index.ts has no default export and no docgen.entry', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-hooks' }),
            'src/index.ts': "export { useKeyDown } from './useKeyDown.js';\n",
        });

        await generateDocgen();

        expect(process.exitCode).toBe(1);
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('should fail with exit code when the entry source file does not exist', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-ghost' }),
            'src/index.ts': "import Ghost from './ghost.js';\nexport default Ghost;\n",
        });

        await generateDocgen();

        expect(process.exitCode).toBe(1);
        consoleError.mockRestore();
    });

    it('should emit compact JSON matching the @react-docgen/cli output shape', async () => {
        await scaffold({
            'package.json': JSON.stringify({ name: '@crab-dev/rc-button' }),
            'src/index.ts': "import Button from './button.js';\nexport default Button;\n",
            'src/button.tsx': BUTTON_SOURCE,
        });

        await generateDocgen();

        const raw = await readFile(join(tempDir, 'public', 'docgen.json'), 'utf-8');
        // 与 CLI 一致:紧凑 JSON(无缩进、无换行)
        expect(raw).not.toContain('\n');
        expect(raw.startsWith('{"./src/button.tsx":[')).toBe(true);
    });
});
