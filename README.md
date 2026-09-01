<div align="center">
	<h1>Crab Dev</h1>
	<p>基于 React 19 的企业级 UI 组件库 Monorepo，采用零运行时 CSS-in-JS 和三层设计令牌系统</p>
	<p>Yarn PnP 优先 · TypeScript 严格模式 · OKLCh 色彩空间</p>
</div>

## 概述

Crab Dev 是一个 **Turbo Monorepo**，包含 React 19 UI 组件、共享工程规范和 Wake 文档站。所有包均以 ESM 为主，全局使用 `"type": "module"`，优先支持 Yarn Plug'n'Play。

## 架构

```
crab-dev/
├── components/    # React 19 UI 组件（@crab-dev/rc-*）
├── standards/     # 共享 ESLint、TypeScript 预设（@crab-dev/standards-*）
├── .website/      # Wake Docs 聚合文档站（私有，不发布）
└── rfc/           # 设计提案文档
```

### 组件库

共 49 个包（含两个令牌包）：

| 组件 | 包名 | 说明 |
|------|------|------|
| rc-alert | `@crab-dev/rc-alert` | 警告提示 |
| rc-app-main-layout | `@crab-dev/rc-app-main-layout` | 应用主布局 |
| rc-auto-sizer | `@crab-dev/rc-auto-sizer` | 自动尺寸容器 |
| rc-avatar | `@crab-dev/rc-avatar` | 头像 |
| rc-badge | `@crab-dev/rc-badge` | 徽标 |
| rc-bar-chart | `@crab-dev/rc-bar-chart` | 柱状图 |
| rc-breadcrumbs | `@crab-dev/rc-breadcrumbs` | 面包屑 |
| rc-button | `@crab-dev/rc-button` | 按钮 |
| rc-canvas | `@crab-dev/rc-canvas` | Canvas 图形引擎 |
| rc-card | `@crab-dev/rc-card` | 卡片 |
| rc-checkbox | `@crab-dev/rc-checkbox` | 复选框 |
| rc-color-picker | `@crab-dev/rc-color-picker` | 颜色选择器 |
| rc-component-preview | `@crab-dev/rc-component-preview` | 组件预览（文档站专用） |
| rc-cron-picker | `@crab-dev/rc-cron-picker` | Cron 选择器 |
| rc-date-picker | `@crab-dev/rc-date-picker` | 日期选择器 |
| rc-dialog | `@crab-dev/rc-dialog` | 对话框 |
| rc-divider | `@crab-dev/rc-divider` | 分割线 |
| rc-drawer | `@crab-dev/rc-drawer` | 抽屉 |
| rc-dropdown-container | `@crab-dev/rc-dropdown-container` | 下拉容器 |
| rc-empty | `@crab-dev/rc-empty` | 空状态 |
| rc-flow-diagram | `@crab-dev/rc-flow-diagram` | 流程图 |
| rc-form | `@crab-dev/rc-form` | 高性能表单 |
| rc-hooks | `@crab-dev/rc-hooks` | 通用 Hooks |
| rc-line-edit | `@crab-dev/rc-line-edit` | 文本输入 |
| rc-masonry | `@crab-dev/rc-masonry` | 瀑布流布局 |
| rc-menu | `@crab-dev/rc-menu` | 菜单 |
| rc-message | `@crab-dev/rc-message` | 全局消息提示 |
| rc-notification | `@crab-dev/rc-notification` | 通知提示 |
| rc-number-edit | `@crab-dev/rc-number-edit` | 数值输入 |
| rc-pagination | `@crab-dev/rc-pagination` | 分页 |
| rc-prose | `@crab-dev/rc-prose` | 富文本排版 |
| rc-protocol-table | `@crab-dev/rc-protocol-table` | 协议表格 |
| rc-radio | `@crab-dev/rc-radio` | 单选框 |
| rc-segmented | `@crab-dev/rc-segmented` | 分段控制器 |
| rc-select | `@crab-dev/rc-select` | 选择器 |
| rc-skeleton | `@crab-dev/rc-skeleton` | 骨架屏 |
| rc-slider | `@crab-dev/rc-slider` | 滑块 |
| rc-spin | `@crab-dev/rc-spin` | 加载指示器 |
| rc-split-pane | `@crab-dev/rc-split-pane` | 分割面板 |
| rc-switch | `@crab-dev/rc-switch` | 开关 |
| rc-table | `@crab-dev/rc-table` | 表格 |
| rc-tabs | `@crab-dev/rc-tabs` | 标签页 |
| rc-tag | `@crab-dev/rc-tag` | 标签 |
| rc-text-edit | `@crab-dev/rc-text-edit` | 文本输入 |
| rc-tooltip | `@crab-dev/rc-tooltip` | 文字提示 |
| rc-tree | `@crab-dev/rc-tree` | 树形控件 |
| rc-virtual | `@crab-dev/rc-virtual` | 虚拟滚动 |
| rc-token-global | `@crab-dev/rc-token-global` | 全局设计令牌（第 1 层） |
| rc-token-semantic | `@crab-dev/rc-token-semantic` | 语义设计令牌（第 2 层） |

### 工具链

组件构建、令牌生成、docgen、测试、开发工作台和文档站统一使用精确锁定的 `@crab-dev/wake@0.1.23`；零运行时样式使用 `@crab-dev/css@0.1.23`。Turbo 只负责编排包拓扑和跨包并行。

### 工程规范

| 预设 | 包名 | 用途 |
|------|------|------|
| ESLint | `@crab-dev/standards-eslint-preset` | 浏览器 React / Node 两套 ESLint 配置 |
| TypeScript | `@crab-dev/standards-typescript-preset` | 浏览器 React / Node 两套 tsconfig |

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node ≥ 22（CI 使用 24.x） |
| 包管理 | Yarn 4.16.0（Corepack + PnP） |
| 构建编排 | Turbo 2.10.4 |
| 框架 | React 19.2.8 |
| 语言 | TypeScript 6（严格模式） |
| 样式 | Crab CSS 0.1.23（零运行时 CSS-in-JS） |
| 色彩 | OKLCh 色彩空间 |
| 工具链 | Wake 0.1.23（Library / Test / Docs） |
| 测试 | Wake Test（DOM 快速确定性环境） |
| CSS 处理 | LightningCSS |
| CI | GitHub Actions（`canary` 分支） |

## 设计令牌

三层架构，基于 TOML 定义，自动生成 CSS 变量：

```
第 1 层：rc-token-global    → 原始基元（颜色、间距、圆角、排版、阴影）
第 2 层：rc-token-semantic  → 语义映射（$ref → 全局令牌）
第 3 层：rc-{component}     → 组件专属令牌（$ref → 语义令牌）
```

令牌解析链：`var(--button-primary-color, var(--token-semantic-..., var(--token-global-..., oklch(...))))`

深色主题只需覆盖语义层 CSS 变量。

## 快速开始

```bash
# 安装依赖
corepack enable
yarn install

# 全量构建
yarn build:library

# 全量测试
yarn test

# 全量 ESLint
yarn lint

# 全量类型检查
yarn typecheck

# 重新生成所有设计令牌
yarn generate:token

# 启动文档站
yarn start
```

### 单组件开发

```bash
cd components/rc-button

yarn start            # 启动 Wake Docs 组件工作台
yarn build:library    # Wake Library 构建
yarn test             # Wake Test（串行并生成覆盖率）
yarn eslint           # 代码检查
yarn typecheck        # 类型检查
yarn generate:token   # 从 token.toml 重新生成 token.ts
```

## 组件输出

每个组件构建后生成四种格式：

```
esm/           # ES Modules（.mjs）
cjs/           # CommonJS（.cjs）
declarations/  # TypeScript 类型声明（.d.ts）
css/           # 静态 CSS（Crab CSS 编译产物）
```

Wake 消费方会自动发现组件 CSS；使用其他构建器时必须显式导入组件包暴露的 CSS 子路径。

## 许可证

私有项目
