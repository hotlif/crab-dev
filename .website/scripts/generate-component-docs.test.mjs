import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
    createDemoSearchMetadata,
    createPage,
    createSearchableApiSource,
    normalizeApiProps,
    parseSourceApiProps,
    removeOrphanGeneratedFiles,
    resolveApiSourcePath,
} from "./generate-component-docs.mjs";

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "crab-docs-generator-"));
const tests = [];

function test(name, run) {
    tests.push({ name, run });
}

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
        searchSymbol: "SelectPropsSearchIndex",
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
        ],
    };
    const source = createSearchableApiSource(api);
    assert.match(source, /interface SelectPropsSearchIndex/);
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

[打开 Select 工作台](/components/rc-select/workbench/)

## 代码演示

<Demos glob="./demos/*.demo.tsx" />

## API

<API source="../src/types.ts" symbol="SelectProps" component="Select" />
`, "rc-select", demos, api);

    assert.match(page, /可搜索 — 按 disabled 状态过滤/);
    assert.match(page, /<API source="\.\.\/_generated_api\/rc-select\.ts" symbol="SelectPropsSearchIndex"/);
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
