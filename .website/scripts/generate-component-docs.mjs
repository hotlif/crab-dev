import { readFile, readdir, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const EXPECTED_COMPONENT_COUNT = 51;
const EXPECTED_DEMO_COUNT = 245;
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
const apiTypePrinter = ts.createPrinter({ removeComments: true });

const compactComponents = new Set([
    "rc-avatar",
    "rc-badge",
    "rc-button",
    "rc-checkbox",
    "rc-radio",
    "rc-slider",
    "rc-switch",
    "rc-tag",
    "rc-tooltip",
]);

const gridLayoutComponents = new Set([
    "rc-alert",
    "rc-avatar",
    "rc-badge",
    "rc-button",
    "rc-card",
    "rc-checkbox",
    "rc-divider",
    "rc-empty",
    "rc-line-edit",
    "rc-number-edit",
    "rc-radio",
    "rc-select",
    "rc-skeleton",
    "rc-slider",
    "rc-spin",
    "rc-switch",
    "rc-tag",
    "rc-text-edit",
    "rc-tooltip",
]);

const spaciousComponents = new Set([
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
        ["组合", ["button-group.demo.tsx"]],
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
    ["rc-protocol-table", [
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

function unwrapExpression(expression) {
    let current = expression;
    while (
        ts.isAsExpression(current)
        || ts.isSatisfiesExpression(current)
        || ts.isParenthesizedExpression(current)
        || ts.isTypeAssertionExpression(current)
    ) {
        current = current.expression;
    }
    return current;
}

function readStaticString(expression, fieldName, filePath) {
    const value = unwrapExpression(expression);
    if (ts.isStringLiteralLike(value)) {
        return value.text;
    }
    throw new Error(`${filePath}: meta.${fieldName} 必须是静态字符串`);
}

function propertyNameText(name) {
    if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) {
        return name.text;
    }
    return undefined;
}

function extractDemoMeta(sourceCode, filePath) {
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
    );

    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        const isExported = statement.modifiers?.some((modifier) => (
            modifier.kind === ts.SyntaxKind.ExportKeyword
        ));
        if (!isExported) continue;

        for (const declaration of statement.declarationList.declarations) {
            if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "meta") continue;
            if (!declaration.initializer) {
                throw new Error(`${filePath}: meta 缺少初始化值`);
            }
            const initializer = unwrapExpression(declaration.initializer);
            if (!ts.isObjectLiteralExpression(initializer)) {
                throw new Error(`${filePath}: meta 必须是静态对象字面量`);
            }

            const values = new Map();
            for (const property of initializer.properties) {
                if (!ts.isPropertyAssignment(property)) continue;
                const name = propertyNameText(property.name);
                if (name === "title" || name === "description") {
                    values.set(name, readStaticString(property.initializer, name, filePath));
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
    const leadingText = sourceFile.text.slice(node.getFullStart(), node.getStart(sourceFile));
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
    const jsDoc = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
    const comment = typeof jsDoc?.comment === "string" ? jsDoc.comment : "";
    return normalizeCommentText(comment) || leadingLineComment(node, sourceFile);
}

function propertyDeprecated(node) {
    return ts.getJSDocTags(node).some((tag) => tag.tagName.text === "deprecated");
}

function memberName(member) {
    if (!member.name) return undefined;
    return propertyNameText(member.name);
}

function memberTypeText(member, sourceFile) {
    if (ts.isPropertySignature(member)) {
        return member.type
            ? apiTypePrinter.printNode(ts.EmitHint.Unspecified, member.type, sourceFile)
            : "unknown";
    }
    if (ts.isMethodSignature(member)) {
        const typeParameters = member.typeParameters?.length
            ? `<${member.typeParameters.map((parameter) => parameter.getText(sourceFile)).join(", ")}>`
            : "";
        const parameters = member.parameters.map((parameter) => parameter.getText(sourceFile)).join(", ");
        const returnType = member.type?.getText(sourceFile) ?? "void";
        return `${typeParameters}(${parameters}) => ${returnType}`;
    }
    return "unknown";
}

function sourceMemberRecord(member, sourceFile) {
    const name = memberName(member);
    if (!name || (!ts.isPropertySignature(member) && !ts.isMethodSignature(member))) {
        return undefined;
    }
    return {
        name,
        required: member.questionToken === undefined,
        description: propertyDescription(member, sourceFile),
        typeText: memberTypeText(member, sourceFile).replace(/\s+/g, " ").trim(),
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
    if (ts.isLiteralTypeNode(typeNode) && ts.isStringLiteralLike(typeNode.literal)) {
        return [typeNode.literal.text];
    }
    if (ts.isUnionTypeNode(typeNode)) {
        return typeNode.types.flatMap(literalPropertyNames);
    }
    return [];
}

function parseSourceApiProps(sourcePath, symbol) {
    const sourceCode = ts.sys.readFile(sourcePath);
    if (sourceCode === undefined) return [];
    const sourceFile = ts.createSourceFile(
        sourcePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
        sourcePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const declarations = new Map();
    for (const statement of sourceFile.statements) {
        if (
            (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement))
            && ts.isIdentifier(statement.name)
        ) {
            declarations.set(statement.name.text, statement);
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
        if (ts.isParenthesizedTypeNode(typeNode)) return resolveType(typeNode.type);
        if (ts.isTypeLiteralNode(typeNode)) {
            return typeNode.members.map((member) => sourceMemberRecord(member, sourceFile)).filter(Boolean);
        }
        if (ts.isIntersectionTypeNode(typeNode)) {
            return mergeIntersectionRecords(typeNode.types.map(resolveType));
        }
        if (ts.isUnionTypeNode(typeNode)) {
            return mergeUnionRecords(typeNode.types.map(resolveType));
        }
        if (!ts.isTypeReferenceNode(typeNode)) return [];

        return resolveNamedType(typeNode.typeName.getText(sourceFile), typeNode.typeArguments);
    }

    function resolveDeclaration(name) {
        if (resolving.has(name)) return [];
        const declaration = declarations.get(name);
        if (!declaration) return [];
        resolving.add(name);
        let records;
        if (ts.isTypeAliasDeclaration(declaration)) {
            records = resolveType(declaration.type);
        } else {
            const inherited = declaration.heritageClauses?.flatMap((clause) => (
                clause.types.flatMap((heritage) => (
                    resolveNamedType(heritage.expression.getText(sourceFile), heritage.typeArguments)
                ))
            )) ?? [];
            const own = declaration.members
                .map((member) => sourceMemberRecord(member, sourceFile))
                .filter(Boolean);
            records = mergeIntersectionRecords([inherited, own]);
        }
        resolving.delete(name);
        return records;
    }

    const descriptionsByName = new Map();
    for (const declaration of declarations.values()) {
        if (!ts.isInterfaceDeclaration(declaration)) continue;
        for (const member of declaration.members) {
            const record = sourceMemberRecord(member, sourceFile);
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
    const sourceFile = ts.createSourceFile(
        "api-type.ts",
        `type ApiType = ${typeText};`,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    return sourceFile.parseDiagnostics.length === 0;
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
        searchSymbol: `${symbol}SearchIndex`,
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
    if (ts.isIdentifier(name)) return [name.text];
    return [...qualifiedNameParts(name.left), name.right.text];
}

function createApiTypePlaceholders(props) {
    const aliases = new Map();
    const namespaces = new Map();
    for (const prop of props) {
        const sourceFile = ts.createSourceFile(
            "api-property.ts",
            `type ApiProperty = ${prop.typeText};`,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TS,
        );
        const boundNames = new Set();
        function collectBoundNames(node) {
            if (ts.isTypeParameterDeclaration(node)) boundNames.add(node.name.text);
            ts.forEachChild(node, collectBoundNames);
        }
        collectBoundNames(sourceFile);
        function visit(node) {
            if (ts.isTypeReferenceNode(node)) {
                const parts = qualifiedNameParts(node.typeName);
                const arity = node.typeArguments?.length ?? 0;
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
            ts.forEachChild(node, visit);
        }
        visit(sourceFile);
    }

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
    const placeholders = createApiTypePlaceholders(searchableProps);
    const content = `/**\n * ${GENERATED_MARKER}\n * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。\n */\n\n${placeholders}\n\nexport interface ${api.searchSymbol} {\n${properties}\n}\n`;
    const sourceFile = ts.createSourceFile(
        `${api.searchSymbol}.ts`,
        content,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    if (sourceFile.parseDiagnostics.length > 0) {
        const message = sourceFile.parseDiagnostics
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, " "))
            .join("; ");
        throw new Error(`${api.component}: 生成的搜索 API 源码无法解析：${message}`);
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

function createPage(canonicalSource, slug, demos, api) {
    const normalized = normalizeNewlines(canonicalSource);
    const frontmatterMatch = normalized.match(/^(\+\+\+\n[\s\S]*?\n\+\+\+)\n+/);
    if (!frontmatterMatch) {
        throw new Error(`${slug}: index.mdx 缺少 TOML frontmatter`);
    }

    let body = normalized.slice(frontmatterMatch[0].length);
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
            return `<API source="../_generated_api/${slug}.ts" symbol="${api.searchSymbol}" component="${api.component}" />`;
        });
    }

    const imports = [
        'import ComponentDemos from "../site/componentDemos.js";',
        `import { demos } from "../_generated/${slug}.js";`,
    ].filter(Boolean).join("\n");

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
        if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
        const filePath = path.join(directory, entry.name);
        if (expectedFiles.has(filePath)) continue;
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
            content: createPage(canonicalMdx, slug, organizedDemos, api),
        });
    }

    if (demoCount !== EXPECTED_DEMO_COUNT || globalDemoKeys.size !== EXPECTED_DEMO_COUNT) {
        throw new Error(
            `Demo 数量应为 ${EXPECTED_DEMO_COUNT}，实际为 ${demoCount}（唯一 ${globalDemoKeys.size}）`,
        );
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

    if (checkOnly && drift.length > 0) {
        throw new Error(`组件文档生成产物存在漂移：\n${drift.map((file) => `- ${file}`).join("\n")}`);
    }

    const action = checkOnly ? "检查" : "生成";
    console.log(`${action}完成：${componentSlugs.length} 个组件页，${demoCount} 个唯一 Demo，${drift.length} 个文件变化。`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await generateDocs();

export {
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    extractApiRecord,
    generateDocs,
    isValidTypeText,
    normalizeApiProps,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
};
