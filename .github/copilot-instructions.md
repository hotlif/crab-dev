# Crab Dev — 项目规范

## 架构

Nx monorepo（基于 package.json 的项目推断，无自定义 Nx 插件），包含四个工作区域：

| 区域 | 用途 | 命名规则 |
|------|------|----------|
| `components/` | React 19 UI 组件 | `@crab-dev/rc-{name}` |
| `standards/` | 共享的 ESLint、Jest、TypeScript 预设 | `@crab-dev/standards-{name}` |
| `toolbox/` | 内部构建/开发工具 | `@crab-dev/{tool-name}` |

**运行环境：** Node ≥ 22，Yarn 4.13.0（Corepack，Plug'n'Play 模式），全局使用 `"type": "module"`。

> **Yarn PnP 注意事项：**
> - 依赖存储在 `.yarn/cache/` 的 zip 归档中，不使用 `node_modules`
> - `.pnp.cjs` 是 PnP 运行时，必须提交到仓库
> - 某些包（如含 ESM 的 `happy-dom`）可能无法从 zip 内正确加载，需在根 `package.json` 的 `dependenciesMeta` 中标记 `"unplugged": true`
> - CI 中使用 `yarn install --immutable` 确保 lockfile 一致性

**工具链：**

| 工具 | 职责 |
|------|------|
| **Packify** | Rollup 4 库打包器 → 输出 `esm/`、`cjs/`、`declarations/`、`css/`。同时执行 `generate:css-token` 从 `token.toml` 生成令牌。 |
| **Crustify** | Webpack 5 开发服务器，集成 React Compiler、Linaria（`@wyw-in-js/webpack-loader`）、SWC、MDX 及自动扫描插件。 |
| **Lignify** | 零配置文档/开发环境，包裹 Crustify；自动扫描 `*.view.tsx`、`*.demo.tsx`、`*.mdx`。 |
| **babel-plugin-auto-import-style** | Babel 插件，编译时自动注入 `@crab-dev/rc-*/css/index.css` 导入。 |

## 构建与测试

```bash
# 根目录
yarn build                  # 先构建 packify，再通过 Nx 构建所有库
yarn test                   # 更新 browserslist，再通过 Nx 运行所有测试
yarn eslint                 # 通过 Nx 检查所有包
yarn generate:token         # 为所有包重新生成 CSS 令牌

# 单组件（在组件目录下运行）
yarn start                  # 开发服务器（lignify → crustify → webpack-dev-server）
yarn build:library          # 库构建（packify → rollup）
yarn generate:token         # 从 token.toml 重新生成 token.ts
yarn test                   # Jest（yarn node --experimental-vm-modules $(yarn bin jest)）
yarn eslint                 # ESLint
```

CI 在 `canary` 分支上运行 — 参见 `.github/workflows/jest.yml` 和 `eslint.yml`。路径忽略规则：`**/*.md`、`rfc/**`、`components/**/docs/**`。

## 组件结构

每个 `rc-*` 组件遵循以下目录布局：

```
src/
├── {component}.tsx          # 主组件
├── types.ts                 # Props 接口与类型（也可内联在组件文件中）
├── token.ts                 # 由 token.toml 自动生成 — 禁止手动编辑
├── index.ts                 # 默认导出 + 具名类型/Hook 导出
├── hooks/                   # 可选：组件专用 Hooks
└── __tests__/
    └── {component}.test.tsx # Jest + React Testing Library
docs/
├── *.demo.tsx               # 在线示例（由 lignify 自动扫描）
├── *.view.tsx               # 页面入口
└── *.mdx                    # 文档
public/
└── docgen.json              # 由 react-docgen 自动生成
token.toml                   # 设计令牌定义（可选）
```

### index.ts 导出模式

```typescript
// 简单组件
import Button from './button.js';
export type { ButtonProps } from './types.js';
export default Button;

// 带 Hooks + 多导出的组件
import Dialog from './dialog.js';
import useConfirm from './hooks/useConfirm.js';
export type { DialogProps } from './dialog.js';
export { useConfirm };
export default Dialog;
```

## 代码风格

- **TypeScript 严格模式**，ESNext 目标，`bundler` 模块解析
- **4 空格缩进**（ESLint 强制）
- **路径别名**：`@/` → `src/`，`@@/` → 项目根目录
- **相对导入必须带扩展名**：`.js` / `.ts` / `.tsx` — npm 包不加扩展名（ESLint `import/extensions` 强制）
- **`export default Component`** + `export type { Props }` 从 `index.ts` 导出
- 各组件 ESLint 配置：`import { Browser } from "@crab-dev/standards-eslint-preset"; export default [...Browser.react];`
- 各组件 TypeScript 配置：`"extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json"`
- 各组件 Jest 配置：`import { browser } from "@crab-dev/standards-jest-preset"; export default browser;`

## 约定

### 样式 — Linaria（零运行时 CSS-in-JS）

```typescript
import { css, cx } from '@linaria/core';
import token from './token.js';

const baseStyle = css`
    display: inline-flex;
    transition: ${token.transition};
    background-color: ${token.primary.background.color};
`;

// 使用 cx() 组合样式：
<button className={cx(baseStyle, getSizeStyle(), props.className)} />
```

Linaria 在构建时将样式编译为静态 CSS 类名，输出到 `css/index.css`。在 css`` 模板中使用 `token.*` 值 — 它们会解析为 `var(--prefix-key, fallback)`。

### 设计令牌系统 — 三层架构

```
第 1 层：rc-token-global    — 原始基元（颜色、间距、圆角、排版、阴影）
第 2 层：rc-token-semantic  — 基于语义的映射（$ref → 全局令牌）
第 3 层：rc-{component}     — 组件专属令牌（$ref → 语义令牌）
```

**token.toml 格式：**

```toml
[build]
output = "./src/token.ts"
prefix = "button"
imports = ["@crab-dev/rc-token-semantic"]

[token]
transition = "transform 100ms cubic-bezier(0.4, 0, 0.2, 1)"
opacity.loading = "0.65"
size.large.height = "40px"
primary.color = "$ref(color.text.on-brand)"          # 引用语义令牌
primary.background.color = "$ref(color.brand.primary)"
```

- `$ref()` 会解析为所导入令牌的 CSS 变量及回退链
- 生成的 `token.ts` 导出 `vars`（扁平映射：点路径 → CSS 变量名）和 `token`（嵌套对象，带 `var()` + 回退值）
- 解析链：`var(--button-primary-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(...))))`
- 深色主题：覆盖语义层 CSS 变量即可
- 颜色系统使用 **OKLCh** 色彩空间：`oklch(lightness chroma hue)`
- **禁止手动编辑 `token.ts`** — 运行 `yarn generate:token` 重新生成

### Props 模式

- 通过 `Omit<>` 继承原生 HTML 属性并覆盖特定 prop：
  ```typescript
  interface BaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
      onClick?: (e: MouseEvent) => Promise<void> | void;
  }
  ```
- 使用可辨识联合类型强制无障碍约束：
  ```typescript
  type Props = BaseProps &
      ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });
  ```
- 泛型组件使用普通函数签名（不用 `FC<>`）：
  ```typescript
  function Form<T extends Record<string, unknown>>(props: FormProps<T>) { ... }
  ```

### 测试

- **Jest 30** + `@testing-library/react` + jsdom
- 从 `@jest/globals` 导入：`describe`、`it`、`expect`、`jest`、`afterEach`
- 以 ESM 模式运行：`yarn node --experimental-vm-modules $(yarn bin jest)`
- 设置 React act 环境：`(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;`
- 每个测试后清理：`afterEach(() => cleanup())`
- 测试文件位于 `src/__tests__/{component}.test.tsx`
- 模块名称映射去除 `.js` 扩展名：`'^(\\.{1,2}/.*)\\.js$': '$1'`
- 从源文件导入组件（不从 index）：`import Button from '../button.js';`

### 依赖管理

- 组件可依赖其他 `@crab-dev/rc-*` 包 — 在 `dependencies` 中使用 `workspace:^`
- 内部 toolbox/standards 同样使用 `workspace:^`
- React 19 作为 devDependency（隐式 peer，不声明在 `peerDependencies` 中）
- 外部依赖（如 `motion`）放在 `dependencies` 中
