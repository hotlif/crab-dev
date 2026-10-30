# AI 工作入口优化验收记录

- 日期：2026-10-27（Asia/Singapore）。
- 对比基线：`f10af97f48f9077ac87c545c44361e4a930e5789`；验收对象为本次未提交工作树。
- 范围：任务导航、规则归位、技能去重、只读查询及契约测试。记录属于历史证据，不是现行规范或持久化上下文快照。

## 文本量与读取边界

按 UTF-8 解码后的 JavaScript 字符长度计数，统一 LF；不是 token 数，不代表模型实际耗时或准确率。默认继承正文按目标祖先目录的 AGENTS 合计，不含按需指南、技能正文及查询输出。

| 场景 | 基线继承字符 | 本次继承字符 | 变化说明 |
| --- | ---: | ---: | --- |
| Button 行为 | 6489 | 6318 | 少加载 Form、字段定位及 Prose 专项细节 |
| Form 标签 | 6489 | 6759 | 加载 Form 专项入口及其测试定位，仍不加载 Prose 细节 |
| 语义令牌 | 6489 | 6318 | 通用规则与具体令牌任务分开 |
| 教学示例 | 3497 | 3996 | 根任务导航增加；网站规则未扩写 |
| 工程脚本 | 2402 | 3645 | 新增适用的共享模块和验证入口 |

`components/AGENTS.md` 从 4087 减至 3417 字符，约减少 16.4%；根规则增加任务导航后，普通组件的继承总量仅减少约 2.6%。不宣称所有场景都减少加载文本。

| 按需技能 | 基线字符 | 本次字符 |
| --- | ---: | ---: |
| component-change | 2303 | 1665 |
| docs-change | 1575 | 1134 |
| token-change | 1835 | 1740 |
| library-inventory | 1668 | 1480 |

组件技能约减少 27.7%。删去技能重复定义的包结构、React 实现、样式和示例约束，保留其权威规则链接及操作、验证步骤；产品字段改为引用清单与实际校验器。Form、DatePicker、Select、DropdownContainer、Prose 只增加确有专项约束的局部规则。

## 定位路径验收

旧入口需要人工串联包结构约定、来源表、包脚本和依赖读取器；现在以下每个任务先运行一次查询，即可同时拿到规则、编辑/测试入口、关联文档、生成物及命令，再读取需要的正文。这里比较结构上的入口步骤，不把人工搜索耗时虚构成性能数据。

| 任务 | 一次查询的目标 | 已核对的关键返回 |
| --- | --- | --- |
| Button 行为 | `rc-button` | 包内测试、check、组件 Demo 与教学来源分列，无 Form 专项继承 |
| Form 标签 | `components/rc-form/src/item.tsx` | Form 规则、包内测试、已登记 test:browser |
| 令牌 | `components/rc-token-semantic/token.toml` | token-change、包内生成命令、额外 density-geometry 生成物 |
| 教学示例 | `.website/docs/examples/rc-button/step-1.tsx` | 教学 JSON、独立运行文件、组件 Demo 和教程产物 |
| 工程脚本 | `scripts/check-library.mjs` | scripts/AGENTS、lint:tools、架构检查 |

补充核对：完整包名、简称、Windows 分隔符、根目标、JSON/帮助/错误退出、直接依赖角色、直接反向关系、嵌套规则继承、越界路径及符号链接、缺失可选文件、显式缓存/历史查询、生成令牌/docgen/API/教程/拓扑溯源、README 混合区域及产品清单派生产物。所有返回的检查命令均核对到真实包脚本；查询前后对相关源码、lockfile、PnP 与生成物内容做哈希比对。

## 验证结果

- `yarn lint:tools`：通过；lint 0 错误/0 警告，原有 lint 契约、18 项架构测试及新增 13 项上下文测试通过，无跳过。新增测试已串入既有本地与 CI 工具检查链。
- `yarn check:architecture`：通过，清单、命令契约及拓扑一致。
- 网站 `generate:docs`、`check:docs`：通过，均报告 0 个文件变化。
- 网站 `test:generator`：50 项通过。
- 根 `docs:build`：通过；组件库构建完成，Wake 文档构建完成（71 个路由），构建后扫描 1889 个生产 JavaScript 文件，0 个未绑定引用。产物位于 `.website/docs-dist/`，未提交构建目录。
- 五个修改技能的 `quick_validate.py`：通过。系统与内置 Python 均缺 PyYAML；仅在 `.tmp/ai-skill-validator` 安装校验依赖，不修改工程依赖。
- `git diff --check`：通过。

首次 `docs:build` 因系统临时目录 EPERM 失败；重试仅在该进程将 TEMP/TMP 指向仓库 `.tmp/ai-context-validation`，未改项目配置。构建包含 Turbo 缓存命中，不能宣称所有包均重新编译。

未执行根全量 `yarn check`、组件行为测试及浏览器视觉验收；本次不修改组件运行实现、样式或交互。尚无同提交 CI 结论。内部维护工具与规则整理不触发公开包版本，不创建 Changeset。

工作期间根 `package.json` 的 `@types/node` 从基线版本范围发生了本任务之外的变化；本次保留该变化，未修改依赖或安装产物。

## 源码指纹

SHA-256，覆盖查询入口、契约测试与来源导航正文；不把历史构建证据作为本次视觉通过证明。

| 来源 | SHA-256 |
| --- | --- |
| scripts/ai-context.mjs | `4d07626a60ce9372f856753e3ab07397b8e01fb315ca99e5571f4b6e1fec059d` |
| scripts/ai-context.test.mjs | `98c4d1766bf85a44db192f374870d64bfa6f1f2916f3190be487d28f489675e6` |
| .website/docs/guides/contributing.mdx | `9e5658d54f0333637f2b47bb082ee7b587204389f1db740826be5e0d5c69f9c1` |
