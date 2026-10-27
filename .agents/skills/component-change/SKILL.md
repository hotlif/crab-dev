---
name: component-change
description: 修改或新增 components/ 下的组件包时使用。覆盖包结构定位、公共 API 与 React 约定、样式与令牌接入、文档示例同步、包内 check、必跑浏览器检查与 changeset。用户报告某组件行为、可访问性或视觉问题，或要求新增变体时加载本技能。
---

# 组件改动

## 何时使用

- 在 `components/rc-*` 下新增包，或改现有组件的源码、类型、样式、测试、文档与示例。
- 判断一次组件改动需要跑哪些检查、要不要写 changeset。

不适用：只改 `.website/docs/guides/` 正文（用 [docs-change](../docs-change/SKILL.md)）、只改令牌值（用 [token-change](../token-change/SKILL.md)）。

## 先读

- [组件规则](../../../components/AGENTS.md)：实现约束。本技能只给流程，不复述条文。
- [公共 API](../../../.website/docs/guides/public-api.mdx)、[设计体系](../../../.website/docs/guides/design-styles.mdx)、[尺寸与密度](../../../.website/docs/guides/component-sizing.mdx)。
- 目标包 `package.json`：`crab.requiredChecks`、`crab.docsDependencies`、`peerDependencies`。

## 结构

1. 包在 `components/rc-<name>/`，`package.json#name` 为 `@crab-dev/rc-<name>`。
2. 源码 `src/{component}.tsx`、类型 `src/types.ts`、入口 `src/index.ts`、测试 `src/__tests__/`。
3. 文档 `docs/index.mdx`，示例 `docs/demos/*.demo.tsx`；`docs/preview.tsx`、`docs/theme.css` 按需存在。
4. `token.toml` 生成 `src/token.ts`；`wake library docgen` 生成 `public/docgen.json`。两者都是生成物。
5. `esm/`、`cjs/`、`declarations/`、`css/`、`coverage/`、`.wake/`、`.turbo/` 不是源码。

## 流程

1. 先 `git status`：保留工作区已有改动，只动任务相关文件。
2. 读实现与测试，确认导出面：主组件默认导出，类型、Hook、工具具名导出；跨包能力优先复用 `@crab-dev/rc-*` 并声明依赖。
3. 改实现，遵守 Rules of React：ref 是普通 prop、`use(Context)`、默认不手写 `memo` / `useMemo` / `useCallback`；例外就近写类别与原因。
4. 改样式：只动 `token.toml` 与静态 CSS；条件样式拆静态块并用 `cx()`；CSS 模板注释只用 `/* */`，不写 `//`。
5. 同步 `src/types.ts`、`src/index.ts`、文档与示例。API 表由类型与 docgen 生成，不手写。
6. 补测试：从具体源文件导入被测组件，API 来自 `@crab-dev/wake/test`；浮层、尺寸、动画用保留语义的最小替身。
7. 跑验证（见下表）；用户可感知变化补 changeset（[release-change](../release-change/SKILL.md)）。

## 验证

| 改动 | 至少运行 |
| --- | --- |
| 源码、类型、测试 | `yarn workspace @crab-dev/rc-<name> check` |
| 快速迭代 | `yarn workspace @crab-dev/rc-<name> lint`、`typecheck`、`test` |
| `token.toml` | 包内 `generate:token`、`yarn check:tokens`，再 `check` |
| 导出或依赖 | `yarn build:library`、`yarn check:exports`、`yarn check:consumer` |
| 新增 `test:*` 必跑项 | `yarn test:required`（`yarn test:required --list` 先看清单） |

`check` 共用 `scripts/check-package.mjs`：先按依赖闭包构建该包，再依次跑 `lint`、`typecheck`、`test`、`crab.requiredChecks` 登记的脚本；`rc-token-global` 追加令牌契约，私有包追加 `build`。提交前用它，单项命令只用于迭代。

登记的 browser、forced-colors 等检查不能用默认 DOM 测试替代；环境受限没跑时，报告写“未验证”，不写“通过”。

