---
name: library-inventory
description: 修改 library.manifest.json，新增或下线组件包，调整能力族、分类、生命周期或设计覆盖时使用。覆盖唯一来源边界、turbo.json 拓扑生成、站点导航与覆盖矩阵派生，以及 check:architecture 校验。清单与包不一致或拓扑过期时加载本技能。
---

# 产品清单

## 何时使用

- 新增或下线 `components/rc-*` 包，调整族、分类、`status` 或 `designCoverage`。
- `yarn check:architecture` 报清单与包不一致、命令契约失败或 `turbo.json` 过期。

## 唯一来源

`library.manifest.json` 维护 `schemaVersion`、`families`（六个能力族）、`categories`、`designSystems` 与 `packages`。

每个包条目的字段：`name`、`path`、`title`、`family`、`category`、`status`（`experimental` / `stable` / `deprecated`）、`designCoverage`（`md3` / `apple` / `shadcn` → `partial` / `verified` / `not-applicable`）。

包版本、依赖与导出只在各包 `package.json`。文档和生成器不得重复固定包数、族数或 Demo 数。

## 派生与校验

- `turbo.json` 由 `scripts/generate-library-tasks.mjs` 生成：任务输入输出与依赖拓扑，不要手改。
- 站点导航、组件目录、覆盖矩阵由 `.website/scripts/generate/generate-component-docs.mjs` 从清单与组件类型派生。
- 读取统一走 `scripts/library-manifest.mjs`；校验在 `scripts/check-library.mjs`（路径、族依赖方向、React peer、设计覆盖证据）；命令契约在 `scripts/check-commands.mjs`。

## 流程

1. 改清单与包本身；新包需要 workspace 依赖、`peerDependencies`、`crab` 配置、`docs/` 与 `src/` 结构（见 [component-change](../component-change/SKILL.md)）。
2. `yarn generate:architecture` 重写 `turbo.json`。
3. `yarn workspace @crab-dev/website generate:docs` 更新站点派生内容。
4. 校验 `yarn check:architecture`：清单校验 + 命令契约 + 拓扑 `--check` 比对。
5. 再跑 `yarn test:architecture`；包导出或依赖变化时补 `yarn build:library`、`yarn check:exports`、`yarn check:consumer`。
6. 同步迁移说明与规范正文；公共规则变化补测试与 changeset。

## 验证

| 改动 | 至少运行 |
| --- | --- |
| 清单字段 | `yarn check:architecture`、`yarn test:architecture` |
| 新包 | 上述 + 包内 `check` + `yarn build:library` |
| 拓扑 | `yarn generate:architecture` 后 `yarn check:architecture` |

