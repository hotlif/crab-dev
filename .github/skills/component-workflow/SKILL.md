---
name: 01-workflow
description: "crab-dev monorepo 的组件开发全流程手册。使用场景：创建新的 rc-* 组件；设计 token.toml 设计令牌；排查 Yarn 4 PnP 问题；配置 Webpack / Rollup 构建；修复 Turbo 任务图循环依赖；编写 Jest + RTL 测试；Linaria CSS-in-JS 样式；ESM 模块解析；编写 demo 或 MDX 文档。禁止用于：非 crab-dev 项目。"
argument-hint: "描述你需要帮助的组件、令牌、构建或 PnP 任务"
---

# 组件开发工作流（Component Workflow）

> 本 SKILL 聚焦可操作流程与实战模板。通用规范（代码风格、提交规范、验收清单等）见 `copilot-instructions.md`，此处不重复。

---

## 一、组件创建流程

### 1. 准备：读取兄弟组件版本

创建 `package.json` 前，**必须先读取一个已有组件**（如 `components/rc-tag/package.json`）获取当前 devDependencies 版本号。不要猜测版本。

### 2. 脚手架文件清单

> **样式注意**：编写组件源码中的 Linaria 样式时，**应**同步调用 `02-style` 技能以确保状态覆盖与令牌合规。

```
components/rc-{name}/
├── package.json
├── tsconfig.json
├── eslint.config.js
├── jest.config.mjs
├── token.toml                      # 可选：需要设计令牌时
├── src/
│   ├── {name}.tsx                  # 主组件
│   ├── types.ts                    # Props 类型（也可内联）
│   ├── icons.tsx                   # SVG 图标（如有多个图标应提取至此）
│   ├── token.ts                    # 自动生成 — 禁止手编
│   ├── index.ts                    # 默认导出 + 类型导出
│   └── __tests__/
│       └── {name}.test.tsx
├── docs/
│   ├── README.md                   # 文档首页（frontmatter + API 指令）
│   └── demos/
│       ├── basic.demo.tsx          # 基础用法
│       └── *.demo.tsx              # 其他演示
└── public/                         # docgen.json 自动生成目录
```

### 3. 配置文件模板

**tsconfig.json**
```json
{
    "extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json",
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "esm"
    }
}
```

**eslint.config.js**
```javascript
import { Browser } from "@crab-dev/standards-eslint-preset";
export default [...Browser.react];
```

**jest.config.mjs**
```javascript
import { browser } from "@crab-dev/standards-jest-preset";
export default browser;
```

### 4. package.json 模板

```json
{
    "name": "@crab-dev/rc-{name}",
    "description": "组件中文描述",
    "packageManager": "yarn@4.13.0",
    "type": "module",
    "version": "0.0.1",
    "scripts": {
        "start": "yarn generate:docgen && yarn generate:token && lignify run-task app:dev",
        "build:library": "packify build",
        "generate:docgen": "node -e \"require('fs').mkdirSync('public',{recursive:true})\" && react-docgen ./src/{name}.tsx --out ./public/docgen.json",
        "generate:token": "packify generate:css-token",
        "test": "yarn node --experimental-vm-modules $(yarn bin jest)",
        "eslint": "eslint . ",
        "typecheck": "tsc --noEmit"
    },
    "files": ["esm", "cjs", "declarations"],
    "types": "declarations/index.d.ts",
    "main": "cjs/index.cjs",
    "module": "esm/index.mjs",
    "devDependencies": {
        "@crab-dev/lignify": "workspace:^",
        "@crab-dev/packify": "workspace:^",
        "@crab-dev/rc-component-preview": "workspace:^",
        "@crab-dev/rc-masonry": "workspace:^",
        "@crab-dev/rc-menu": "workspace:^",
        "@crab-dev/rc-token-semantic": "workspace:^",
        "@crab-dev/standards-eslint-preset": "workspace:^",
        "@crab-dev/standards-jest-preset": "workspace:^",
        "@crab-dev/standards-typescript-preset": "workspace:^",
        "@jest/globals": "COPY",
        "@linaria/core": "COPY",
        "@mdx-js/react": "COPY",
        "@react-docgen/cli": "COPY",
        "@testing-library/dom": "COPY",
        "@testing-library/react": "COPY",
        "@types/node": "COPY",
        "@types/react": "COPY",
        "@types/react-dom": "COPY",
        "eslint": "COPY",
        "eslint-plugin-react": "COPY",
        "globals": "COPY",
        "jest": "COPY",
        "jest-environment-jsdom": "COPY",
        "react": "COPY",
        "react-dom": "COPY",
        "react-router": "COPY",
        "typescript": "COPY",
        "typescript-eslint": "COPY"
    },
    "engines": { "node": ">=22" }
}
```

> 标记 `COPY` 的版本号必须从兄弟组件复制。`generate:docgen` 使用 `node -e` 创建目录（跨平台兼容）。

**依赖规则：**
- `workspace:^` 用于所有 workspace 内部包
- React 19 放 devDependencies（隐式 peer，不声明 peerDependencies）
- 外部运行时依赖放 `dependencies`
- `rc-component-preview`、`rc-menu`、`rc-masonry` 为 lignify 文档环境所需

### 4.1 高频漏项：`rc-masonry`（MUST）

`rc-masonry` 是文档开发环境的稳定依赖，新增 rc-* 组件时**必须**放在 `devDependencies`。这条规则与业务代码是否直接 import 无关。

**必须包含：**
- `"@crab-dev/rc-masonry": "workspace:^"`

**典型漏加症状：**
- `yarn start`（lignify）启动失败或模板渲染报包解析错误
- PnP 提示 workspace 包缺失（常见为 `Cannot find module` / `qualified path resolution failed`）

**提交前自检（建议固定执行）：**

```bash
cat components/rc-{name}/package.json | rg "rc-component-preview|rc-menu|rc-masonry"
```

若缺失，立刻补齐：

```bash
yarn workspace @crab-dev/rc-{name} add -D @crab-dev/rc-masonry
```

### 5. index.ts 导出模式

```typescript
import Component from './{name}.js';
export type { ComponentProps } from './types.js';
export default Component;
```

### 6. 图标提取规则

当组件包含 2 个以上 SVG 图标时，将图标提取到 `src/icons.tsx`：

```typescript
// icons.tsx — 每个图标单独导出，不使用 map 对象
export const SuccessIcon = () => ( <svg>...</svg> );
export const ErrorIcon = () => ( <svg>...</svg> );
export const CloseIcon = ({ size }: { size: string }) => ( <svg>...</svg> );
```

组件中通过 if-else 选择图标，不使用 Record/map 映射：

```typescript
const getDefaultIcon = () => {
    if (type === 'success') return <SuccessIcon />;
    if (type === 'error') return <ErrorIcon />;
    return <InfoIcon />;
};
```

### 7. 测试模板

```typescript
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Component from '../{name}.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('{Name}', () => {
    it('renders correctly', () => {
        const { container } = render(<Component>content</Component>);
        expect(container.firstChild).toBeTruthy();
    });
});
```

### 8. docs/README.md 模板

```markdown
+++
title = "{Name}"
index = true
+++


# {Name}

组件的一句话描述。


## 何时使用

- 使用场景 1。
- 使用场景 2。


## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/{name}.tsx" />
```

### 9. Demo 文件规范（硬性约束）

Demo 元数据由 `crustify/AutoScanWebpackPlugin` 的 `getTypeScriptComment` + `smol-toml` 解析，决定了 demo 卡片的标题、描述与排序。下述四条**必须**同时满足，否则 frontmatter 会被丢弃成 `null`，demo 会以无标题形态渲染（典型表现：卡片只显示一段裸代码，没有中文标题和说明）。

**规则 M1 — 注释必须置于文件最顶部**

注释取的是"源文件第一个 statement 的 leading comment"。因此 JSDoc 块**必须**在 `import` 之前，**不得**放在组件定义上方或任何 `import` 之后。

**规则 M2 — 注释体必须是 TOML，不是散文**

内容按 `key = "value"` 逐行书写，值**必须**使用双引号包裹。禁止仅写一段中文标题 / 描述段落——解析器会抛错并把 frontmatter 归零。

**规则 M3 — 字段白名单**

目前被消费的字段：

| 字段 | 类型 | 语义 |
|------|------|------|
| `title` | string（必填） | demo 卡片标题，中文 |
| `description` | string（可选） | 一句话说明，支持 `` ` `` 行内代码 |

未来新增字段前须同步更新 scanner；demo 里**不得**自创字段。

**规则 M4 — 注释内不得使用 Markdown 列表 / 多段落**

`smol-toml` 按 TOML 规则解析；`-`、空行、`>` 等符号会让整块变成非法 TOML。如需多行描述，使用 TOML 的多行字符串 `"""..."""`。

#### ✅ 正确范式

```typescript
/**
 * title = "基础用法"
 * description = "通过 `open` 控制显示；点击遮罩或按 `Esc` 均可关闭。"
 */

import { useState } from "react";
import Component from "../../src/index.js";

const BasicDemo = () => {
    return <Component />;
};

export default BasicDemo;
```

#### ❌ 常见错误（对照自查）

```typescript
// ❌ 错误 1：注释写在 import 之后 —— 不是"第一个 statement 的 leading comment"，被忽略
import Component from "../../src/index.js";

/**
 * title = "基础用法"
 */
const Demo = () => <Component />;
```

```typescript
// ❌ 错误 2：散文式 JSDoc —— 不是合法 TOML，parse() 抛错后 frontmatter = null
/**
 * 基础用法
 *
 * 通过 `open` 控制显示……
 */
import Component from "../../src/index.js";
```

```typescript
// ❌ 错误 3：值未加引号 / 使用 Markdown 列表 —— 非法 TOML
/**
 * title = 基础用法
 * description =
 *   - 第一行
 *   - 第二行
 */
```

#### 自查清单

提交 demo 前逐项核对：

- [ ] JSDoc 块是文件**第一行**，前面没有任何 `import` 或其它代码；
- [ ] 至少包含 `title = "..."`（双引号）；
- [ ] 多行描述使用 TOML 多行字符串 `"""..."""`，不使用 Markdown 列表；
- [ ] 在 lignify 预览中卡片**标题正确显示**为中文，而非文件名。

### 10. 创建后执行

```bash
# 1. 安装依赖（在仓库根目录）
yarn install

# 2. 生成令牌（如有 token.toml）
#    若新增了语义令牌引用，先重新生成 rc-token-semantic
cd components/rc-token-semantic && yarn generate:token
cd components/rc-{name} && yarn generate:token

# 3. 验证
yarn eslint
yarn test
yarn typecheck
```

---

## 二、设计令牌流程

### 三层架构速查

| 层 | 包名 | 职责 |
|----|------|------|
| 1 | `rc-token-global` | OKLCh 原始色值、间距刻度、圆角刻度 |
| 2 | `rc-token-semantic` | 语义映射（`$ref` → L1） |
| 3 | `rc-{component}` | 组件专属令牌（`$ref` → L2） |

### token.toml 模板

```toml
[build]
output = "./src/token.ts"
prefix = "{component-name}"
imports = ["@crab-dev/rc-token-semantic"]

[token]
transition = "background-color 100ms cubic-bezier(0.4, 0, 0.2, 1)"
padding = "$ref(space.card-padding)"
border.radius = "$ref(radius.lg)"
```

### 可用的语义令牌分类

| 分类 | 常用 key |
|------|----------|
| 品牌色 | `color.brand.primary` / `-hover` / `-active` |
| 背景 | `color.background.surface` / `elevated` / `overlay` / `disabled` / `hover-subtle` / `active-subtle` |
| 文本 | `color.text.primary` / `secondary` / `tertiary` / `on-brand` / `disabled` / `link` |
| 边框 | `color.border.default` / `hover` / `focus` / `error` |
| 反馈 | `color.feedback.success` / `-background`、`warning` / `-background`、`error` / `-background`、`info` / `-background` |
| 间距 | `space.inline-gap`(4) / `component-gap`(8) / `stack-gap`(12) / `section-gap`(16) / `card-padding`(20) / `dialog-padding`(24) |
| 字号 | `font.size.body` / `heading` / `subhead` / `caption` |
| 字重 | `font.weight.label` / `heading` |
| 圆角 | `radius.sm` / `md` / `lg` / `xl` / `pill` |
| 阴影 | `shadow.float` / `overlay` |
| 动效 | `motion.fade` / `motion.expand` |
| 透明度 | `opacity.disabled` / `secondary` / `tertiary` / `hover` |

> 若需要的语义令牌不存在（如之前缺少 `color.feedback.info`），应先在 `rc-token-semantic/token.toml` 中添加，然后 `yarn generate:token` 重新生成，最后在组件中引用。

### 组件中使用令牌的对齐技巧

图标/按钮与文字垂直对齐时，用 `height: calc(font-size * line-height)` 使元素高度匹配文字行盒：

```typescript
const iconStyle = css`
    display: inline-flex;
    align-items: center;
    height: calc(${token.font.size} * ${token.line.height});
`;
```

---

## 三、Yarn PnP 快速排错

| 症状 | 方案 |
|------|------|
| ESM 包 zip 内加载失败 | 根 `package.json` → `dependenciesMeta.{pkg}.unplugged: true` |
| `Qualified path resolution failed` | 先构建目标包：`yarn build` |
| `Cannot find module` workspace 包 | 检查 `workspace:^` 声明 → `yarn install` |
| `.pnp.cjs` 合并冲突 | `yarn install` 重新生成 |

---

## 四、Turbo 循环依赖处理

Turbo 将所有 dependencies + devDependencies 视为图边。当 `dependsOn: ["^build:library"]` 导致环时：

1. 确认环路是否仅通过 devDependencies 产生
2. 移除 `src/` 未使用的 devDependencies
3. 若无法移除，在 `turbo.json` 中添加包级任务覆盖：

```json
{ "@crab-dev/rc-xxx#build:library": { "dependsOn": ["@crab-dev/packify#build:library"] } }
```

验证：`turbo run build:library --dry-run`

---

## 五、构建工具链

详见 [build-toolchain.md](./references/build-toolchain.md)。
