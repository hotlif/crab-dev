
import { describe, it, expect } from "@jest/globals";
import { type Configuration } from "webpack";
import { join } from "path";
import { readFileSync, existsSync, rmSync } from "fs";
import { createRequire } from "module";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { compile, babelLoader } from "../util.js";
import { getTmpDir } from "../../util.js";
import AutoScanWebpackPlugin, { getAllFiles, getTypeScriptComment, getMdxComment, parseHeaderComments } from "../../plugins/AutoScanWebpackPlugin.js";


const require = createRequire(import.meta.url); // eslint-disable-line @typescript-eslint/no-unused-vars
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('AutoScanWebpackPlugin', () => {

    it("should get all files in the current directory", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, /\.ts$/, null);
        expect(data.length).toEqual(3);
        expect(data).toContain(join(currentPath, "A.ts"));
        expect(data).toContain(join(currentPath, "A", "A1.ts"));
        expect(data).toContain(join(currentPath, "A", "AA", "AA1.ts"));
    });

    it("should get typeScript file comment ", async () => {
        const text = readFileSync(join(__dirname, "index.ts")).toString();
        const comment = getTypeScriptComment(text);
        expect(comment).toEqual("这是一个头部测试的注释")
    });

    it('should generate auto scan with Webpack configuration', async () => {
        const _temp = join(__dirname, ".tmp");
        if (existsSync(_temp)) {
            rmSync(_temp, { recursive: true, force: true });
        }
        const tempDir = getTmpDir(__dirname); 
        const config: Configuration = {
            mode: "production",
            entry: join(__dirname, 'index.ts'),
            output: {
                path: '/dist',
                filename: 'bundle.js'
            },
            module: {
                rules: [{
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [babelLoader],
                }]
            },
            plugins: [
                new AutoScanWebpackPlugin({
                    rootDir: __dirname,
                    componentScanRules: [{
                        namespaces: "@@/TestDirectoryStructure",
                        cwd: join(__dirname, "TestDirectoryStructure"),
                        generateSourceCharacter: false,
                        include: /\.ts$/,
                        exclude: /\.css$/,
                    },{
                        namespaces: "@@/TestDirectoryStructureGenerateSourceCharacter",
                        cwd: join(__dirname, "TestDirectoryStructure"),
                        generateSourceCharacter: true,
                        include: /\.ts$/,
                    }]
                })
            ]
        };

        const { error } = await compile(config);
        expect(error).toBeNull();

        const fileName = Buffer.from("@@/TestDirectoryStructure").toString("base64");
        expect(existsSync(tempDir)).toBe(true);
        expect(existsSync(join(tempDir, `${fileName}.ts`))).toBe(true);
        const generatedContent1 = readFileSync(join(tempDir, `${fileName}.ts`)).toString();
        expect(generatedContent1).toMatchSnapshot();
        // 验证生成的文件结构
        expect(generatedContent1).toContain('import { lazy } from "react";');
        expect(generatedContent1).toContain('const components = [');
        expect(generatedContent1).toContain('export default components;');
        expect(generatedContent1).toContain('name:');
        expect(generatedContent1).toContain('component:');
        expect(generatedContent1).toContain('path:');
        expect(generatedContent1).toContain('frontmatter:');
        expect(generatedContent1).toContain('source: null');
        
        const fileNameGenerateSourceCharacter = Buffer.from("@@/TestDirectoryStructureGenerateSourceCharacter").toString("base64");
        expect(existsSync(tempDir)).toBe(true);
        expect(existsSync(join(tempDir, `${fileNameGenerateSourceCharacter}.ts`))).toBe(true);
        const generatedContent2 = readFileSync(join(tempDir, `${fileNameGenerateSourceCharacter}.ts`)).toString();
        expect(generatedContent2).toMatchSnapshot();
        // 验证生成的文件结构（包含源代码）
        expect(generatedContent2).toContain('import { lazy } from "react";');
        expect(generatedContent2).toContain('const components = [');
        expect(generatedContent2).toContain('export default components;');
        expect(generatedContent2).toContain('name:');
        expect(generatedContent2).toContain('component:');
        expect(generatedContent2).toContain('path:');
        expect(generatedContent2).toContain('frontmatter:');
        expect(generatedContent2).toContain('source:'); // 可能包含源代码而不是 null
        rmSync(tempDir, { recursive: true });
    }, 120_000);

    it("should get all files without include/exclude filters", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, null, null);
        expect(data.length).toBeGreaterThanOrEqual(5);
    });

    it("should exclude files matching exclude when include does not match", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, /\.ts$/, /\.css$/);
        expect(data).not.toContain(join(currentPath, "A.css"));
        expect(data).toContain(join(currentPath, "A.ts"));
    });

    it("should include files not matching include and not matching exclude", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, /\.ts$/, /\.css$/);
        expect(data).toContain(join(currentPath, "B.mdx"));
    });

    it("should return null for code without comments", () => {
        const comment = getTypeScriptComment('const x = 1;');
        expect(comment).toBeNull();
    });

    it("should return null for empty code", () => {
        const comment = getTypeScriptComment('');
        expect(comment).toBeNull();
    });

    it("should parse MDX frontmatter from .mdx file", async () => {
        const mdxPath = join(__dirname, "TestDirectoryStructure", "B.mdx");
        const result = await getMdxComment(mdxPath);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("title", "Test MDX");
        expect(result).toHaveProperty("version", "1.0.0");
    });

    it("should parse MDX frontmatter from .md file", async () => {
        const mdPath = join(__dirname, "TestDirectoryStructure", "C.md");
        const result = await getMdxComment(mdPath);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("title", "Test MD");
    });

    it("getMdxComment should return null for MDX without TOML frontmatter", async () => {
        const mdxPath = join(__dirname, "TestDirectoryStructure", "D.mdx");
        const result = await getMdxComment(mdxPath);
        expect(result).toBeNull();
    });

    it("parseHeaderComments should handle .ts files", async () => {
        const tsPath = join(__dirname, "TestDirectoryStructure", "A.ts");
        const result = await parseHeaderComments(tsPath);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("name", "zhangj");
    });

    it("parseHeaderComments should handle .mdx files", async () => {
        const mdxPath = join(__dirname, "TestDirectoryStructure", "B.mdx");
        const result = await parseHeaderComments(mdxPath);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("title", "Test MDX");
    });

    it("parseHeaderComments should handle .md files", async () => {
        const mdPath = join(__dirname, "TestDirectoryStructure", "C.md");
        const result = await parseHeaderComments(mdPath);
        expect(result).toBeDefined();
        expect(result).toHaveProperty("title", "Test MD");
    });

    it("parseHeaderComments should return null for unsupported file types", async () => {
        const cssPath = join(__dirname, "TestDirectoryStructure", "A.css");
        const result = await parseHeaderComments(cssPath);
        expect(result).toBeNull();
    });

    it("parseHeaderComments should return null for .ts without comment", async () => {
        const tsPath = join(__dirname, "TestDirectoryStructure", "A", "A1.ts");
        const result = await parseHeaderComments(tsPath);
        expect(result).toBeNull();
    });

    it("getMdxComment should return null for MDX with invalid TOML frontmatter", async () => {
        const mdxPath = join(__dirname, "TestDirectoryStructure", "E.mdx");
        const result = await getMdxComment(mdxPath);
        expect(result).toBeNull();
    });
});
