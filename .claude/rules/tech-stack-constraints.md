# 技术栈与技术约束（Tech Stack Constraints）

> 本文件定义 **crab-dev** 仓库的技术栈与技术性硬约束。措辞遵循 RFC 2119 语义：
> **必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、**可 (MAY)**。
> 冲突时优先级：**MUST > SHOULD > MAY**。
>
> **范围声明**：本文件**只**覆盖技术栈与技术约束（运行环境、模块体系、React API、样式、
> 令牌、类型、依赖、生成文件边界）。工作流、提交规范、UI 质感、AI 协作行为等**不在**本文件，
> 见 `.claude/rules/` 下对应规则文件。本文件与根 `CLAUDE.md` 的"关键约束"一致、互为展开，
> 出现歧义以 `CLAUDE.md` 为准。

---

## §1 运行环境与工作区拓扑

**运行环境（硬性）：**

- Node.js **必须 ≥ 22**；
- 包管理器**必须**为 **Yarn 4.13.0**，经 Corepack 启用，采用 **Plug'n'Play (PnP)** 模式；
- 全仓 ESM：每个 `package.json` **必须**声明 `"type": "module"`。

**四个工作区，职责互不重叠：**

| 工作区 | 职责 | 包命名 |
|--------|------|--------|
| `components/` | React 19 UI 组件库（含 `rc-token-global` / `rc-token-semantic` 令牌包） | `@crab-dev/rc-{name}` |
| `standards/`  | 共享 ESLint / Jest / TypeScript 预设 | `@crab-dev/standards-{name}` |
| `toolbox/`    | 内部构建与开发工具 | `@crab-dev/{tool}` |
| `.website/`   | 文档站（私有，不发布） | — |

**工具链定位：**

| 工具 | 定位 |
|------|------|
| **packify**  | 基于 Rollup 4 的库打包器；产出 `esm/`、`cjs/`、`declarations/`、`css/`，并驱动 `generate:css-token` 从 `token.toml` 生成 `src/token.ts`。 |
| **crustify** | 基于 Webpack 5 的开发服务器；集成 **React Compiler**、Linaria（`@wyw-in-js/webpack-loader`）、SWC、MDX 与自动扫描插件。 |
| **lignify**  | 零配置文档 / 预览环境，封装 crustify，自动扫描 `*.view.tsx`、`*.demo.tsx`、`*.mdx`。 |
| **babel-plugin-auto-import-style** | 编译期为消费方自动注入 `@crab-dev/rc-*/css/index.css`。 |

---

## §2 Yarn PnP 硬性约束

- **无 `node_modules`**：依赖以 zip 归档存于 `.yarn/cache/`；
- `.pnp.cjs` 是 PnP 运行时，**必须**提交至版本库；
- 含 ESM 的包无法从 zip 内正确加载时，**必须**在根 `package.json` 的 `dependenciesMeta`
  标记 `"unplugged": true`；
- 依赖变更后**必须**执行 `yarn install --immutable`，以保证 lockfile 一致。

---

## §3 ESM 模块约束

- 相对导入**必须**带显式扩展名：引用 `.tsx` / `.ts` 源文件一律写 **`.js`**；
- npm 包导入**不得**带扩展名；
- 以上由 ESLint `import/extensions` 强制；
- 路径别名：`@/` → `src/`，`@@/` → 仓库根。

```typescript
import Button from './button.js';                 // ✅ 相对导入带 .js（实为 .tsx）
import { css, cx } from '@linaria/core';          // ✅ npm 包不带扩展名
import Button from './button.tsx';                // ❌ 不得用 .tsx
import Button from './button';                     // ❌ 不得省略扩展名
```

---

## §4 React 19 现代 API 约束（核心）

本仓库基于 **React 19**，且 **React Compiler 已全局启用**（crustify / packify 经
`babel-plugin-react-compiler`，`target: '19'`）。组件代码**必须**采用 React 19 现代 API，
**不得**沿用已被取代的旧写法。

### 4.1 记忆化与 ref：默认交编译器，例外手动控制

**默认（MUST）：**

- **不得**手写 `useMemo` / `useCallback` / `React.memo`，由 React Compiler 自动记忆化，手写反而干扰；
- **必须**遵守 Rules of React（渲染为纯函数、不在渲染期读写 ref / 外部可变量、不产生副作用），
  否则编译器对该组件**降级**、优化失效。

**例外白名单：** 以下情形手动控制 ref / 手写记忆化是**正当**的，不受上述默认约束。但凡使用例外，
**必须**在紧邻代码处注释标明属于哪一类及原因，便于审查区分"有意优化"与"遗留旧写法"。

1. **可变实例状态 ref（MUST 手动）**：跨渲染 / 跨事件持有、且**不应触发渲染**的可变值——
   定时器句柄、拖拽中标志、进入编辑时的原值快照、DOM 测量缓存等。这是 `useRef` 的本职，
   与记忆化无关，编译器不会也不应接管。

2. **latest-ref 模式（MAY 手动，需权衡）**：需要在事件处理器 / effect 中读取**最新**的
   prop / state / 回调，却**不希望**它进入依赖而触发 effect 重跑或重算时，可在渲染期用
   `ref.current = latest` 持有最新值。注意：渲染期写 ref 违反 Rules of React，会使编译器
   对该组件**降级**——这是用「手动精确控制触发时机」换「编译器自动优化」的有意取舍。
   - 若**只**在 effect 中读取最新值，**应**优先用 `useEffectEvent` 替代 latest-ref
     （它正是为此设计，且不违反 Rules of React）。

3. **编译器无法静态推断的稳定性（MAY 手写 memo）**：依赖需**值相等**而非引用相等
   （如以 `join()` 结果 / 自定义 key 作 `useMemo` 依赖）；或派生结果需作为 `useEffect`
   依赖且必须保持引用稳定；或编译器无法判定纯度的昂贵计算。

4. **面向库消费方的稳定化（MAY 手写）**：本仓库是组件库，消费方**不一定**启用 React Compiler。
   当组件接收用户传入的内联回调 / 字面量对象、且其引用稳定性直接影响下游重算时，
   可手动用 ref / memo 稳定化，避免在未编译的消费侧出现性能退化。

### 4.2 ref 作为普通 prop（不得用 forwardRef）

- **不得**使用 `forwardRef`；`ref` **必须**作为普通 prop 声明并透传；
- 需要在挂载/卸载时清理副作用时，**应**使用 **ref callback 的 cleanup 返回值**。

```typescript
import type { Ref, InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    ref?: Ref<HTMLInputElement>;
}

// ✅ ref 直接作为 prop
function Input({ ref, ...props }: InputProps) {
    return <input ref={ref} {...props} />;
}

// ✅ ref callback 返回 cleanup（React 19）
<div ref={(node) => {
    const ob = new ResizeObserver(/* ... */);
    if (node) ob.observe(node);
    return () => ob.disconnect();
}} />
```

### 4.3 读取 context 必须用 `use()`（含存量迁移）

- 读取 context **必须**用 `use(Context)`，**不得**用 `useContext(Context)`；
- `use()` 可在条件分支内调用，语义更灵活；
- **存量迁移（MUST）**：现存以 `useContext` 实现的 context hook **必须**改写为 `use()`。

```typescript
// ❌ 旧写法
import { useContext } from 'react';
const ctx = useContext(FormContext);

// ✅ React 19
import { use } from 'react';
const ctx = use(FormContext);
```

### 4.4 Provider 必须用 `<Context>` 简写（含存量迁移）

- 提供 context **必须**用 `<Context value={...}>`，**不得**用 `<Context.Provider value={...}>`；
- **存量迁移（MUST）**：现存 `<XxxContext.Provider>` **必须**改写为 `<XxxContext>`。

```tsx
// ❌ 旧写法
<FormContext.Provider value={{ eventBus }}>{children}</FormContext.Provider>

// ✅ React 19
<FormContext value={{ eventBus }}>{children}</FormContext>
```

### 4.5 异步与表单交互优先用 Actions

- 处理异步提交 / pending / 乐观更新时，**应**使用 **Actions** 与配套 Hook，
  **不应**手写一套 `isLoading` / `isPending` state 机制：
  - `<form action={fn}>` / `startTransition`；
  - `useActionState`（表单动作 + 状态 + pending）；
  - `useFormStatus`（子组件读取所属 form 的 pending）；
  - `useOptimistic`（乐观 UI）；
  - `useTransition`（标记非阻塞更新）。

```tsx
const [state, submitAction, isPending] = useActionState(
    async (_prev, formData: FormData) => save(formData),
    null,
);
<form action={submitAction}>{/* ... */ }<button disabled={isPending}>提交</button></form>
```

### 4.6 无障碍 id 必须用 `useId`

- 关联 `label` / `aria-describedby` / `aria-labelledby` 等的 id **必须**由 `useId` 生成，
  **不得**手拼随机值或自增计数（避免 SSR 不一致与碰撞）。

```tsx
const id = useId();
<label htmlFor={id}>邮箱</label>
<input id={id} aria-describedby={`${id}-hint`} />
```

### 4.7 异步资源（可选）

- 读取 Promise 资源**可**用 `use(promise)` 配合 `<Suspense>` 边界承接 pending 态；
  适用于数据/资源按需读取的场景，**不**强制。

> 文档元数据 hoisting（`<title>` / `<meta>`）、资源预加载等浏览器特性与组件库定位关系不大，
> 本文件不作约束。

---

## §5 样式 — Linaria 零运行时

- `` css`...` `` 模板插值**必须**构建期可求值；**不得**用 props / state / 函数入参做条件插值；
- 条件样式**必须**拆成多个静态 `css` 块，用 `cx()` 在运行时组合；
- **不得**使用内联 `style={{...}}`；样式值**必须**走 `token.*`。

```typescript
import { css, cx } from '@linaria/core';
import token from './token.js';

const baseStyle = css`
    display: inline-flex;
    background-color: ${token.primary.background.color};
`;

// ❌ 运行时变量在构建期不存在
const bad = css`border-color: ${bordered ? token.primary['border-color'] : 'transparent'};`;

// ✅ 拆静态块，用 cx() 运行时组合
const borderedStyle = css`border-color: ${token.primary['border-color']};`;
const noBorderStyle = css`border-color: transparent;`;
<span className={cx(baseStyle, bordered ? borderedStyle : noBorderStyle)} />
```

---

## §6 设计令牌三层架构

```
L1  rc-token-global    —— 原始基元（颜色、间距、圆角、排版、阴影）
L2  rc-token-semantic  —— 语义映射（$ref → L1）
L3  rc-{component}     —— 组件专属令牌（$ref → L2）
```

- `token.toml` **必须**优先以 `$ref()` 引用上一层令牌 → `generate:token` 生成 `src/token.ts`；
- 颜色**必须**使用 **OKLCh** 色彩空间（`oklch(L C H)`）；
- 主题切换**必须**通过覆盖 **L2** CSS 变量实现，**不得**在组件层做分支；
- 改 `token.toml` **必须**同时执行 `generate:token`，并将二者一并提交；
- `src/token.ts` 为生成产物，**不得**手改（见 §9）。

---

## §7 Props 与类型约束

- 原生属性**必须**用 `Omit<...>` 继承再覆盖；
- 无障碍等互斥约束**必须**用可辨识联合表达；
- 泛型组件**必须**用普通函数签名，**不得**用 `React.FC`；
- **不得**使用 `any` 与非必要的 `as unknown as`；类型缺失**应**补 `types.ts` 而非就地断言；
- TypeScript **严格模式**，`target: ESNext`、`moduleResolution: bundler`、**4 空格**缩进。

```typescript
interface BaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onClick?: (e: MouseEvent) => Promise<void> | void;
}

type Props = BaseProps & (
    | { children: ReactNode; 'aria-label'?: string }
    | { children?: never;    'aria-label': string  }
);

function Form<T extends Record<string, unknown>>(props: FormProps<T>) { /* ... */ }
```

---

## §8 依赖管理约束

- 内部 `@crab-dev/*` 包（components / standards / toolbox）**必须**声明为 `"workspace:^"`；
- React 19（`react` / `react-dom`）**必须**放在 `devDependencies`（作为隐式 peer），
  **不得**声明于 `peerDependencies`；
- 外部运行时依赖（如 `motion`）**必须**声明在 `dependencies`；
- 构建期工具（打包器、插件、预设）**必须**声明在 `devDependencies`。

**组件复用优先（禁止造轮子）：**

- 某 `components/rc-*` 组件内部需要通用交互 / 展示能力（按钮、输入框、下拉容器、弹层、骨架屏、
  虚拟滚动等）时，**必须**优先复用组件库内已有的 `@crab-dev/rc-*` 组件（并声明为 `workspace:^`
  依赖），**不得**用原生 HTML 元素重新拼装等价能力，也**不得**引入第三方 UI 库实现同等能力；
- 仅当组件库内**确无**对应能力时，方可自行用原生元素实现——此时该组件即成为该能力在库内的
  首个提供者，后续其他组件应转而复用它，而非各自重复实现。

```typescript
// ✅ rc-dialog 内部复用 rc-button 渲染操作区按钮（真实案例，见 components/rc-dialog）
import Button from '@crab-dev/rc-button';
<Button onClick={onConfirm}>确定</Button>

// ❌ 库内已有 rc-button，却在组件内部重新拼装原生 button
<button className={styles.confirmBtn} onClick={onConfirm}>确定</button>
```

---

## §9 生成文件与变更边界（Guardrails）

除非任务明确要求，**不得**手工编辑或直接提交以下文件的差异：

- 令牌产物：`src/token.ts`；
- 文档产物：`public/docgen.json`；
- 构建产物：`esm/`、`cjs/`、`declarations/`、`css/`；
- 覆盖率：`coverage/`；
- PnP 运行时：`.pnp.*`（仅在新增依赖后随之提交其更新）。

如需刷新上述产物，**必须**通过对应命令生成，而非手改。

每包**必须**继承标准预设、**不得**重写：

- ESLint：`import { Browser } from "@crab-dev/standards-eslint-preset"; export default [...Browser.react];`
- TypeScript：`"extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json"`
- Jest：`import { browser } from "@crab-dev/standards-jest-preset"; export default browser;`
