import { existsSync, mkdirSync } from "fs";
import { Configuration } from "webpack";
import { join } from "path";
import { Config, Modification } from "./conf";

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


export const getModsWebpackMerge = (mods: Modification[], webpackConfig: Configuration) => {
    let config = webpackConfig;
    mods.forEach(mod => {
        config = mod.modifyWebpack(config)
    });
    return config;
}
