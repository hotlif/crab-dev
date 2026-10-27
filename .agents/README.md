# 项目技能

本目录存放 crab-dev 的任务技能。DSH 从 `<项目根>/.agents/skills/<name>/SKILL.md` 发现项目技能（来源 `project-agents`）。

技能只回答“怎么做”：入口、真实命令、文件位置、验证与常见错误。规则仍以 [根规则](../AGENTS.md) 与子级 [组件规则](../components/AGENTS.md)、[网站规则](../.website/AGENTS.md) 为准；技能与规则冲突时服从规则，并修正技能。

## 技能目录

| 技能 | 用途 |
| --- | --- |
| [component-change](skills/component-change/SKILL.md) | 改或新增组件包，含文档、示例与包内检查 |
| [token-change](skills/token-change/SKILL.md) | L1/L2/L3 令牌与生成物、令牌契约 |
| [docs-change](skills/docs-change/SKILL.md) | 指南、组件文档站、示例与站点构建 |
| [library-inventory](skills/library-inventory/SKILL.md) | 产品清单与派生的任务拓扑、导航、覆盖矩阵 |
| [verify-change](skills/verify-change/SKILL.md) | 变更类型到最小充分验证、失败排查、结果报告 |
| [release-change](skills/release-change/SKILL.md) | changeset、提交信息与 CI 发布 |

## 新增技能

1. 建 `skills/<kebab-case>/SKILL.md`，目录名与 frontmatter `name` 一致。
2. frontmatter 必填 `name`（`^[a-z0-9]+(?:-[a-z0-9]+)*$`）与单行 `description`；`description` 写清触发条件，模型据此判断是否加载。
3. 可选 `whenToUse`、`user-invocable`、`disable-model-invocation`。
4. 正文从“何时使用”开始，给可复制的真实命令，指向规则文件而不是复述条文。
5. 命令以根、包或站点 `package.json` 的 `scripts` 为准；脚本改名时同步技能，不写不存在的命令。
6. 技能只描述流程，不定义新的公共契约；契约变化回到 AGENTS.md 与规范正文。

## 维护

- 三份 AGENTS.md 或 `package.json` 脚本变化时，检查相关技能是否仍然正确。
- 删除能力（如退役的本地技能）时一并删除目录，不保留空壳。
