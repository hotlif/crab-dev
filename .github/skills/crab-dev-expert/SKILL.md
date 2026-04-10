---
name: crab-dev-expert
description: "UI component library development expert for crab-dev monorepo. USE FOR: creating new rc-* components, designing token.toml design tokens, troubleshooting Yarn 4 PnP issues, configuring Webpack/Rollup builds, fixing Turbo task graph circular dependencies, writing Jest+RTL tests, Linaria CSS-in-JS styling, ESM module resolution. DO NOT USE FOR: non-crab-dev projects."
argument-hint: "Describe the component, token, build, or PnP task you need help with"
---

# Crab Dev Expert

> 本 SKILL 聚焦可操作流程与实战模板。通用规范（代码风格、提交规范、验收清单等）见 `copilot-instructions.md`，此处不重复。

---

## 一、组件创建流程

### 1. 准备：读取兄弟组件版本

创建 `package.json` 前，**必须先读取一个已有组件**（如 `components/rc-tag/package.json`）获取当前 devDependencies 版本号。不要猜测版本。

### 2. 脚手架文件清单

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

### 9. Demo 文件规范

每个 demo 文件必须以 JSDoc 注释开头声明元数据：

```typescript
/**
 * title = "基础用法"
 * description = "组件的基本展示"
 */

import { css } from "@linaria/core";
import Component from "../../src/index.js";

const BasicDemo = () => {
    return ( <Component>内容</Component> );
};

export default BasicDemo;
```

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
