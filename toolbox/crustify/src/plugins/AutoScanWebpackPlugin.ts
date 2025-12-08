import { Compiler, WebpackPluginInstance } from "webpack";
import { readdir, writeFile, readFile } from "fs/promises";
import { copy } from "fs-extra";
import { join, sep } from "path";
import * as ts from "typescript";
import { parse } from "smol-toml";

import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';

import { read } from "to-vfile";
import { unified } from "unified";

import { type ComponentScanRule } from "../conf";
import { getTmpDir } from "../util";
import { existsSync, mkdirSync } from "fs";

const PLUGIN_NAME = "AutoScanWebpackPlugin";

/**
 * 从给定的 TypeScript 代码中提取注释内容。
 *
 * @param code - 包含 TypeScript 代码的字符串。
 * @returns 提取的注释内容字符串，如果没有找到注释则返回 null。
 */
export const getTypeScriptComment = (code: string) => {
	const sourceFile = ts.createSourceFile("", code, ts.ScriptTarget.Latest, true);
    try {
        const statement = sourceFile.statements[0];
        const comments = ts.getLeadingCommentRanges(code, statement.pos);
        if (comments && comments?.[0]) {
                const firstComment = comments[0];
                const commentText = code.substring(firstComment.pos, firstComment.end);
                const commentTextList = commentText.split("\n");
                const commentTextListLength = commentTextList.length;
                return commentTextList.map((line, index)=> {
                    if (index === 0) {
                        return line.trim().replace(/^\s*\/\*+/, "");
                    } else if (index === commentTextListLength - 1) {
                        return line.trim().replace(/^\s*\*+\//, "");
                    } else {
                        return line.trim().replace(/^\s*\*\s*/, "");
                    }
                }).join("\n").trim();

        }
        return null;
    } catch (error) {
        return null;            
    }
}


/**
 * 从给定的 Markdown 文件中提取 TOML 格式的注释内容。
 * @param path 文件路径
 * @returns 返回解析好的 TOML 数据
 */
export const getMdxComment = async (path: string) => {
	type Tree = {
		children: {type: string, value: string}[]
	}
	let tree: Tree | null = null;

	await unified()
	.use(remarkParse)
	.use(remarkStringify)
	.use(remarkFrontmatter, ['toml'])
	.use(() => (t: any) => {
		tree = t 
	})
	.process(await read(path, "utf-8"));
	const data = tree!.children.find(ele => ele.type === "toml")
	try {
		if (data?.value) {
			return parse(data.value);
		}
		return null;
	} catch (error) {
		return null;
	}
}

/**
 * 解析文件头部注释
 * 
 * @param path - 文件路径
 * @returns 解析后的注释内容
 */
export const parseHeaderComments = async (path: string) => {
    if (/\.[jt]sx?$/.test(path)) {
        const text = (await readFile(path)).toString();
        const comment = getTypeScriptComment(text);
        if (comment) {
            return parse(comment);
        } else {
            return null;
        }
    } else if (/\.(md|mdx)$/.test(path)) {
        const comment = await getMdxComment(path);
        if (comment) {
            return comment;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

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

/**
 * 自动扫描指定目录下的所有文件，并生成一个包含所有组件的 ES 模块文件。
 * 
 * @param rootDir - 扫描的根目录。
 * @param componentScan - 扫描组件的规则。
 * @returns 一个字符串，表示生成的 ES 模块文件的内容。
 * 
 * 生成的文件将包括：
 * - 每个找到的组件的 import 语句。
 * - 一个包含组件元数据的数组，包括名称、相对路径和可选的源代码。
 * 
 * `componentScan` 参数包括：
 * - `cwd`: 开始扫描的目录。
 * - `generateSourceCharacter`: 是否包含组件的源代码。
 * - `include`: 包含特定文件的正则表达式。
 * - `exclude`: 排除特定文件的正则表达式。
 */
class AutoScanWebpackPlugin implements WebpackPluginInstance {
    private param: ComponentScanRule[] = [];
    private rootDir: string;

    constructor(param: AutoScanWebpackPluginParam) {
        this.param = param.componentScanRules ?? [];
        this.rootDir = param.rootDir;
    }

    async generateTsConfigFile(componentScan: ComponentScanRule[]) {
        const tsconfig: {
            compilerOptions: {
                paths: {
                    [key: string]: string[]
                }
            }
        } = {
            "compilerOptions": {
                "paths": {
                }
            }
        }
        const tmp = getTmpDir(this.rootDir);
        componentScan.forEach(element => {
            const fileName = Buffer.from(element.namespaces).toString("base64");
            tsconfig.compilerOptions.paths[`@@@/${element.namespaces}`] = [join(tmp, `${fileName}.ts`)]
        })
        return JSON.stringify(tsconfig);
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
        let importStatements: string = "";
        let exportStatements: string = "const components = [\n";
        let importSourceStatements: string = "";

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];


            const importUrl = file.replace(process.cwd(), "@@").replaceAll(sep, "/");
            const importName = importUrl.replace(/[^a-zA-Z0-9]/g, "_");
            const relativePath = file.replace(process.cwd(), "").replaceAll(sep, "/");

            const sourcePath = join(getTmpDir(rootDir), `${relativePath}.raw`);
            await copy(file, sourcePath);

            if (generateSourceCharacter !== false) {
                importSourceStatements += `import ${importName}_source from "./${relativePath}.raw";\n`;
            }

            const metadata = await parseHeaderComments(file);
            importStatements += `const ${importName} = lazy(() => import("@@/${importUrl}"));\n`;
            exportStatements += `   { name: "${importName}", component: ${importName}, relativePath: "${relativePath}"${
                generateSourceCharacter !== false ? `, source: ${importName}_source` : ""
            }, metadata: ${JSON.stringify(metadata)}},\n`;
        }
        exportStatements += "];\n";
        return `import { lazy } from "react";\n${
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

            if (!existsSync(join(tmp, "autoscan"))) {
                mkdirSync(join(tmp, "autoscan"));
            }
            const tsConfigStr = await this.generateTsConfigFile(this.param);
            writeFile(join(tmp, "autoscan", "tsconfig.json"), tsConfigStr);
        });
    }
}

export default AutoScanWebpackPlugin;
