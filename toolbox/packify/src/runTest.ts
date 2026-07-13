import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

/**
 * 解析「调用方包」的 jest 可执行入口。
 *
 * 以 `cwd/package.json` 为基准解析,而非 packify 自身的依赖树——各包各自掌控其 jest 版本,
 * packify 只负责把它以正确的方式启动。
 *
 * 必须用无扩展名的 `jest/bin/jest`:jest 的 exports 未暴露 `./bin/jest.js` 子路径,
 * 带扩展名会得到 ERR_PACKAGE_PATH_NOT_EXPORTED。
 */
export const resolveJestBin = (cwd: string): string => {
    const require = createRequire(join(cwd, "package.json"));
    return require.resolve("jest/bin/jest");
};

/**
 * 组装子进程 node 的完整参数。
 *
 * jest 尚未原生支持 ESM,必须以 `--experimental-vm-modules` 启动;该 flag 只能在 node 进程
 * 启动时传入、无法在运行中的进程里开启——这正是此处只能 spawn 子进程,而不能直接调用
 * jest 编程 API 的根本原因。
 */
export const buildJestArgv = (jestBin: string, forwarded: readonly string[]): string[] => [
    "--experimental-vm-modules",
    jestBin,
    ...forwarded,
];

/**
 * 在调用方包内运行 jest,透传其命令行参数与退出码。
 *
 * PnP runtime 由 yarn 经 NODE_OPTIONS(`--require .pnp.cjs`)注入,spawn 出的子进程继承该
 * 环境后,方能加载位于 zip 归档内的 jest。
 */
const runTest = (forwarded: readonly string[] = process.argv.slice(3)): void => {
    const child = spawn(
        process.execPath,
        buildJestArgv(resolveJestBin(process.cwd()), forwarded),
        { stdio: "inherit" },
    );

    // 透传退出码 / 终止信号:否则测试失败时本进程仍以 0 退出,CI 会把红灯误判为通过
    child.on("exit", (code, signal) => {
        if (signal) {
            process.kill(process.pid, signal);
        } else {
            process.exit(code ?? 1);
        }
    });
};

export default runTest;
