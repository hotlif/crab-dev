# crab-dev 工作入口

本仓库交付 React 19 组件库、设计基础、可选集成和文档工具。产品清单以 `library.manifest.json` 为准，不扩展为应用开发平台。

## 按任务进入

先运行 `yarn ai:context <包名或仓库相对路径>`，只查看路径、来源和命令；`--json` 提供结构化结果，`--dependents` 补充直接使用方。根目标 `.` 返回全局导航。再按任务读取相关正文，不预先通读所有指南和技能。

| 任务 | 工作入口 |
| --- | --- |
| 组件行为、类型、样式 | [组件规则](components/AGENTS.md)，再读目标包及目标文件祖先目录的 AGENTS.md |
| 文档、Demo、教学示例 | [网站规则](.website/AGENTS.md)、[来源与生成导航](.website/README.md) |
| 工程脚本、命令契约 | [脚本规则](scripts/AGENTS.md) |
| 令牌、产品清单、验证、发布 | [任务技能索引](.agents/README.md)，只加载匹配技能 |

[里程碑](MILESTONE.md)、`.reports/` 和 `.website/review/` 是历史资料，按证据需求显式查询，不作为默认任务上下文或现行规范。

## 规则与唯一来源

- 用户明确要求优先于仓库约定。用户可见沟通默认使用中文；标识符和提交信息使用项目语言。
- 本文件约束全库；[组件规则](components/AGENTS.md)细化组件实现，[网站规则](.website/AGENTS.md)细化文档与示例。子级规则只补充适用范围，不得悄悄放宽公共契约。
- [项目技能](.agents/skills/)按任务给出可执行流程（组件、令牌、文档、清单、验证、发布）。技能只写做法，公共约束仍以本文件和子级规则为准；冲突时服从规则并修正技能。
- 可维护规范入口：[库架构](.website/docs/guides/library-architecture.mdx)、[公共 API](.website/docs/guides/public-api.mdx)、[设计体系](.website/docs/guides/design-styles.mdx)、[尺寸与密度](.website/docs/guides/component-sizing.mdx)、[贡献维护](.website/docs/guides/contributing.mdx)和[迁移指南](.website/docs/guides/migration.mdx)。历史审查不是当前规范。
- 产品名称、六个能力族、用途分类、生命周期和设计覆盖只维护于 `library.manifest.json`；工程版本、依赖与导出只维护于各包 `package.json`。文档和生成器不得重复固定包数或 Demo 数。
- 公共配置为 `designSystem`、`colorMode`、`brandColor`、`size`、`density`、`locale`、`direction` 与继承最近边界的 `nonce`；根默认 `md3 / light / medium / standard / zh-CN / ltr`，nonce 未提供。设计体系仅 `md3` / `apple` / `shadcn`。旧接口一次切换，仅浏览器历史偏好允许迁移旧设计 ID。

## 工作边界

- 保留用户已有改动，只修改任务所需内容。生成文件不得手改；源与对应生成产物一起交付。
- 先确认影响面，按规范选择最小充分验证；报告真实结果及未验证范围。测试、构建、截图和人工评审不能互相替代。
- 视觉验收绑定实际源码与构建产物，逐组件记录设计、明暗、尺寸及适用状态。失败原图和采集前提错误分别保留；源码修复后建立新候选证据，未实际核对的范围保持 `partial`。
- Windows 使用 PowerShell 7+，Linux / macOS 使用匹配的 POSIX shell；不得混用变量、重定向和文件操作语法。搜索优先 `rg`；跨平台脚本使用 Node 文件 API。
- 不将 `.tmp/`、`.cache/`、`.turbo/`、`.wake/`、`coverage/`、`esm/`、`cjs/`、`declarations/`、`css/` 当作源码。保留审查历史，不擅自清理。

## 工程基线

- Node.js ≥ 22，Corepack 使用根 `packageManager` 指定的 Yarn 4 PnP；不得创建或依赖 `node_modules`。提交 PnP 运行时与 lockfile，安装后验证一致性。
- 全仓 ESM，包声明 `type: module`；相对 TS/TSX 导入写 `.js`，内部依赖使用 `workspace:^`。
- 实际使用 React / ReactDOM 的公开包显式声明对应 `peerDependencies`，并保留开发依赖；严格 PnP 下独立消费不能依赖隐式 peer。
- Wake 与 Crab CSS 精确锁定 `0.1.45`。Wake 负责 lint、构建、令牌、docgen、测试和文档；Turbo 只编排真实包拓扑。
- TypeScript 统一使用官方 6.0.2 与 Yarn 内置 PnP 兼容补丁，继承共享预设并保持严格模式；升级同步依赖、lockfile、PnP 运行时和编辑器 SDK。不自构建编译器。React 19 / Compiler、Crab CSS 和三层令牌的要求见组件规则。
- 依赖变化后刷新安装产物，再运行 `yarn install --immutable`；不可加载于 zip 的 ESM 依赖按实际需要标记 unplugged。

## 验证与发布

- 使用包内公开脚本。组件源变更至少 `lint` + `typecheck` + `test`；包在 `crab.requiredChecks` 登记的附加测试也必须通过，可由包内 `check` 或根 `test:required` 执行。令牌变更另跑 `generate:token` 与令牌契约；构建/导出变更另跑 `build:library`。
- 文档变更运行生成、漂移检查、生成器测试；运行界面变化另做站点检查与实际浏览器验收。全库整理以统一验证入口和同一提交的 CI 结果为准。
- 提交使用英文 Conventional Commits，不添加 `Co-Authored-By`。生成产物只能和触发它的源修改一起提交。
- 唯一版本流程为 Changesets：变更记录 → 自动版本 Release PR → 同一提交验证 → CI 发布。不得手动修改版本建立第二条流程，不得本地 publish。
- 例外必须就近说明理由、范围、兼容影响、验证和退出条件；公共规则变化同步实现、类型、文档、测试与迁移说明。
