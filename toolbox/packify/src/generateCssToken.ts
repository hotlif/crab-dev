import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { parse } from 'smol-toml';

interface TokenConfig {
    build: { output: string; prefix: string; };
    token: Record<string, any>;
}

/**
 * Recursive function to format the token object with 4-space indentation
 */
const formatTokenObject = (
    obj: Record<string, any>, 
    path: string[], 
    level: number = 1, 
    varsMap: Record<string, string>
): string => {
    const indent = "    ".repeat(level);
    
    const entries = Object.entries(obj).map(([key, value]) => {
        const currentPath = [...path, key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${indent}'${key}': {\n${formatTokenObject(value, currentPath, level + 1, varsMap)}\n${indent}}`;
        }
        
        // 完整的 CSS 變數名稱 (Value) -> 例如: --rc-slider-rail-interact-height
        const cssVarName = `--${currentPath.join('-')}`;
        
        // 用點 (.) 連接的路徑，去除掉 prefix (Key) -> 例如: slider.rail.interact.height
        const dotKey = currentPath.slice(1).join('.');
        const safeValue = String(value).trim();
        
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

        const varsMap: Record<string, string> = {};
        const formattedBody = formatTokenObject(token, [build.prefix], 1, varsMap);
        
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