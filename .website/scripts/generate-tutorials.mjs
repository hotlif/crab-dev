import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "@babel/parser";
import catalogDescriptions from "../content/catalog/overview.json" with { type: "json" };

const marker = "// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.";
const requiredText = ["title", "goal", "why", "instruction", "expected"];

export function validateTutorial(record, source) {
    if (!record || typeof record.id !== "string" || !/^[a-z0-9-]+$/.test(record.id)) throw new Error(`${source}: 教程 ID 无效`);
    for (const field of ["title", "summary", "prerequisite"]) if (typeof record[field] !== "string" || !record[field].trim()) throw new Error(`${source}: 缺少 ${field}`);
    if (!Array.isArray(record.steps) || record.steps.length < 2 || record.steps.length > 6) throw new Error(`${source}: 教程必须包含 2–6 步`);
    const ids = new Set();
    for (const step of record.steps) {
        if (!step.id || ids.has(step.id) || !/^[a-z0-9-]+$/.test(step.id)) throw new Error(`${source}: 步骤 ID 重复或无效`);
        ids.add(step.id);
        for (const field of requiredText) if (typeof step[field] !== "string" || !step[field].trim()) throw new Error(`${source}: ${step.id} 缺少 ${field}`);
        if (!Array.isArray(step.changes) || step.changes.length === 0 || step.changes.some(change => typeof change !== "string" || !change.trim())) throw new Error(`${source}: 缺少代码变化说明`);
        if ((typeof step.source === "string") === (typeof step.workbench === "string")) throw new Error(`${source}: 每步必须且只能选择一个示例来源`);
    }
    if (!Array.isArray(record.faq) || record.faq.length === 0 || record.faq.some(item => !item.question || !item.answer)) throw new Error(`${source}: 缺少常见问题`);
}

export function assertExampleImports(source, file) {
    let ast;
    try { ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] }); }
    catch (error) { throw new Error(`${file}: 示例语法无效：${error.message}`, { cause: error }); }
    for (const statement of ast.program.body) {
        if (statement.type !== "ImportDeclaration") continue;
        const specifier = statement.source.value;
        if (statement.specifiers.length === 0 && /\.css(?:[?#]|$)/i.test(specifier)) throw new Error(`${file}: 示例样式由 Wake 自动加载，不得手写 CSS 副作用导入：${specifier}`);
        if (specifier.startsWith(".") || specifier.startsWith("@/") || specifier.startsWith("@@/") || /\/(src|esm|cjs|declarations)\//.test(specifier)) throw new Error(`${file}: 教学示例必须使用公开包入口，不能依赖隐藏辅助文件：${specifier}`);
    }
    if (!ast.program.body.some(statement => statement.type === "ExportDefaultDeclaration")) throw new Error(`${file}: 教学示例必须默认导出运行组件`);
}

export async function validateTeachingInventory(repositoryRoot, records, additionalExamples = []) {
    const website = path.join(repositoryRoot, ".website");
    const expected = new Set(records.map(record => `${record.id}.json`));
    const files = (await readdir(path.join(website, "content"))).filter(file => (
        file.endsWith(".json") && file !== "component-guides.json"
    ));
    const extras = files.filter(file => !expected.has(file));
    if (extras.length) throw new Error(`存在未关联页面的教程：${extras.join(", ")}`);
    const referenced = new Set(records.flatMap(record => record.steps.flatMap(step => step.source ? [step.source] : [])));
    for (const example of additionalExamples) referenced.add(example);
    const examplesRoot = path.join(website, "docs/examples");
    const examples = (await readdir(examplesRoot, { recursive: true })).filter(file => file.endsWith(".tsx"));
    const unused = examples.map(file => file.replaceAll("\\", "/")).filter(file => !referenced.has(file));
    if (unused.length) throw new Error(`存在未关联步骤的示例：${unused.join(", ")}`);
    return { tutorials: records.length, examples: referenced.size };
}

export async function createHomeExample(repositoryRoot) {
    const website = path.join(repositoryRoot, ".website");
    const file = path.join(website, "docs/examples/home/profile.tsx");
    const source = (await readFile(file, "utf8")).replace(/\r\n?/g, "\n");
    assertExampleImports(source, file);
    const match = source.match(/\{\/\* home-source:start \*\/\}\n([\s\S]*?)\s*\{\/\* home-source:end \*\/\}/);
    if (!match) throw new Error("首页示例缺少源码展示标记");
    const lines = match[1].trimEnd().split("\n");
    const indent = Math.min(...lines.filter(line => line.trim()).map(line => line.search(/\S/)));
    return {
        filePath: path.join(website, "docs/_generated_tutorials/home.ts"),
        content: `${marker}\nexport const sourceCode = ${JSON.stringify(source)};\nexport const sourceSnippet = ${JSON.stringify(lines.map(line => line.slice(indent)).join("\n"))};\n`,
    };
}

export function createLearningMap(navigation, records, descriptions = catalogDescriptions) {
    const sections = navigation.split("[[group.section]]").filter(section => section.includes('"components/')).map(section => ({
        title: section.match(/title = "([^"]+)"/)?.[1],
        records: [...section.matchAll(/"components\/(rc-[^"]+)"/g)].map(match => {
            const record = records.find(item => item.id === match[1]);
            if (!record) throw new Error(`学习地图缺少 ${match[1]}`);
            return record;
        }),
    }));
    // 组件目录先呈现常用界面能力，基础工具仍保留原分类锚点。
    sections.sort((a, b) => Number(a.title === "基础能力") - Number(b.title === "基础能力"));
    const total = sections.reduce((sum, section) => sum + section.records.length, 0);
    const categories = sections.map(({ title, records: items }) => ({ title, count: items.length }));
    let body = `+++\ntitle = "组件目录"\ndescription = "${total} 个组件与工具包，按场景查阅用法、示例和 API。"\nkind = "guide"\nstatus = "experimental"\n+++\n\n{/* ${marker.slice(3)} */}\n\nimport { CatalogIntro, CatalogItem } from "../site/componentCatalog.js";\n\n<CatalogIntro categories={${JSON.stringify(categories)}} />\n`;
    for (const section of sections) {
        body += `\n<section className="crab-catalog-section">\n\n<div className="crab-catalog-section-heading">\n\n## ${section.title}\n\n<div className="crab-catalog-count">${section.records.length} 个</div>\n\n</div>\n\n<div className="crab-catalog-grid">\n\n`;
        for (const record of section.records) {
            const parts = record.title.match(/^(.+?)\s+([\u3400-\u9fff].*)$/u);
            const description = descriptions[record.id];
            if (typeof description !== "string" || !description.trim()) throw new Error(`组件概览缺少 ${record.id} 的用途介绍`);
            const props = { href: `/components/${record.id}`, name: parts?.[1] ?? record.title, label: parts?.[2] ?? "", description, preview: record.id };
            // Wake MDX 当前不能正确编译 JSX 属性展开，使用单个显式数据属性。
            body += `<CatalogItem item={${JSON.stringify(props)}} />\n\n`;
        }
        body += `</div>\n\n</section>\n`;
    }
    return body;
}

export async function loadTutorial(repositoryRoot, id, demos = []) {
    const website = path.join(repositoryRoot, ".website");
    const source = path.join(website, "content", `${id}.json`);
    const record = JSON.parse(await readFile(source, "utf8"));
    validateTutorial(record, source);
    if (record.id !== id) throw new Error(`${source}: ID 与文件名不一致`);
    const serializedSteps = [];
    for (const step of record.steps) {
        const { source: example, workbench, ...content } = step;
        if (workbench) {
            const demo = demos.find(item => item.id === `docs/demos/${workbench}`);
            if (!demo) throw new Error(`${source}: 找不到工作台示例 ${workbench}`);
            // 隔离示例保留运行原文，复制时明确提供源文件及依赖，不伪装为独立站内示例。
            serializedSteps.push(JSON.stringify({ ...content, sourceCode: demo.sourceCode, preview: { kind: "workbench", demo } }));
        } else {
            const examplesRoot = path.join(website, "docs/examples");
            const file = path.resolve(examplesRoot, example);
            if (!file.startsWith(examplesRoot + path.sep) || !file.endsWith(".tsx")) throw new Error(`${source}: 示例路径越界`);
            const sourceCode = (await readFile(file, "utf8")).replace(/\r\n?/g, "\n");
            assertExampleImports(sourceCode, file);
            serializedSteps.push(`{ ...${JSON.stringify({ ...content, sourceCode })}, preview: { kind: "inline", load: () => import(${JSON.stringify(`../examples/${example.replace(/\.tsx$/, ".js")}`)}) } }`);
        }
    }
    return {
        record,
        output: {
            filePath: path.join(website, "docs/_generated_tutorials", `${id}.ts`),
            content: `${marker}\nimport type { TutorialRecord } from "../site/tutorial.js";\nexport const tutorial = { id: ${JSON.stringify(id)}, title: ${JSON.stringify(record.title)}, steps: [\n${serializedSteps.map(step => `    ${step}`).join(",\n")}\n] } satisfies TutorialRecord;\n`,
        },
    };
}

export function tutorialMarkup(record) {
    // 教学字段是文字；JSX 与花括号应显示给读者，不能被 MDX 当作运行代码。
    const text = value => value.replace(/[&<>{}]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "{": "&#123;", "}": "&#125;" })[character]);
    const faq = record.faq.map(item => `### ${text(item.question)}\n\n${text(item.answer)}`).join("\n\n");
    const searchable = record.steps.map(step => `**${text(step.title)}**\n\n${[step.goal, step.why, step.instruction, step.expected].map(text).join(" ")}`).join("\n\n");
    return `## 开始之前\n\n${text(record.prerequisite)}\n\n## 跟着做\n\n${text(record.summary)}\n\n<Tutorial tutorial={tutorial} />\n\n<div hidden aria-hidden="true" data-docs-search-index="tutorial">\n\n${searchable}\n\n</div>\n\n## 常见问题\n\n${faq}\n`;
}

export async function loadPracticeTutorials(repositoryRoot) {
    const content = path.join(repositoryRoot, ".website/content");
    const names = (await readdir(content)).filter(name => name.startsWith("practice-") && name.endsWith(".json")).sort();
    if (names.length !== 3) throw new Error("必须维护三个实战教程");
    return Promise.all(names.map(name => loadTutorial(repositoryRoot, name.slice(0, -5))));
}
