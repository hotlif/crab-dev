import { readFile, readdir, mkdir, unlink, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import { generate } from "@babel/generator";
import { loadTutorial, loadPracticeTutorials, tutorialMarkup, validateTeachingInventory, createLearningMap, createHomeExample } from "./generate-tutorials.mjs";
import { createTokenReferenceData, readGlobalTokens } from "./generate-token-reference.mjs";
import { loadLibraryManifest } from "../../scripts/library-manifest.mjs";
import { inspectLibrary } from "../../scripts/library-graph.mjs";

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
const require = createRequire(import.meta.url);
const sourceApiContextCache = new Map();
const sourceApiMemberCache = new WeakMap();

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
        ["三套风格对照", ["designs.demo.tsx"]],
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
            "visual-states.demo.tsx",
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
            "timePickerDial.demo.tsx",
            "timePickerPanel.demo.tsx",
        ]],
        ["标签与状态", ["visual-states.demo.tsx"]],
    ]],
    ["rc-line-edit", [
        ["标签与状态", ["field-states.demo.tsx", "visual-states.demo.tsx"]],
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
        ["业务实战", [
            "order-operations.demo.tsx",
            "inventory-planning.demo.tsx",
            "receivables-review.demo.tsx",
        ]],
        ["基础与数据", [
            "basic.demo.tsx",
            "visual-states.demo.tsx",
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
        ["标签与状态", ["field-states.demo.tsx"]],
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
        ["三套风格对照", ["theme-states.demo.tsx"]],
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
            "default-editor.demo.tsx",
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

function jsxRootName(name) {
    if (name.type === "JSXIdentifier") return name.name;
    if (name.type === "JSXMemberExpression") return jsxRootName(name.object);
    return undefined;
}

export function extractDemoLearning(sourceCode, filePath) {
    const sourceFile = parseTypeScript(sourceCode, filePath);
    const importedComponents = new Set();
    for (const statement of sourceFile.program.body) {
        if (statement.type !== "ImportDeclaration") continue;
        const source = statement.source.value;
        const isComponentSource = source.startsWith("@crab-dev/rc-")
            || /(?:^|\/)src(?:\/|$)/.test(source);
        if (!isComponentSource) continue;
        for (const specifier of statement.specifiers) {
            if (/^[A-Z]/.test(specifier.local.name)) importedComponents.add(specifier.local.name);
        }
    }

    const renderedComponents = new Set();
    const fallbackComponents = new Set();
    const props = new Set();
    const events = new Set();
    let hasState = false;

    visitSyntax(sourceFile, (node) => {
        if (
            node.type === "CallExpression"
            && node.callee.type === "Identifier"
            && ["useState", "useReducer", "useActionState", "useTransition"].includes(node.callee.name)
        ) {
            hasState = true;
        }
        if (node.type !== "JSXOpeningElement") return;
        const rootName = jsxRootName(node.name);
        if (!rootName || !/^[A-Z]/.test(rootName)) return;
        fallbackComponents.add(rootName);
        if (!importedComponents.has(rootName)) return;
        renderedComponents.add(rootName);
        for (const attribute of node.attributes) {
            if (attribute.type !== "JSXAttribute" || attribute.name.type !== "JSXIdentifier") continue;
            const name = attribute.name.name;
            if (["className", "style", "key", "id"].includes(name)) continue;
            props.add(name);
            if (/^on[A-Z]/.test(name)) events.add(name);
        }
    });

    const components = renderedComponents.size > 0 ? renderedComponents : fallbackComponents;
    return {
        components: [...components].slice(0, 6),
        props: [...props].slice(0, 12),
        events: [...events].slice(0, 6),
        hasState,
    };
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
    if (sourceApiMemberCache.has(member)) return sourceApiMemberCache.get(member);
    const name = memberName(member);
    if (!name || (member.type !== "TSPropertySignature" && member.type !== "TSMethodSignature")) {
        return undefined;
    }
    const record = {
        name,
        required: !member.optional,
        description: propertyDescription(member, sourceFile),
        typeText: memberTypeText(member).replace(/\s+/g, " ").trim(),
        defaultValue: null,
        deprecated: propertyDeprecated(member),
    };
    sourceApiMemberCache.set(member, record);
    return record;
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
                native: current.native === true && record.native === true,
                exclusiveWith: [...new Set([...(current.exclusiveWith ?? []), ...(record.exclusiveWith ?? [])])],
            } : record);
        }
    }
    return [...merged.values()];
}

function mergeUnionRecords(recordGroups) {
    const groups = recordGroups.map(records => new Map(records.map(record => [record.name, record])));
    const names = [...new Set(groups.flatMap(group => [...group.keys()]))];
    const concreteNames = new Set(recordGroups.flatMap(records => records.filter(record => record.typeText !== "never").map(record => record.name)));
    const neverNames = [...new Set(recordGroups.flatMap(records => records.filter(record => record.typeText === "never").map(record => record.name)))];
    return names.map((name) => {
        const variants = groups
            .map(group => group.get(name))
            .filter(Boolean);
        const concreteTypes = [...new Set(
            variants.map((record) => record.typeText).filter((typeText) => typeText !== "never"),
        )];
        const unionTypes = concreteTypes.map((typeText) => (
            typeText.includes("=>") ? `(${typeText})` : typeText
        ));
        return {
            name,
            required: groups.every(group => group.get(name)?.required),
            description: variants.find((record) => record.description)?.description ?? "",
            typeText: unionTypes.length > 0 ? unionTypes.join(" | ") : "never",
            defaultValue: null,
            deprecated: variants.some((record) => record.deprecated),
            native: variants.every((record) => record.native === true),
            exclusiveWith: [...new Set([
                ...variants.flatMap(record => record.exclusiveWith ?? []),
                ...neverNames.filter(other => other !== name && concreteNames.has(other)
                    && groups.filter(group => group.has(name) && group.get(name).typeText !== "never")
                        .every(group => group.get(other)?.typeText === "never")),
            ])],
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
    const contexts = new Map();
    const resolving = new Set();

    function loadContext(filePath) {
        const absolutePath = path.resolve(filePath);
        if (contexts.has(absolutePath)) return contexts.get(absolutePath);
        let sourceCode;
        try { sourceCode = readFileSync(absolutePath, "utf8"); }
        catch (error) {
            if (error.code === "ENOENT" || error.code === "EISDIR") { contexts.set(absolutePath, undefined); return undefined; }
            throw error;
        }
        const cached = sourceApiContextCache.get(absolutePath);
        if (cached?.sourceCode === sourceCode) {
            contexts.set(absolutePath, cached);
            return cached;
        }
        const context = { path: absolutePath, sourceCode, declarations: new Map(), imports: new Map(), reexports: new Map(), stars: [], defaultNamespace: undefined,
            nativeRecordsCache: absolutePath.replaceAll("\\", "/").endsWith("/@types/react/index.d.ts") ? new Map() : undefined };
        contexts.set(absolutePath, context);
        const sourceFile = parseTypeScript(sourceCode, absolutePath);
        function collect(statements, prefix = "") {
            for (const statement of statements) {
                const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
                if (declaration?.type === "TSInterfaceDeclaration" || declaration?.type === "TSTypeAliasDeclaration") context.declarations.set(prefix + declaration.id.name, declaration);
                if (declaration?.type === "TSModuleDeclaration" && declaration.id.type === "Identifier" && declaration.body?.type === "TSModuleBlock") collect(declaration.body.body, `${prefix}${declaration.id.name}.`);
                if (statement.type === "TSExportAssignment" && statement.expression.type === "Identifier") context.defaultNamespace = statement.expression.name;
                if (statement.type === "ImportDeclaration") for (const item of statement.specifiers) {
                    if (item.type === "ImportSpecifier") context.imports.set(item.local.name, { source: statement.source.value, name: item.imported.name ?? item.imported.value });
                    if (item.type === "ImportNamespaceSpecifier") context.imports.set(item.local.name, { source: statement.source.value, name: "*" });
                }
                if (statement.type === "ExportNamedDeclaration") for (const item of statement.specifiers) {
                    if (item.type === "ExportSpecifier") context.reexports.set(item.exported.name ?? item.exported.value, {
                        source: statement.source?.value, name: item.local.name ?? item.local.value,
                    });
                }
                if (statement.type === "ExportAllDeclaration") context.stars.push(statement.source.value);
            }
        }
        collect(sourceFile.program.body);
        sourceApiContextCache.set(absolutePath, context);
        return context;
    }

    function resolveModule(context, specifier) {
        let base;
        if (specifier === "react") return loadContext(path.join(path.dirname(require.resolve("@types/react/package.json")), "index.d.ts"));
        if (specifier.startsWith(".")) base = path.resolve(path.dirname(context.path), specifier).replace(/\.(?:mjs|cjs|js)$/, "");
        else {
            const workspace = specifier.match(/^@crab-dev\/(rc-[^/]+)(?:\/(.+))?$/);
            if (!workspace) return undefined;
            base = path.join(componentsDirectory, workspace[1], "src", workspace[2] ?? "index");
        }
        for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}.mts`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
            const target = loadContext(candidate);
            if (target) return target;
        }
        return undefined;
    }

    function substitute(node, bindings, shadowed = new Set()) {
        if (!node || typeof node !== "object") return node;
        if (Array.isArray(node)) return node.map(child => substitute(child, bindings, shadowed));
        if (node.type === "TSTypeReference" && node.typeName.type === "Identifier"
            && bindings.has(node.typeName.name) && !shadowed.has(node.typeName.name)) {
            return substitute(bindings.get(node.typeName.name), new Map(), shadowed);
        }
        const inner = new Set(shadowed);
        if (["TSFunctionType", "TSMethodSignature", "TSCallSignatureDeclaration"].includes(node.type)) {
            for (const parameter of node.typeParameters?.params ?? []) inner.add(parameter.name);
        }
        return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, substitute(value, bindings, inner)]));
    }

    function recordsForMembers(members, context, bindings) {
        return members.flatMap(member => {
            const original = sourceMemberRecord(member, context.sourceCode);
            if (!original) return [];
            return [{ ...original, native: context.nativeRecordsCache !== undefined, typeText: memberTypeText(substitute(member, bindings)).replace(/\s+/g, " ").trim() }];
        });
    }

    function resolveNamedType(context, name, typeArguments = [], bindings = new Map()) {
        const argumentsResolved = typeArguments.map(argument => substitute(argument, bindings));
        if (name === "Omit" || name === "Pick" || name === "Partial" || name === "Required") {
            const base = resolveType(argumentsResolved[0], context, bindings);
            if (name === "Partial") return base.map((record) => ({ ...record, required: false }));
            if (name === "Required") return base.map((record) => ({ ...record, required: true }));
            const selected = new Set(literalPropertyNames(argumentsResolved[1]));
            return base.filter((record) => name === "Pick"
                ? selected.has(record.name)
                : !selected.has(record.name));
        }
        const key = `${context.path}#${name}<${argumentsResolved.map(printType).join(",")}>`;
        if (context.nativeRecordsCache?.has(key)) return context.nativeRecordsCache.get(key);
        if (resolving.has(key)) return [];
        resolving.add(key);
        let records = [];
        try {
            const declaration = context.declarations.get(name) ?? (context.defaultNamespace && context.declarations.get(`${context.defaultNamespace}.${name}`));
            if (!declaration) {
                const [namespace, ...members] = name.split(".");
                const namespaceImport = context.imports.get(namespace);
                if (members.length && namespaceImport?.name === "*") {
                    const target = resolveModule(context, namespaceImport.source);
                    return target ? resolveNamedType(target, members.join("."), argumentsResolved, bindings) : [];
                }
                const reference = context.imports.get(name) ?? context.reexports.get(name);
                if (reference) {
                    const target = reference.source ? resolveModule(context, reference.source) : context;
                    if (target) records = resolveNamedType(target, reference.name, argumentsResolved, bindings);
                } else for (const source of context.stars) {
                    const target = resolveModule(context, source);
                    if (target) {
                        records = resolveNamedType(target, name, argumentsResolved, bindings);
                        if (records.length > 0) break;
                    }
                }
                return records;
            }
            const instantiated = new Map(bindings);
            for (const [index, parameter] of (declaration.typeParameters?.params ?? []).entries()) {
                const argument = argumentsResolved[index] ?? parameter.default;
                if (argument) instantiated.set(parameter.name, substitute(argument, instantiated));
            }
            if (declaration.type === "TSTypeAliasDeclaration") records = resolveType(declaration.typeAnnotation, context, instantiated);
            else {
                const inherited = declaration.extends?.flatMap(heritage => resolveNamedType(context, printType(heritage.expression), heritage.typeParameters?.params ?? [], instantiated)) ?? [];
                const own = recordsForMembers(declaration.body.body, context, instantiated);
                const ownNames = new Set(own.map(record => record.name));
                records = [...mergeIntersectionRecords([inherited]).filter(record => !ownNames.has(record.name)), ...own];
            }
            return records;
        } finally {
            resolving.delete(key);
            context.nativeRecordsCache?.set(key, records);
        }
    }

    function resolveType(typeNode, context, bindings) {
        if (!typeNode) return [];
        if (typeNode.type === "TSParenthesizedType") return resolveType(typeNode.typeAnnotation, context, bindings);
        if (typeNode.type === "TSTypeLiteral") return recordsForMembers(typeNode.members, context, bindings);
        if (typeNode.type === "TSIntersectionType") return mergeIntersectionRecords(typeNode.types.map(type => resolveType(type, context, bindings)));
        if (typeNode.type === "TSUnionType") return mergeUnionRecords(typeNode.types.map(type => resolveType(type, context, bindings)));
        if (typeNode.type !== "TSTypeReference") return [];
        if (typeNode.typeName.type === "Identifier" && bindings.has(typeNode.typeName.name)) return resolveType(bindings.get(typeNode.typeName.name), context, new Map());
        return resolveNamedType(context, printType(typeNode.typeName), typeNode.typeParameters?.params ?? [], bindings);
    }

    const rootContext = loadContext(sourcePath);
    if (!rootContext) return [];
    const records = resolveNamedType(rootContext, symbol);
    const descriptionsByName = new Map();
    for (const declaration of rootContext.declarations.values()) {
        if (declaration.type !== "TSInterfaceDeclaration") continue;
        for (const member of declaration.body.body) {
            const record = sourceMemberRecord(member, rootContext.sourceCode);
            if (record?.description && !descriptionsByName.has(record.name)) {
                descriptionsByName.set(record.name, record.description);
            }
        }
    }
    return records.map((record) => ({
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

async function extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath, explicitTag) {
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

const componentPreviewDemoOverrides = new Map([
    // The first TextEdit demo tests clearing content and intentionally has no label.
    ["rc-text-edit", "docs/demos/simple.demo.tsx"],
]);

function createComponentPreviews(records) {
    const previews = {};
    for (const { slug, demos } of records) {
        if (Object.hasOwn(previews, slug)) {
            throw new Error(`顶部预览组件重复：${slug}`);
        }
        const override = componentPreviewDemoOverrides.get(slug);
        const demo = override ? demos.find(item => item.id === override) : demos[0];
        if (!demo) {
            throw new Error(`${slug}: 顶部预览缺少${override ? `指定 Demo ${override}` : "可用 Demo"}`);
        }
        const { id, title, previewPath, workbenchPath, density } = demo;
        previews[slug] = { id, title, previewPath, workbenchPath, density };
    }
    return `/**\n * ${GENERATED_MARKER}\n */\n\nimport type { ComponentDemoDescriptor } from "../site/componentDemoFrame.js";\n\nexport const componentPreviews = ${serialize(previews)} as const satisfies Readonly<Record<string, ComponentDemoDescriptor>>;\n`;
}

function escapeJsDoc(value) {
    // Wake 0.1.45 scans interface braces without treating JSDoc apostrophes as
    // comments; typographic apostrophes keep prose intact and the scan balanced.
    return value.replace(/\*\//g, "*\\/").replaceAll("'", "’");
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
    // File maintenance notes must not become the public interface's JSDoc summary.
    const content = `// ${GENERATED_MARKER}\n// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。\n\n${placeholders}\n\nexport interface ${api.symbol} {\n${properties}\n}\n`;
    try {
        parseTypeScript(content, `${api.symbol}.ts`);
    } catch (error) {
        throw new Error(`${api.component}: 生成的搜索 API 源码无法解析：${error.message}`, { cause: error });
    }
    return content;
}

/** Keep component contracts visible while retaining the full inherited DOM API. */
function splitApiRecord(api, slug) {
    const primary = { ...api, generatedFileName: api.generatedFileName ?? `${slug}.ts` };
    if (!api.props) return { primary, native: null };
    const nativeProps = api.props.filter(prop => prop.native === true);
    if (nativeProps.length === 0) return { primary, native: null };
    return {
        primary: { ...primary, props: api.props.filter(prop => prop.native !== true) },
        native: {
            ...api,
            symbol: `${api.symbol}NativeAttributes`,
            component: `${api.component} 继承的原生属性`,
            generatedFileName: primary.generatedFileName.replace(/\.ts$/, "-native.ts"),
            props: nativeProps,
        },
    };
}

function apiRecordMarkup(record, slug) {
    const { primary, native } = splitApiRecord(record, slug);
    const tag = current => `<API source="../_generated_api/${current.generatedFileName}" symbol="${current.symbol}" component="${current.component}" />`;
    return [
        primary.props?.length === 0 ? `### ${record.component}` : tag(primary),
        native && `<details data-docs-native-props>\n<summary>${record.component} 继承的原生属性（${native.props.length} 项）</summary>\n\n${tag(native)}\n\n</details>`,
    ].filter(Boolean).join("\n\n");
}

function searchHeadingText(value) {
    return value
        .replace(/[\r\n<>]+/g, " ")
        .replaceAll("{", "（")
        .replaceAll("}", "）")
        .replace(/\s+/g, " ")
        .trim();
}

function assertDetailedItems(items, minimum, field, slug) {
    if (
        !Array.isArray(items)
        || items.length < minimum
        || items.some((item) => typeof item !== "string" || item.trim().length < 12)
    ) {
        throw new Error(`${slug}: 新手指南 ${field} 至少需要 ${minimum} 条完整说明`);
    }
}

export function validateComponentGuide(guide, slug) {
    if (!guide || typeof guide !== "object") throw new Error(`${slug}: 缺少组件新手指南`);
    if (typeof guide.definition !== "string" || guide.definition.trim().length < 30) {
        throw new Error(`${slug}: 新手指南 definition 过短`);
    }
    assertDetailedItems(guide.useWhen, 2, "useWhen", slug);
    assertDetailedItems(guide.avoidWhen, 1, "avoidWhen", slug);
    assertDetailedItems(guide.essentials, 3, "essentials", slug);
    assertDetailedItems(guide.accessibility, 2, "accessibility", slug);
    for (const design of ["md3", "apple", "shadcn"]) {
        const reference = guide.designSystems?.[design];
        if (typeof reference?.basis !== "string" || reference.basis.trim().length < 20) {
            throw new Error(`${slug}: 新手指南 designSystems.${design}.basis 过短`);
        }
        if (!Array.isArray(reference.references) || reference.references.length === 0
            || reference.references.some(link => typeof link !== "string" || !link.startsWith("https://"))) {
            throw new Error(`${slug}: 新手指南 designSystems.${design}.references 必须是 HTTPS 链接列表`);
        }
    }
}

function markdownList(items) {
    return items.map((item) => `- ${item}`).join("\n");
}

export function componentGuideMarkup(guide) {
    if (!guide) return "";
    const labels = { md3: "MD3 Expressive", apple: "Apple", shadcn: "shadcn/ui" };
    const references = Object.entries(labels).map(([design, label]) => {
        const record = guide.designSystems[design];
        return `- **${label}**：${record.basis} ${record.references.map((link, index) => `[依据 ${index + 1}](${link})`).join(" · ")}`;
    }).join("\n");
    return `### 适用场景

${guide.useWhen.join(" ")}

${guide.avoidWhen.join(" ")}

### 使用要点

${markdownList(guide.essentials)}

### 无障碍

${markdownList(guide.accessibility)}

### 设计依据与覆盖

${references}

设计依据不等于完成验收；当前状态与适用边界见[覆盖矩阵](/guides/design-coverage)。
`;
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

function componentFaqMarkup(lesson) {
    if (!lesson?.faq.length) return "";
    const text = value => value.replace(/[&<>{}]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "{": "&#123;", "}": "&#125;" })[character]);
    return `## 常见问题\n\n${lesson.faq.map(item => `### ${text(item.question)}\n\n${text(item.answer)}`).join("\n\n")}`;
}

function createPage(canonicalSource, slug, demos, api, lesson, referenceTokens = [], guide, description) {
    const normalized = normalizeNewlines(canonicalSource);
    const frontmatterMatch = normalized.match(/^(\+\+\+\n[\s\S]*?\n\+\+\+)\n+/);
    if (!frontmatterMatch) {
        throw new Error(`${slug}: index.mdx 缺少 TOML frontmatter`);
    }
    const body = normalized.slice(frontmatterMatch[0].length);
    const workbenchLink = /^\[打开[^\]]*工作台\]\([^\n)]*\/workbench\/\)\s*$/m;
    if (slug === "rc-token-global") {
        const content = body
            .replace(workbenchLink, "")
            .replace(/<Demos\b[^>]*\/>/g, '<ComponentDemos demos={demos} />')
            .replace(/\{\/\* token-reference:([\w-]+) \*\/\}/g, '<TokenReference group="$1" />')
            .replace("{/* token-tutorial */}", "<Tutorial tutorial={tutorial} />");
        const tokenIndex = referenceTokens.map(entry => `${entry.key} · ${entry.value} · ${entry.expression} · ${entry.variable}`).join("\n\n");
        return `${frontmatterMatch[1]}\n\n{/* ${GENERATED_MARKER} */}\n\nimport TokenReference from "../site/tokenReference.js";\nimport Tutorial from "../site/tutorial.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";\nimport ComponentDemos from "../site/componentDemos.js";\nimport { demos } from "../_generated/${slug}.js";\n\n${content.trim()}\n\n<div hidden aria-hidden="true" data-docs-search-index="tokens">\n\n@crab-dev/rc-token-global\n\n${tokenIndex}\n\n</div>\n\n${createDemoSearchMetadata(demos).trimEnd()}\n`;
    }
    if (!workbenchLink.test(body)) {
        throw new Error(`${slug}: index.mdx 缺少工作台入口，无法确定预览插入位置`);
    }
    if (!/<Demos\b[^>]*\/>/.test(body)) {
        throw new Error(`${slug}: index.mdx 缺少 Demos 标签`);
    }

    // Component reference pages show one collection. Teaching steps remain in the
    // practice tutorials; repeating their first step here separated related demos.
    const hasDemos = demos.length > 0;
    const heading = body.match(/^# [^\n]+/m)?.[0] ?? `# ${lesson?.title ?? slug}`;
    const frontmatter = description
        ? frontmatterMatch[1].replace(/^description = .+$/m, `description = ${JSON.stringify(description)}`)
        : frontmatterMatch[1];
    const imports = hasDemos || !lesson
        ? `import ComponentDemos from "../site/componentDemos.js";\nimport { demos } from "../_generated/${slug}.js";`
        : `import Tutorial from "../site/tutorial.js";\nimport { tutorial } from "../_generated_tutorials/${slug}.js";`;
    const examples = hasDemos || !lesson
        ? `${createDemoSearchMetadata(demos)}\n<ComponentDemos demos={demos} />`
        : '<Tutorial tutorial={tutorial} />';
    const notes = body
        .replace(/^# [^\n]+\n+/m, "")
        .replace(workbenchLink, "")
        .replace(/<Demos\b[^>]*\/>/g, "")
        .replace(/<API\b[^>]*\/>/g, "")
        .replace(/^## (?:API|代码演示|Light \/ Dark 并排示例)\s*$/gm, "")
        .replace(/^## /gm, "### ")
        .trim();
    const guidance = [notes, componentGuideMarkup(guide).trim()].filter(Boolean).join("\n\n");
    const apiRecords = api === null ? [] : Array.isArray(api) ? api : [api];
    const apiMarkup = apiRecords.length === 0 ? "" : "## API\n\n" + apiRecords.map(record => apiRecordMarkup(record, slug)).join("\n\n");
    return [
        frontmatter,
        `{/* ${GENERATED_MARKER} */}`,
        imports,
        heading,
        `<div hidden aria-hidden="true" data-docs-search-index="package">@crab-dev/${slug}</div>`,
        // Keep existing deep links without reintroducing duplicate headings or previews.
        '<div id="基础示例" data-docs-example-anchor /><div id="全部示例" data-docs-example-anchor />',
        "## 示例",
        examples,
        `[打开完整组件工作台](/components/${slug}/workbench/)`,
        guidance && `## 使用说明\n\n${guidance}`,
        componentFaqMarkup(lesson),
        apiMarkup,
    ].filter(Boolean).join("\n\n") + "\n";
}
async function readIfPresent(filePath) {
    try {
        return await withGeneratedFileRetry(() => readFile(filePath, "utf8"));
    } catch (error) {
        if (error?.code === "ENOENT") return undefined;
        throw error;
    }
}

async function withGeneratedFileRetry(operation, platform = process.platform) {
    for (let attempt = 0; ; attempt++) {
        try { return await operation(); }
        catch (error) {
            if (platform !== "win32" || !["UNKNOWN", "EBUSY", "EPERM", "EACCES"].includes(error.code) || attempt >= 4) throw error;
            await new Promise(resolve => setTimeout(resolve, 100 * 2 ** attempt));
        }
    }
}

async function emitFile(filePath, content, drift) {
    const current = await readIfPresent(filePath);
    if (current === content) return false;
    drift.push(path.relative(repositoryRoot, filePath));
    if (!checkOnly) {
        await mkdir(path.dirname(filePath), { recursive: true });
        await withGeneratedFileRetry(() => writeFile(filePath, content, "utf8"));
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

function createLibraryNavigation(manifest) {
    const groups = [
        { id: "project", title: "项目", pages: ["index"], sections: [
            { id: "learning", title: "学习与实战", pages: ["learn/components", "learn/index", "learn/practice-profile", "learn/practice-data", "learn/practice-admin"] },
            { id: "guides", title: "使用指南", pages: ["guides/getting-started", "guides/library-architecture", "guides/public-api", "guides/migration", "guides/accessibility"] },
        ] },
        { id: "design", title: "设计体系", pages: ["guides/design-styles", "guides/component-sizing", "guides/design-coverage"], sections: [] },
        { id: "maintenance", title: "组件库维护", pages: ["guides/contributing", "guides/dependencies", "guides/toolchain"], sections: [] },
        { id: "components", title: "组件", pages: [], sections: manifest.families.map(family => ({
            id: family.id,
            title: family.title,
            pages: manifest.packages.filter(item => item.family === family.id).map(item => `components/${item.slug}`),
        })) },
    ];
    let content = `# ${GENERATED_MARKER}\n# 来源：library.manifest.json 与组件库指南入口。\n`;
    for (const group of groups) {
        content += `\n[[group]]\nid = ${JSON.stringify(group.id)}\ntitle = ${JSON.stringify(group.title)}\npages = ${JSON.stringify(group.pages)}\n`;
        for (const section of group.sections) content += `\n[[group.section]]\nid = ${JSON.stringify(section.id)}\ntitle = ${JSON.stringify(section.title)}\npages = ${JSON.stringify(section.pages)}\n`;
    }
    return content;
}

function createLibraryData(manifest) {
    const families = manifest.families.map(family => ({ ...family, count: manifest.packages.filter(item => item.family === family.id).length }));
    return `// ${GENERATED_MARKER}\nexport const libraryInventory = ${JSON.stringify({ count: manifest.packages.length, families, categories: manifest.categories })} as const;\n`;
}

function createDependencyRecords(manifest, inspection) {
    const known = new Map(manifest.packages.map(item => [item.name, item.slug]));
    const resolveEdges = (names, own) => [...new Set(names)].filter(name => known.has(name) && name !== own).sort().map(name => known.get(name));
    return manifest.packages.map(item => {
        const facts = inspection.get(item.name);
        return {
            slug: item.slug, title: item.title, family: item.family,
            production: resolveEdges([...Object.keys(item.packageJson.dependencies ?? {}), ...facts.productionImports], item.name),
            docs: resolveEdges([...facts.docsImports, ...(item.packageJson.crab?.docsDependencies ?? [])], item.name),
            token: resolveEdges(facts.tokenImports, item.name),
        };
    });
}

function createDependenciesPage(records) {
    const bySlug = new Map(records.map(item => [item.slug, item]));
    const links = names => names.map(slug => `[${bySlug.get(slug).title}](/components/${slug})`).join("、") || "—";
    return `+++\ntitle = "包依赖图"\ndescription = "由产品清单、包声明、生产源码、文档和令牌引用生成的依赖关系"\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\nimport LibraryDependencies from "../site/libraryDependencies.js";\n\n# 包依赖图\n\n从包出发查看其直接依赖与使用方。生产依赖来自 package.json dependencies 与生产源码 import/export，文档依赖来自 docs 源码与 crab.docsDependencies，令牌依赖来自 token.toml imports。三类边独立展示，允许同一对包承担多个角色；不把文档引用加入生产构建前置。\n\n<LibraryDependencies />\n\n## 完整直接关系\n\n以下邻接表与交互图来自同一生成数据。只列产品清单内的包，外部 npm、React peer 和测试依赖按各包声明维护；最终 Turbo 构建图由同一检查模块派生并检查环。\n\n| 包 | 生产依赖 | 文档依赖 | 令牌依赖 |\n| --- | --- | --- | --- |\n${records.map(item => `| [${item.title}](/components/${item.slug}) | ${links(item.production)} | ${links(item.docs)} | ${links(item.token)} |`).join("\n")}\n\n修改产品清单、package.json、类型/运行源码、组件文档或 token.toml 后运行架构与文档生成检查。能力族是职责分类，不代表人工固定的依赖链；来源与边界见[组件库体系](/guides/library-architecture)。\n`;
}

function updateReadmeInventory(source, manifest) {
    let inventory = `当前产品清单包含 ${manifest.packages.length} 个包，按 ${manifest.families.length} 个能力族组织。\n\n| 能力族 | 包数 | 职责 |\n| --- | --- | --- |\n`;
    for (const family of manifest.families) {
        const products = manifest.packages.filter(item => item.family === family.id);
        inventory += `| ${family.title} | ${products.length} | ${family.description} |\n`;
    }
    for (const family of manifest.families) {
        inventory += `\n**${family.title}**：${manifest.packages.filter(item => item.family === family.id).map(item => `[${item.title}](${item.path}/docs/index.mdx)`).join(" · ")}\n`;
    }
    const pattern = /<!-- library-inventory:start -->[\s\S]*?<!-- library-inventory:end -->/;
    if (!pattern.test(source)) throw new Error("README 缺少产品清单生成边界");
    return source.replace(pattern, `<!-- library-inventory:start -->\n${inventory}\n<!-- library-inventory:end -->`);
}

function createDesignCoverage(manifest) {
    const names = { partial: "部分覆盖", verified: "已验收", "not-applicable": "无独立视觉" };
    let content = `+++\ntitle = "设计体系覆盖矩阵"\ndescription = "由产品清单生成的组件成熟度与三套设计体系覆盖范围"\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${GENERATED_MARKER} */}\n\n# 设计体系覆盖矩阵\n\n本页来自根目录 \`library.manifest.json\`。当前产品清单包含 ${manifest.packages.length} 个包、${manifest.families.length} 个能力族；用途分类是独立的第二轴。\n\n“部分覆盖”表示已有实现但完整视觉与交互矩阵尚未验收；“已验收”必须有绑定提交和产物的证据；“无独立视觉”只说明该包的职责，不免除行为、类型和依赖检查。历史截图不能自动提升当前覆盖状态。\n\n| 包 | 能力族 | 用途 | 生命周期 | MD3 Expressive | Apple | shadcn/ui |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
    for (const product of manifest.packages) {
        const family = manifest.families.find(item => item.id === product.family).title;
        const category = manifest.categories.find(item => item.id === product.category).title;
        content += `| [${product.title}](/components/${product.slug}) | ${family} | ${category} | ${product.status} | ${names[product.designCoverage.md3]} | ${names[product.designCoverage.apple]} | ${names[product.designCoverage.shadcn]} |\n`;
    }
    return content + "\n每个可视包都需检查适用的默认、悬停、焦点、按下、禁用、选中、错误和加载状态，以及浅深色、触控、键盘、减少动画和强制颜色。详见[设计体系](/guides/design-styles)、[公共 API](/guides/public-api)与[维护约定](/guides/contributing)。\n";
}

async function generateDocs() {
    const manifest = await loadLibraryManifest();
    // Dev regeneration reuses this module; read authored JSON again each run.
    const [componentGuides, componentDescriptions] = await Promise.all([
        readFile(path.join(repositoryRoot, ".website/content/component-guides.json"), "utf8").then(JSON.parse),
        readFile(path.join(repositoryRoot, ".website/content/catalog/overview.json"), "utf8").then(JSON.parse),
    ]);
    const directoryEntries = await readdir(componentsDirectory, { withFileTypes: true });
    const componentSlugs = directoryEntries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("rc-"))
        .map((entry) => entry.name)
        .sort();

    const registeredSlugs = manifest.packages.map(item => item.slug).sort();
    if (JSON.stringify(componentSlugs) !== JSON.stringify(registeredSlugs)) {
        throw new Error("组件目录与 library.manifest.json 产品清单不一致");
    }

    const guideSlugs = Object.keys(componentGuides).sort();
    const missingGuides = componentSlugs.filter((slug) => !guideSlugs.includes(slug));
    const orphanGuides = guideSlugs.filter((slug) => !componentSlugs.includes(slug));
    if (missingGuides.length > 0 || orphanGuides.length > 0) {
        throw new Error(
            `新手指南与组件不一致；缺少：${missingGuides.join(", ") || "无"}；多余：${orphanGuides.join(", ") || "无"}`,
        );
    }
    for (const slug of componentSlugs) validateComponentGuide(componentGuides[slug], slug);

    const navigation = createLibraryNavigation(manifest);
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

    const outputs = [{ filePath: path.join(websiteDocsDirectory, "navigation.toml"), content: navigation }];
    const readmePath = path.join(repositoryRoot, "README.md");
    outputs.push({ filePath: readmePath, content: updateReadmeInventory(await readFile(readmePath, "utf8"), manifest) });
    outputs.push({ filePath: path.join(websiteDocsDirectory, "guides/design-coverage.mdx"), content: createDesignCoverage(manifest) });
    outputs.push({ filePath: path.join(generatedDataDirectory, "library.ts"), content: createLibraryData(manifest) });
    const dependencies = createDependencyRecords(manifest, await inspectLibrary(manifest));
    outputs.push({ filePath: path.join(generatedDataDirectory, "library-dependencies.ts"), content: `// ${GENERATED_MARKER}\nimport type { LibraryDependencyRecord } from "../site/libraryDependencies.js";\nexport const libraryDependencies = ${serialize(dependencies)} as const satisfies readonly LibraryDependencyRecord[];\n` });
    outputs.push({ filePath: path.join(websiteDocsDirectory, "guides/dependencies.mdx"), content: createDependenciesPage(dependencies) });
    const referenceSource = await readFile(path.join(componentsDirectory, "rc-token-global/token.toml"), "utf8");
    const referenceTokens = readGlobalTokens(referenceSource);
    outputs.push({
        filePath: path.join(generatedDataDirectory, "globalTokenReference.ts"),
        content: createTokenReferenceData(referenceSource),
    });
    outputs.push(await createHomeExample(repositoryRoot));
    const lessons = [];
    const componentPreviewRecords = [];
    const globalDemoKeys = new Set();
    let demoCount = 0;

    for (const slug of componentSlugs) {
        const product = manifest.packages.find(item => item.slug === slug);
        const componentDirectory = path.join(componentsDirectory, slug);
        const canonicalMdxPath = path.join(componentDirectory, "docs/index.mdx");
        const canonicalMdx = (await readFile(canonicalMdxPath, "utf8"))
            .replace(/^title = .*$/m, `title = ${JSON.stringify(product.title)}`)
            .replace(/^status = .*$/m, `status = ${JSON.stringify(product.status)}`);
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
            const learning = extractDemoLearning(sourceCode, sourcePath);
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
                learning,
                sourceCode,
                previewPath: `/components/${slug}/workbench/?__wake_demo=${encodeURIComponent(id)}`,
                workbenchPath: `/components/${slug}/workbench/#/components/${encodeURIComponent(id)}`,
                density: densityFor(slug),
                layout: layoutFor(slug),
            });
        }
        const organizedDemos = organizeDemos(slug, demos);
        componentPreviewRecords.push({ slug, demos: organizedDemos });
        demoCount += organizedDemos.length;

        const api = [];
        for (const [index, tag] of [...canonicalMdx.matchAll(/<API\b[^>]*\/>/g)].entries()) {
            const record = await extractApiRecord(componentDirectory, canonicalMdx, canonicalMdxPath, tag[0]);
            record.generatedFileName = index === 0 ? `${slug}.ts` : `${slug}-${record.symbol}.ts`;
            if (api.some(current => current.symbol === record.symbol)) throw new Error(`${slug}: API symbol 重复 ${record.symbol}`);
            api.push(record);
        }
        const lesson = await loadTutorial(repositoryRoot, slug, organizedDemos);
        lessons.push({ ...lesson.record, title: product.title });
        outputs.push(lesson.output);
        outputs.push({
            filePath: path.join(generatedDataDirectory, `${slug}.ts`),
            content: createDataModule(organizedDemos),
        });
        for (const record of api) {
            const { primary, native } = splitApiRecord(record, slug);
            for (const grouped of [primary, native].filter(group => group && group.props.length > 0)) outputs.push({
                filePath: path.join(generatedApiDirectory, grouped.generatedFileName),
                content: createSearchableApiSource(grouped),
            });
        }
        outputs.push({
            filePath: path.join(generatedPagesDirectory, `${slug}.mdx`),
            content: createPage(
                canonicalMdx,
                slug,
                organizedDemos,
                api,
                lesson.record,
                slug === "rc-token-global" ? referenceTokens : [],
                componentGuides[slug],
                componentDescriptions[slug],
            ),
        });
    }

    if (demoCount !== globalDemoKeys.size) {
        throw new Error(`Demo 存在重复：${demoCount} 项中只有 ${globalDemoKeys.size} 个唯一 ID`);
    }

    outputs.push({
        filePath: path.join(generatedDataDirectory, "component-previews.ts"),
        content: createComponentPreviews(componentPreviewRecords),
    });

    const practices = await loadPracticeTutorials(repositoryRoot);
    const teaching = await validateTeachingInventory(repositoryRoot, [...lessons, ...practices.map(item => item.record)], ["home/profile.tsx"]);
    outputs.push({ filePath: path.join(websiteDocsDirectory, "learn/components.mdx"), content: createLearningMap(navigation, lessons, componentDescriptions, manifest.packages.map(item => ({ ...item, categoryTitle: manifest.categories.find(category => category.id === item.category).title }))) });
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
    createLibraryNavigation,
    createDependencyRecords,
    createDesignCoverage,
    createComponentPreviews,
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    splitApiRecord,
    densityFor,
    extractApiRecord,
    generateDocs,
    isValidTypeText,
    layoutFor,
    normalizeApiProps,
    organizeDemos,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
    withGeneratedFileRetry,
};
