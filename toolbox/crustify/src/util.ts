import { existsSync, mkdirSync } from "fs";
import { join } from "path";

/**
 * 获取当前生成器的临时目录
 */
export const getTmpDir = (rootDir?: string) => {
    const tmpDir = join(rootDir ?? process.cwd(), ".tmp");
    if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir);
    }
    return tmpDir;
}

export const getCwdDir = (rootDir?: string) => {
    return rootDir ?? process.cwd();
}
