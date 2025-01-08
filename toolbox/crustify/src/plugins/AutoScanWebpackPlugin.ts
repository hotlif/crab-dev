import { Compiler, WebpackPluginInstance } from "webpack";
import { readdir } from "fs/promises";
import { join } from "path";
import { type ComponentScanRule } from "../conf";

const PLUGIN_NAME = "AutoScanWebpackPlugin";

export const getAllFiles = async (dir: string, include: RegExp, exclude: RegExp | null) => {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (let i = 0; i < dirents.length; i++) {
        const currentPath = join(dir, dirents[i].name);
        if (dirents[i].isDirectory()) {
            const nextFiles = await getAllFiles(currentPath, include, exclude);
            files.push(...nextFiles);
        } else {
            if (include.test(currentPath)) {
                files.push(currentPath);
            } else if (exclude != null && !exclude.test(currentPath)){
                files.push(currentPath);
            }
        }
    }
    return files
}

class AutoScanWebpackPlugin implements WebpackPluginInstance {
    private param: ComponentScanRule[] = [];

    constructor(param: ComponentScanRule[] = []) {
        this.param = param;
    }

    /**
     * 自动扫描对应的文件夹, 并且生成对应的 `export` 语句, 可通过 `namespaces` 来指定对应的命名空间进行导入
     */
    generateImportESMAScriptFile (componentScan: ComponentScanRule) {
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
            for (let i = 0; i < this.param.length; i++) {
                const componentScan = this.param[i];

            }
        });
    }
}

export default AutoScanWebpackPlugin;
