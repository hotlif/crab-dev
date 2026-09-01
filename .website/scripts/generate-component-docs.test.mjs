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

test("生成的 API 适配接口可解析，并由 Wake 原生 API 建立属性索引", () => {
    const api = {
        component: "Select",
        symbol: "SelectProps",
        searchSymbol: "SelectPropsSearchIndex",
        props: [{
            name: "onChange",
            required: false,
            description: "值变化回调",
            typeText: "((value: string) => void) | ((value: string[]) => void)",
            defaultValue: null,
            deprecated: false,
        }],
    };
    const source = createSearchableApiSource(api);
    assert.match(source, /interface SelectPropsSearchIndex/);
    assert.match(source, /"onChange"\?: \(\(value: string\) => void\)/);

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
    assert.match(metadata, /hidden aria-hidden="true"/);
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
