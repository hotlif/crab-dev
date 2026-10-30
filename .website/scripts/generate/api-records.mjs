import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseTypeScript } from "./syntax.mjs";
import { normalizeCommentText, parseSourceApiProps } from "./api-source.mjs";

export const MAX_API_TYPE_TEXT_LENGTH = 400;

export function parseAttributes(tag) {
    const attributes = new Map();
    const pattern = /([A-Za-z][\w-]*)="([^"]*)"/g;
    for (const match of tag.matchAll(pattern)) {
        attributes.set(match[1], match[2]);
    }
    return attributes;
}

export function normalizeTypeText(type) {
    const raw = typeof type?.raw === "string" ? type.raw : type?.name;
    return typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "unknown";
}

export function isValidTypeText(typeText) {
    if (
        typeof typeText !== "string"
        || typeText === ""
        || typeText === "unknown"
        || typeText.length > MAX_API_TYPE_TEXT_LENGTH
        || typeText.includes("/**")
        || typeText.includes("*/")
    ) {
        return false;
    }
    try {
        const sourceFile = parseTypeScript(`type ApiType = ${typeText};`, "api-type.ts");
        return sourceFile.program.body.length === 1
            && sourceFile.program.body[0].type === "TSTypeAliasDeclaration";
    } catch {
        return false;
    }
}

export function normalizeApiProps(docgenProps, sourceProps, context) {
    const sourceByName = new Map(sourceProps.map((prop) => [prop.name, prop]));
    const docgenByName = new Map(docgenProps.map((prop) => [prop.name, prop]));
    if (sourceByName.size !== sourceProps.length) {
        throw new Error(`${context}: API source 存在重复属性`);
    }
    if (docgenByName.size !== docgenProps.length) {
        throw new Error(`${context}: docgen 存在重复属性`);
    }
    // Old docgen may still contain removed business APIs. Once source members are
    // available, docgen contributes metadata, never an additional public field.
    const names = (sourceProps.length ? sourceProps : docgenProps).map(prop => prop.name);
    if (names.length === 0) {
        throw new Error(`${context}: Props 为空，且无法从 API source 提取兜底定义`);
    }

    return names.map((name) => {
        const sourceProp = sourceByName.get(name);
        const docgenProp = docgenByName.get(name);
        const sourceType = sourceProp?.typeText;
        const docgenType = docgenProp?.typeText;
        const typeText = sourceType && isValidTypeText(sourceType) ? sourceType : docgenType;
        if (!isValidTypeText(typeText)) {
            const candidate = docgenType ?? sourceType ?? "unknown";
            throw new Error(`${context}: ${name} 的类型无法可靠解析：${String(candidate).slice(0, 120)}`);
        }
        const description = normalizeCommentText(sourceProp?.description || docgenProp?.description || "暂无说明。");
        const constraint = sourceProp?.exclusiveWith?.length ? `与 ${sourceProp.exclusiveWith.join("、")} 互斥，不能同时提供。` : "";
        return {
            name,
            required: sourceProp?.required ?? (docgenProp?.required === true),
            description: `${description}${constraint ? ` ${constraint}` : ""}`,
            typeText,
            defaultValue: docgenProp?.defaultValue ?? sourceProp?.defaultValue ?? null,
            deprecated: docgenProp?.deprecated === true || sourceProp?.deprecated === true,
            native: sourceProp?.native === true,
        };
    });
}

export async function extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath, explicitTag) {
    const apiTag = explicitTag ?? canonicalMdx.match(/<API\b[^>]*\/>/)?.[0];
    if (!apiTag) return null;

    const attributes = parseAttributes(apiTag);
    const componentName = attributes.get("component");
    const symbol = attributes.get("symbol");
    const source = attributes.get("source");
    if (!componentName || !symbol || !source) {
        throw new Error(`${componentDirectory}: API 标签缺少 component、symbol 或 source`);
    }

    const docgenPath = path.join(componentDirectory, "public/docgen.json");
    let docgen;
    try {
        docgen = JSON.parse(await readFile(docgenPath, "utf8"));
    } catch (error) {
        throw new Error(`${docgenPath}: 无法读取 API 数据`, { cause: error });
    }

    const candidates = Object.values(docgen).flatMap((value) => (
        Array.isArray(value) ? value : []
    ));
    const definition = candidates.find((candidate) => candidate?.displayName === componentName);
    const docgenProps = Object.entries(definition?.props ?? {}).map(([name, prop]) => ({
        name,
        required: prop?.required === true,
        description: typeof prop?.description === "string" ? prop.description : "",
        typeText: normalizeTypeText(prop?.tsType),
        defaultValue: typeof prop?.defaultValue?.value === "string"
            ? prop.defaultValue.value
            : null,
        deprecated: prop?.deprecated === true,
    }));
    const sourcePath = await resolveApiSourcePath(componentDirectory, canonicalMdxPath, source);
    const started = performance.now();
    const sourceProps = parseSourceApiProps(sourcePath, symbol);
    if (process.env.CRAB_DOCS_TRACE) console.log(`API ${componentName}: ${(performance.now() - started).toFixed(0)}ms`);
    const props = normalizeApiProps(docgenProps, sourceProps, docgenPath);

    return {
        component: componentName,
        symbol,
        props,
    };
}

export async function resolveApiSourcePath(componentDirectory, canonicalMdxPath, source) {
    const sourceDirectory = path.resolve(componentDirectory, "src");
    const sourcePath = path.resolve(path.dirname(canonicalMdxPath), source);
    const relativePath = path.relative(sourceDirectory, sourcePath);
    if (
        relativePath === ".."
        || relativePath.startsWith(`..${path.sep}`)
        || path.isAbsolute(relativePath)
    ) {
        throw new Error(`${sourcePath}: API source 必须位于组件 src 目录内`);
    }
    try {
        await readFile(sourcePath, "utf8");
    } catch (error) {
        throw new Error(`${sourcePath}: API source 不存在或无法读取`, { cause: error });
    }
    return sourcePath;
}
