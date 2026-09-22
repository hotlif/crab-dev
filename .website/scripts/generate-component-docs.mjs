import { readFile, readdir, mkdir, unlink, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import { generate } from "@babel/generator";
import { loadTutorial, loadPracticeTutorials, tutorialMarkup, validateTeachingInventory, createLearningMap, createHomeExample } from "./generate-tutorials.mjs";
import { createTokenReferenceData, readGlobalTokens } from "./generate-token-reference.mjs";

const EXPECTED_COMPONENT_COUNT = 54;
const EXPECTED_DEMO_COUNT = 257;
const GENERATED_MARKER = "THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const componentsDirectory = path.join(repositoryRoot, "components");
const websiteDocsDirectory = path.join(repositoryRoot, ".website/docs");
const generatedDataDirectory = path.join(websiteDocsDirectory, "_generated");
const generatedApiDirectory = path.join(websiteDocsDirectory, "_generated_api");
const generatedPagesDirectory = path.join(websiteDocsDirectory, "components");
const checkOnly = process.argv.includes("--check");
const MAX_API_TYPE_TEXT_LENGTH = 400;

const compactComponents = new Set([
    "rc-avatar",
    "rc-badge",
    "rc-button",
    "rc-checkbox",
    "rc-radio",
    "rc-select",
    "rc-slider",
    "rc-switch",
    "rc-tag",
    "rc-tooltip",
]);

const gridLayoutComponents = new Set([
    "rc-alert",
    "rc-avatar",
    "rc-badge",
    "rc-card",
    "rc-checkbox",
    "rc-divider",
    "rc-empty",
    "rc-line-edit",
    "rc-number-edit",
    "rc-radio",
    "rc-skeleton",
    "rc-slider",
    "rc-spin",
    "rc-switch",
    "rc-tag",
    "rc-text-edit",
    "rc-tooltip",
]);

const spaciousComponents = new Set([
    "rc-pdf-editor",
    "rc-app-main-layout",
    "rc-masonry",
    "rc-prose",
    "rc-tree",
    "rc-virtual",
]);

const demoGroupDefinitions = new Map([
    ["rc-button", [
        ["基础与外观", [
            "basic.demo.tsx",
            "appearance.demo.tsx",
            "circle.demo.tsx",
            "danger.demo.tsx",
            "icon.demo.tsx",
            "icon-after.demo.tsx",
            "link-button.demo.tsx",
            "size.demo.tsx",
        ]],
        ["状态与反馈", [
            "disabled.demo.tsx",
            "loading.demo.tsx",
            "selected.demo.tsx",
        ]],
        ["组合", ["button-group.demo.tsx", "expressive.demo.tsx"]],
    ]],
    ["rc-canvas", [
        ["基础图形", [
            "basic.demo.tsx",
            "line.demo.tsx",
            "rounded.demo.tsx",
            "opacity.demo.tsx",
            "text.demo.tsx",
            "text-advanced.demo.tsx",
            "group.demo.tsx",
        ]],
        ["交互与变换", [
            "draggable.demo.tsx",
            "hover.demo.tsx",
            "transformer.demo.tsx",
        ]],
        ["场景与性能", [
            "animation.demo.tsx",
            "infinite-canvas.demo.tsx",
            "minimap.demo.tsx",
        ]],
    ]],
    ["rc-card", [
        ["基础与布局", [
            "basic.demo.tsx",
            "composition.demo.tsx",
            "cover.demo.tsx",
            "size.demo.tsx",
            "variant.demo.tsx",
        ]],
        ["交互与状态", [
            "clickable.demo.tsx",
            "states.demo.tsx",
            "loading.demo.tsx",
        ]],
    ]],
    ["rc-date-picker", [
        ["日期选择", [
            "datePicker.demo.tsx",
            "datePickerRange.demo.tsx",
            "datePickerPanel.demo.tsx",
        ]],
        ["日期时间", [
            "dateTimePicker.demo.tsx",
            "dateTimePickerPanel.demo.tsx",
        ]],
        ["时间选择", [
            "timePicker.demo.tsx",
            "timePickerPanel.demo.tsx",
        ]],
    ]],
    ["rc-line-edit", [
        ["基础与尺寸", [
            "simple.demo.tsx",
            "size.demo.tsx",
            "prefix-suffix.demo.tsx",
        ]],
        ["输入能力", [
            "allow-clear.demo.tsx",
            "password.demo.tsx",
            "show-count.demo.tsx",
            "status.demo.tsx",
        ]],
    ]],
    ["rc-pagination", [
        ["基础与外观", [
            "basic.demo.tsx",
            "size.demo.tsx",
            "disabled.demo.tsx",
        ]],
        ["页码控制", [
            "controlled.demo.tsx",
            "many-pages.demo.tsx",
            "quick-jumper.demo.tsx",
            "show-total.demo.tsx",
            "size-changer.demo.tsx",
        ]],
    ]],
    ["rc-table-pro", [
        ["基础与数据", [
            "basic.demo.tsx",
            "type-loaders.demo.tsx",
            "auto-refresh.demo.tsx",
        ]],
        ["工作区能力", [
            "search-bar.demo.tsx",
            "sidebar.demo.tsx",
            "pagination.demo.tsx",
        ]],
        ["导出与状态", [
            "export.demo.tsx",
            "state-persistence.demo.tsx",
        ]],
    ]],
    ["rc-select", [
        ["基础与状态", [
            "basic.demo.tsx",
            "size.demo.tsx",
            "status.demo.tsx",
            "disabled.demo.tsx",
            "loading.demo.tsx",
            "allowClear.demo.tsx",
        ]],
        ["数据与搜索", [
            "group.demo.tsx",
            "searchable.demo.tsx",
        ]],
        ["多选能力", [
            "multiple.demo.tsx",
            "maxTagCount.demo.tsx",
        ]],
    ]],
    ["rc-table", [
        ["基础、汇总与性能", [
            "basis.demo.tsx",
            "empty.demo.tsx",
            "highlight.demo.tsx",
            "summary.demo.tsx",
            "largeScale.demo.tsx",
        ]],
        ["列与表头", [
            "columnDrag.demo.tsx",
            "columnResize.demo.tsx",
            "filter.demo.tsx",
            "mergeTableHeaders.demo.tsx",
            "sort.demo.tsx",
        ]],
        ["行与结构", [
            "dynamicRowHeight.demo.tsx",
            "mergeCells.demo.tsx",
            "rowExpansion.demo.tsx",
            "rowGrouping.demo.tsx",
            "rowNumber.demo.tsx",
            "rowSelection.demo.tsx",
            "rowState.demo.tsx",
            "tree.demo.tsx",
        ]],
        ["编辑与交互", [
            "copy.demo.tsx",
            "edit.demo.tsx",
            "rowEdit.demo.tsx",
            "rowEvent.demo.tsx",
            "selectCells.demo.tsx",
        ]],
    ]],
    ["rc-tag", [
        ["基础与外观", [
            "basic.demo.tsx",
            "bordered.demo.tsx",
            "icon.demo.tsx",
            "size.demo.tsx",
        ]],
        ["交互与自定义", [
            "checkable.demo.tsx",
            "closable.demo.tsx",
            "custom-color-close-icon.demo.tsx",
        ]],
    ]],
    ["rc-tree", [
        ["基础展示", [
            "basic.demo.tsx",
            "expand-all.demo.tsx",
            "show-line.demo.tsx",
            "icon-and-disabled.demo.tsx",
        ]],
        ["选择与筛选", [
            "checkable.demo.tsx",
            "filter.demo.tsx",
        ]],
        ["编辑与交互", [
            "draggable.demo.tsx",
            "allow-drop.demo.tsx",
            "inline-edit.demo.tsx",
            "keyboard.demo.tsx",
        ]],
    ]],
]);

function normalizeNewlines(value) {
    return value.replace(/\r\n?/g, "\n");
}

// TypeScript 7.0 has no JavaScript compiler API. Docs only need syntax, not type checking.
function parseTypeScript(sourceCode, filePath) {
    return parse(sourceCode, {
        sourceType: "module",
        sourceFilename: filePath,
        plugins: filePath.endsWith(".tsx") ? ["typescript", "jsx"] : ["typescript"],
    });
}

function printType(node) {
    return generate(node, { comments: false, concise: true }).code;
}

function visitSyntax(node, visit) {
    if (!node || typeof node !== "object" || typeof node.type !== "string") return;
    visit(node);
    for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach((child) => visitSyntax(child, visit));
        else if (value && typeof value === "object") visitSyntax(value, visit);
    }
}

function unwrapExpression(expression) {
    let current = expression;
    while (
        current.type === "TSAsExpression"
        || current.type === "TSSatisfiesExpression"
        || current.type === "ParenthesizedExpression"
        || current.type === "TSTypeAssertion"
    ) {
        current = current.expression;
    }
    return current;
}

function readStaticString(expression, fieldName, filePath) {
    const value = unwrapExpression(expression);
    if (value.type === "StringLiteral") return value.value;
    if (value.type === "TemplateLiteral" && value.expressions.length === 0) {
        return value.quasis[0].value.cooked;
    }
    throw new Error(`${filePath}: meta.${fieldName} 必须是静态字符串`);
}

function propertyNameText(name) {
    if (name?.type === "Identifier") return name.name;
    if (name?.type === "StringLiteral") return name.value;
    return undefined;
}

export function extractDemoMeta(sourceCode, filePath) {
    const sourceFile = parseTypeScript(sourceCode, filePath);

    for (const statement of sourceFile.program.body) {
        if (statement.type !== "ExportNamedDeclaration"
            || statement.declaration?.type !== "VariableDeclaration") continue;

        for (const declaration of statement.declaration.declarations) {
            if (declaration.id.type !== "Identifier" || declaration.id.name !== "meta") continue;
            if (!declaration.init) {
                throw new Error(`${filePath}: meta 缺少初始化值`);
            }
            const initializer = unwrapExpression(declaration.init);
            if (initializer.type !== "ObjectExpression") {
                throw new Error(`${filePath}: meta 必须是静态对象字面量`);
            }

            const values = new Map();
            for (const property of initializer.properties) {
                if (property.type !== "ObjectProperty" || property.computed) continue;
                const name = propertyNameText(property.key);
                if (name === "title" || name === "description") {
                    values.set(name, readStaticString(property.value, name, filePath));
                }
            }
            if (!values.has("title") || !values.has("description")) {
                throw new Error(`${filePath}: meta 必须同时声明静态 title 和 description`);
            }
            return {
                title: values.get("title"),
                description: values.get("description"),
            };
        }
    }

    throw new Error(`${filePath}: 未找到导出的静态 meta`);
}

function parseAttributes(tag) {
    const attributes = new Map();
    const pattern = /([A-Za-z][\w-]*)="([^"]*)"/g;
    for (const match of tag.matchAll(pattern)) {
        attributes.set(match[1], match[2]);
    }
    return attributes;
}

function normalizeTypeText(type) {
    const raw = typeof type?.raw === "string" ? type.raw : type?.name;
    return typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "unknown";
}

function normalizeCommentText(value) {
    if (typeof value !== "string") return "";
    return value
        .replace(/\{@link\s+([^}\s]+)(?:\s+([^}]+))?\}/g, (_, target, label) => label ?? target)
        .replace(/\s+/g, " ")
        .trim();
}

function leadingLineComment(node, sourceFile) {
    const leadingText = sourceFile.slice(0, node.start);
    const lines = leadingText.split(/\r?\n/);
    const comments = [];
    for (let index = lines.length - 1; index >= 0; index -= 1) {
        const line = lines[index].trim();
        if (line === "") {
            if (comments.length === 0) continue;
            break;
        }
        if (!line.startsWith("//")) break;
        const comment = line.slice(2).trim();
        if (!/^[-=─\s]+$/.test(comment)) comments.unshift(comment);
    }
    return normalizeCommentText(comments.join(" "));
}

function propertyDescription(node, sourceFile) {
    const comment = propertyJsDoc(node).split(/(?:^|\s)@[a-zA-Z]+\b/)[0];
    return normalizeCommentText(comment) || leadingLineComment(node, sourceFile);
}

function propertyJsDoc(node) {
    const jsDoc = node.leadingComments?.findLast((comment) => (
        comment.type === "CommentBlock" && comment.value.startsWith("*")
    ));
    return jsDoc?.value.replace(/^\s*\* ?/gm, "").trim() ?? "";
}

function propertyDeprecated(node) {
    return /(?:^|\s)@deprecated\b/.test(propertyJsDoc(node));
}

function memberName(member) {
    if (member.computed) return undefined;
    return propertyNameText(member.key);
}

function memberTypeText(member) {
    if (member.type === "TSPropertySignature") {
        return member.typeAnnotation
            ? printType(member.typeAnnotation.typeAnnotation)
            : "unknown";
    }
    if (member.type === "TSMethodSignature") {
        return printType({
            type: "TSFunctionType",
            typeParameters: member.typeParameters,
            parameters: member.parameters,
            typeAnnotation: member.typeAnnotation ?? {
                type: "TSTypeAnnotation",
                typeAnnotation: { type: "TSVoidKeyword" },
            },
        });
    }
    return "unknown";
}

function sourceMemberRecord(member, sourceFile) {
    const name = memberName(member);
    if (!name || (member.type !== "TSPropertySignature" && member.type !== "TSMethodSignature")) {
        return undefined;
    }
    return {
        name,
        required: !member.optional,
        description: propertyDescription(member, sourceFile),
        typeText: memberTypeText(member).replace(/\s+/g, " ").trim(),
        defaultValue: null,
        deprecated: propertyDeprecated(member),
    };
}

function mergeIntersectionRecords(recordGroups) {
    const merged = new Map();
    for (const records of recordGroups) {
        for (const record of records) {
            const current = merged.get(record.name);
            merged.set(record.name, current ? {
                ...current,
                required: current.required || record.required,
                description: current.description || record.description,
                typeText: current.typeText === record.typeText
                    ? current.typeText
                    : `${current.typeText} | ${record.typeText}`,
                deprecated: current.deprecated || record.deprecated,
            } : record);
        }
    }
    return [...merged.values()];
}

function mergeUnionRecords(recordGroups) {
    const names = [...new Set(recordGroups.flatMap((records) => records.map((record) => record.name)))];
    return names.map((name) => {
        const variants = recordGroups
            .map((records) => records.find((record) => record.name === name))
            .filter(Boolean);
        const concreteTypes = [...new Set(
            variants.map((record) => record.typeText).filter((typeText) => typeText !== "never"),
        )];
        const unionTypes = concreteTypes.map((typeText) => (
            typeText.includes("=>") ? `(${typeText})` : typeText
        ));
        return {
            name,
            required: recordGroups.every((records) => (
                records.some((record) => record.name === name && record.required)
            )),
            description: variants.find((record) => record.description)?.description ?? "",
            typeText: unionTypes.length > 0 ? unionTypes.join(" | ") : "never",
            defaultValue: null,
            deprecated: variants.some((record) => record.deprecated),
        };
    });
}

function literalPropertyNames(typeNode) {
    if (typeNode?.type === "TSLiteralType" && typeNode.literal.type === "StringLiteral") {
        return [typeNode.literal.value];
    }
    if (typeNode?.type === "TSUnionType") {
        return typeNode.types.flatMap(literalPropertyNames);
    }
    return [];
}

function parseSourceApiProps(sourcePath, symbol) {
    let sourceCode;
    try {
        sourceCode = readFileSync(sourcePath, "utf8");
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
    const sourceFile = parseTypeScript(sourceCode, sourcePath);
    const declarations = new Map();
    for (const statement of sourceFile.program.body) {
        const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
        if (
            declaration?.type === "TSInterfaceDeclaration" || declaration?.type === "TSTypeAliasDeclaration"
        ) {
            declarations.set(declaration.id.name, declaration);
        }
    }

    const resolving = new Set();
    function resolveNamedType(name, typeArguments) {
        if (name === "Omit" || name === "Pick" || name === "Partial" || name === "Required") {
            const base = resolveType(typeArguments?.[0]);
            if (name === "Partial") return base.map((record) => ({ ...record, required: false }));
            if (name === "Required") return base.map((record) => ({ ...record, required: true }));
            const selected = new Set(literalPropertyNames(typeArguments?.[1]));
            return base.filter((record) => name === "Pick"
                ? selected.has(record.name)
                : !selected.has(record.name));
        }
        return resolveDeclaration(name);
    }

    function resolveType(typeNode) {
        if (!typeNode) return [];
        if (typeNode.type === "TSParenthesizedType") return resolveType(typeNode.typeAnnotation);
        if (typeNode.type === "TSTypeLiteral") {
            return typeNode.members.map((member) => sourceMemberRecord(member, sourceCode)).filter(Boolean);
        }
        if (typeNode.type === "TSIntersectionType") {
            return mergeIntersectionRecords(typeNode.types.map(resolveType));
        }
        if (typeNode.type === "TSUnionType") {
            return mergeUnionRecords(typeNode.types.map(resolveType));
        }
        if (typeNode.type !== "TSTypeReference") return [];

        return resolveNamedType(printType(typeNode.typeName), typeNode.typeParameters?.params);
    }

    function resolveDeclaration(name) {
        if (resolving.has(name)) return [];
        const declaration = declarations.get(name);
        if (!declaration) return [];
        resolving.add(name);
        let records;
        if (declaration.type === "TSTypeAliasDeclaration") {
            records = resolveType(declaration.typeAnnotation);
        } else {
            const inherited = declaration.extends?.flatMap((heritage) => (
                resolveNamedType(printType(heritage.expression), heritage.typeParameters?.params)
            )) ?? [];
            const own = declaration.body.body
                .map((member) => sourceMemberRecord(member, sourceCode))
                .filter(Boolean);
            records = mergeIntersectionRecords([inherited, own]);
        }
        resolving.delete(name);
        return records;
    }

    const descriptionsByName = new Map();
    for (const declaration of declarations.values()) {
        if (declaration.type !== "TSInterfaceDeclaration") continue;
        for (const member of declaration.body.body) {
            const record = sourceMemberRecord(member, sourceCode);
            if (record?.description && !descriptionsByName.has(record.name)) {
                descriptionsByName.set(record.name, record.description);
            }
        }
    }
    return resolveDeclaration(symbol).map((record) => ({
        ...record,
        description: record.description || descriptionsByName.get(record.name) || "",
    }));
}

function isValidTypeText(typeText) {
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

function normalizeApiProps(docgenProps, sourceProps, context) {
    const sourceByName = new Map(sourceProps.map((prop) => [prop.name, prop]));
    const docgenByName = new Map(docgenProps.map((prop) => [prop.name, prop]));
    if (sourceByName.size !== sourceProps.length) {
        throw new Error(`${context}: API source 存在重复属性`);
    }
    if (docgenByName.size !== docgenProps.length) {
        throw new Error(`${context}: docgen 存在重复属性`);
    }
    const preserveSourceOrder = docgenProps.length === 0
        || sourceProps.length > docgenProps.length
        || docgenProps.some((prop) => !isValidTypeText(prop.typeText));
    const primaryProps = preserveSourceOrder ? sourceProps : docgenProps;
    const secondaryProps = preserveSourceOrder ? docgenProps : sourceProps;
    const primaryNames = new Set(primaryProps.map((prop) => prop.name));
    const names = [
        ...primaryProps.map((prop) => prop.name),
        ...secondaryProps
            .map((prop) => prop.name)
            .filter((name) => !primaryNames.has(name)),
    ];
    if (names.length === 0) {
        throw new Error(`${context}: Props 为空，且无法从 API source 提取兜底定义`);
    }

    return names.map((name) => {
        const sourceProp = sourceByName.get(name);
        const docgenProp = docgenByName.get(name);
        const sourceType = sourceProp?.typeText;
        const docgenType = docgenProp?.typeText;
        const typeText = docgenType && isValidTypeText(docgenType)
            ? docgenType
            : sourceType;
        if (!isValidTypeText(typeText)) {
            const candidate = docgenType ?? sourceType ?? "unknown";
            throw new Error(`${context}: ${name} 的类型无法可靠解析：${String(candidate).slice(0, 120)}`);
        }
        return {
            name,
            required: sourceProp?.required ?? (docgenProp?.required === true),
            description: normalizeCommentText(
                sourceProp?.description
                || docgenProp?.description
                || "暂无说明。",
            ),
            typeText,
            defaultValue: docgenProp?.defaultValue ?? sourceProp?.defaultValue ?? null,
            deprecated: docgenProp?.deprecated === true || sourceProp?.deprecated === true,
        };
    });
}

async function extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath) {
    const apiTag = canonicalMdx.match(/<API\b[^>]*\/>/)?.[0];
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
    if (!definition) {
        throw new Error(`${docgenPath}: 未找到 ${componentName} 的 docgen 定义`);
    }

    const docgenProps = Object.entries(definition.props ?? {}).map(([name, prop]) => ({
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
    const sourceProps = parseSourceApiProps(sourcePath, symbol);
    const props = normalizeApiProps(docgenProps, sourceProps, docgenPath);

    return {
        component: componentName,
        symbol,
        props,
    };
}

async function resolveApiSourcePath(componentDirectory, canonicalMdxPath, source) {
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

function densityFor(componentSlug) {
    if (compactComponents.has(componentSlug)) return "compact";
    if (spaciousComponents.has(componentSlug)) return "spacious";
    return "regular";
}

function layoutFor(componentSlug) {
    return gridLayoutComponents.has(componentSlug) ? "grid" : "wide";
}

function organizeDemos(componentSlug, demos) {
    const definitions = demoGroupDefinitions.get(componentSlug);
    if (!definitions) {
        return demos.map((demo) => ({ ...demo, group: null }));
    }

    const demosByFileName = new Map(
        demos.map((demo) => [path.posix.basename(demo.id), demo]),
    );
    const organized = [];
    const assigned = new Set();

    for (const [group, demoFiles] of definitions) {
        for (const demoFile of demoFiles) {
            if (assigned.has(demoFile)) {
                throw new Error(`${componentSlug}: Demo 分组重复：${demoFile}`);
            }
            const demo = demosByFileName.get(demoFile);
            if (!demo) {
                throw new Error(`${componentSlug}: Demo 分组引用不存在的文件：${demoFile}`);
            }
            assigned.add(demoFile);
            organized.push({ ...demo, group });
        }
    }

    const unassigned = [...demosByFileName.keys()].filter((demoFile) => !assigned.has(demoFile));
    if (unassigned.length > 0) {
        throw new Error(`${componentSlug}: Demo 未分组：${unassigned.join(", ")}`);
    }

    return organized;
}

function serialize(value) {
    return JSON.stringify(value, null, 4).replace(/</g, "\\u003c");
}

function createDataModule(demos) {
    return `/**\n * ${GENERATED_MARKER}\n */\n\nimport type { ComponentDemoRecord } from "../site/componentDemos.js";\n\nexport const demos = ${serialize(demos)} as const satisfies readonly ComponentDemoRecord[];\n`;
}

function escapeJsDoc(value) {
    return value.replace(/\*\//g, "*\\/");
}

function placeholderType(typeArguments) {
    if (typeArguments === 0) return " = DocsTypePlaceholder";
    const parameters = Array.from(
        { length: typeArguments },
        (_, index) => `T${index} = unknown`,
    ).join(", ");
    const tuple = Array.from({ length: typeArguments }, (_, index) => `T${index}`).join(", ");
    return `<${parameters}> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [${tuple}] }`;
}

function qualifiedNameParts(name) {
    if (name.type === "Identifier") return [name.name];
    return [...qualifiedNameParts(name.left), name.right.name];
}

function createApiTypePlaceholders(props, rootSymbol) {
    const aliases = new Map();
    const namespaces = new Map();
    for (const prop of props) {
        const sourceFile = parseTypeScript(`type ApiProperty = ${prop.typeText};`, "api-property.ts");
        const boundNames = new Set();
        visitSyntax(sourceFile, (node) => {
            if (node.type === "TSTypeParameter") boundNames.add(node.name);
        });
        visitSyntax(sourceFile, (node) => {
            if (node.type === "TSTypeReference") {
                const parts = qualifiedNameParts(node.typeName);
                const arity = node.typeParameters?.params.length ?? 0;
                if (parts.length === 1 && !boundNames.has(parts[0])) {
                    aliases.set(parts[0], Math.max(aliases.get(parts[0]) ?? 0, arity));
                } else if (parts.length > 1 && parts[0] !== "globalThis") {
                    const namespace = parts.slice(0, -1).join(".");
                    const members = namespaces.get(namespace) ?? new Map();
                    const member = parts.at(-1);
                    members.set(member, Math.max(members.get(member) ?? 0, arity));
                    namespaces.set(namespace, members);
                }
            }
        });
    }

    aliases.delete(rootSymbol);
    for (const namespace of namespaces.keys()) aliases.delete(namespace.split(".")[0]);
    const aliasDeclarations = [...aliases]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([name, arity]) => `type ${name}${placeholderType(arity)};`);
    const namespaceDeclarations = [...namespaces]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([namespace, members]) => {
            const memberDeclarations = [...members]
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([name, arity]) => `    type ${name}${placeholderType(arity)};`)
                .join("\n");
            return "// eslint-disable-next-line @typescript-eslint/no-namespace -- "
                + "Generated type-only namespace preserves the public qualified API name.\n"
                + `declare namespace ${namespace} {\n${memberDeclarations}\n}`;
        });
    if (aliasDeclarations.length === 0 && namespaceDeclarations.length === 0) return "";
    const placeholder = "type DocsTypePlaceholder = ((...args: never[]) => unknown) & {\n"
        + "    readonly [key: string]: DocsTypePlaceholder;\n"
        + "    readonly [key: number]: DocsTypePlaceholder;\n"
        + "};";
    return [placeholder, ...aliasDeclarations, ...namespaceDeclarations].join("\n");
}

function createSearchableApiSource(api) {
    const searchableProps = api.props;
    const properties = searchableProps.map((prop) => {
        const comments = [
            "/**",
            ` * ${escapeJsDoc(prop.description)}`,
            prop.defaultValue === null ? null : ` * @default ${escapeJsDoc(prop.defaultValue)}`,
            prop.deprecated ? " * @deprecated" : null,
            " */",
        ].filter(Boolean).join("\n");
        const optional = prop.required ? "" : "?";
        return `    ${comments.replace(/\n/g, "\n    ")}\n    ${JSON.stringify(prop.name)}${optional}: ${prop.typeText};`;
    }).join("\n\n");
    const placeholders = createApiTypePlaceholders(searchableProps, api.symbol);
    const content = `/**\n * ${GENERATED_MARKER}\n * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。\n */\n\n${placeholders}\n\nexport interface ${api.symbol} {\n${properties}\n}\n`;
    try {
        parseTypeScript(content, `${api.symbol}.ts`);
    } catch (error) {
        throw new Error(`${api.component}: 生成的搜索 API 源码无法解析：${error.message}`, { cause: error });
    }
    return content;
}

function searchHeadingText(value) {
    return value
        .replace(/[\r\n<>]+/g, " ")
        .replaceAll("{", "（")
        .replaceAll("}", "）")
        .replace(/\s+/g, " ")
        .trim();
}

function createDemoSearchMetadata(demos) {
    if (demos.length === 0) return "";
    const lines = [
        '<div hidden aria-hidden="true" data-docs-search-index="demos">',
        "",
    ];
    let currentGroup;
    for (const demo of demos) {
        if (demo.group !== null && demo.group !== currentGroup) {
            lines.push(`#### ${searchHeadingText(demo.group)}`, "");
            currentGroup = demo.group;
        }
        lines.push(`##### ${searchHeadingText(`${demo.title} — ${demo.description}`)}`, "");
    }
    lines.push("</div>", "");
    return lines.join("\n");
}

function createPage(canonicalSource, slug, demos, api, lesson, referenceTokens = []) {
    const normalized = normalizeNewlines(canonicalSource);
    const frontmatterMatch = normalized.match(/^(\+\+\+\n[\s\S]*?\n\+\+\+)\n+/);
    if (!frontmatterMatch) {
        throw new Error(`${slug}: index.mdx 缺少 TOML frontmatter`);
    }

    let body = normalized.slice(frontmatterMatch[0].length);
    if (slug === "rc-token-global") {
        const content = body
            .replace(/^\[打开[^\]]*工作台\]\([^\n)]*\/workbench\/\)\s*$/m, "")
            .replace(/<Demos\b[^>]*\/>/g, '<ComponentDemos demos={demos} />')
            .replace(/\{\/\* token-reference:([\w-]+) \*\/\}/g, '<TokenReference group="$1" />')
            .replace("{/* token-tutorial */}", "<Tutorial tutorial={tutorial} />");
        const tokenIndex = referenceTokens.map(entry => `${entry.key} · ${entry.value} · ${entry.expression} · ${entry.variable}`).join("\n\n");
        return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\nimport TokenReference from "../site/tokenReference.js";\nimport Tutorial from "../site/tutorial.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";\nimport ComponentDemos from "../site/componentDemos.js";\nimport { demos } from "../_generated/${slug}.js";\n\n${content.trim()}\n\n<div hidden aria-hidden="true" data-docs-search-index="tokens">\n\n@crab-dev/rc-token-global\n\n${tokenIndex}\n\n</div>\n\n${createDemoSearchMetadata(demos).trimEnd()}\n`;
    }
    const previewSection = `## 组件预览\n\n${createDemoSearchMetadata(demos)}<ComponentDemos demos={demos} />\n`;
    const workbenchLink = /^\[打开[^\]]*工作台\]\([^\n)]*\/workbench\/\)\s*$/m;
    if (!workbenchLink.test(body)) {
        throw new Error(`${slug}: index.mdx 缺少工作台入口，无法确定预览插入位置`);
    }
    body = body.replace(workbenchLink, previewSection);

    const demosTag = body.match(/<Demos\b[^>]*\/>/)?.[0];
    if (!demosTag) {
        throw new Error(`${slug}: index.mdx 缺少 Demos 标签`);
    }
    const demoIndex = body.indexOf(demosTag);
    const beforeDemos = body.slice(0, demoIndex).replace(/\n##[^\n]+\n+$/, "\n");
    body = `${beforeDemos}${body.slice(demoIndex + demosTag.length)}`;

    if (api !== null) {
        let renderedApi = false;
        body = body.replace(/<API\b[^>]*\/>/g, () => {
            if (renderedApi) return "";
            renderedApi = true;
            return `<API source="../_generated_api/${slug}.ts" symbol="${api.symbol}" component="${api.component}" />`;
        });
    }

    const imports = [
        'import ComponentDemos from "../site/componentDemos.js";',
        `import { demos } from "../_generated/${slug}.js";`,
    ].filter(Boolean).join("\n");

    if (lesson) {
        const heading = body.match(/^# [^\n]+/m)?.[0] ?? `# ${lesson.title}`;
        const apiMarkup = api === null ? "" : `## API\n\n<API source="../_generated_api/${slug}.ts" symbol="${api.symbol}" component="${api.component}" />\n\n`;
        const notes = normalized.slice(frontmatterMatch[0].length)
            .replace(/^# [^\n]+\n+/m, "")
            .replace(workbenchLink, "")
            .replace(/<Demos\b[^>]*\/>/g, "")
            .replace(/<API\b[^>]*\/>/g, "")
            .replace(/^## (?:API|代码演示|Light \/ Dark 并排示例)\s*$/gm, "")
            .replace(/^## /gm, "### ");
        if (slug === "rc-line-edit") {
            const searchIndex = tutorialMarkup(lesson).match(/<div hidden aria-hidden="true" data-docs-search-index="tutorial">[\s\S]*?<\/div>/)?.[0] ?? "";
            return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\n${imports}\nimport { LineEditExample } from "../site/lineEditPage.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";\n\n${heading}\n\n<div hidden aria-hidden="true" data-docs-search-index="package">@crab-dev/${slug}</div>\n\n<div className="crab-line-edit-page">\n\n## 基础示例\n\n<LineEditExample tutorial={tutorial} index={0} />\n\n## 两种外观\n\n用填充或描边建立清晰的输入边界。两种外观共享标签、辅助文字与交互行为。\n\n<LineEditExample tutorial={tutorial} index={1} />\n\n## 状态与反馈\n\n错误就近说明原因；只读仍可复制，禁用提供原因。试着补全邮箱、切换密码可见性。\n\n<LineEditExample tutorial={tutorial} index={2} />\n\n${apiMarkup}\n## 更多示例\n\n<details>\n<summary>展开进阶示例（${demos.length} 个）</summary>\n\n${createDemoSearchMetadata(demos)}\n<ComponentDemos demos={demos} />\n</details>\n\n[打开完整组件工作台](/components/${slug}/workbench/)\n\n<details>\n<summary>使用指南、设计依据与兼容说明</summary>\n\n${notes.trim()}\n\n</details>\n\n${searchIndex}\n\n</div>\n`;
        }
        if (slug === "rc-radio") {
            const searchIndex = tutorialMarkup(lesson).match(/<div hidden aria-hidden="true" data-docs-search-index="tutorial">[\s\S]*?<\/div>/)?.[0] ?? "";
            return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\n${imports}\nimport { RadioExample, RadioGuidance } from "../site/radioPage.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";\n\n${heading}\n\n<div hidden aria-hidden="true" data-docs-search-index="package">@crab-dev/${slug}</div>\n\n<div className="crab-radio-page">\n\n## 基础示例\n\n<RadioExample tutorial={tutorial} index={0} />\n\n<RadioGuidance />\n\n## 用法示例\n\n用 RadioGroup 管理组值，为组提供清晰的名称。每个 Radio 的 value 必须不同。\n\n<RadioExample tutorial={tutorial} index={1} />\n\n## 状态与主题\n\n切换主题、品牌色和可用状态，直接体验焦点、禁用与错误恢复。\n\n<RadioExample tutorial={tutorial} index={2} />\n\n${apiMarkup}\n<API source="../../../components/rc-radio/src/types.ts" symbol="RadioGroupProps" component="RadioGroup" />\n\n## 更多示例\n\n<details>\n<summary>展开进阶示例（${demos.length} 个）</summary>\n\n${createDemoSearchMetadata(demos)}\n<ComponentDemos demos={demos} />\n</details>\n\n[打开完整组件工作台](/components/${slug}/workbench/)\n\n<details>\n<summary>设计依据、键盘与兼容说明</summary>\n\n${notes.trim()}\n\n</details>\n\n${searchIndex}\n\n</div>\n`;
        }
        return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\n${imports}\nimport Tutorial from "../site/tutorial.js";\nimport FirstExample from "../site/firstExample.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";\n\n${heading}\n\n<div hidden aria-hidden="true" data-docs-search-index="package">@crab-dev/${slug}</div>\n\n## 基础示例\n\n<FirstExample tutorial={tutorial} />\n\n${tutorialMarkup(lesson)}\n\n${apiMarkup}## 更多示例\n\n<details>\n<summary>展开进阶示例（${demos.length} 个）</summary>\n\n${createDemoSearchMetadata(demos)}\n<ComponentDemos demos={demos} />\n</details>\n\n[打开完整组件工作台](/components/${slug}/workbench/)\n\n## 使用说明\n\n${notes.trim()}\n`;
    }
    return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\n${imports}\n\n${body.trim()}\n`;
}

async function readIfPresent(filePath) {
    try {
        return await readFile(filePath, "utf8");
    } catch (error) {
        if (error?.code === "ENOENT") return undefined;
        throw error;
    }
}

async function emitFile(filePath, content, drift) {
    const current = await readIfPresent(filePath);
    if (current === content) return false;
    drift.push(path.relative(repositoryRoot, filePath));
    if (!checkOnly) {
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, content, "utf8");
    }
    return true;
}

async function removeOrphanGeneratedFiles(directory, expectedFiles, drift, shouldCheck = checkOnly) {
    let entries;
    try {
        entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error?.code === "ENOENT") return;
        throw error;
    }
    for (const entry of entries) {
        if (!entry.isFile() || !/\.(ts|mdx)$/.test(entry.name)) continue;
        const filePath = path.join(directory, entry.name);
        if (expectedFiles.has(filePath)) continue;
        if (entry.name.endsWith(".mdx") && !(await readFile(filePath, "utf8")).includes(GENERATED_MARKER)) continue;
        drift.push(path.relative(repositoryRoot, filePath));
        if (!shouldCheck) await unlink(filePath);
    }
}

async function generateDocs() {
    const directoryEntries = await readdir(componentsDirectory, { withFileTypes: true });
    const componentSlugs = directoryEntries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("rc-"))
        .map((entry) => entry.name)
        .sort();

    if (componentSlugs.length !== EXPECTED_COMPONENT_COUNT) {
        throw new Error(`组件数量应为 ${EXPECTED_COMPONENT_COUNT}，实际为 ${componentSlugs.length}`);
    }

    const navigation = await readFile(path.join(websiteDocsDirectory, "navigation.toml"), "utf8");
    const navigationSlugs = new Set(
        [...navigation.matchAll(/"components\/(rc-[^"]+)"/g)].map((match) => match[1]),
    );
    const missingNavigation = componentSlugs.filter((slug) => !navigationSlugs.has(slug));
    const orphanNavigation = [...navigationSlugs].filter((slug) => !componentSlugs.includes(slug));
    if (missingNavigation.length > 0 || orphanNavigation.length > 0) {
        throw new Error(
            `导航与组件不一致；缺少：${missingNavigation.join(", ") || "无"}；多余：${orphanNavigation.join(", ") || "无"}`,
        );
    }

    const outputs = [];
    const referenceSource = await readFile(path.join(componentsDirectory, "rc-token-global/token.toml"), "utf8");
    const referenceTokens = readGlobalTokens(referenceSource);
    outputs.push({
        filePath: path.join(generatedDataDirectory, "globalTokenReference.ts"),
        content: createTokenReferenceData(referenceSource),
    });
    outputs.push(await createHomeExample(repositoryRoot));
    const lessons = [];
    const globalDemoKeys = new Set();
    let demoCount = 0;

    for (const slug of componentSlugs) {
        const componentDirectory = path.join(componentsDirectory, slug);
        const canonicalMdxPath = path.join(componentDirectory, "docs/index.mdx");
        const canonicalMdx = await readFile(canonicalMdxPath, "utf8");
        const demoDirectory = path.join(componentDirectory, "docs/demos");
        const demoFiles = (await readdir(demoDirectory, { withFileTypes: true }))
            .filter((entry) => entry.isFile() && entry.name.endsWith(".demo.tsx"))
            .map((entry) => entry.name)
            .sort();

        const demos = [];
        for (const demoFile of demoFiles) {
            const sourcePath = path.join(demoDirectory, demoFile);
            const sourceCode = normalizeNewlines(await readFile(sourcePath, "utf8"));
            const meta = extractDemoMeta(sourceCode, sourcePath);
            const id = `docs/demos/${demoFile}`;
            const uniqueKey = `${slug}:${id}`;
            if (globalDemoKeys.has(uniqueKey)) {
                throw new Error(`${sourcePath}: Demo ID 重复：${id}`);
            }
            globalDemoKeys.add(uniqueKey);
            demos.push({
                id,
                title: meta.title,
                description: meta.description,
                sourceCode,
                previewPath: `/components/${slug}/workbench/?__wake_demo=${encodeURIComponent(id)}`,
                workbenchPath: `/components/${slug}/workbench/#/components/${encodeURIComponent(id)}`,
                density: densityFor(slug),
                layout: layoutFor(slug),
            });
        }
        const organizedDemos = organizeDemos(slug, demos);
        demoCount += organizedDemos.length;

        const api = await extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath);
        const lesson = await loadTutorial(repositoryRoot, slug, organizedDemos);
        lessons.push(lesson.record);
        outputs.push(lesson.output);
        outputs.push({
            filePath: path.join(generatedDataDirectory, `${slug}.ts`),
            content: createDataModule(organizedDemos),
        });
        if (api !== null) {
            outputs.push({
                filePath: path.join(generatedApiDirectory, `${slug}.ts`),
                content: createSearchableApiSource(api),
            });
        }
        outputs.push({
            filePath: path.join(generatedPagesDirectory, `${slug}.mdx`),
            content: createPage(canonicalMdx, slug, organizedDemos, api, lesson.record, slug === "rc-token-global" ? referenceTokens : []),
        });
    }

    if (demoCount !== EXPECTED_DEMO_COUNT || globalDemoKeys.size !== EXPECTED_DEMO_COUNT) {
        throw new Error(
            `Demo 数量应为 ${EXPECTED_DEMO_COUNT}，实际为 ${demoCount}（唯一 ${globalDemoKeys.size}）`,
        );
    }

    const practices = await loadPracticeTutorials(repositoryRoot);
    const teaching = await validateTeachingInventory(repositoryRoot, [...lessons, ...practices.map(item => item.record)], ["home/profile.tsx"]);
    outputs.push({ filePath: path.join(websiteDocsDirectory, "learn/components.mdx"), content: createLearningMap(navigation, lessons) });
    for (const { record, output } of practices) {
        outputs.push(output);
        outputs.push({
            filePath: path.join(websiteDocsDirectory, "learn", `${record.id}.mdx`),
            content: `+++\ntitle = ${JSON.stringify(record.title)}\ndescription = ${JSON.stringify(record.summary)}\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\nimport Tutorial from "../site/tutorial.js";\nimport { tutorial } from "../_generated_tutorials/${record.id}.js";\n\n# ${record.title}\n\n${tutorialMarkup(record)}\n\n[返回实战教程](/learn)\n`,
        });
    }
    const drift = [];
    for (const output of outputs) {
        await emitFile(output.filePath, output.content, drift);
    }
    const expectedApiFiles = new Set(
        outputs
            .map((output) => output.filePath)
            .filter((filePath) => path.dirname(filePath) === generatedApiDirectory),
    );
    await removeOrphanGeneratedFiles(generatedApiDirectory, expectedApiFiles, drift);
    for (const directory of [path.join(websiteDocsDirectory, "_generated_tutorials"), path.join(websiteDocsDirectory, "learn")]) {
        const expectedFiles = new Set(outputs.map(output => output.filePath).filter(file => path.dirname(file) === directory));
        await removeOrphanGeneratedFiles(directory, expectedFiles, drift);
    }

    if (checkOnly && drift.length > 0) {
        throw new Error(`组件文档生成产物存在漂移：\n${drift.map((file) => `- ${file}`).join("\n")}`);
    }

    const action = checkOnly ? "检查" : "生成";
    console.log(`${action}完成：${componentSlugs.length} 个组件页，${teaching.tutorials} 份教程，${teaching.examples} 个教学示例，${demoCount} 个唯一 Demo，${drift.length} 个文件变化。`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await generateDocs();

export {
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    densityFor,
    extractApiRecord,
    generateDocs,
    isValidTypeText,
    layoutFor,
    normalizeApiProps,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
};
