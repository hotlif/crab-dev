# 工作流约束（命令 / 验收 / 提交）

> 本文件规定**常用命令、交付验收（Definition of Done）与提交规范**。措辞遵循 RFC 2119：
> **必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、**可 (MAY)**。
>
> **范围声明**：终端选择见 [`platform-scripts-constraints.md`](./platform-scripts-constraints.md)；
> 技术约束见 [`tech-stack-constraints.md`](./tech-stack-constraints.md)。

---

## §1 常用命令

**根目录（Turbo 编排全仓库）：**

| 命令 | 语义 |
|------|------|
| `yarn build:library` | 先构建 packify，再经 Turbo 拓扑构建全部库产物 |
| `yarn test` / `yarn lint` / `yarn typecheck` | Turbo 并行运行全部测试 / ESLint / 类型检查 |
| `yarn generate:token` | 为全部用令牌的包重新生成 `src/token.ts` |
| `yarn docs:dev` / `yarn docs:build` | 文档站开发 / 生产构建 |

**单包（在 `components/rc-*` 内）：** `yarn start`（开发服务器）、`build:library`、`eslint`、
`typecheck`、`generate:token`（从 `token.toml` 生成 `src/token.ts`）、`test`。

- 测试为 ESM 模式：`yarn test`；跑单个：`yarn test -- src/__tests__/x.test.tsx`
  或 `yarn test -- -t "用例名"`；
- 依赖变更后**必须**跑 `yarn install --immutable`。

---

## §2 交付验收（Definition of Done）

按**影响面**取最小命令集，**必须**全部通过且**不得**引入新告警：

| 影响面 | 必跑 |
|--------|------|
| 组件源码（`components/rc-*/src/**`） | `eslint` + `test` |
| 设计令牌（`token.toml` 或消费 `token.*`） | `generate:token` + `eslint` + `test` |
| 构建配置 / 导出边界 / Rollup / Webpack | `build:library` + `test` |
| `standards/*` 预设改动 | 选一个受影响下游包跑 `eslint` / `test` |
| `toolbox/*` 工具改动 | 根目录 `build:library` |

- 对外导出（`index.ts`）与类型导出**必须**保持一致；
- 所有生成文件**必须**为命令产物，非手改。

---

## §3 提交规范

- commit 消息**必须**使用**英文**书写（含 subject 与 body）；
- **必须**遵循 Conventional Commits：`<type>(<scope>): <subject>`；
- scope **应**用组件名 / 工具名（如 `feat(rc-table): ...`、`build(packify): ...`），
  跨工作区基础设施用 `repo` / `ci`；
- 一个 commit **应**只做一件事；生成文件**仅**在与其触发变更同一次 commit 中提交；
- **不得**在提交信息中添加 `Co-Authored-By` 行。
