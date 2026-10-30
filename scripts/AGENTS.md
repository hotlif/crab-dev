# 工程脚本维护入口

继承[根规则](../AGENTS.md)。从根 `package.json` 的公开脚本进入，不在任务说明中另造执行链。

| 职责 | 复用入口 |
| --- | --- |
| 产品清单和包定位 | [library-manifest.mjs](library-manifest.mjs) |
| 源码引用、生产/文档/令牌依赖 | [library-graph.mjs](library-graph.mjs) |
| 工作区脚本与附加检查 | [check-commands.mjs](check-commands.mjs)、[check-package.mjs](check-package.mjs) |
| Yarn 运行入口 | [package-manager.mjs](package-manager.mjs) |
| AI 路径查询 | [ai-context.mjs](ai-context.mjs) |

- 查询模块保持只读，不导入会立即执行生成、安装或检查的模块；命令只从真实 scripts 派生，不复制包清单或依赖图。
- 入口脚本与可测试函数分开；脚本内路径使用 Node 文件 API，子进程遵循现有跨平台调用方式。
- 根 `yarn lint:tools` 包含 lint、架构与 AI 上下文契约测试。定位时可单跑 `yarn test:ai-context`、`yarn test:architecture`；契约变动补正反案例。
- 文档生成器属于网站工作区，继续在 `.website/scripts/` 维护并按[文档技能](../.agents/skills/docs-change/SKILL.md)验证。
