# Crab Dev — 项目规范

## 架构

Turbo monorepo（基于 package.json 的项目推断），包含四个工作区域：

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
yarn build                  # 先构建 packify，再通过 Turbo 构建所有库
yarn test                   # 通过 Turbo 运行所有测试
yarn eslint                 # 通过 Turbo 检查所有包
yarn generate:token         # 为所有包重新生成 CSS 令牌

# 单组件（在组件目录下运行）
yarn start                  # 开发服务器（lignify → crustify → webpack-dev-server）
yarn build:library          # 库构建（packify → rollup）
yarn generate:token         # 从 token.toml 重新生成 token.ts
yarn test                   # Jest（yarn node --experimental-vm-modules $(yarn bin jest)）
yarn eslint                 # ESLint
```

CI 在 `canary` 分支上运行 — 参见 `.github/workflows/jest.yml` 和 `eslint.yml`。路径忽略规则：`**/*.md`、`rfc/**`、`components/**/docs/**`。

## 执行优先级（Instruction Priority）

当规则冲突时，按以下顺序决策：

1. **Must（必须）**：违反会导致错误、构建失败、规范破坏或产物不一致。
2. **Should（应该）**：默认遵循，若因上下文限制无法满足，需在变更说明中标注原因。
3. **Can（可选）**：增强项，仅在不影响 Must/Should 的前提下采用。

### Must

- 保持 ESM 语义与导入规则：相对导入保留扩展名（`.js`）
- 禁止手动编辑 `src/token.ts`（仅通过 `yarn generate:token` 生成）
- Linaria `css`` 模板中禁止使用运行时变量（props/state）
- 依赖声明遵循 Yarn 4 PnP：workspace 包使用 `workspace:^`
- 不提交破坏性更改（构建失败、测试失败、类型错误）

### Should

- 遵循组件目录结构与 `index.ts` 导出模式
- 新增/修改组件时补充最小必要测试
- 优先最小改动，避免无关重构

### Can

- 在不改变外部 API 前提下做轻量重构（可读性、重复代码收敛）
- 补充文档示例与说明性注释

## 任务验收清单（Definition of Done）

按改动范围选择最小检查集：

### 组件代码改动（`components/rc-*/src/**`）

```bash
yarn eslint
yarn test
```

### 涉及设计令牌（`token.toml` 或样式 token 使用）

```bash
yarn generate:token
yarn eslint
yarn test
```

### 涉及构建配置/导出边界（Rollup/Webpack/入口导出）

```bash
yarn build
yarn test
```

验收标准：

- 相关命令通过，无新增错误
- 导出入口与类型导出一致
- 无手改生成文件（尤其 `src/token.ts`）

## 常见任务 Playbook

### Playbook A：新增 rc-* 组件

1. 在 `components/` 下创建 `rc-{name}`，补齐基础文件：`package.json`、`tsconfig.json`、`eslint.config.js`、`jest.config.mjs`。
2. 在 `src/` 创建 `{component}.tsx`、`index.ts`、`types.ts`（可选）与 `__tests__/{component}.test.tsx`。
3. 若需要令牌，在根目录添加 `token.toml`，执行 `yarn generate:token` 生成 `src/token.ts`。
4. 在 `docs/` 添加最小 `*.demo.tsx` 或 `*.view.tsx` 用于预览验证。
5. 确认 `index.ts` 为 default 导出组件，并导出类型/Hook。
6. 执行 `yarn eslint`、`yarn test`，必要时执行 `yarn build:library`。

### Playbook B：新增/调整 token

1. 修改 `token.toml`，优先通过 `$ref()` 引用语义令牌。
2. 执行 `yarn generate:token`，仅接受生成结果，不手改 `src/token.ts`。
3. 在组件样式中通过 `token.*` 使用变量，避免运行时分支插值。
4. 执行 `yarn eslint`、`yarn test`，必要时执行 `yarn build` 验证产物。

### Playbook C：修复 workspace 包解析/PnP 问题

1. 确认依赖是否在对应 `package.json` 声明（workspace 包使用 `workspace:^`）。
2. 运行安装并校验：`yarn install --immutable`。
3. 若 ESM 包在 zip 中加载异常，按需在根 `package.json` 的 `dependenciesMeta` 标记 `"unplugged": true`。
4. 重新执行 `yarn eslint` / `yarn test` / `yarn build` 验证。

## 变更边界（Guardrails）

默认不直接修改以下内容，除非任务明确要求：

- 构建产物目录：`cjs/`、`esm/`、`declarations/`、`css/`
- 覆盖率与缓存产物：`coverage/`、临时缓存文件
- 自动生成文件：`src/token.ts`、`public/docgen.json`

若需要更新这些文件，应通过对应命令生成，而不是手工编辑。

## 失败回退策略（Failure Handling）

当修改后出现失败时，按顺序处理：

1. **先定位失败类别**：类型、Lint、测试、构建、依赖解析。
2. **最小修复一次**：仅修复与本次改动直接相关问题，避免扩大改动面。
3. **再次验证**：执行对应最小命令集（例如只跑目标包的 test/eslint）。
4. **最多尝试 3 轮**：若仍失败，停止继续扩改，输出失败点与已尝试步骤，请求人工决策。

输出失败信息时应包含：

- 失败命令
- 关键报错摘要
- 已尝试修复动作
- 建议下一步（回滚局部改动 / 拆分任务 / 补充上下文）

## 提交规范（Commit Convention）

采用 Conventional Commits，并结合 monorepo scope：

`<type>(<scope>): <subject>`

- type 允许值：`feat`、`fix`、`refactor`、`perf`、`test`、`docs`、`build`、`ci`、`chore`、`revert`
- scope 优先使用工作区或包名：`rc-button`、`rc-tag`、`packify`、`standards-jest-preset`、`repo`
- subject 使用祈使句，首字母小写，不加句号，建议不超过 72 字符

### Breaking Change

- 破坏性变更在 header 后追加 `!`：`feat(rc-form)!: rename field api`
- 并在 commit body 中追加：`BREAKING CHANGE: <impact>`

### 提交粒度

- 一个 commit 只做一件事（功能、修复、重构分开提交）
- 生成文件与源码变更同 commit 提交，仅当该生成文件由本次改动直接触发
- 禁止把无关格式化、重命名、大规模移动与功能改动混在同一 commit

### 分不同 commit 提交策略

当一次开发包含多类改动时，按以下顺序拆分提交：

1. `refactor`：不改变行为的重构（重命名、提取函数、目录整理）。
2. `feat` / `fix`：实际功能或缺陷修复。
3. `test`：补充或调整测试用例。
4. `docs`：文档、示例、注释更新。
5. `build` / `ci` / `chore`：构建脚本、流水线、仓库维护。

执行要求：

- 每个 commit 必须可独立通过最小验证（至少 lint + 相关 test）
- 若某步依赖上一步，保持历史线性，不交叉混入其他类型改动
- 自动生成文件应与触发它的源码改动放在同一个 commit

常见拆分示例：

- 新增组件并补测试：`feat(rc-xx)` + `test(rc-xx)` + `docs(rc-xx)`
- 调整 token 并重生成：`feat(rc-xx)`（含 `token.toml` 与生成的 `src/token.ts`）+ `test(rc-xx)`
- 修复构建与业务 bug 同时出现：`fix(rc-xx)` + `build(repo)`

反例（禁止）：

- `feat` 与无关 `docs`、`ci` 混在一个 commit
- 多个组件无关联改动打包成单个 commit
- 先提交生成文件，后提交触发它的源码

### Monorepo Scope 约定

- 单包改动：使用具体包名 scope，例如 `fix(rc-checkbox): correct indeterminate style`
- 多包同类改动：使用 `components` / `standards` / `toolbox`
- 跨仓级别改动（turbo、根配置、工作流）：使用 `repo` 或 `ci`

### 提交前检查

- 至少通过本次改动对应的最小验收命令集（见 Definition of Done）
- 确认无误改产物与缓存目录（`coverage/`、临时文件）
- 确认未手动编辑生成文件（尤其 `src/token.ts`）

### 示例

- `feat(rc-tag): add closable interaction and keyboard support`
- `fix(rc-date-picker): prevent timezone offset regression`
- `refactor(components): unify token import path handling`
- `build(packify): align css token generation hook`
- `ci(repo): run eslint and jest on canary changes`

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

> **⚠️ 严禁在 `css` 模板中使用运行时变量进行条件判断。** Linaria 是零运行时方案，`css``` 内的插值在**构建时**求值，JavaScript 变量（如 props、state）此时不存在。
>
> ```typescript
> // ❌ 错误 — 运行时变量在构建时无法求值
> const style = css`
>     border-color: ${bordered ? token.primary['border-color'] : 'transparent'};
> `;
>
> // ✅ 正确 — 拆分为独立静态样式，通过 cx() 在运行时组合
> const borderedStyle = css`
>     border-color: ${token.primary['border-color']};
> `;
> const noBorderStyle = css`
>     border-color: transparent;
> `;
> <span className={cx(baseStyle, bordered ? borderedStyle : noBorderStyle)} />
> ```

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
