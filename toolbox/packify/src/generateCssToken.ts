import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { parse } from 'smol-toml';
import { createRequire } from 'module';

interface TokenConfig {
    build: { output: string; prefix: string; imports?: string[]; };
    token: Record<string, unknown>;
}

interface GlobalTokenSource {
    prefix: string;
    tokens: Record<string, string>;
}

interface GlobalTokenInfo {
    sources: GlobalTokenSource[];
    merged: Record<string, { prefix: string; value: string }>;
}

/**
 * Flatten nested token object into a flat { dotKey: rawValue } map.
 */
const flattenTokens = (obj: Record<string, unknown>, path: string[] = []): Record<string, string> => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...path, key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(result, flattenTokens(value, currentPath));
        } else {
            result[currentPath.join('.')] = String(value).trim();
        }
    }
    return result;
};

/**
 * Resolve $ref() syntax in token values.
 *
 * Usage in token.toml:
 *   primary.bg = "$ref(zinc.950)"
 *   box-shadow = "inset 0 0 0 1px $ref(zinc.200)"
 *
 * Output:
 *   "var(--token-global-zinc-950, oklch(0.140 0.004 286))"
 */
const resolveRefs = (value: string, globals: GlobalTokenInfo): string => {
    return value.replace(/\$ref\(([^)]+)\)/g, (_match, key: string) => {
        const trimmedKey = key.trim();
        const entry = globals.merged[trimmedKey];
        if (entry) {
            const cssVarName = `--${entry.prefix}-${trimmedKey.replace(/\./g, '-')}`;
            return `var(${cssVarName}, ${entry.value})`;
        }
        console.warn(`⚠️ $ref(${trimmedKey}) not found in any global token source`);
        return `$ref(${trimmedKey})`;
    });
};

/**
 * Load global token definitions from a workspace package.
 * Reads the package's token.toml and returns its prefix + flattened token map.
 * If the package itself has imports, recursively loads and resolves them first.
 */
const loadGlobalTokenSource = async (packageName: string, reqFn?: ReturnType<typeof createRequire>): Promise<GlobalTokenSource | null> => {
    try {
        const req = reqFn ?? createRequire(join(process.cwd(), 'package.json'));
        const packageJsonPath = req.resolve(`${packageName}/package.json`);
        const packageDir = dirname(packageJsonPath);
        const tomlContent = await readFile(join(packageDir, 'token.toml'), 'utf-8');
        const config = parse(tomlContent) as unknown as TokenConfig;

        let tokens = flattenTokens(config.token);

        // 递归解析：如果上游包自身也有 imports，先加载并解析其 $ref()
        if (config.build.imports && config.build.imports.length > 0) {
            const upstreamReq = createRequire(join(packageDir, 'package.json'));
            const upstream = await loadGlobalTokens(config.build.imports, upstreamReq);
            if (upstream) {
                for (const [key, value] of Object.entries(tokens)) {
                    if (value.includes('$ref(')) {
                        tokens[key] = resolveRefs(value, upstream);
                    }
                }
            }
        }

        return {
            prefix: config.build.prefix,
            tokens,
        };
    } catch (error) {
        console.warn(`⚠️ Could not load global tokens from ${packageName}:`, error);
        return null;
    }
};

/**
 * Load and merge multiple global token packages.
 * Later packages override earlier ones on key collision.
 */
const loadGlobalTokens = async (packageNames: string[], reqFn?: ReturnType<typeof createRequire>): Promise<GlobalTokenInfo | null> => {
    const sources: GlobalTokenSource[] = [];
    for (const name of packageNames) {
        const source = await loadGlobalTokenSource(name, reqFn);
        if (source) sources.push(source);
    }
    if (sources.length === 0) return null;

    const merged: Record<string, { prefix: string; value: string }> = {};
    for (const source of sources) {
        for (const [key, value] of Object.entries(source.tokens)) {
            merged[key] = { prefix: source.prefix, value };
        }
    }
    return { sources, merged };
};

/**
 * Recursive function to format the token object with 4-space indentation
 */
const formatTokenObject = (
    obj: Record<string, unknown>, 
    path: string[], 
    level: number = 1, 
    varsMap: Record<string, string>,
    globals: GlobalTokenInfo | null = null,
): string => {
    const indent = "    ".repeat(level);
    
    const entries = Object.entries(obj).map(([key, value]) => {
        const currentPath = [...path, key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${indent}'${key}': {\n${formatTokenObject(value, currentPath, level + 1, varsMap, globals)}\n${indent}}`;
        }
        
        // 完整的 CSS 變數名稱 (Value) -> 例如: --rc-slider-rail-interact-height
        const cssVarName = `--${currentPath.join('-')}`;
        
        // 用點 (.) 連接的路徑，去除掉 prefix (Key) -> 例如: slider.rail.interact.height
        const dotKey = currentPath.slice(1).join('.');
        let safeValue = String(value).trim();

        // 解析 $ref() 引用，替換為 Global Token 的 CSS 變數
        if (globals && safeValue.includes('$ref(')) {
            safeValue = resolveRefs(safeValue, globals);
        }
        
        // 1. 將 Key: Value 存入 varsMap
        varsMap[dotKey] = cssVarName;
        
        // 2. 在 token 中使用 ES6 模板字串動態引入 vars 裡的變數
        return `${indent}'${key}': \`var(\${vars['${dotKey}']}, ${safeValue})\``;
    });

    return entries.join(',\n');
};

const generateCssToken = async () => {
    try {
        const content = await readFile(join(process.cwd(), "token.toml"), "utf-8");
        const config = parse(content) as unknown as TokenConfig;
        const { build, token } = config;

        // 載入 Layer 1 Global Tokens（如果配置了 globals）
        let globals: GlobalTokenInfo | null = null;
        if (build.imports && build.imports.length > 0) {
            globals = await loadGlobalTokens(build.imports);
            if (globals) {
                for (const source of globals.sources) {
                    console.log(`📦 Loaded global tokens from prefix: ${source.prefix}`);
                }
            }
        }

        const varsMap: Record<string, string> = {};
        const formattedBody = formatTokenObject(token, [build.prefix], 1, varsMap, globals);
        
        const varsBody = Object.entries(varsMap)
            .map(([key, value]) => `    '${key}': '${value}'`)
            .join(',\n');

        const tsSourceCode = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
${varsBody}
};

const token = {
${formattedBody}
};

export default token;
`;

        await writeFile(build.output, tsSourceCode);
        console.log(`✅ Tokens generated successfully at: ${build.output}`);
    } catch (error) {
        console.error("❌ Generation failed:", error);
    }
};

export default generateCssToken;