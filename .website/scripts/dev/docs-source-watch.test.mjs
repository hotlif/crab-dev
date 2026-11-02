import assert from "node:assert/strict";
import { test } from "node:test";
import { isComponentDocsSource } from "./docs-source-watch.mjs";

test("增量生成监听文档、展示配置与真实源码，兼容 Windows 路径", () => {
    for (const source of [
        "rc-button/src/types.ts", "rc-hooks/src/useControllableState.ts", "rc-checkbox/src/group/group.tsx",
        "rc-button/docs/index.mdx", "rc-button/docs/presentation.json", "rc-button/docs/demos/basic.demo.tsx",
        "rc-button/public/docgen.json", "rc-button/package.json", "rc-button/token.toml",
    ]) {
        assert.equal(isComponentDocsSource(source), true, source);
        assert.equal(isComponentDocsSource(source.replaceAll("/", "\\")), true, source);
    }
});

test("测试、缓存和输出不触发文档循环生成", () => {
    for (const source of [
        "rc-button/src/token.ts", "rc-button/src/__tests__/button.test.tsx",
        "rc-button/src/nested/__fixtures__/sample.ts", "rc-button/src/__fixtures__/sample.tsx",
        "rc-button/esm/index.js", "rc-button/css/index.css", "rc-button/.wake/types.ts",
        "rc-button/docs/button.visual.spec.mjs", "rc-button/coverage/result.ts", "rc-button/package.json.bak",
    ]) assert.equal(isComponentDocsSource(source), false, source);
});
