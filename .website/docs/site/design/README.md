# Crab Design Language v1

访问文档站 `/design/language`，或在 `.website` 中运行 `yarn build`、`yarn preview` 后打开 `http://127.0.0.1:4173/design/language`。

## 维护方式

- `../ui.tsx` 在所有页面保留共用顶部导航、搜索、移动导航与主题切换；`/design/*` 使用设计语言专属侧栏，桌面与手机导航只显示设计章节。组件和指南继续显示各自的文档目录，路由与浏览器前进后退由 Wake 管理。
- 顶部栏目入口为“设计语言”和“组件”；开发指南通过文档侧栏、搜索或原地址访问。
- 公共 L1 `rc-token-global/token.toml` 保存 Purple 七档，L2 `rc-token-semantic/src/theme.ts` 维护明暗配对，`rc-theme` 输出 CSS。`../palette.ts` 只映射站点展示别名；`../paletteStyles.ts` 仅绑定站点专用变量。旧 8% / 12% 是参考参数，不再决定主题状态。公共默认变化见质量审查迁移说明。
- `tokens.ts` 集中管理样板尺寸、密度、排版及迁移候选，并复用站点色板；所有参数通过 Crab CSS `defineTokens` 声明，保证跨模块静态求值。
- `styles.ts` 只覆盖 `.crab-language[data-theme]` 和 `.crab-language-overlay[data-theme]`。规范内容与业务样板使用同一组参数。
- `preview.tsx` 提供共用样板边界、主题与密度控制；主题与文档站顶部共用 Wake 状态。密度在每个章节内生效，进入新章节默认为标准；脱离站点上下文时，主题由组件本地管理。
- 详细规范写在 `docs/design/*.mdx`；章节中的目的、选型、结构、参数、状态、无障碍、禁例与验收步骤均为手写内容。七个现有展示组件继续承载交互样板，避免把长篇规范塞入 TSX。
- `language.tsx`（原则）、`color.tsx`（色彩）、`typography.tsx`（排版）、`interaction.tsx`（状态）和 `system.tsx`（令牌）提供可视化样板；`workbenchPage.tsx`、`formPage.tsx` 连接共用设置与业务组件。空间与形状已拆为独立 MDX 章节。
- `workbench.tsx` 复用 Table、AutoSizer、Select、Pagination 等真实组件。搜索按项目编号、名称、负责人匹配，空白与大小写宽容；分页与筛选会清空选择。
- `profile.tsx` 复用 Form、Drawer、Dialog；使用 Transition 管理模拟保存。姓名与邮箱必填，规范化后回写摘要，失败保留草稿，未保存退出需确认。
- 下拉通过现有最近 `data-theme` 边界挂载机制继承样板参数；原生 Drawer / Dialog 在各自节点设置相同主题和密度。
- 独立工作台通过各包 `docs/theme.css` 导入 `rc-theme/docs/workbench.css`，该适配文件复用公共主题构建 CSS，并把预览的前景、表面绑定到 L2。先构建公共主题，再构建文档；不要在示例中复制品牌值。
- 十九个手写页面按下表分类，侧栏顺序由 `docs/navigation.toml` 的六个 section 管理。新增章节需登记导航，不得移入生成的教程目录；原七个地址保持有效。
- 桌面右侧显示当前章节的二级标题目录，1280px 以下使用正文前可折叠目录。左侧负责选章节，页内目录负责定位段落；320px 使用设计语言目录抽屉。

## 章节分类

| 分类 | 独立文件（均位于 docs/design/） |
| --- | --- |
| 开始使用 | language.mdx：概览与设计原则 |
| 视觉基础 | color.mdx：色彩与主题；typography.mdx：字体与排版；layout.mdx：布局、间距与密度；shape.mdx：表面、层级与形状；icons.mdx：图标与信息表达；motion.mdx：动效与过渡 |
| 交互规则 | interaction.mdx：状态系统；accessibility.mdx：无障碍与键盘；content.mdx：界面文案与信息 |
| 组件规范 | actions.mdx：操作按钮；inputs.mdx：输入与选择；navigation.mdx：导航与定位；data-display.mdx：数据展示；overlays.mdx：浮层与对话；feedback.mdx：反馈与等待 |
| 业务模式 | workbench.mdx：数据工作台；forms.mdx：复杂表单 |
| 实施与维护 | tokens.mdx：令牌与实施 |

概览中链接 Material Web 官方色彩和按钮规范；文档站采用 v0.192 固定基准紫色，以 OKLCh 保存并校验 sRGB 等价性。Crab 的尺寸、密度与业务参数仍由本项目定义。无障碍章节链接 W3C 原文，区分 AA 要求、AAA 说明与项目更高的触控目标。规则、候选参数、后续迁移与样板已实现能力必须分清，不声称全库已迁移或完成完整 WCAG 认证。

## 后续迁移清单

| 阶段 | 工作 | 验收门槛 |
| --- | --- | --- |
| L1 基元层 | Purple 七档已纳入公共 L1，其他 137 项原值保留 | 等价性与迁移基线检查已通过；保持来源记录 |
| L2 语义层 | 品牌、焦点与选中明暗配对已统一；排版与密度候选继续评审 | 配对数值测试通过；组件最终组合和已有覆盖继续复测 |
| 基础控件 | Button、LineEdit、Select、Segmented、Pagination 统一尺寸、焦点、禁用与加载；减少 L3 字面量 | 状态矩阵与键盘交互通过；保持 Props 兼容 |
| 数据与容器 | Card、Table、Tag 统一形状、表面与数据行节奏 | 两种密度、窄屏滚动、选择与分页通过 |
| 浮层反馈 | DropdownContainer、Drawer、Dialog、Alert、Empty 统一浮层层级与状态表达 | 嵌套主题、焦点恢复、强制颜色和减少动态效果通过 |
| 文档与推广 | 增补各组件规范示例，保持文档站外壳与规范一致，评估其他业务产品的迁移 | 执行受影响包规定的生成、ESLint、测试与构建 |

当前工作已进入公共默认品牌与组件逐批修复阶段。Purple 与公共主题配对已经落实；没有增加 density Props，也没有改变依赖版本。完整组件审查、两轮生产复审和真实用户对照仍待完成，进度见[质量审查记录](../../../review/quality/README.md)。

## 详细规范的维护契约

十九个章节已按任务、结构、选型、规格来源、状态、边界、适配、正反例与验收深化。章节可按主题调整顺序，但不能只保留抽象原则。现有七个样板入口保持不变；新增文字用手写 MDX，不为文档说明增加交互实现。

### 规则强度和落实状态

- 必须 / 应 / 可描述约束强度；现有实现 / 设计要求 / 候选规格 / 待落实差距描述落实状态，两者分别记录。
- “现有实现”须附来源和作用域，不等于已经通过所有设备测试。
- 候选值写清用途、单位、消费者和待验证项；不得写成公共 API 或全库默认参数。
- 未落实要求保留为明确差距，不通过改写演示说明隐藏实现限制。

### 唯一解释位置

颜色配对归 color；字号、行高与数字归 typography；间距、尺寸、密度及重排归 layout；圆角、边界和阴影归 shape；状态组合归 interaction；焦点、标准等级与辅助技术验收归 accessibility；动效归 motion；任务等待和结果恢复归 feedback。业务与组件章节链接共性规则，只补充当前场景差异。

### 来源核对步骤

1. 核对 palette.ts、paletteStyles.ts、design/tokens.ts、design/styles.ts 和 siteStyles.ts，区分站点、样板与浮层。
2. 公共令牌读取 components/rc-token-global/token.toml、rc-token-semantic/token.toml 及对应组件 token.toml；不手改生成文件。
3. 能力读取具体组件类型和源码，再链接组件文档。部分 Props 与组件同文件声明，不能假设所有包都有 types.ts。
4. 异步与选择规则核对 workbench.tsx、profile.tsx、data.ts 和相关现有测试，区分默认路径、可注入失败与未来生产要求。
5. 外部标准核对 W3C / APG 官方原文，标明等级与例外；Material 固定色板仅提供参考来源，不承担 Crab 尺寸与业务规则。

### 需要持续保留的差异说明

样板正文为 14/22px，站点文章有自己的 16px 阅读基准；样板 36/28px 控件与 44/36px 数据行不构成公共 density API。Dialog / Drawer 的 JavaScript 进退场参数与通用 motion 映射分别记录。姓名样板的计数使用字符串 length，表单错误在提交时重新校验；工作台未提供排序、批量操作和真实网络竞争。统一图标、全局离开保护和完整辅助技术审计仍是后续工作。

### 验证与交付记录

纯文档运行 `yarn check:docs`、`yarn test:generator`、`yarn build`，检查导航地址和页面交叉链接；生产预览检查 320、768、1440px 及明暗主题的标题、长表格、样板和目录。测试已有失败单独列出，未实测的读屏、系统强制颜色或文字缩放不能标为通过。

不为 MDX 内容镜像新增组件单元测试。纯文档任务不调整公共组件、主题、令牌或依赖；用户明确授权公共质量迁移时，组件改动执行对应包验证，并记录默认视觉变化、兼容范围及生成来源。维护记录放在 `.website/review/`，记录完成章节、验证命令、浏览器条件、发现的差距与验证边界。
