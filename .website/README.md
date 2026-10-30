# 组件库文档与工作台

本工作区服务 Crab UI 的组件查阅、设计规范、可运行示例、迁移与维护。工程版本以 package.json 为准；工具职责和约束见根 AGENTS 与本目录 AGENTS。

## 编辑入口

在仓库根运行 `yarn ai:context <包名或相对路径>`，定位本次任务的规则、编辑来源、生成物及公开检查命令。`--json` 输出结构化数据；`--dependents` 列出直接使用方。查询只读，不执行列出的命令。

完整的“内容类型 → 编辑来源 → 生成物 → 验证命令”表统一维护于[贡献与维护：来源与生成](docs/guides/contributing.mdx#来源与生成)。组件 Demo 在包内维护，用于组件工作台；教学步骤代码在 `docs/examples/`，与 `content/` 的教学文字配对，不能把两类示例当作重复文件删除。

文档生成器派生六族导航、组件目录、覆盖矩阵、库存、聚合组件页、API 搜索数据和教程源码；示例数量按源文件统计，不固定阈值。根 README 的产品清单区域同样生成。禁止手改生成文件。

API 聚合使用官方 TypeScript API 读取真实类型源码；原始 docgen 和适配文件都由工具生成。生成入口只编排读取、类型提取、页面渲染与文件写入，具体模块位于 `scripts/generate/`。展示布局、预览密度、首屏示例和分组由各组件的 `docs/presentation.json` 提供；默认 `wide / regular`，引用的 Demo 必须存在且不能重复分组。

## 设计与运行边界

设计、主题和预览配置的公共约定见 [设计体系](docs/guides/design-styles.mdx)和[站点规则](AGENTS.md)。站点样式使用公共令牌，不覆盖 Wake 私有类或真实示例的控件样式。

## 开发与检查

仓库根 yarn docs:dev 先构建库，再启动增量文档；产品清单、正文、Demo、真实类型源码、教学文字和运行文件变化时重新生成。修改 UI 或加载配置后重启开发服务。

在本工作区运行 generate:docs、check:docs、test:generator、lint、typecheck、test、build。构建成功后 preview 在本机 4173 提供生产预览。子路径使用 DOCS_PREVIEW_DIR、DOCS_PREVIEW_BASE、DOCS_PREVIEW_PORT 配置，并遵循当前 shell 语法。

浏览器验收覆盖适用的三体系、明暗、尺寸/密度、320/768/桌面、长内容、键盘与焦点、触控、强制颜色和减少动画。配置、Portal 和消息测试不能替代组件逐状态视觉核对。

## 证据

review 保留历史，不作为现行规则或自动通过证明。新记录标明提交、产物、日期、范围、命令、结果和未验证项；正式规范维护于 guides。不得删除既有审查历史，也不得提交浏览器 profile、缓存和临时构建作为证据。
