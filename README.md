# Crab UI

面向 React 19 的组件库，使用 Crab CSS 静态样式、三层令牌和统一公共接口。产品分为基础支撑、基础组件、组合组件、专业扩展、可选集成与开发支持；用途分类是独立的第二轴。

- [开始使用](.website/docs/guides/getting-started.mdx)、[组件库体系](.website/docs/guides/library-architecture.mdx)、[公共 API](.website/docs/guides/public-api.mdx)
- [三套设计体系](.website/docs/guides/design-styles.mdx)、[尺寸与密度](.website/docs/guides/component-sizing.mdx)、[迁移指南](.website/docs/guides/migration.mdx)
- [贡献与维护](.website/docs/guides/contributing.mdx)、[工具链](.website/docs/guides/toolchain.mdx)、[项目规则](AGENTS.md)

## 产品清单

<!-- library-inventory:start -->
当前产品清单包含 54 个包，按 6 个能力族组织。

| 能力族 | 包数 | 职责 |
| --- | --- | --- |
| 基础支撑 | 7 | 设计令牌、配置、通用状态和测量能力 |
| 基础组件 | 29 | 可独立使用的界面与交互基础 |
| 组合组件 | 10 | 复用基础组件组织字段、集合与布局 |
| 专业扩展 | 5 | 图形、复杂数据与文档编辑能力 |
| 可选集成 | 2 | 独立选择的路由与远程模块集成 |
| 开发支持 | 1 | 组件开发、演示与文档工具 |

**基础支撑**：[AutoSizer 自适应容器](components/rc-auto-sizer/docs/index.mdx) · [ConfigProvider 全局配置](components/rc-config-provider/docs/index.mdx) · [Hooks 通用钩子](components/rc-hooks/docs/index.mdx) · [Theme 主题样式](components/rc-theme/docs/index.mdx) · [Global Tokens 全局令牌](components/rc-token-global/docs/index.mdx) · [Semantic Tokens 语义令牌](components/rc-token-semantic/docs/index.mdx) · [Virtual 虚拟滚动](components/rc-virtual/docs/index.mdx)

**基础组件**：[Alert 警告提示](components/rc-alert/docs/index.mdx) · [Avatar 头像](components/rc-avatar/docs/index.mdx) · [Badge 徽标数](components/rc-badge/docs/index.mdx) · [Breadcrumbs 面包屑导航](components/rc-breadcrumbs/docs/index.mdx) · [Button 按钮](components/rc-button/docs/index.mdx) · [Card 卡片](components/rc-card/docs/index.mdx) · [Checkbox 复选框](components/rc-checkbox/docs/index.mdx) · [Dialog 对话框](components/rc-dialog/docs/index.mdx) · [Divider 分割线](components/rc-divider/docs/index.mdx) · [Drawer 抽屉](components/rc-drawer/docs/index.mdx) · [DropdownContainer 下拉容器](components/rc-dropdown-container/docs/index.mdx) · [Empty 空状态](components/rc-empty/docs/index.mdx) · [LineEdit 单行输入框](components/rc-line-edit/docs/index.mdx) · [Masonry 瀑布流](components/rc-masonry/docs/index.mdx) · [Menu 菜单](components/rc-menu/docs/index.mdx) · [Message 全局提示](components/rc-message/docs/index.mdx) · [Notification 通知提醒](components/rc-notification/docs/index.mdx) · [Prose 长文本排版](components/rc-prose/docs/index.mdx) · [Radio 单选框](components/rc-radio/docs/index.mdx) · [Segmented 分段控制器](components/rc-segmented/docs/index.mdx) · [Skeleton 骨架屏](components/rc-skeleton/docs/index.mdx) · [Slider 滑块](components/rc-slider/docs/index.mdx) · [Spin 加载中](components/rc-spin/docs/index.mdx) · [SplitPane 分栏面板](components/rc-split-pane/docs/index.mdx) · [Switch 开关](components/rc-switch/docs/index.mdx) · [Tabs 标签页](components/rc-tabs/docs/index.mdx) · [Tag 标签](components/rc-tag/docs/index.mdx) · [TextEdit 多行文本输入框](components/rc-text-edit/docs/index.mdx) · [Tooltip 文字提示](components/rc-tooltip/docs/index.mdx)

**组合组件**：[AppMainLayout 布局](components/rc-app-main-layout/docs/index.mdx) · [ColorPicker 颜色选择器](components/rc-color-picker/docs/index.mdx) · [CronPicker Cron 表达式选择器](components/rc-cron-picker/docs/index.mdx) · [DatePicker 日期选择器](components/rc-date-picker/docs/index.mdx) · [Form 表单](components/rc-form/docs/index.mdx) · [NumberEdit 数字输入框](components/rc-number-edit/docs/index.mdx) · [Pagination 分页](components/rc-pagination/docs/index.mdx) · [Select 选择器](components/rc-select/docs/index.mdx) · [Table 表格](components/rc-table/docs/index.mdx) · [Tree 树形控件](components/rc-tree/docs/index.mdx)

**专业扩展**：[BarChart 柱状图](components/rc-bar-chart/docs/index.mdx) · [Canvas WebGL 画布](components/rc-canvas/docs/index.mdx) · [FlowDiagram 流程图](components/rc-flow-diagram/docs/index.mdx) · [PdfEditor PDF 编辑器](components/rc-pdf-editor/docs/index.mdx) · [TablePro 高级表格](components/rc-table-pro/docs/index.mdx)

**可选集成**：[Realm 远程模块](components/rc-realm/docs/index.mdx) · [Router 路由](components/rc-router/docs/index.mdx)

**开发支持**：[ComponentPreview 组件预览](components/rc-component-preview/docs/index.mdx)

<!-- library-inventory:end -->

产品元数据只维护 library.manifest.json；工程版本、依赖与导出以各包 package.json 为准。目录、导航、数量和设计覆盖由同一清单生成，不维护另一套手写列表。生命周期与三体系覆盖分别记录。

## 设计与配置

设计体系为 MD3 Expressive（md3，默认）、Apple（apple）和 shadcn/ui（shadcn）。Apple 是依据 Apple 原则自主实现的 Web 设计，不复刻特定 macOS 版本。设计体系、明暗、品牌、尺寸和密度独立设置。

```tsx
<ConfigProvider designSystem="md3" colorMode="light" size="medium" density="standard">
    <App />
</ConfigProvider>
```

值控件采用 value/defaultValue/onValueChange，布尔控件采用 checked/defaultChecked/onCheckedChange；原生 onChange 保留 DOM 事件。此次公共接口一次切换，旧设计 ID 只在浏览器存储偏好入口迁移。

## 工作区与工具

AI 维护从 `yarn ai:context <包名或仓库相对路径>` 进入，例如 `yarn ai:context rc-button`。查询只列适用规则、编辑来源、生成物与验证命令；使用 `--json` 获取结构化结果，`--dependents` 查看直接使用方。完整任务入口见 [AGENTS.md](AGENTS.md)，来源与生成导航见[贡献与维护](.website/docs/guides/contributing.mdx#来源与生成)。

| 位置 | 职责 |
| --- | --- |
| components/ | 组件、设计基础、可选集成与开发支持包 |
| standards/ | 共享 TypeScript 配置及历史 ESLint 消费兼容接口 |
| .website/ | 组件库规范、查阅、示例与工作台 |
| scripts/ | 产品清单、拓扑与工程契约检查 |

Node.js ≥ 22，通过 Corepack 使用根 packageManager 指定的 Yarn 4 PnP；不创建 node_modules。类型检查使用官方 TypeScript 6.0.2，编辑器通过 `yarn generate:sdk` 接入 Yarn PnP。Wake 负责 lint、构建、令牌、docgen、测试与文档，文档聚合通过官方 TypeScript API 读取真实类型，Turbo 按产品运行时拓扑编排。

```sh
corepack enable
yarn install --immutable
yarn docs:dev
```

`yarn check` 是本地和双平台 CI 共用的全量入口；`yarn check --list` 只列检查计划。根命令包括 build:library、generate:token、check:tokens、lint、typecheck、test、docs:build；包内使用对应公开脚本。文档生成与验证见 [.website 维护说明](.website/README.md)。

## 版本与发布

Changeset 描述用户可观察的变更和迁移要求，由 CI 准备版本 Release PR，并在同一提交通过验证后发布。不要手工升版建立第二条流程或本地执行 publish。审查证据保留提交/产物指纹和实际范围，历史通过不代表当前全库完成。
