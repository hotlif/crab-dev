<div align="center">
	<h1>Crab Dev</h1>
	<p>基于 React 19 的企业级 UI 组件库 Monorepo，采用零运行时 CSS-in-JS 和三层设计令牌系统</p>
	<p>Yarn PnP 优先 · TypeScript 严格模式 · OKLCh 色彩空间</p>
</div>

## 概述

Crab Dev 是一个 **Nx Monorepo**，包含 React 19 UI 组件、共享工程规范和内部构建工具。所有包均以 ESM 为主，全局使用 `"type": "module"`，优先支持 Yarn Plug'n'Play。

## 架构

```
crab-dev/
├── components/    # React 19 UI 组件（@crab-dev/rc-*）
├── standards/     # 共享 ESLint、Jest、TypeScript 预设（@crab-dev/standards-*）
├── toolbox/       # 内部构建/开发工具（@crab-dev/*）
└── rfc/           # 设计提案文档
```

### 组件库

| 组件 | 包名 | 说明 |
|------|------|------|
| rc-button | `@crab-dev/rc-button` | 按钮 |
| rc-dialog | `@crab-dev/rc-dialog` | 对话框 |
| rc-form | `@crab-dev/rc-form` | 高性能表单 |
| rc-table | `@crab-dev/rc-table` | 表格 |
| rc-tree | `@crab-dev/rc-tree` | 树形控件 |
| rc-menu | `@crab-dev/rc-menu` | 菜单 |
| rc-slider | `@crab-dev/rc-slider` | 滑块 |
| rc-date-picker | `@crab-dev/rc-date-picker` | 日期选择器 |
| rc-color-picker | `@crab-dev/rc-color-picker` | 颜色选择器 |
| rc-line-edit | `@crab-dev/rc-line-edit` | 文本输入 |
| rc-notification | `@crab-dev/rc-notification` | 通知提示 |
| rc-dropdown-container | `@crab-dev/rc-dropdown-container` | 下拉容器 |
| rc-virtual | `@crab-dev/rc-virtual` | 虚拟滚动 |
| rc-component-preview | `@crab-dev/rc-component-preview` | 组件预览 |
| rc-app-main-layout | `@crab-dev/rc-app-main-layout` | 应用主布局 |
| rc-hooks | `@crab-dev/rc-hooks` | 通用 Hooks |
| rc-token-global | `@crab-dev/rc-token-global` | 全局设计令牌（第 1 层） |
| rc-token-semantic | `@crab-dev/rc-token-semantic` | 语义设计令牌（第 2 层） |

### 工具链

| 工具 | 包名 | 职责 |
|------|------|------|
| Packify | `@crab-dev/packify` | Rollup 4 库打包器 → `esm/`、`cjs/`、`declarations/`、`css/` |
| Crustify | `@crab-dev/crustify` | Webpack 5 开发服务器，集成 React Compiler、Linaria、SWC、MDX |
| Lignify | `@crab-dev/lignify` | 零配置文档/开发环境，包裹 Crustify |
| auto-import-style | `@crab-dev/babel-plugin-auto-import-style` | 编译时自动注入组件样式导入 |

### 工程规范

| 预设 | 包名 | 用途 |
|------|------|------|
| ESLint | `@crab-dev/standards-eslint-preset` | 浏览器 React / Node 两套 ESLint 配置 |
| Jest | `@crab-dev/standards-jest-preset` | 浏览器 React / Node 两套 Jest 配置 |
| TypeScript | `@crab-dev/standards-typescript-preset` | 浏览器 React / Node 两套 tsconfig |

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node ≥ 22 |
| 包管理 | Yarn 4.13.0（Corepack + PnP） |
| 构建编排 | Nx 22 |
| 框架 | React 19 |
| 语言 | TypeScript 6（严格模式） |
| 样式 | Linaria（零运行时 CSS-in-JS） |
| 色彩 | OKLCh 色彩空间 |
| 打包 | Rollup 4（库）/ Webpack 5（开发） |
| 测试 | Jest 30 + Testing Library |
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
yarn build

# 全量测试
yarn test

# 全量 ESLint
yarn eslint

# 重新生成所有设计令牌
yarn generate:token
```

### 单组件开发

```bash
cd components/rc-button

yarn start            # 启动开发服务器（lignify → crustify → webpack-dev-server）
yarn build:library    # 库构建（packify → rollup）
yarn test             # 运行测试
yarn eslint           # 代码检查
yarn generate:token   # 从 token.toml 重新生成 token.ts
```

## 组件输出

每个组件构建后生成三种格式：

```
esm/           # ES Modules（.mjs）
cjs/           # CommonJS（.cjs）
declarations/  # TypeScript 类型声明（.d.ts）
css/           # 静态 CSS（Linaria 编译产物）
```

## 许可证

私有项目
