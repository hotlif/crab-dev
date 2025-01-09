
import { describe, it, expect } from "@jest/globals";
import { type Configuration } from "webpack";
import { join } from "path";
import { readFileSync, existsSync, rmSync } from "fs";
import { compile, babelLoader } from "../util";
import { getTmpDir } from "../../../util";
import AutoScanWebpackPlugin, { getAllFiles } from "../../AutoScanWebpackPlugin";

describe('AutoScanWebpackPlugin', () => {

    it("should get all files in the current directory", async () => {
        const currentPath = join(__dirname, "TestDirectoryStructure");
        const data = await getAllFiles(currentPath, /\.ts$/, null);
        expect(data.length).toEqual(3);
        expect(data).toContain(join(currentPath, "A.ts"));
        expect(data).toContain(join(currentPath, "A", "A1.ts"));
        expect(data).toContain(join(currentPath, "A", "AA", "AA1.ts"));
    })

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
        expect(existsSync(join(tempDir, `${fileName}.ts`))).toBe(true)
        expect(readFileSync(join(tempDir, `${fileName}.ts`)).toString()).toMatchSnapshot();
        
        const fileNameGenerateSourceCharacter = Buffer.from("@@/TestDirectoryStructureGenerateSourceCharacter").toString("base64");
        expect(existsSync(tempDir)).toBe(true);
        expect(existsSync(join(tempDir, `${fileNameGenerateSourceCharacter}.ts`))).toBe(true)
        expect(readFileSync(join(tempDir, `${fileNameGenerateSourceCharacter}.ts`)).toString()).toMatchSnapshot();
        rmSync(tempDir, { recursive: true });
    });
});
