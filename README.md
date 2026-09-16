<div align="center">
	<h1>Crab Dev</h1>
	<p>面向企业应用的 React 19 组件库，使用静态 CSS 和三层设计令牌统一界面样式</p>
	<p>Yarn PnP · TypeScript 严格模式 · OKLCh 色彩</p>
</div>

## 概述

Crab Dev 仓库包含 Crab UI 组件、共享工程预设和文档站。组件按包独立使用，Wake 负责构建、测试与文档，Turbo 按包依赖关系编排任务。仓库使用 ESM 源码和 Yarn Plug'n'Play（PnP）。

- 使用组件：从下方目录进入组件说明，或阅读[入门指南](./.website/docs/guides/getting-started.mdx)。
- 开发组件：阅读本文的开发命令和[工具链指南](./.website/docs/guides/toolchain.mdx)。
- 编写交互：参考[无障碍使用指南](./.website/docs/guides/accessibility.mdx)。

文档站提供 52 个包的分步教程、116 个可运行教学步骤和三个业务实战，并保留 246 个进阶示例。推荐按“按钮与输入 → 资料表单 → 数据列表 → 后台管理页面”的顺序学习。网站源码和维护方式见 [.website 说明](./.website/README.md)。

## 架构

```
crab-dev/
├── components/    # React 19 UI 组件（@crab-dev/rc-*）
├── standards/     # 共享 TypeScript 预设与历史 ESLint 兼容包（@crab-dev/standards-*）
├── .website/      # Wake Docs 文档站（私有，不发布）
└── scripts/       # 仓库级检查脚本
```

### 组件库

`components/` 当前包含 52 个包，涵盖 UI 组件、图形、路由、工具和主题令牌：

| 组件 | 包名 | 说明 |
|------|------|------|
| [rc-alert](./components/rc-alert/docs/index.mdx) | `@crab-dev/rc-alert` | 警告提示 |
| [rc-app-main-layout](./components/rc-app-main-layout/docs/index.mdx) | `@crab-dev/rc-app-main-layout` | 应用主布局 |
| [rc-auto-sizer](./components/rc-auto-sizer/docs/index.mdx) | `@crab-dev/rc-auto-sizer` | 自动尺寸容器 |
| [rc-avatar](./components/rc-avatar/docs/index.mdx) | `@crab-dev/rc-avatar` | 头像 |
| [rc-badge](./components/rc-badge/docs/index.mdx) | `@crab-dev/rc-badge` | 徽标 |
| [rc-bar-chart](./components/rc-bar-chart/docs/index.mdx) | `@crab-dev/rc-bar-chart` | 柱状图 |
| [rc-breadcrumbs](./components/rc-breadcrumbs/docs/index.mdx) | `@crab-dev/rc-breadcrumbs` | 面包屑 |
| [rc-button](./components/rc-button/docs/index.mdx) | `@crab-dev/rc-button` | 按钮 |
| [rc-canvas](./components/rc-canvas/docs/index.mdx) | `@crab-dev/rc-canvas` | Canvas 图形引擎 |
| [rc-card](./components/rc-card/docs/index.mdx) | `@crab-dev/rc-card` | 卡片 |
| [rc-checkbox](./components/rc-checkbox/docs/index.mdx) | `@crab-dev/rc-checkbox` | 复选框 |
| [rc-color-picker](./components/rc-color-picker/docs/index.mdx) | `@crab-dev/rc-color-picker` | 颜色选择器 |
| [rc-component-preview](./components/rc-component-preview/docs/index.mdx) | `@crab-dev/rc-component-preview` | 组件预览（文档站专用） |
| [rc-cron-picker](./components/rc-cron-picker/docs/index.mdx) | `@crab-dev/rc-cron-picker` | Cron 选择器 |
| [rc-date-picker](./components/rc-date-picker/docs/index.mdx) | `@crab-dev/rc-date-picker` | 日期选择器 |
| [rc-dialog](./components/rc-dialog/docs/index.mdx) | `@crab-dev/rc-dialog` | 对话框 |
| [rc-divider](./components/rc-divider/docs/index.mdx) | `@crab-dev/rc-divider` | 分割线 |
| [rc-drawer](./components/rc-drawer/docs/index.mdx) | `@crab-dev/rc-drawer` | 抽屉 |
| [rc-dropdown-container](./components/rc-dropdown-container/docs/index.mdx) | `@crab-dev/rc-dropdown-container` | 下拉容器 |
| [rc-empty](./components/rc-empty/docs/index.mdx) | `@crab-dev/rc-empty` | 空状态 |
| [rc-flow-diagram](./components/rc-flow-diagram/docs/index.mdx) | `@crab-dev/rc-flow-diagram` | 流程图 |
| [rc-form](./components/rc-form/docs/index.mdx) | `@crab-dev/rc-form` | 表单数据与校验 |
| [rc-hooks](./components/rc-hooks/docs/index.mdx) | `@crab-dev/rc-hooks` | 通用 Hooks |
| [rc-line-edit](./components/rc-line-edit/docs/index.mdx) | `@crab-dev/rc-line-edit` | 单行文本输入 |
| [rc-masonry](./components/rc-masonry/docs/index.mdx) | `@crab-dev/rc-masonry` | 瀑布流布局 |
| [rc-menu](./components/rc-menu/docs/index.mdx) | `@crab-dev/rc-menu` | 菜单 |
| [rc-message](./components/rc-message/docs/index.mdx) | `@crab-dev/rc-message` | 全局消息提示 |
| [rc-notification](./components/rc-notification/docs/index.mdx) | `@crab-dev/rc-notification` | 通知提示 |
| [rc-number-edit](./components/rc-number-edit/docs/index.mdx) | `@crab-dev/rc-number-edit` | 数值输入 |
| [rc-pagination](./components/rc-pagination/docs/index.mdx) | `@crab-dev/rc-pagination` | 分页 |
| [rc-prose](./components/rc-prose/docs/index.mdx) | `@crab-dev/rc-prose` | 富文本排版 |
| [rc-table-pro](./components/rc-table-pro/docs/index.mdx) | `@crab-dev/rc-table-pro` | 高级表格 |
| [rc-radio](./components/rc-radio/docs/index.mdx) | `@crab-dev/rc-radio` | 单选框 |
| [rc-realm](./components/rc-realm/docs/index.mdx) | `@crab-dev/rc-realm` | 远程模块加载与挂载 |
| [rc-router](./components/rc-router/docs/index.mdx) | `@crab-dev/rc-router` | 浏览器路由 |
| [rc-segmented](./components/rc-segmented/docs/index.mdx) | `@crab-dev/rc-segmented` | 分段控制器 |
| [rc-select](./components/rc-select/docs/index.mdx) | `@crab-dev/rc-select` | 选择器 |
| [rc-skeleton](./components/rc-skeleton/docs/index.mdx) | `@crab-dev/rc-skeleton` | 骨架屏 |
| [rc-slider](./components/rc-slider/docs/index.mdx) | `@crab-dev/rc-slider` | 滑块 |
| [rc-spin](./components/rc-spin/docs/index.mdx) | `@crab-dev/rc-spin` | 加载指示器 |
| [rc-split-pane](./components/rc-split-pane/docs/index.mdx) | `@crab-dev/rc-split-pane` | 分割面板 |
| [rc-switch](./components/rc-switch/docs/index.mdx) | `@crab-dev/rc-switch` | 开关 |
| [rc-table](./components/rc-table/docs/index.mdx) | `@crab-dev/rc-table` | 表格 |
| [rc-tabs](./components/rc-tabs/docs/index.mdx) | `@crab-dev/rc-tabs` | 标签页 |
| [rc-tag](./components/rc-tag/docs/index.mdx) | `@crab-dev/rc-tag` | 标签 |
| [rc-text-edit](./components/rc-text-edit/docs/index.mdx) | `@crab-dev/rc-text-edit` | 多行文本输入 |
| [rc-theme](./components/rc-theme/docs/index.mdx) | `@crab-dev/rc-theme` | 浅色、深色与强制颜色主题 |
| [rc-tooltip](./components/rc-tooltip/docs/index.mdx) | `@crab-dev/rc-tooltip` | 文字提示 |
| [rc-tree](./components/rc-tree/docs/index.mdx) | `@crab-dev/rc-tree` | 树形控件 |
| [rc-virtual](./components/rc-virtual/docs/index.mdx) | `@crab-dev/rc-virtual` | 虚拟滚动 |
| [rc-token-global](./components/rc-token-global/docs/index.mdx) | `@crab-dev/rc-token-global` | 全局设计令牌（第 1 层） |
| [rc-token-semantic](./components/rc-token-semantic/docs/index.mdx) | `@crab-dev/rc-token-semantic` | 语义设计令牌（第 2 层） |

### 工具链

`@crab-dev/wake` 统一负责代码检查、组件构建、令牌生成、API 提取、测试、组件工作台和文档站；`@crab-dev/css` 在构建期提取静态样式。Turbo 负责按依赖顺序执行任务和跨包并行。依赖版本以各包的 `package.json` 和根目录 `yarn.lock` 为准。

### 工程规范

| 预设 | 包名 | 用途 |
|------|------|------|
| Wake Lint | `wake.config.toml` | 根目录统一规则，显式区分浏览器与 Node 环境 |
| TypeScript | `@crab-dev/standards-typescript-preset` | 浏览器 React / Node 两套 tsconfig |

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node ≥ 22（CI 使用 24.x） |
| 包管理 | Yarn 4（Corepack + PnP，版本由 `packageManager` 指定） |
| 构建编排 | Turbo |
| 框架 | React 19 |
| 语言 | TypeScript（严格模式） |
| 样式 | Crab CSS（构建期提取静态 CSS） |
| 色彩 | OKLCh 色彩空间 |
| 工具链 | Wake（Library / Test / Docs） |
| 测试 | Wake Test（隔离 DOM 环境） |
| CSS 处理 | LightningCSS |
| CI | GitHub Actions（`canary` 分支） |

## 设计令牌

设计令牌在 `token.toml` 中定义，由 Wake 生成 TypeScript 令牌入口，并在样式构建时使用 CSS 变量：

```
第 1 层：rc-token-global    → 原始基元（颜色、间距、圆角、排版、阴影）
第 2 层：rc-token-semantic  → 语义映射（$ref → 全局令牌）
第 3 层：rc-{component}     → 组件专属令牌（$ref → 语义令牌）
```

令牌解析链：`var(--button-primary-color, var(--token-semantic-..., var(--token-global-..., oklch(...))))`

`@crab-dev/rc-theme` 通过覆盖语义层 CSS 变量提供主题。修改 `token.toml` 后运行 `yarn generate:token`，不要手工编辑生成的 `src/token.ts`。

## 本地开发

需要 Node.js 22 或更高版本。以下命令在仓库根目录执行；Corepack 会选择 `packageManager` 指定的 Yarn 版本。

```sh
# 安装依赖
corepack enable
yarn install --immutable

# 构建组件并启动文档站
yarn docs:dev
```

| 命令 | 用途 |
| --- | --- |
| `yarn build:library` | 按包依赖顺序构建组件库 |
| `yarn test` | 运行全仓测试 |
| `yarn lint` | 运行全仓 Wake Lint 检查 |
| `yarn typecheck` | 运行全仓类型检查 |
| `yarn generate:token` | 重新生成设计令牌 |
| `yarn docs:build` | 构建组件库与生产文档站 |

### 单组件开发

```sh
cd components/rc-button

yarn start            # 启动 Wake Docs 组件工作台
yarn build:library    # Wake Library 构建
yarn test             # Wake Test（串行并生成覆盖率）
yarn lint             # Wake 原生代码检查
yarn typecheck        # 类型检查
yarn generate:token   # 从 token.toml 重新生成 token.ts
```

## 组件输出

Wake Library 的主要构建产物如下，具体出口以各包的 `package.json` 为准：

```
esm/           # ES Modules（.mjs）
cjs/           # CommonJS（.cjs）
declarations/  # TypeScript 类型声明（.d.ts）
css/           # 静态 CSS（Crab CSS 编译产物）
```

Wake 消费方会自动发现组件 CSS；使用其他构建器时必须显式导入组件包暴露的 CSS 子路径。

## 维护文档

组件说明位于 `components/rc-*/docs/index.mdx`，交互示例位于同包的 `docs/demos/`。包内 README 提供简要说明和阅读入口。

修改源文档后运行：

```sh
yarn workspace @crab-dev/website generate:docs
yarn workspace @crab-dev/website check:docs
```

`.website/docs/components/`、`_generated/` 和 `_generated_api/` 由生成器维护，不要手工编辑。入门与开发指南直接维护在 `.website/docs/guides/`。

## 许可证

私有项目
