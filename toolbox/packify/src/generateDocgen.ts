import { access, mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { builtinHandlers, builtinImporters, builtinResolvers, parse } from "react-docgen";

/**
 * 与 @react-docgen/cli 的默认行为逐项对齐(resolver=find-exported-component、
 * handlers=全量内建、importer=fsImporter),保证生成的 docgen.json 与旧 CLI
 * 产物字节级兼容——lignify 文档站按 `<API path="./src/xxx.tsx" />` 消费顶层 key。
 */
const cliCompatibleOptions = {
    resolver: new builtinResolvers.FindExportedDefinitionsResolver({ limit: 1 }),
    handlers: Object.values(builtinHandlers),
    importer: builtinImporters.fsImporter,
};

const fileExists = async (path: string): Promise<boolean> => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
};

/**
 * 从 src/index.ts 回溯 default 导出组件的源文件。
 * 组件包 index.ts 遵循固定导出形态(component-constraints §2):
 *   import Card from './card.js';  →  export default Card;
 * 因此按标识符做两步正则匹配即可,无需完整 AST。
 */
const resolveEntryFromIndex = async (cwd: string): Promise<string> => {
    const content = await readFile(join(cwd, "src", "index.ts"), "utf-8");

    const defaultExport = content.match(/^export\s+default\s+([A-Za-z_$][\w$]*)\s*;?\s*$/m);
    if (!defaultExport) {
        throw new Error(
            "no `export default <Component>` found in src/index.ts; " +
            "set `docgen.entry` in package.json to specify the entry manually",
        );
    }
    const name = defaultExport[1];

    const importSource = content.match(new RegExp(
        `^import\\s+${name}\\s*(?:,\\s*\\{[^}]*\\})?\\s*from\\s+["'](\\.\\.?/[^"']+)\\.js["']`,
        "m",
    ));
    if (!importSource) {
        throw new Error(
            `cannot locate the import of default export \`${name}\` in src/index.ts; ` +
            "set `docgen.entry` in package.json to specify the entry manually",
        );
    }

    const relative = importSource[1].replace(/^\.\//, "");
    for (const ext of [".tsx", ".ts"]) {
        if (await fileExists(join(cwd, "src", `${relative}${ext}`))) {
            return `./src/${relative}${ext}`;
        }
    }
    throw new Error(`source file of \`${name}\` not found: src/${relative}.tsx or .ts`);
};

/**
 * 入口解析顺序:package.json 的 `docgen.entry` 显式配置优先(应对 index.ts
 * 无 default 导出等非常规形态),否则从 src/index.ts 自动推断。
 */
const resolveEntry = async (cwd: string): Promise<string> => {
    const pkg = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8")) as {
        docgen?: { entry?: string };
    };
    if (pkg.docgen?.entry) {
        return pkg.docgen.entry.replace(/\\/g, "/");
    }
    return resolveEntryFromIndex(cwd);
};

const generateDocgen = async () => {
    try {
        const cwd = process.cwd();
        const entry = await resolveEntry(cwd);
        const content = await readFile(join(cwd, entry), "utf-8");
        const documentation = parse(content, {
            filename: entry,
            ...cliCompatibleOptions,
        });

        await mkdir(join(cwd, "public"), { recursive: true });
        const output = join(cwd, "public", "docgen.json");
        // 顶层 key 与 @react-docgen/cli 一致:POSIX 相对路径,紧凑 JSON
        await writeFile(output, JSON.stringify({ [entry]: documentation }));
        console.log(`✅ Docgen generated successfully at: ${output} (entry: ${entry})`);
    } catch (error) {
        console.error("❌ Docgen generation failed:", error);
        process.exitCode = 1;
    }
};

export default generateDocgen;
