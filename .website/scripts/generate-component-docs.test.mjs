import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, rm, writeFile, readFile, readdir } from "node:fs/promises";
import { parse } from "@babel/parser";
import { createTokenReferenceData, readGlobalTokens } from "./generate-token-reference.mjs";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateTutorial, assertExampleImports, loadTutorial, tutorialMarkup, validateTeachingInventory, createLearningMap, createHomeExample } from "./generate-tutorials.mjs";

import {
    componentGuideMarkup,
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    densityFor,
    extractDemoMeta,
    extractDemoLearning,
    isValidTypeText,
    layoutFor,
    normalizeApiProps,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
    validateComponentGuide,
} from "./generate-component-docs.mjs";

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "crab-docs-generator-"));
const tests = [];

function test(name, run) {
    tests.push({ name, run });
}

test("静态 Demo 元数据支持 TSX、satisfies 和常量断言，拒绝动态值", () => {
    const source = 'export const meta = ({ title: "标题", description: `说明` } as const) satisfies Meta; export default () => <div />;';
    assert.deepEqual(extractDemoMeta(source, "example.tsx"), { title: "标题", description: "说明" });
    assert.throws(() => extractDemoMeta('export const meta = { title: getTitle(), description: "说明" };', "dynamic.tsx"), /必须是静态字符串/);
});

test("API 提取保留工具类型、方法泛型、说明和弃用标记", async () => {
    const sourcePath = path.join(temporaryDirectory, "utility-types.ts");
    await writeFile(sourcePath, `
interface Base {
    /** 数据说明 {@link Value} */
    value: string;
    /** 旧字段\n     * @deprecated 使用 value */
    legacy?: number;
    hidden: boolean;
}
export type Props = Partial<Pick<Base, "value">> & Required<Omit<Base, "value" | "hidden">> & {
    /** 提交数据 */
    submit<T extends string>(value: T): Promise<T>;
};
`);
    const props = parseSourceApiProps(sourcePath, "Props");
    assert.deepEqual(props.map(({ name, required }) => [name, required]), [["value", false], ["legacy", true], ["submit", true]]);
    assert.equal(props[0].description, "数据说明 Value");
    assert.equal(props[1].description, "旧字段");
    assert.equal(props[1].deprecated, true);
    assert.equal(props[2].typeText, "<T extends string>(value: T) => Promise<T>");
    const searchable = createSearchableApiSource({ component: "Example", symbol: "Props", props });
    assert.doesNotMatch(searchable, /type T =/);
});

test("API 类型校验接受复杂类型并拒绝不完整语法或额外声明", () => {
    assert.equal(isValidTypeText('((value: string) => void) | { readonly [key: string]: number }'), true);
    assert.equal(isValidTypeText('Array<'), false);
    assert.equal(isValidTypeText('string; const injected = 1'), false);
});

test("映射类型的键保留为局部参数，不生成同名占位声明", () => {
    const content = createSearchableApiSource({
        component: "Example",
        symbol: "Props",
        props: [{
            name: "values",
            required: true,
            description: "字段映射",
            typeText: "{ [K in keyof Value]: Value[K] }",
            defaultValue: null,
            deprecated: false,
        }],
    });
    assert.doesNotMatch(content, /type K =/);
    assert.match(content, /type Value = DocsTypePlaceholder/);
});

test("Button 文档使用单列宽预览", () => {
    assert.equal(layoutFor("rc-button"), "wide");
    assert.equal(layoutFor("rc-alert"), "grid");
});

test("Select 文档使用单列紧凑预览", () => {
    assert.equal(layoutFor("rc-select"), "wide");
    assert.equal(densityFor("rc-select"), "compact");
});

test("从联合 Props 合并公共字段、变体类型和源码说明", async () => {
    const sourcePath = path.join(temporaryDirectory, "types.ts");
    await writeFile(sourcePath, `
interface BaseProps {
    // 数据源
    options: string[];
    /** 是否禁用 */
    disabled?: boolean;
}
interface SingleProps extends BaseProps {
    mode?: "single";
    value?: string;
}
interface MultipleProps extends BaseProps {
    mode: "multiple";
    value?: string[];
}
export type SelectProps = SingleProps | MultipleProps;
`, "utf8");

    const props = parseSourceApiProps(sourcePath, "SelectProps");
    assert.deepEqual(props.map((prop) => prop.name), ["options", "disabled", "mode", "value"]);
    assert.equal(props.find((prop) => prop.name === "options")?.description, "数据源");
    assert.equal(props.find((prop) => prop.name === "mode")?.required, false);
    assert.equal(props.find((prop) => prop.name === "mode")?.typeText, '"single" | "multiple"');
    assert.equal(props.find((prop) => prop.name === "value")?.typeText, "string | string[]");
});

test("docgen 为空或类型串列时使用源码 API，并为缺失说明提供明确占位", () => {
    const sourceProps = [
        {
            name: "disabled",
            required: false,
            description: "是否禁用",
            typeText: "boolean",
            defaultValue: null,
            deprecated: false,
        },
        {
            name: "value",
            required: true,
            description: "",
            typeText: "string",
            defaultValue: null,
            deprecated: false,
        },
    ];
    const props = normalizeApiProps([{
        ...sourceProps[0],
        description: "",
        typeText: "boolean /** value */ value?: string",
    }], sourceProps, "fixture/docgen.json");

    assert.equal(props.length, 2);
    assert.equal(props[0].typeText, "boolean");
    assert.equal(props[0].description, "是否禁用");
    assert.equal(props[1].description, "暂无说明。");
});

test("逐属性合并源码与 docgen，并保留跨文件继承的合法属性", async () => {
    const sourcePath = path.join(temporaryDirectory, "mixed-types.ts");
    await writeFile(sourcePath, `
import type { ImportedProps } from "./imported.js";
export interface DateProps extends ImportedProps {
    /** 本地属性 */
    local?: boolean;
    /** 范围 */
    range?: { start?: string; end?: string };
}
`, "utf8");
    const sourceProps = parseSourceApiProps(sourcePath, "DateProps");
    const docgenProps = [
        {
            name: "local",
            required: false,
            description: "docgen 本地属性",
            typeText: "boolean",
            defaultValue: null,
            deprecated: false,
        },
        {
            name: "range",
            required: false,
            description: "docgen 范围",
            typeText: "{ start?: string } /** next */ timeZone?: string",
            defaultValue: null,
            deprecated: false,
        },
        {
            name: "instance",
            required: false,
            description: "跨文件继承的实例",
            typeText: "RefObject<DatePanelInstance | null>",
            defaultValue: null,
            deprecated: false,
        },
        {
            name: "onSelect",
            required: false,
            description: "跨文件继承的选择回调",
            typeText: "(values: Temporal.ZonedDateTime[]) => void",
            defaultValue: null,
            deprecated: false,
        },
    ];

    const props = normalizeApiProps(docgenProps, sourceProps, "fixture/docgen.json");
    assert.deepEqual(props.map((prop) => prop.name), ["local", "range", "instance", "onSelect"]);
    assert.equal(props.find((prop) => prop.name === "range")?.typeText, "{ start?: string; end?: string; }");
    assert.equal(props.find((prop) => prop.name === "instance")?.typeText, "RefObject<DatePanelInstance | null>");
    assert.equal(props.find((prop) => prop.name === "onSelect")?.typeText, "(values: Temporal.ZonedDateTime[]) => void");
});

test("生成的 API 适配接口可解析，并由 Wake 原生 API 建立属性索引", () => {
    const api = {
        component: "Select",
        symbol: "SelectProps",
        props: [
            {
                name: "onChange",
                required: false,
                description: "值变化回调",
                typeText: "((value: string) => void) | ((value: string[]) => void)",
                defaultValue: null,
                deprecated: false,
            },
            {
                name: "value",
                required: true,
                description: "日期值",
                typeText: "Temporal.ZonedDateTime | null",
                defaultValue: null,
                deprecated: false,
            },
            {
                name: "nested",
                required: false,
                description: "递归配置",
                typeText: "SelectProps[]",
                defaultValue: null,
                deprecated: false,
            },
        ],
    };
    const source = createSearchableApiSource(api);
    assert.match(source, /interface SelectProps/);
    assert.doesNotMatch(source, /SelectPropsSearchIndex/);
    assert.doesNotMatch(source, /type SelectProps/);
    assert.match(source, /"onChange"\?: \(\(value: string\) => void\)/);
    assert.match(source, /declare namespace Temporal/);
    assert.match(source, /"value": Temporal\.ZonedDateTime \| null/);
    assert.doesNotMatch(source, /Temporal_ZonedDateTime/);
    assert.match(source, /Generated type-only namespace preserves the public qualified API name/);

    const demos = [{
        id: "docs/demos/search.demo.tsx",
        title: "可搜索",
        description: "按 disabled 状态过滤",
        sourceCode: "export default () => null;",
        previewPath: "/preview",
        workbenchPath: "/workbench",
        density: "compact",
        layout: "grid",
        group: "数据与搜索",
    }];
    const page = createPage(`+++
title = "Select"
description = "选择器"
kind = "component"
status = "experimental"
+++

# Select

## 何时使用

先确认场景，再查看示例。

[打开 Select 工作台](/components/rc-select/workbench/)

## 代码演示

<Demos glob="./demos/*.demo.tsx" />

## API

<API source="../src/types.ts" symbol="SelectProps" component="Select" />
`, "rc-select", demos, api);

    assert.match(page, /可搜索 — 按 disabled 状态过滤/);
    assert.ok(page.indexOf("## 示例") < page.indexOf("### 何时使用"));
    assert.ok(page.indexOf("### 何时使用") < page.indexOf("## API"));
    assert.match(page, /<API source="\.\.\/_generated_api\/rc-select\.ts" symbol="SelectProps"/);
    assert.doesNotMatch(page, /ComponentApi/);
});

test("Demo 标题、描述和分组写入 Wake 可提取的静态标题", () => {
    const metadata = createDemoSearchMetadata([{
        title: "基础用法",
        description: "支持键盘操作与 { label, value } 数据",
        group: "基础能力",
    }]);
    assert.match(metadata, /#### 基础能力/);
    assert.match(metadata, /##### 基础用法 — 支持键盘操作与 （ label, value ） 数据/);
    assert.doesNotMatch(metadata, /[{}]/);
    assert.doesNotMatch(metadata, /Demo 搜索索引/);
    assert.match(metadata, /hidden aria-hidden="true"/);
});

test("API source 必须存在且位于组件 src 目录", async () => {
    const componentDirectory = path.join(temporaryDirectory, "rc-fixture");
    const docsDirectory = path.join(componentDirectory, "docs");
    const sourceDirectory = path.join(componentDirectory, "src");
    const canonicalMdxPath = path.join(docsDirectory, "index.mdx");
    const sourcePath = path.join(sourceDirectory, "types.ts");
    await mkdir(docsDirectory, { recursive: true });
    await mkdir(sourceDirectory, { recursive: true });
    await writeFile(sourcePath, "export interface Props {}\n", "utf8");

    assert.equal(
        await resolveApiSourcePath(componentDirectory, canonicalMdxPath, "../src/types.ts"),
        sourcePath,
    );
    await assert.rejects(
        resolveApiSourcePath(componentDirectory, canonicalMdxPath, "../outside.ts"),
        /必须位于组件 src 目录内/,
    );
    await assert.rejects(
        resolveApiSourcePath(componentDirectory, canonicalMdxPath, "../src/missing.ts"),
        /不存在或无法读取/,
    );
});

test("检查模式报告孤儿 API，生成模式删除孤儿 API", async () => {
    const directory = path.join(temporaryDirectory, "orphan-api");
    const orphan = path.join(directory, "removed-component.ts");
    await mkdir(directory, { recursive: true });
    await writeFile(orphan, "export interface RemovedProps {}\n", "utf8");

    const drift = [];
    await removeOrphanGeneratedFiles(directory, new Set(), drift, true);
    assert.ok(drift.some((file) => file.endsWith("removed-component.ts")));
    await access(orphan);

    await removeOrphanGeneratedFiles(directory, new Set(), [], false);
    await assert.rejects(access(orphan), { code: "ENOENT" });
});

const lesson = {
    id: "rc-example", title: "组件教程", summary: "学习受控状态", prerequisite: "了解 useState",
    steps: [1, 2].map(number => ({ id: `step-${number}`, title: `第 ${number} 步`, goal: "读取状态", why: "单一数据来源", instruction: "点击按钮", expected: "结果增加", changes: ["连接 onClick"], source: `rc-example/step-${number}.tsx` })),
    faq: [{ question: "如何重置？", answer: "点击重置当前示例。" }],
};

const guide = {
    definition: "示例组件帮助初学者理解一项完整能力，并通过运行结果、源码和接口说明建立从概念到实现的联系。",
    useWhen: ["需要完成一项明确的界面任务并复用组件行为。", "需要通过受控状态把组件与业务数据连接起来。"],
    avoidWhen: ["已有更符合任务语义的组件时，不要只因为外观相似而替换。"],
    essentials: ["先理解组件负责什么，再选择属性。", "受控状态与变更事件保持单一数据来源。", "默认、错误、禁用和窄屏状态都要检查。"],
    accessibility: ["组件必须有可访问名称和清楚的键盘路径。", "状态不能只靠颜色表达，焦点必须始终可见。"],
    material: {
        basis: "示例以 Material Design 3 的组件职责和状态规则为设计依据。",
        m3: "https://m3.material.io/components",
        web: "https://material-web.dev/components/",
        source: "https://github.com/material-components/material-web",
    },
};

test("组件新手指南要求完整场景、概念、无障碍和官方依据", () => {
    validateComponentGuide(guide, "rc-example");
    assert.throws(() => validateComponentGuide({ ...guide, useWhen: ["太短"] }, "rc-example"), /useWhen/);
    const markup = componentGuideMarkup(guide);
    assert.match(markup, /### 适用场景/);
    assert.match(markup, /### 使用要点/);
    assert.doesNotMatch(markup, /设计参考|Material Web|https:\/\//);
});

test("教程要求完整步骤、唯一 ID 与互斥示例来源", () => {
    validateTutorial(lesson, "fixture");
    assert.throws(() => validateTutorial({ ...lesson, steps: [lesson.steps[0]] }, "fixture"), /2–6/);
    assert.throws(() => validateTutorial({ ...lesson, steps: [lesson.steps[0], lesson.steps[0]] }, "fixture"), /ID/);
    assert.throws(() => validateTutorial({ ...lesson, steps: [{ ...lesson.steps[0], expected: "" }, lesson.steps[1]] }, "fixture"), /expected/);
    assert.throws(() => validateTutorial({ ...lesson, steps: [{ ...lesson.steps[0], workbench: "basic.demo.tsx" }, lesson.steps[1]] }, "fixture"), /只能选择/);
});

test("源码必须独立并默认导出，拒绝隐藏辅助文件与无效语法", () => {
    const valid = 'import Button from "@crab-dev/rc-button"; export default function Example() { return <Button>保存</Button>; }';
    assertExampleImports(valid, "valid.tsx");
    for (const specifier of ["@crab-dev/rc-button/css/index.css", "@crab-dev/rc-theme/css/index.css", "./theme.css?inline"]) {
        assert.throws(() => assertExampleImports(`import "${specifier}"; ${valid}`, "styles.tsx"), /Wake 自动加载/);
    }
    for (const specifier of ["./helper.js", "@/helpers", "@@/helpers", "@crab-dev/rc-button/src/button.js", "@crab-dev/rc-button/esm/index.mjs"]) {
        assert.throws(() => assertExampleImports(`import X from "${specifier}"; export default X;`, "invalid.tsx"), /公开包入口/);
    }
    assert.throws(() => assertExampleImports("export const value = 1;", "missing.tsx"), /默认导出/);
    assert.throws(() => assertExampleImports("export default <", "broken.tsx"), /broken.tsx.*语法/);
});

test("生成数据保留实际源码，使用动态导入并防止路径越界", async () => {
    const root = path.join(temporaryDirectory, "tutorial-fixture");
    const content = path.join(root, ".website/content");
    const examples = path.join(root, ".website/docs/examples/rc-example");
    await mkdir(content, { recursive: true }); await mkdir(examples, { recursive: true });
    const source = 'import Button from "@crab-dev/rc-button";\r\nexport default function Example() { return <Button>保存</Button>; }\r\n';
    for (const step of lesson.steps) await writeFile(path.join(root, ".website/docs/examples", step.source), source);
    const recordPath = path.join(content, "rc-example.json");
    await writeFile(recordPath, JSON.stringify(lesson));
    const loaded = await loadTutorial(root, lesson.id);
    assert.ok(loaded.output.content.includes(JSON.stringify(source.replaceAll("\r\n", "\n"))));
    assert.match(loaded.output.content, /load: \(\) => import\("\.\.\/examples\/rc-example\/step-1\.js"\)/);
    assert.deepEqual(await validateTeachingInventory(root, [lesson]), { tutorials: 1, examples: 2 });
    await writeFile(path.join(examples, "unused.tsx"), source);
    await assert.rejects(validateTeachingInventory(root, [lesson]), /未关联步骤/);
    await writeFile(recordPath, JSON.stringify({ ...lesson, steps: [{ ...lesson.steps[0], source: "../outside.tsx" }, lesson.steps[1]] }));
    await assert.rejects(loadTutorial(root, lesson.id), /越界/);
});

test("教学步骤可搜索，隐藏索引不生成无效目录锚点", () => {
    const markup = tutorialMarkup(lesson);
    assert.match(markup, /data-docs-search-index="tutorial"/);
    assert.ok(markup.includes("结果增加"));
    assert.ok(!markup.includes("### 第 1 步"));
    const navigation = '[[group.section]]\ntitle = "基础"\npages = ["components/rc-example"]';
    const map = createLearningMap(navigation, [lesson], { "rc-example": "用于展示示例内容。" });
    assert.match(map, /用于展示示例内容/);
    assert.match(map, /\/components\/rc-example/);
});

test("教学文字中的 JSX 与表达式不会成为 MDX 运行代码", () => {
    const markup = tutorialMarkup({ ...lesson, faq: [{ question: "如何接入？", answer: "使用 <Router routes={routes} />，保留 A & B。" }] });
    assert.ok(markup.includes("&lt;Router routes=&#123;routes&#125; /&gt;"));
    assert.ok(!markup.includes("<Router"));
    assert.ok(markup.includes("A &amp; B"));
});

test("没有工作台演示时只展示一次教程，并保留原有说明和工作台入口", () => {
    const source = '+++\ntitle = "组件"\n+++\n\n# 组件\n\n[打开工作台](/components/rc-example/workbench/)\n\n## 何时使用\n\n原有说明。\n\n<Demos />\n';
    const page = createPage(source, "rc-example", [], null, lesson);
    assert.match(page, /<Tutorial tutorial=\{tutorial\} \/>/);
    assert.match(page, /\/components\/rc-example\/workbench\//);
    assert.match(page, /原有说明/);
    assert.equal((page.match(/<Tutorial /g) ?? []).length, 1);
    assert.doesNotMatch(page, /<FirstExample |<ComponentDemos |## 基础示例|## 全部示例/);
    assert.ok(page.indexOf("## 示例") < page.indexOf("## 使用说明"));
});

test("组件页连续展示唯一示例集，随后提供说明和 API，保留旧示例锚点", () => {
    const source = '+++\ntitle = "组件"\n+++\n\n# 组件\n\n[打开工作台](/components/rc-example/workbench/)\n\n## 何时使用\n\n原有说明。\n\n<Demos />\n';
    const demos = [{
        id: "docs/demos/basic.demo.tsx",
        title: "基础",
        description: "展示基础能力",
        learning: { components: ["Example"], props: [], events: [], hasState: false },
        sourceCode: "export default () => null;",
        previewPath: "/preview",
        workbenchPath: "/workbench",
        density: "regular",
        layout: "wide",
        group: null,
    }];
    const page = createPage(source, "rc-example", demos, { symbol: "ExampleProps", component: "Example" }, lesson, [], guide);
    assert.equal((page.match(/<ComponentDemos /g) ?? []).length, 1);
    assert.doesNotMatch(page, /<FirstExample |<Tutorial |## 基础示例|## 全部示例|## 组件入门|<details>/);
    assert.match(page, /id="基础示例"/);
    assert.match(page, /id="全部示例"/);
    assert.match(page, /基础 — 展示基础能力/);
    assert.match(page, /原有说明/);
    assert.match(page, /### 无障碍/);
    assert.ok(page.indexOf("## 示例") < page.indexOf("## 使用说明"));
    assert.ok(page.indexOf("## 使用说明") < page.indexOf("## API"));
});

test("孤儿教学页面只清理生成文件，保留手写实战入口", async () => {
    const directory = path.join(temporaryDirectory, "orphan-lessons");
    await mkdir(directory, { recursive: true });
    const manual = path.join(directory, "index.mdx");
    const orphan = path.join(directory, "practice-old.mdx");
    await writeFile(manual, "# 实战入口\n");
    await writeFile(orphan, "{/* THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY. */}\n");
    await removeOrphanGeneratedFiles(directory, new Set(), [], false);
    assert.equal(await readFile(manual, "utf8"), "# 实战入口\n");
    await assert.rejects(access(orphan), { code: "ENOENT" });
});

test("首页关键代码与完整源码来自同一运行文件，缺少标记时拒绝生成", async () => {
    const root = path.join(temporaryDirectory, "home-fixture");
    const directory = path.join(root, ".website/docs/examples/home");
    await mkdir(directory, { recursive: true });
    const source = 'export default function Example() { return <>\n{/* home-source:start */}\n    <span>实际运行内容</span>\n{/* home-source:end */}\n</>; }\n';
    await writeFile(path.join(directory, "profile.tsx"), source);
    const output = await createHomeExample(root);
    assert.ok(output.content.includes(JSON.stringify(source)));
    assert.ok(output.content.includes(JSON.stringify("<span>实际运行内容</span>")));
    await writeFile(path.join(directory, "profile.tsx"), "export default function Example() { return null; }");
    await assert.rejects(createHomeExample(root), /缺少源码展示标记/);
});

test("站点、教学示例和预览组件不得另写库中已有的基础交互控件", async () => {
    for (const root of [
        new URL("../docs/site/", import.meta.url),
        new URL("../docs/examples/", import.meta.url),
        new URL("../../components/rc-component-preview/src/", import.meta.url),
    ]) {
        const files = (await readdir(root, { recursive: true })).filter(file => file.endsWith(".tsx") && !file.includes("__tests__"));
        for (const file of files) {
            const source = await readFile(new URL(file.replaceAll("\\", "/"), root), "utf8");
            const ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
            const styles = new Set(ast.program.body.flatMap(statement => {
                if (statement.type === "VariableDeclaration") return statement.declarations.map(item => item.id.name);
                if (statement.type === "ImportDeclaration") return statement.specifiers.map(item => item.local.name);
                return [];
            }));
            function visit(node) {
                if (!node || typeof node !== "object") return;
                if (node.type === "JSXAttribute" && node.name.name === "className" && node.value?.type === "JSXExpressionContainer") {
                    const value = node.value.expression;
                    if (value.type === "Identifier" && value.name.endsWith("Style")) {
                        assert.ok(styles.has(value.name), `${file}: 样式引用 ${value.name} 没有定义`);
                    }
                }
                if (node.type === "JSXOpeningElement" && node.name.type === "JSXIdentifier") {
                    assert.ok(!["button", "input", "select", "textarea", "dialog"].includes(node.name.name), `${file}: 使用 Crab UI 组件替代 <${node.name.name}>`);
                    assert.ok(!node.attributes.some(attribute => attribute.name?.name === "data-mini"), `${file}: 不得手画组件缩略图`);
                }
                for (const value of Object.values(node)) {
                    if (Array.isArray(value)) value.forEach(visit);
                    else if (value && typeof value === "object") visit(value);
                }
            }
            visit(ast);
        }
    }
});

test("Demo 学习说明从实际组件、属性、事件和状态中提取", () => {
    const source = `
import Button from "../../src/index.js";
import { useState } from "react";
export default function Demo() {
    const [selected, setSelected] = useState(false);
    return <Button appearance="primary" isSelected={selected} onClick={() => setSelected(true)}>保存</Button>;
}`;
    assert.deepEqual(extractDemoLearning(source, "button.demo.tsx"), {
        components: ["Button"],
        props: ["appearance", "isSelected", "onClick"],
        events: ["onClick"],
        hasState: true,
    });
});

test("Radio 页面保留 Radio 和 RadioGroup 两个 API", () => {
    const source = '+++\ntitle = "Radio 单选框"\n+++\n\n# Radio 单选框\n\n[打开工作台](/components/rc-radio/workbench/)\n\n<Demos />\n';
    const page = createPage(source, "rc-radio", [], { symbol: "RadioProps", component: "Radio" }, lesson);
    assert.doesNotMatch(page, /<FirstExample /);
    assert.match(page, /symbol="RadioProps"/);
    assert.match(page, /symbol="RadioGroupProps"/);
    assert.match(page, /\/components\/rc-radio\/workbench\//);
});

test("组件概览保留分类锚点与入口，为每张卡片提供用途介绍与对应示意图", () => {
    const navigation = '[[group.section]]\ntitle = "基础能力"\npages = ["components/rc-tools"]\n[[group.section]]\ntitle = "输入与操作"\npages = ["components/rc-example"]';
    const records = [{ ...lesson, id: "rc-tools", title: "Global Tokens 设计基元" }, { ...lesson, title: "Example 示例" }];
    const descriptions = { "rc-example": "示例组件的用途。", "rc-tools": "设计基础值。" };
    const map = createLearningMap(navigation, records, descriptions);
    assert.match(map, /description = "2 个组件与工具包/);
    assert.ok(map.indexOf("## 输入与操作") < map.indexOf("## 基础能力"));
    assert.equal((map.match(/^## /gm) ?? []).length, 2);
    assert.doesNotMatch(map, /<CatalogItem \{\.\.\./);
    const entries = [...map.matchAll(/^<CatalogItem item=\{(.+)\} \/>$/gm)].map(match => JSON.parse(match[1]));
    assert.deepEqual(entries.map(item => item.href), ["/components/rc-example", "/components/rc-tools"]);
    assert.deepEqual(entries[1], { href: "/components/rc-tools", name: "Global Tokens", label: "设计基元", description: descriptions["rc-tools"], preview: "rc-tools" });
    assert.ok(entries.every(item => !Object.hasOwn(item, "steps")));
    assert.throws(() => createLearningMap(navigation, records, {}), /组件概览缺少 rc-example 的用途介绍/);
    assert.throws(() => createLearningMap(navigation, [lesson]), /学习地图缺少 rc-tools/);
});

test("全部组件概览都有用途介绍和唯一的静态示意图，示意图不产生交互或额外焦点", async () => {
    const navigation = await readFile(new URL("../docs/navigation.toml", import.meta.url), "utf8");
    const ids = [...navigation.matchAll(/"components\/(rc-[^"]+)"/g)].map(match => match[1]).sort();
    const descriptions = JSON.parse(await readFile(new URL("../content/catalog/overview.json", import.meta.url), "utf8"));
    assert.deepEqual(Object.keys(descriptions).sort(), ids);
    assert.ok(Object.values(descriptions).every(value => typeof value === "string" && value.length >= 16 && !value.includes(" → ")));
    const artworkRoot = new URL("../docs/site/catalog/", import.meta.url);
    const artworkIds = [];
    for (const file of (await readdir(artworkRoot)).filter(name => name.endsWith(".tsx"))) {
        const source = await readFile(new URL(file, artworkRoot), "utf8");
        const ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
        function visit(node) {
            if (!node || typeof node !== "object") return;
            if (node.type === "ObjectProperty" && node.key.type === "StringLiteral" && node.key.value.startsWith("rc-")) artworkIds.push(node.key.value);
            if (node.type === "JSXOpeningElement" && node.name.type === "JSXIdentifier") {
                const tag = node.name.name;
                if (/^[a-z]/.test(tag)) assert.ok(["svg", "g", "rect", "circle", "path", "text"].includes(tag), `${file}: 概览插图只允许静态 SVG`);
                assert.ok(!node.attributes.some(attribute => /^on[A-Z]|^tabIndex$/.test(attribute.name?.name)), `${file}: 概览插图不能产生交互或焦点`);
            }
            for (const value of Object.values(node)) {
                if (Array.isArray(value)) value.forEach(visit);
                else if (value && typeof value === "object") visit(value);
            }
        }
        visit(ast);
    }
    assert.deepEqual(artworkIds.sort(), ids);
    const preview = await readFile(new URL("preview.tsx", artworkRoot), "utf8");
    assert.match(preview, /aria-hidden="true"/);
    assert.match(preview, /focusable="false"/);
});

test("站点样式模板的 CSS 规则保持完整，不让无效闭括号吞掉后续选择器", async () => {
    const source = await readFile(new URL("../docs/site/siteStyles.ts", import.meta.url), "utf8");
    const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
    const stylesheet = ast.program.body.find(node => node.type === "ExpressionStatement"
        && node.expression.type === "TaggedTemplateExpression"
        && node.expression.tag.name === "globalStyle");
    assert.ok(stylesheet, "Missing global stylesheet");
    const css = stylesheet.expression.quasi.quasis.map(part => part.value.cooked).join("0");
    let depth = 0;
    for (const character of css) {
        if (character === "{") depth += 1;
        if (character === "}") depth -= 1;
        assert.ok(depth >= 0, "Unexpected closing CSS brace");
    }
    assert.equal(depth, 0, "Unclosed CSS rule");
});

test("全局令牌目录完整覆盖原始定义并保留非标准键和零值", async () => {
    const source = await readFile(new URL("../../components/rc-token-global/token.toml", import.meta.url), "utf8");
    const entries = readGlobalTokens(source);
    const declared = [...source.slice(source.indexOf("[token]")).matchAll(/^([\w.-]+)\s*=/gm)].map(match => match[1]);
    assert.deepEqual(entries.map(entry => entry.key), declared);
    assert.equal(entries.filter(entry => entry.group === "colors").length, 117);
    assert.ok(entries.filter(entry => entry.key.startsWith("material.")).every(entry => entry.group === "colors"));
    const purple = entries.filter(entry => entry.key.startsWith("purple."));
    assert.deepEqual(purple.map(entry => entry.key), ["10", "20", "30", "40", "80", "90", "100"].map(tone => `purple.${tone}`));
    assert.ok(purple.every(entry => entry.group === "colors" && entry.expression === `globalToken.purple["${entry.key.split(".")[1]}"]`));
    assert.equal(entries.find(entry => entry.key === "z-index.10").value, "1000");
    assert.equal(entries.find(entry => entry.key === "space.0-5").expression, 'globalToken.space["0-5"]');
    assert.equal(entries.find(entry => entry.key === "opacity.0").value, "0");
    const generated = createTokenReferenceData(source);
    parse(generated, { sourceType: "module", plugins: ["typescript"] });
    assert.match(generated, /--token-global-font-family-sans: initial;/);
    assert.notEqual(generated, createTokenReferenceData(source.replace('space.0   = "0px"', 'space.0   = "1px"')));
    assert.throws(() => readGlobalTokens('[token]\nspace.0 = "0px"\nspace.0 = "1px"'), /Duplicate/);
    assert.throws(() => readGlobalTokens('[token]\nspace.0 = 0'), /unsupported syntax/);
    assert.throws(() => readGlobalTokens('[token]\nunknown.0 = "0"'), /Unmapped/);
    assert.equal(readGlobalTokens('[build]\nprefix = "custom"\n[token]\nspace.0 = "0px"')[0].variable, "--custom-space-0");
});

test("全局令牌参考页保留章节层级与原有示例锚点且不重复包装", async () => {
    const source = await readFile(new URL("../../components/rc-token-global/docs/index.mdx", import.meta.url), "utf8");
    const page = createPage(source, "rc-token-global", [], null, {});
    assert.equal((page.match(/^## 基础示例$/gm) ?? []).length, 1);
    assert.equal((page.match(/<TokenReference group=/g) ?? []).length, 8);
    assert.match(page, /^## 三层令牌与主题$/m);
    assert.doesNotMatch(page, /## 使用说明|FirstExample|token-reference:/);
    assert.match(page, /<Tutorial tutorial=\{tutorial\} \/>/);
    assert.match(page, /<ComponentDemos demos=\{demos\} \/>/);
});

let passed = 0;
try {
    for (const testCase of tests) {
        await testCase.run();
        passed += 1;
        console.log(`✓ ${testCase.name}`);
    }
    console.log(`生成器测试完成：${passed} 项通过。`);
} finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
}
