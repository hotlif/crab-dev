---
name: component-change
description: 修改或新增 components/ 下的组件包时使用。覆盖包结构定位、公共 API 与 React 约定、样式与令牌接入、文档示例同步、包内 check、必跑浏览器检查与 changeset。用户报告某组件行为、可访问性或视觉问题，或要求新增变体时加载本技能。
---

# 组件改动

## 何时使用

- 在 `components/rc-*` 下新增包，或改现有组件的源码、类型、样式、测试、文档与示例。
- 判断一次组件改动需要跑哪些检查、要不要写 changeset。

不适用：只改 `.website/docs/guides/` 正文（用 [docs-change](../docs-change/SKILL.md)）、只改令牌值（用 [token-change](../token-change/SKILL.md)）。

## 流程

1. 查看 `git status`，运行 `yarn ai:context <目标包或文件>`；读取返回的继承规则、包内说明与已有测试。新增包先按[组件规则](../../../components/AGENTS.md)建结构，再用 [library-inventory](../library-inventory/SKILL.md)登记。
2. 确认导出面及调用方；仅接口变化时查[公共 API](../../../.website/docs/guides/public-api.mdx)，样式变化时查[设计体系](../../../.website/docs/guides/design-styles.mdx)与[尺寸密度](../../../.website/docs/guides/component-sizing.mdx)。
3. 改实现并补行为回归；类型、导出、组件正文与 Demo 随影响同步。测试 API 与替身要求见组件规则，不在本技能重述。
4. 涉及令牌使用 [token-change](../token-change/SKILL.md)，文档来源变化使用 [docs-change](../docs-change/SKILL.md)生成和检查；用户可感知变化按 [release-change](../release-change/SKILL.md)写 changeset。
5. 跑下表检查，报告实际范围和未验证项。

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

