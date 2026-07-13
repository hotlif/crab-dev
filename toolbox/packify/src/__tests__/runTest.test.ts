import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

type ExitListener = (code: number | null, signal: string | null) => void;

interface FakeChild {
    on: (event: string, listener: ExitListener) => void;
}

const spawnMock = jest.fn<(command: string, args: readonly string[], options: object) => FakeChild>();

jest.unstable_mockModule('node:child_process', () => ({ spawn: spawnMock }));

const { default: runTest, buildJestArgv, resolveJestBin } = await import('../runTest.js');

describe('buildJestArgv', () => {
    it('把 --experimental-vm-modules 置于 jest bin 之前(该 flag 只在进程启动时生效)', () => {
        expect(buildJestArgv('/pkg/jest/bin/jest.js', [])).toEqual([
            '--experimental-vm-modules',
            '/pkg/jest/bin/jest.js',
        ]);
    });

    it('原样保序透传调用方参数', () => {
        expect(buildJestArgv('/pkg/jest/bin/jest.js', ['-t', '用例名', 'src/a.test.tsx'])).toEqual([
            '--experimental-vm-modules',
            '/pkg/jest/bin/jest.js',
            '-t',
            '用例名',
            'src/a.test.tsx',
        ]);
    });
});

describe('resolveJestBin', () => {
    it('从调用方包解析出 jest 可执行入口', () => {
        // packify 自身声明了 jest,借仓库内真实 PnP 解析验证
        const bin = resolveJestBin(process.cwd()).replace(/\\/g, '/');
        expect(bin).toMatch(/\/jest\/bin\/jest\.js$/);
    });

    it('调用方未声明 jest 时抛错,而非静默跳过测试', async () => {
        const tempDir = await mkdtemp(join(tmpdir(), 'packify-runtest-'));
        await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'no-jest' }));

        expect(() => resolveJestBin(tempDir)).toThrow();

        await rm(tempDir, { recursive: true, force: true });
    });
});

describe('runTest', () => {
    let exitListener: ExitListener | undefined;
    let exitSpy: jest.Spied<typeof process.exit>;
    let killSpy: jest.Spied<typeof process.kill>;

    beforeEach(() => {
        exitListener = undefined;
        spawnMock.mockReset();
        spawnMock.mockReturnValue({
            on: (event, listener) => {
                if (event === 'exit') {
                    exitListener = listener;
                }
            },
        });
        exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        killSpy = jest.spyOn(process, 'kill').mockImplementation((() => true) as never);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('以当前 node 可执行文件 spawn jest 并继承 stdio', () => {
        runTest([]);

        const [command, args, options] = spawnMock.mock.calls[0];
        expect(command).toBe(process.execPath);
        expect(args[0]).toBe('--experimental-vm-modules');
        expect(options).toEqual({ stdio: 'inherit' });
    });

    it('透传调用方参数给 jest', () => {
        runTest(['-t', '用例名']);

        const [, args] = spawnMock.mock.calls[0];
        expect(args.slice(-2)).toEqual(['-t', '用例名']);
    });

    it('转发失败退出码——测试红灯不得被 CI 判为通过', () => {
        runTest([]);
        exitListener?.(1, null);

        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('转发成功退出码', () => {
        runTest([]);
        exitListener?.(0, null);

        expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('子进程被信号终止时以同一信号自终,保留终止语义', () => {
        runTest([]);
        exitListener?.(null, 'SIGINT');

        expect(killSpy).toHaveBeenCalledWith(process.pid, 'SIGINT');
        expect(exitSpy).not.toHaveBeenCalled();
    });

    it('既无退出码也无信号时以 1 退出,不静默放行', () => {
        runTest([]);
        exitListener?.(null, null);

        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});
