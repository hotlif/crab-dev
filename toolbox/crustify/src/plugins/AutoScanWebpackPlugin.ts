import { Compiler, WebpackPluginInstance } from "webpack";
import { readdir, writeFile } from "fs/promises";
import { join, sep } from "path";
import { type ComponentScanRule } from "../conf";
import { getTmpDir, getCwdDir } from "../util";

const PLUGIN_NAME = "AutoScanWebpackPlugin";

export const getAllFiles = async (dir: string, include: RegExp | null, exclude: RegExp | null) => {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (let i = 0; i < dirents.length; i++) {
        const currentPath = join(dir, dirents[i].name);
        if (dirents[i].isDirectory()) {
            const nextFiles = await getAllFiles(currentPath, include, exclude);
            files.push(...nextFiles);
        } else {
            if (include == null || include.test(currentPath)) {
                files.push(currentPath);
            } else if (exclude != null && !exclude.test(currentPath)){
                files.push(currentPath);
            }
        }
    }
    return files
}


interface AutoScanWebpackPluginParam {
    componentScanRules: ComponentScanRule[]
    rootDir: string
}

class AutoScanWebpackPlugin implements WebpackPluginInstance {
    private param: ComponentScanRule[] = [];
    private rootDir: string;

    constructor(param: AutoScanWebpackPluginParam) {
        this.param = param.componentScanRules ?? [];
        this.rootDir = param.rootDir;
    }

    /**
     * 自动扫描对应的文件夹, 并且生成对应的 `export` 语句, 可通过 `namespaces` 来指定对应的命名空间进行导入
     */
    async generateImportESMAScriptFile (rootDir: string, componentScan: ComponentScanRule) {
        const {
            cwd,
            generateSourceCharacter,
            include,
            exclude
        } = componentScan;

        const files = await getAllFiles(cwd, include ?? null, exclude ?? null);

        const typeCode = `
interface ComponentType {
    name: string,
    relativePath: string,
    component: ComponentType,
    source?: string
}`
        let importStatements: string = "";
        let exportStatements: string = "const components: ComponentType[] = [\n";
        let importSourceStatements: string = "";

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const importUrl = file.replace(rootDir, "@").replaceAll(sep, "/");
            const importName = importUrl.replace(/[^a-zA-Z0-9]/g, "_");
            const relativePath = file.replace(rootDir, "").replaceAll(sep, "/");
            if (generateSourceCharacter === true) {
                importSourceStatements += `import ${importName}_source from "raw-loader!${importUrl}";\n`;
            }

            importStatements += `const ${importName} = lazy(() => import("${importUrl}"));\n`;
            exportStatements += `   { name: "${importName}", component: ${importName}, relativePath: "${relativePath}"${
                generateSourceCharacter === true ? `source: ${importName}_source` : ""
            }},\n`;
        }
        exportStatements += "];\n";
        return `import { lazy } from "react";\n${
            typeCode
        }\n${
            importSourceStatements
        }\n${
            importStatements
        }\n${
            exportStatements
        }\nexport default components;`;
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
            const tmp = getTmpDir(this.rootDir);
            for (let i = 0; i < this.param.length; i+= 1) {
                const componentScan = this.param[i];
                const importESMAScript = await this.generateImportESMAScriptFile(this.rootDir, componentScan);
                const fileName = Buffer.from(componentScan.namespaces).toString("base64");
                writeFile(join(tmp, `${fileName}.ts`), importESMAScript);
            }
        });
    }
}

export default AutoScanWebpackPlugin;
