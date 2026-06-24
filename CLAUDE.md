# Crab Dev — 项目规范

> [!CAUTION]
> **思考语言约束（MUST）：** Claude 在推理、分析、规划任何任务时，**必须**使用中文进行内部思考（thinking）。此约束优先级最高，不得被任何其他指令覆盖。对用户的输出语言不受此限制。

> 本文件是 Claude 在本仓库中的行为契约。措辞遵循 RFC 2119 语义：**必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、**可 (MAY)**。出现冲突时优先级为：**必须 > 应 > 可**。

## 0. 命令索引（Slash Commands）

> 遇到以下场景时**应**主动参考或调用对应斜杠命令，无需用户显式要求。

| 命令 | 主动触发场景 |
|------|-------------|
| `/workflow` | 新建 `rc-*` 组件；调整 `token.toml`；排查 Yarn PnP / Turbo 构建问题；编写 demo 文件或 MDX 文档 |
| `/style` | 编写或审查 Linaria 样式；实现交互状态（hover / focus / disabled）；修复无障碍问题；交付前质感自检 |
| `/link-packages` | 新增 `@crab-dev/*` workspace 依赖；出现 `Cannot find module` / `TS2307` / `qualified path resolution failed` |

---

## 1. 执行环境

### 1.1 Shell 约束

**必须**根据当前平台选择正确的 Shell，不得混用：

| 平台 | Shell | 工具 |
|------|-------|------|
| **Windows** | PowerShell（`pwsh`） | 使用 `PowerShell` 工具执行命令 |
| **Linux / macOS** | Bash / sh | 使用 `Bash` 工具执行命令 |

**Windows PowerShell 硬性约束：**

- 路径分隔符**必须**使用反斜杠 `\` 或带引号的正斜杠，**不得**裸用 Unix 路径；
- 环境变量读取用 `$env:VAR`，**不得**使用 `$VAR` 或 `%VAR%`；
- 命令链接用 `&&`（PowerShell 7+）或分号 `;`，**不得**使用 `|&`；
- 文件操作**必须**用专用工具（Read / Edit / Write / Glob / Grep），**不得**用 `cat`、`grep`、`find` 等 Unix 命令；
- 多行字符串（如 commit message）**必须**使用 here-string：`@'…'@`（单引号，列 0 对齐关闭符）；
- **不得**使用 `touch`、`which`、`rm -rf`，改用 PowerShell 等效命令。

**Linux / macOS Bash 硬性约束：**

- 多步命令用 `&&` 链接，确保前序失败时中断；
- 路径含空格**必须**加引号；
- **不得**使用 `\r\n` 换行（Windows 换行符会导致脚本解析失败）。

---

## 2. 项目拓扑

Turbo 驱动的 Yarn Monorepo，共五个顶层工作区，职责互不重叠：

| 工作区 | 职责 | 包命名 |
|--------|------|--------|
| `components/` | React 19 UI 组件库（当前 37 个 `rc-*` 包） | `@crab-dev/rc-{name}` |
| `standards/`  | 共享的 ESLint / Jest / TypeScript 预设 | `@crab-dev/standards-{name}` |
| `toolbox/`    | 内部构建与开发工具 | `@crab-dev/{tool-name}` |
| `.website`    | 官方文档站（私有，不发布） | `@crab-dev/website` |
| `styleify`    | 样式工具（规划中，目录暂不存在） | — |

**运行环境（硬性约束）：**

- Node.js **≥ 22**（CI 使用 **24.x**）
- Yarn **4.13.0**，经 Corepack 启用，采用 **Plug'n'Play (PnP)** 模式
- 所有 `package.json` 必须声明 `"type": "module"`（即所有包一律为 ESM）

**工具链：**

| 工具 | 定位 |
|------|------|
| **Packify**  | 基于 Rollup 4 的库打包器；产出 `esm/`、`cjs/`、`declarations/`、`css/`，并驱动 `generate:css-token` 从 `token.toml` 生成 `src/token.ts`。 |
| **Crustify** | 基于 Webpack 5 的开发服务器，集成 React Compiler、Linaria（`@wyw-in-js/webpack-loader`）、SWC、MDX 及自动扫描插件。 |
| **Lignify**  | 零配置文档 / 预览环境，封装 Crustify，自动扫描 `*.view.tsx`、`*.demo.tsx`、`*.mdx`。 |
| **babel-plugin-auto-import-style** | Babel 插件，编译期为消费方自动注入 `@crab-dev/rc-*/css/index.css`。 |

### 2.1 Yarn PnP 硬性事实

- 依赖以 zip 归档形式存放于 `.yarn/cache/`，**不存在** `node_modules`；
- `.pnp.cjs` 是 PnP 运行时，**必须**提交至版本库；
- `.yarnrc.yml` 中设置了 `enableScripts: false`，原生模块的安装脚本默认不执行；
- 少数含 ESM 的包无法从 zip 内正确加载，需在根 `package.json` 的 `dependenciesMeta` 中标记 `"unplugged": true`；
- CI 及本地重置安装**必须**使用 `yarn install --immutable` 以保证 lockfile 一致性。

---

## 3. 命令矩阵

### 3.1 根目录

| 命令 | 语义 |
|------|------|
| `yarn start`         | 启动文档站开发服务器（`@crab-dev/website`） |
| `yarn build:library` | 先构建 `packify`，再经 Turbo 拓扑构建全部库产物 |
| `yarn test`          | Turbo 并行运行全部测试 |
| `yarn lint`          | Turbo 并行运行全部 ESLint |
| `yarn typecheck`     | Turbo 并行运行全部类型检查 |
| `yarn generate:token`| 为全部使用令牌的包重新生成 `src/token.ts` |
| `yarn docs:dev`      | 文档站开发服务器（通过 Crustify CLI 启动） |
| `yarn docs:build`    | 文档站生产构建 |

### 3.2 单包（在包目录下执行）

| 命令 | 语义 |
|------|------|
| `yarn start`           | 生成 docgen → 生成 token → 启动开发服务器（lignify → webpack-dev-server） |
| `yarn build:library`   | 当前包库构建（packify → rollup） |
| `yarn generate:token`  | 基于当前包 `token.toml` 重新生成 `src/token.ts` |
| `yarn generate:docgen` | 生成 `public/docgen.json`（react-docgen 产物，`yarn start` 前自动执行） |
| `yarn test`            | Jest，以 ESM 模式运行（`yarn node --experimental-vm-modules $(yarn bin jest)`） |
| `yarn eslint`          | 当前包 ESLint |
| `yarn typecheck`       | 当前包 TypeScript 类型检查 |

### 3.3 CI

工作流定义于 `.github/workflows/test.yml`、`lint.yml` 与 `typecheck.yml`，针对 `canary` 分支触发。路径忽略：`**/*.md`、`rfc/**`、`components/**/docs/**`。运行环境：`ubuntu-latest`，Node **24.x**，Yarn 4.13.0（Corepack）。

---

## 4. 变更规则

### 4.1 必须 (MUST)

1. **ESM 语义**：相对导入**必须**保留显式扩展名（`.js` / `.ts` / `.tsx`）；`npm` 包导入**不得**带扩展名。由 ESLint `import/extensions` 强制。
2. **生成文件不可手改**：`src/token.ts`、`public/docgen.json`、`esm/`、`cjs/`、`declarations/`、`css/` 及 `coverage/` **不得**手工编辑或直接提交差异；必要时只能通过对应命令重新生成。
3. **Linaria 模板**：`` css`...` `` 模板中**不得**使用运行时变量（props、state、函数入参）进行条件插值（详见 §6.1）。
4. **Yarn PnP 依赖声明**：引用 workspace 内部包**必须**使用 `workspace:^` 协议；**不得**在任一包中出现 `node_modules` 路径或相对路径依赖。
5. **交付准入**：**不得**提交破坏 lint / test / typecheck / build 的变更。
6. **不越权**：**不得**修改未被任务直接要求的文件；**不得**顺带做与任务无关的重命名、格式化或重构。

### 4.2 应 (SHOULD)

1. 新增与修改组件**应**遵循 §5 的目录结构与 `index.ts` 导出模式；
2. 任何影响行为的改动**应**伴随最小可验证测试；
3. **应**优先选择最小改动路径，避免跨包涟漪；
4. 遇到失败时**应**按 §4.4 的失败处理流程执行。

### 4.3 可 (MAY)

1. 在不改变对外 API 的前提下**可**做局部可读性重构；
2. **可**补充示例 demo 与说明性注释（不得提交无关的文档文件）。

---

## 5. 任务执行流程

### 5.1 Definition of Done（按影响面选取最小命令集）

| 影响面 | 必跑命令 |
|--------|----------|
| 组件源码（`components/rc-*/src/**`） | `yarn eslint` + `yarn test` |
| 设计令牌（`token.toml` 或消费 `token.*`） | `yarn generate:token` + `yarn eslint` + `yarn test` |
| 构建配置 / 导出边界 / Rollup / Webpack | `yarn build:library` + `yarn test` |
| `standards/*` 预设改动 | 至少选取一个受影响的下游包运行 `yarn eslint` / `yarn test` |
| `toolbox/*` 工具改动 | 根目录 `yarn build:library` |

验收硬性条件：

- 选定命令全部通过且**不得**引入新的告警；
- 对外导出（`index.ts`）与类型导出保持一致；
- 所有生成文件为命令产物，非手改。

### 5.2 常用 Playbook

#### A. 新增 `rc-*` 组件

1. 在 `components/` 下创建 `rc-{name}`，补齐：`package.json`、`tsconfig.json`、`eslint.config.js`、`jest.config.mjs`；
2. `src/` 下创建 `{component}.tsx`、`index.ts`、（可选）`types.ts` 与 `__tests__/{component}.test.tsx`；
3. 若需令牌：创建 `token.toml` → 执行 `yarn generate:token` → 仅消费生成的 `src/token.ts`；
4. `docs/` 下添加至少一个 `*.demo.tsx` 或 `*.view.tsx` 供预览；
5. 校验 `index.ts` 采用 default 导出组件并具名导出类型 / Hook；
6. 运行最小验收命令（见 §5.1）。

#### B. 新增或调整设计令牌

1. 编辑 `token.toml`，**必须**优先以 `$ref()` 引用上一层令牌（见 §7.2）；
2. 执行 `yarn generate:token`，仅接受其产物；
3. 样式代码通过 `token.*` 消费变量，**不得**在模板中进行运行时分支；
4. 执行 §5.1 中设计令牌对应的最小命令集。

#### C. workspace 包解析 / PnP 解析失败

1. 在对应 `package.json` 以 `workspace:^` 补齐依赖；
2. 执行 `yarn install --immutable`；
3. 若 ESM 包无法从 zip 加载，于根 `package.json` 的 `dependenciesMeta` 增加 `"unplugged": true`；
4. 重新执行对应最小命令集。

### 5.3 失败处理流程

1. **分类**：判定失败属于 类型 / Lint / 测试 / 构建 / 依赖解析；
2. **定点修复**：仅修复与本次改动直接相关的失败，**不得**扩大改动面；
3. **最小复验**：只跑受影响的包或命令；
4. **上限 3 轮**：连续 3 轮仍未恢复，**必须**停止扩改，输出结构化报告：
   - 失败命令
   - 关键报错摘要
   - 已尝试的修复动作
   - 建议下一步（回滚局部改动 / 拆分任务 / 请求补充上下文）。

---

## 6. 组件目录与导出

每个 `rc-*` 组件**必须**遵循以下布局：

```
src/
├── {component}.tsx          # 主组件
├── types.ts                 # Props 与对外类型（允许与组件同文件）
├── token.ts                 # 由 token.toml 生成 —— 不得手改
├── index.ts                 # default 导出组件 + 具名导出类型 / Hook
├── hooks/                   # 可选：组件内部 Hook
└── __tests__/
    └── {component}.test.tsx # Jest + React Testing Library
docs/
├── *.demo.tsx               # 在线示例（lignify 自动扫描）
├── *.view.tsx               # 页面入口
└── *.mdx                    # 说明文档
public/
└── docgen.json              # react-docgen 生成 —— 不得手改
token.toml                   # 设计令牌定义（可选）
```

`index.ts` 必须采用以下两种形态之一：

```typescript
// 形态 1：单一组件
import Button from './button.js';
export type { ButtonProps } from './types.js';
export default Button;

// 形态 2：组件 + 附属 Hook / 类型
import Dialog from './dialog.js';
import useConfirm from './hooks/useConfirm.js';
export type { DialogProps } from './dialog.js';
export { useConfirm };
export default Dialog;
```

### 6.1 代码风格硬性约束

- TypeScript **严格模式**，`target: ESNext`，`moduleResolution: bundler`；
- **4 空格**缩进（ESLint 强制）；
- 路径别名：`@/` → `src/`，`@@/` → 仓库根；
- 每包必须基于标准预设，不得重写：
  - ESLint：`import { Browser } from "@crab-dev/standards-eslint-preset"; export default [...Browser.react];`
  - TypeScript：`"extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json"`
  - Jest：`import { browser } from "@crab-dev/standards-jest-preset"; export default browser;`

---

## 7. 技术约定

### 7.1 样式 — Linaria（零运行时 CSS-in-JS）

Linaria 在**构建时**将 `` css`...` `` 模板编译为静态类；`token.*` 值会被解析为 `var(--prefix-key, fallback)` 形式并最终写入 `css/index.css`。

```typescript
import { css, cx } from '@linaria/core';
import token from './token.js';

const baseStyle = css`
    display: inline-flex;
    transition: ${token.transition};
    background-color: ${token.primary.background.color};
`;

<button className={cx(baseStyle, getSizeStyle(), props.className)} />
```

> **严禁：**在 `` css`...` `` 模板中通过运行时变量（props、state、函数入参）进行条件插值。Linaria 为零运行时方案，模板内所有插值**必须**在构建期可求值。

```typescript
// ❌ 错误 —— 运行时变量在构建期不存在
const style = css`
    border-color: ${bordered ? token.primary['border-color'] : 'transparent'};
`;

// ✅ 正确 —— 拆成静态样式，使用 cx() 在运行时组合
const borderedStyle = css`
    border-color: ${token.primary['border-color']};
`;
const noBorderStyle = css`
    border-color: transparent;
`;

<span className={cx(baseStyle, bordered ? borderedStyle : noBorderStyle)} />
```

### 7.2 设计令牌系统（三层架构）

```
L1  rc-token-global    —— 原始基元（颜色、间距、圆角、排版、阴影）
L2  rc-token-semantic  —— 语义映射（$ref → L1）
L3  rc-{component}     —— 组件专属令牌（$ref → L2）
```

`token.toml` 示例：

```toml
[build]
output  = "./src/token.ts"
prefix  = "button"
imports = ["@crab-dev/rc-token-semantic"]

[token]
transition                   = "transform 100ms cubic-bezier(0.4, 0, 0.2, 1)"
opacity.loading              = "0.65"
opacity.disabled             = "0.4"
size.large.height            = "40px"
size.large.padding           = "0 $ref(space.control-padding-x)"
size.large.border.radius     = "$ref(radius.lg)"
primary.color                = "$ref(color.text.on-brand)"
primary.background.color     = "$ref(color.brand.primary)"
primary.background.color-hover = "$ref(color.brand.primary-hover)"
```

规则：

- `$ref()` 将被解析为对应 CSS 变量及回退链；
- 生成的 `token.ts` 导出 `vars`（扁平映射：点路径 → CSS 变量名）与 `token`（嵌套对象，值为 `var()` + fallback）；
- 典型解析链：`var(--button-primary-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(...))))`；
- 颜色系统**必须**使用 **OKLCh** 色彩空间：`oklch(lightness chroma hue)`；
- 主题切换**必须**通过覆盖 L2 CSS 变量实现，**不得**在组件层做分支；
- `src/token.ts` **不得**手改。

### 7.3 Props 模式

```typescript
// 继承原生属性并覆盖特定 prop
interface BaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onClick?: (e: MouseEvent) => Promise<void> | void;
}

// 使用可辨识联合强制无障碍约束
type Props =
    & BaseProps
    & (
        | { children: ReactNode;  'aria-label'?: string }
        | { children?: never;     'aria-label': string  }
    );

// 泛型组件使用普通函数签名（不得使用 React.FC）
function Form<T extends Record<string, unknown>>(props: FormProps<T>) { /* ... */ }
```

### 7.4 测试

- **Jest 30** + `@testing-library/react` + jsdom；
- **必须**从 `@jest/globals` 导入 `describe` / `it` / `expect` / `jest` / `afterEach`；
- **必须**以 ESM 模式运行：`yarn node --experimental-vm-modules $(yarn bin jest)`；
- **必须**开启 React act 环境：`(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;`
- **必须**在每个测试后清理：`afterEach(() => cleanup())`；
- 测试文件位置：`src/__tests__/{component}.test.tsx`；
- Jest `moduleNameMapper` 去除 `.js` 扩展名：`'^(\\.{1,2}/.*)\\.js$': '$1'`；
- **必须**从源文件导入被测组件，**不得**从 `index.ts` 导入：`import Button from '../button.js';`

### 7.5 依赖管理

- 内部 `@crab-dev/*` 包（含 components / toolbox / standards）**必须**声明为 `"workspace:^"`；
- React 19 **必须**放在 `devDependencies`（作为隐式 peer，不得声明于 `peerDependencies`）；
- 外部运行时依赖（如 `motion`）**必须**声明在 `dependencies`；
- 构建期工具（打包器、插件、预设）**必须**声明在 `devDependencies`。

---

## 8. 变更边界（Guardrails）

除非任务明确要求，**不得**直接修改：

- 构建产物：`cjs/`、`esm/`、`declarations/`、`css/`
- 覆盖率与缓存：`coverage/`、`.turbo/`、临时缓存
- 自动生成文件：`src/token.ts`、`public/docgen.json`、`.pnp.*`（PnP 运行时除外——新增依赖后必须提交更新）

如需刷新这些产物，**必须**通过对应命令生成，而非手工编辑。

---

## 9. AI 代码生成行为约束

### 9.1 上下文与边界

1. 生成任何代码前，**必须**先阅读相关文件以确认真实状态，**不得**凭记忆或命名猜测 API、路径、类型、导出形态；
2. **必须**严格遵循 §4「变更规则」与 §8「变更边界」，**不得**修改未被任务直接要求的文件；
3. **不得**新建与任务无关的文件（含 README、变更说明、示例），除非用户明确要求；
4. **不得**为已存在但未被触及的代码补写 docstring、注释或类型注解；
5. **不得**顺带重命名、重排 import、重新格式化未被任务直接要求的代码段。

### 9.2 产物一致性

1. 生成的代码**必须**能在当前仓库直接通过 §5.1 对应影响面的最小验收命令集；
2. **不得**输出占位实现（`TODO`、`// implement later`、空函数体）作为最终交付；
3. **不得**捏造依赖包、API、类型名、CSS 变量、token 路径；涉及以上对象时**必须**从源文件或生成产物中核实；
4. 引用内部包时**必须**使用 `@crab-dev/*` 具名导入与 `workspace:^` 协议，**不得**使用相对路径跨包引用；
5. 涉及 `token.toml` 改动时，**必须**一并调用 `yarn generate:token`，并将 `token.toml` 与生成的 `src/token.ts` 一并交付（见 §7.2 / §10.6）。

### 9.3 规范遵从

1. TypeScript **不得**使用 `any` 与非必要的 `as unknown as` 强转；类型缺失时优先补齐 `types.ts` 而非就地断言；
2. 样式**必须**走 Linaria + `token.*`，**不得**内联 `style={{...}}`，**不得**在 `` css`...` `` 模板中插入运行时变量（§7.1）；
3. React 组件**必须**遵循 §7.3 Props 模式：原生属性继承用 `Omit<...>`，无障碍约束用可辨识联合，泛型组件用普通函数签名；
4. 导出形态**必须**匹配 §6 的 `index.ts` 两种形态之一；
5. 测试**必须**遵循 §7.4：从 `@jest/globals` 导入、ESM 运行、`afterEach(cleanup)`、从源文件而非 `index.ts` 导入被测对象。

### 9.4 错误处理边界

1. **仅**在系统边界（用户输入、网络、文件 I/O、跨包 API）做输入校验与错误处理；
2. **不得**为内部调用添加防御性 `try/catch` 或不可能触发的分支；
3. **不得**吞错：`catch` 块必须或抛出、或转换为可观测错误，**不得**空 `catch`。

### 9.5 执行纪律

1. 对可逆的本地动作（编辑文件、运行测试、重跑生成）**可**直接执行；
2. 对不可逆或影响面大的动作**必须**先确认后执行，包括：删除文件 / 分支、`git reset --hard`、`git push --force`、修订已推送提交、发布包、修改共享 CI；
3. **不得**使用 `--no-verify`、`--force` 等绕过仓库校验的开关；
4. 失败处理严格按 §5.3，**上限 3 轮**后停止扩改并输出结构化报告。

### 9.6 输出与报告

1. 给用户的回复**必须**简洁，聚焦"改了什么 / 为什么这样改 / 如何验证"；
2. **不得**在回复中粘贴未经实际执行验证的命令输出或虚构的测试结果；
3. 对存在不确定性的地方**必须**显式标注（而非默默选择一种），并给出最小可选项；
4. **不得**擅自扩展任务范围或追加"顺手优化"；如发现仓库存在与本次任务无关的问题，**应**仅以提示形式列出，由用户决策。

### 9.7 安全基线

1. **不得**生成硬编码凭证、密钥、令牌、真实邮箱 / 手机号；
2. **不得**引入未声明来源的二进制或远程脚本；
3. **不得**在代码中直接拼接未转义的 HTML / SQL / Shell 片段；涉及 DOM 写入必须使用 React 原生机制，**不得**使用 `dangerouslySetInnerHTML` 除非任务明确需要并附来源说明；
4. 对 OWASP Top 10 相关风险点（XSS、注入、不安全反序列化、权限绕过等）**必须**主动规避。

### 9.8 UI 质感与交互细节

本仓库是组件库，视觉与交互质量是交付的核心指标。AI 生成的 UI 代码**不得**止步于"功能可用"，**必须**达到可直接上架的质感。编写或审查样式时**应**主动参考 `/style` 命令以获取设计四原则、全量状态规范与交付自检清单。

**硬性禁止（MUST NOT）：**

| # | 禁止行为 | 正确替代 |
|---|----------|---------|
| 1 | 组件内出现魔法数值（`12px`、`#000`、`0.65`）| 先在 `token.toml` 中补令牌，再通过 `token.*` 引用 |
| 2 | `` css`...` `` 模板中插值运行时变量（props / state）| 拆成多个静态样式，用 `cx()` 运行时组合 |
| 3 | `outline: none` 而无 `:focus-visible` 替代 | 必须为键盘焦点提供可见指示 |
| 4 | 内联 `style={{...}}` / 写死 `z-index` 数字 | 走 Linaria + `token.*` / 语义层令牌 |
| 5 | hover / active 态切换 `border-width` 导致布局跳动 | 用 `box-shadow` / `outline` 模拟强调效果 |

> 写完后**必须**自问：每一个像素、每一次反馈、每一层状态，是否都能在 crab-dev 令牌层与设计四原则（精准 / 克制 / 理性 / 稳态）中找到解释？任一处解释不通，**必须**继续打磨而非交付。

---

## 10. 提交规范

采用 Conventional Commits，结合 monorepo scope：

```
<type>(<scope>): <subject>
```

### 10.1 Type

允许值：`feat` / `fix` / `refactor` / `perf` / `test` / `docs` / `build` / `ci` / `chore` / `revert`。

### 10.2 Scope

- **单包改动**：使用具体包名，如 `rc-button`、`rc-tag`、`packify`、`standards-jest-preset`；
- **同工作区多包同类改动**：使用 `components` / `standards` / `toolbox`；
- **跨仓基础设施**（Turbo、根配置、CI）：使用 `repo` 或 `ci`。

### 10.3 Subject

- **必须**使用祈使句；
- **必须**小写开头，末尾**不得**加句号；
- 长度**应** ≤ 72 字符。

### 10.4 Breaking Change

- **必须**在 header `type` 后追加 `!`，例：`feat(rc-form)!: rename field api`；
- **必须**在 body 中追加 `BREAKING CHANGE: <impact>` 段落。

### 10.5 提交粒度（硬性约束）

- 一个 commit **必须**只做一件事（功能、修复、重构分开）；
- 生成文件**仅**在与其触发变更同一次 commit 中提交；
- **不得**将无关格式化、重命名或大规模移动与功能改动混入同一 commit；
- 每个 commit **必须**能独立通过对应的最小验收命令集。

### 10.6 多类改动的拆分顺序

按以下顺序拆分：

1. `refactor`：无行为变化的重构（重命名、提取函数、目录整理）；
2. `feat` / `fix`：功能或缺陷修复（触发生成文件刷新时，`token.toml` 与生成的 `src/token.ts` 必须合并进同一 commit）；
3. `test`：测试补充或调整；
4. `docs`：文档 / 示例 / 注释；
5. `build` / `ci` / `chore`：构建脚本、流水线、仓库维护。

**正例：**

- `feat(rc-tag): add closable interaction and keyboard support`
- `fix(rc-date-picker): prevent timezone offset regression`
- `refactor(components): unify token import path handling`
- `build(packify): align css token generation hook`
- `ci(repo): run eslint and jest on canary changes`

**反例（禁止）：**

- `feat` 与无关 `docs`、`ci` 混合；
- 多个组件的无关改动打包进同一 commit；
- 先提交生成文件、后提交触发它的源码。

### 10.7 提交前自检

- 已通过对应最小验收命令集（§5.1）；
- 未误提交 `coverage/`、临时缓存、编辑器配置；
- 未手动编辑任何生成文件。
