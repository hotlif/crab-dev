import { parseTypeScript, visitSyntax } from "./syntax.mjs";
import { GENERATED_MARKER, normalizeNewlines } from "./format.mjs";
import { readLibraryMetadata } from "../../../scripts/library-manifest.mjs";

export function escapeJsDoc(value) {
    // Wake 0.1.45 scans interface braces without treating JSDoc apostrophes as
    // comments; typographic apostrophes keep prose intact and the scan balanced.
    return value.replace(/\*\//g, "*\\/").replaceAll("'", "’");
}

export function placeholderType(typeArguments) {
    if (typeArguments === 0) return " = DocsTypePlaceholder";
    const parameters = Array.from(
        { length: typeArguments },
        (_, index) => `T${index} = unknown`,
    ).join(", ");
    const tuple = Array.from({ length: typeArguments }, (_, index) => `T${index}`).join(", ");
    return `<${parameters}> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [${tuple}] }`;
}

export function qualifiedNameParts(name) {
    if (name.type === "Identifier") return [name.name];
    return [...qualifiedNameParts(name.left), name.right.name];
}

export function createApiTypePlaceholders(props, rootSymbol) {
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

export function createSearchableApiSource(api) {
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

export function splitApiRecord(api, slug) {
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

export function apiRecordMarkup(record, slug) {
    const { primary, native } = splitApiRecord(record, slug);
    const tag = current => `<API source="../_generated_api/${current.generatedFileName}" symbol="${current.symbol}" component="${current.component}" />`;
    return [
        primary.props?.length === 0 ? `### ${record.component}` : tag(primary),
        native && `<details data-docs-native-props>\n<summary>${record.component} 继承的原生属性（${native.props.length} 项）</summary>\n\n${tag(native)}\n\n</details>`,
    ].filter(Boolean).join("\n\n");
}

export function searchHeadingText(value) {
    return value
        .replace(/[\r\n<>]+/g, " ")
        .replaceAll("{", "（")
        .replaceAll("}", "）")
        .replace(/\s+/g, " ")
        .trim();
}

export function assertDetailedItems(items, minimum, field, slug) {
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
    for (const { id: design } of readLibraryMetadata().designSystems) {
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

export function markdownList(items) {
    return items.map((item) => `- ${item}`).join("\n");
}

export function componentGuideMarkup(guide) {
    if (!guide) return "";
    const labels = Object.fromEntries(readLibraryMetadata().designSystems.map(design => [design.id, design.title]));
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

export function createDemoSearchMetadata(demos) {
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

export function componentFaqMarkup(lesson) {
    if (!lesson?.faq.length) return "";
    const text = value => value.replace(/[&<>{}]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "{": "&#123;", "}": "&#125;" })[character]);
    return `## 常见问题\n\n${lesson.faq.map(item => `### ${text(item.question)}\n\n${text(item.answer)}`).join("\n\n")}`;
}

export function createPage(canonicalSource, slug, demos, api, lesson, referenceTokens = [], guide, description) {
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
