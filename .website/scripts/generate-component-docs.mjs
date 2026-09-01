import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
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
const generatedPagesDirectory = path.join(websiteDocsDirectory, "components");
const checkOnly = process.argv.includes("--check");

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

async function extractApiRecord(componentDirectory, canonicalMdx) {
    const apiTag = canonicalMdx.match(/<API\b[^>]*\/>/)?.[0];
    if (!apiTag) return null;

    const attributes = parseAttributes(apiTag);
    const componentName = attributes.get("component");
    const symbol = attributes.get("symbol");
    if (!componentName || !symbol) {
        throw new Error(`${componentDirectory}: API 标签缺少 component 或 symbol`);
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

    const props = Object.entries(definition.props ?? {}).map(([name, prop]) => ({
        name,
        required: prop?.required === true,
        description: typeof prop?.description === "string" ? prop.description : "",
        typeText: normalizeTypeText(prop?.tsType),
        defaultValue: typeof prop?.defaultValue?.value === "string"
            ? prop.defaultValue.value
            : null,
        deprecated: prop?.deprecated === true,
    }));

    return {
        component: componentName,
        symbol,
        props,
    };
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

function createDataModule(demos, api) {
    const serializedApi = api === null ? "null" : `${serialize(api)} as const`;
    return `/**\n * ${GENERATED_MARKER}\n */\n\nimport type { ComponentApiRecord } from "../site/componentApi.js";\nimport type { ComponentDemoRecord } from "../site/componentDemos.js";\n\nexport const demos = ${serialize(demos)} as const satisfies readonly ComponentDemoRecord[];\n\nexport const api = ${serializedApi} satisfies ComponentApiRecord | null;\n`;
}

function createPage(canonicalSource, slug, hasApi) {
    const normalized = normalizeNewlines(canonicalSource);
    const frontmatterMatch = normalized.match(/^(\+\+\+\n[\s\S]*?\n\+\+\+)\n+/);
    if (!frontmatterMatch) {
        throw new Error(`${slug}: index.mdx 缺少 TOML frontmatter`);
    }

    let body = normalized.slice(frontmatterMatch[0].length);
    const previewSection = "## 组件预览\n\n<ComponentDemos demos={demos} />\n";
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

    if (hasApi) {
        let renderedApi = false;
        body = body.replace(/<API\b[^>]*\/>/g, () => {
            if (renderedApi) return "";
            renderedApi = true;
            return "<ComponentApi api={api} />";
        });
    }

    const imports = [
        'import ComponentDemos from "../site/componentDemos.js";',
        hasApi ? 'import ComponentApi from "../site/componentApi.js";' : null,
        hasApi
            ? `import { api, demos } from "../_generated/${slug}.js";`
            : `import { demos } from "../_generated/${slug}.js";`,
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

async function main() {
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

        const api = await extractApiRecord(componentDirectory, canonicalMdx);
        outputs.push({
            filePath: path.join(generatedDataDirectory, `${slug}.ts`),
            content: createDataModule(organizedDemos, api),
        });
        outputs.push({
            filePath: path.join(generatedPagesDirectory, `${slug}.mdx`),
            content: createPage(canonicalMdx, slug, api !== null),
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

    if (checkOnly && drift.length > 0) {
        throw new Error(`组件文档生成产物存在漂移：\n${drift.map((file) => `- ${file}`).join("\n")}`);
    }

    const action = checkOnly ? "检查" : "生成";
    console.log(`${action}完成：${componentSlugs.length} 个组件页，${demoCount} 个唯一 Demo，${drift.length} 个文件变化。`);
}

await main();
