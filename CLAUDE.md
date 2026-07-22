# CLAUDE.md

本文件是 Claude Code 在本仓库的行为入口。强约束全部拆分在 `.claude/rules/` 下，
均为 **MUST 级**，效力等同写入本文件。

> [!CAUTION]
> **思考语言约束（MUST，最高优先级）：** Claude 在推理、分析、规划（thinking）时**必须**
> 使用中文，此约束优先级高于一切。对用户的输出语言不受限制。

## 项目定位

React 19 企业级 UI 组件库 **Turbo Monorepo**：Yarn 4 PnP + 全仓 ESM（`"type": "module"`）
+ Linaria 零运行时样式 + 三层设计令牌，Node ≥ 22。工作区：`components/`（`@crab-dev/rc-*`）、
`standards/`（共享预设）、`toolbox/`（packify / crustify / lignify）、`.website/`（文档站，私有）。

## 规则文件（`.claude/rules/`，会话开始即加载，必须遵守）

@.claude/rules/tech-stack-constraints.md
@.claude/rules/component-constraints.md
@.claude/rules/design-principles-constraints.md
@.claude/rules/workflow-constraints.md
@.claude/rules/platform-scripts-constraints.md


| 文件 | 覆盖范围 |
|------|----------|
| [tech-stack-constraints.md](.claude/rules/tech-stack-constraints.md) | 技术栈与技术约束：运行环境 / Yarn PnP / ESM / **React 19 现代 API（含记忆化与 ref 例外）** / Linaria 零运行时 / 三层令牌 / Props 与类型 / 依赖管理（**含组件复用优先，禁止造轮子**） / 生成文件边界 |
| [component-constraints.md](.claude/rules/component-constraints.md) | 组件约定：目录布局 / `index.ts` 导出形态 / 测试约定 |
| [design-principles-constraints.md](.claude/rules/design-principles-constraints.md) | 组件设计原则：Norman《设计心理学》五核心——**示能 / 意符 / 映射 / 反馈 / 限制**，统摄于可发现性与概念模型，落地为可执行的交互与无障碍约束 |
| [workflow-constraints.md](.claude/rules/workflow-constraints.md) | 工作流：常用命令 / 交付验收（DoD）/ 提交规范 / 版本与发布 |
| [platform-scripts-constraints.md](.claude/rules/platform-scripts-constraints.md) | 按操作系统选终端：**Windows → PowerShell，Linux / macOS → shell（bash）** |

> 新增规则文件后，**必须**在本区块同步登记（`@import` 行 + 表格说明），以确保被加载；
> 删除规则文件时，**必须**同步移除其登记，避免残留失效条目。
