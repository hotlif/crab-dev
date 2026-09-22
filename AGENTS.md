# crab-dev Codex 工作约定

本文件是 Codex 在本仓库的项目级行为入口。文中的“必须 / 不得（MUST / MUST NOT）”、“应 / 不应（SHOULD / SHOULD NOT）”与“可（MAY）”遵循 RFC 2119；冲突时按 MUST > SHOULD > MAY 处理。

## 沟通与工作边界

- 除非用户指定其他语言，所有用户可见的分析、计划、进度更新与说明必须使用中文；代码、标识符和提交信息遵循项目自身语言约定。
- 只修改任务所需内容，保留用户已有改动。生成文件不得手改；需要刷新时必须运行对应生成命令。
- 先确认影响面，再选择最小充分的验证命令；验证必须通过且不得引入新告警。

## 项目定位与工作区

本仓库是 React 19 企业级 UI 组件库 Turbo Monorepo，使用 Node.js ≥ 22、Yarn 4 PnP、全仓 ESM、React Compiler、Crab CSS 零运行时样式和三层设计令牌。

| 工作区 | 职责 | 包命名 |
| --- | --- | --- |
| `components/` | React 19 UI 组件与全局、语义令牌包 | `@crab-dev/rc-{name}` |
| `standards/` | TypeScript 共享预设与历史 ESLint 兼容包 | `@crab-dev/standards-{name}` |
| `.website/` | 私有文档站 | 不发布 |

核心工具职责：

- `@crab-dev/wake`：统一负责 Lint、Library 构建、令牌生成、docgen、Test、组件工作台与 Docs；版本必须精确锁定为 `0.1.45`。
- `@crab-dev/css`：提供零运行时静态样式与令牌定义；版本必须精确锁定为 `0.1.45`。
- Turbo：只负责包拓扑和跨包并行，不得增加旧工具兼容任务。

## 终端与平台

- 执行命令前必须依据当前运行环境确认操作系统，不得混用终端语法。开发机主要为 Windows，CI 为 GitHub Actions `ubuntu-latest`。
- Windows 必须使用 PowerShell 7+ 与 PowerShell cmdlet：变量 `$x`，环境变量 `$env:NAME`，stderr 重定向 `2>$null`，多行文本使用 here-string；文件和进程操作优先使用 `Get-ChildItem`、`Get-Content`、`Remove-Item`、`Get-Command` 等。不得写 `export`、`2>/dev/null`、bash here-doc 或依赖 Unix 专有命令。
- Linux / macOS 必须使用 bash、sh 或 zsh 的 POSIX 语法：`x=v`、`export X=v`、`2>/dev/null`、here-doc 与标准 coreutils；不得写 `$env:X`、PowerShell cmdlet 或 here-string。
- 文件读取、补丁、搜索与查找应优先使用宿主提供的专用能力；终端搜索优先用 `rg`。跨平台 CLI（`git`、`yarn`、`turbo`、`node`）主体不变，但变量、管道和重定向必须匹配当前 shell。
- `package.json` 脚本由 Yarn portable shell 执行；脚本本身必须跨平台，涉及文件系统时优先用 Node API，不得依赖仅单一平台可用的命令。

## 运行环境、PnP 与 ESM

- Node.js 必须 ≥ 22；包管理器必须为根 `package.json#packageManager` 指定的 Yarn 4，并通过 Corepack 使用 PnP。
- 全部包的 `package.json` 必须声明 `"type": "module"`。
- 不得创建或依赖 `node_modules`；依赖位于 `.yarn/cache/`，`.pnp.cjs` 必须提交。
- zip 内无法正确加载的 ESM 包必须在根 `dependenciesMeta` 标记 `"unplugged": true`。
- 依赖变化后必须执行 `yarn install --immutable` 并保持 lockfile 一致。
- 相对导入 `.ts` / `.tsx` 源文件时必须写 `.js` 扩展名；npm 包导入不得带文件扩展名。
- `@/` 指向包内 `src/`，`@@/` 指向包根；组件源码应优先相对导入，只有深层目录为避免过长 `../../..` 时才使用别名。

## React 19 与 React Compiler

- React Compiler 已全局启用，组件必须使用 React 19 现代 API并遵守 Rules of React：渲染纯净，不在渲染期间产生副作用或读写外部可变量。
- 默认不得手写 `useMemo`、`useCallback` 或 `React.memo`。仅在以下例外中允许手动控制，并必须在紧邻代码处注释说明类别与原因：
  - 跨渲染但不触发渲染的可变实例状态，例如定时器、拖拽标志、快照和 DOM 测量缓存，应使用 `useRef`。
  - 确需 latest-ref 控制 effect 或事件读取时可以使用；若只在 effect 中读取最新值，应优先 `useEffectEvent`。渲染期写 ref 会使编译器降级，必须是明确取舍。
  - 依赖值相等而非引用相等、派生值必须作为稳定 effect 依赖，或编译器无法判断纯度的昂贵计算。
  - 为未启用 React Compiler 的库消费方稳定关键引用，且引用稳定性直接影响下游重算。
- 不得使用 `forwardRef`；`ref` 必须作为普通 prop 声明并透传。需要挂载和卸载清理时应使用 ref callback 的 cleanup 返回值。
- 读取 context 必须使用 `use(Context)`，不得使用 `useContext(Context)`；提供 context 必须写 `<Context value={...}>`，不得写 `<Context.Provider>`。修改相关存量代码时必须同步迁移。
- 异步提交、pending 与乐观更新应优先使用 Actions、`useActionState`、`useFormStatus`、`useOptimistic`、`useTransition` 或 `startTransition`，不应重复维护手写 loading state。
- 关联 `label`、`aria-describedby`、`aria-labelledby` 的 ID 必须由 `useId` 生成，不得使用随机值或自增计数。
- Promise 资源可用 `use(promise)` 并由 `Suspense` 承接 pending 状态；不强制用于普通异步逻辑。

## Crab CSS 与设计令牌

- Crab CSS `css` 模板中的插值必须能在构建期求值，不得依赖 props、state 或函数运行时参数。
- 条件样式必须拆为静态 `css` 块，再用 `cx()` 组合；不得使用内联 `style={{ ... }}`。
- 样式值必须来自 `token.*`。三层令牌为：L1 `rc-token-global` 原始基元，L2 `rc-token-semantic` 语义映射，L3 `rc-{component}` 组件令牌。
- `token.toml` 必须优先用 `$ref()` 引用上一层；颜色必须使用 OKLCh；主题切换必须覆盖 L2 CSS 变量，不得在组件层分支。
- 修改 `token.toml` 后必须运行 `generate:token`，并将生成的 `src/token.ts` 与源定义一并提交；`src/token.ts` 不得手改。

## Props、类型与依赖

- 原生属性必须用 `Omit<...>` 继承后覆盖；互斥能力与无障碍约束必须用可辨识联合类型表达。
- 泛型组件必须用普通函数签名，不得用 `React.FC`；不得使用 `any` 或非必要的 `as unknown as`。类型缺失时应补充 `types.ts`，不得用就地断言掩盖。
- TypeScript 必须保持严格模式、`target: ESNext`、`moduleResolution: bundler` 与 4 空格缩进。
- 内部 `@crab-dev/*` 依赖必须写 `workspace:^`。
- `react` 与 `react-dom` 必须放在 `devDependencies` 作为隐式 peer，不得声明于 `peerDependencies`；外部运行时依赖放 `dependencies`，构建工具和预设放 `devDependencies`。
- 组件需要按钮、输入、下拉容器、弹层、骨架屏、虚拟滚动等通用能力时，必须优先复用已有 `@crab-dev/rc-*` 并声明工作区依赖；已有等价组件时不得用原生元素重复实现，也不得引入第三方 UI 库。仅库内确无该能力时方可成为首个提供者。

## 组件结构与导出

组件包应遵循以下布局：

```text
src/{component}.tsx
src/types.ts
src/token.ts
src/index.ts
src/hooks/                  # 可选
src/__tests__/{component}.test.tsx
docs/demos/*.demo.tsx
docs/README.md
public/docgen.json
token.toml                  # 可选
```

- 复杂组件可以拆分多个 `.tsx`；包配置包括继承共享预设的 `tsconfig.json` 和 Wake 的 `wake.config.toml`；lint 通过显式 `--root` 使用根目录 Wake 规则。
- `src/index.ts` 必须默认导出主组件；类型、Hook 与工具函数必须具名导出。对外值导出和类型导出必须保持一致。
- `.tmp/`、`.cache/`、`.turbo/`、`coverage/`、`esm/`、`cjs/`、`declarations/`、`css/` 不得当作源码阅读或修改。

## 测试约定

- 使用 Wake Test；组件测试位于 `src/__tests__/{component}.test.tsx`。
- 必须通过包内 `yarn test`（`wake test --serial --coverage`）运行，单文件用 `yarn test src/__tests__/x.test.tsx`；不得手拼 Node 启动命令。
- 核心测试 API必须从 `@crab-dev/wake/test` 导入；React 测试 API必须从 `@crab-dev/wake/test/react` 导入。
- `render`、`act`、`fireEvent`、`userEvent`、`renderHook` 与计时器控制均按 Wake API 使用异步调用；cleanup 由 Wake 自动执行，不得重复注册。
- 函数替身使用 `mock.fn`；模块替身使用 `mock.module` 并通过 `mock.import` 加载；fake timers 使用异步 `clock` API。
- 必须从具体源文件导入被测组件，不得从 `index.ts` 导入。
- DOM 环境无布局引擎；浮层、动画和尺寸测量依赖应以保留交互语义的最小替身处理，缺失的浏览器 API 应在 `beforeAll` 中 stub。
- coverage 使用 `text` 与 `lcov`；act warning 和资源泄漏必须作为错误处理。

## 组件设计

### Material Design 3 视觉规范

- 所有组件、文档站与演示的视觉与交互设计必须以 [Material Design 3 官方规范](https://m3.material.io/) 为唯一设计基准。
- 新增或修改界面前，必须先明确对应的 M3 组件与变体，查阅其使用指南、视觉规格和无障碍说明；不得仅凭印象或截图推测实现，不得混用不同组件、变体或版本的视觉规则。
- 必须同时查阅 [Material Web 官网](https://material-web.dev/) 的对应组件文档与示例，以及 [material-components/material-web 源码仓库](https://github.com/material-components/material-web) 的对应实现、样式与设计令牌。已有对应实现时，必须以其实际视觉实现作为对照；若与所采用的 M3 版本或变体不同，必须核对差异并以对应 M3 规范为准。
- 颜色角色、字体排版、形状与圆角、尺寸与间距、布局、层级与阴影、边框、图标、状态层、焦点指示及动效必须符合对应 M3 规定，并核对默认、hover、focus、pressed、disabled、selected、error 等适用状态。
- 选中、当前项等状态指示必须采用对应 M3 组件与变体规定的形式；不得在规范之外自行叠加左侧竖条、边框、图标或其他状态装饰。
- 无障碍语义、键盘操作、焦点管理、触控目标及动效适配必须按对应 M3 组件的无障碍指南落实，并参考 Material Web 的实际实现。
- Material Web 未提供的组件必须先查阅对应 M3 规范；M3 也未直接定义时，必须依据最接近的 M3 组件与布局规则扩展，并说明参考依据。
- 必须通过本仓库的 React 19、Crab CSS 与 L1 / L2 / L3 设计令牌体系实现，并优先复用已有 `@crab-dev/rc-*` 组件；不得引入 Material Web 或其他第三方 UI 库替代现有实现。
- 交付前必须将受影响界面与对应 M3 规范、Material Web 示例及源码进行视觉和交互核对，并列出实际参考的文档与源码链接。主题定制和能力扩展必须符合 M3 允许的范围，说明具体依据与差异；未完成核对不得声称符合规范。

## 生成文件与共享预设

除非任务明确要求，以下内容不得手工编辑：

- `src/token.ts`、`public/docgen.json`；
- `esm/`、`cjs/`、`declarations/`、`css/`、`coverage/`、`.wake/`；
- `.pnp.*`，仅在依赖变化后随安装命令更新。

每个包必须继承共享预设，不得覆盖预设已有选项；仅可按构建需要增补未涉及字段：

- Lint：使用 `wake lint`；共享规则在根 `wake.config.toml`，包内 `yarn lint` 显式指定根目录、源路径与运行环境。不得重新引入 ESLint 执行入口；原预设包仅保留对外兼容。规则覆盖差异见 `.website/review/toolchain/README.md`。
- TypeScript：`"extends": "@crab-dev/standards-typescript-preset/tsconfig.browser.react.json"`
- Wake：在 `wake.config.toml` 中声明 Library、Test、Docs 所需的最小配置，不得增加旧工具回退。

## 常用命令与交付验收

根目录命令：

- `yarn build:library`：按 Turbo 拓扑运行全部 Wake Library 构建。
- `yarn test`、`yarn lint`、`yarn typecheck`：全仓测试、Wake Lint、类型检查。
- `yarn generate:token`：刷新全部令牌产物。
- `yarn docs:dev`、`yarn docs:build`：文档站开发和生产构建。

组件包命令：`yarn start`、`build:library`、`lint`、`typecheck`、`generate:token`、`generate:docgen`、`test`、`check`。

按影响面执行最小必跑集合：

| 影响面 | 必跑命令 |
| --- | --- |
| `components/rc-*/src/**` | 包内 `lint` + `test` |
| `token.toml` 或令牌消费 | `generate:token` + `lint` + `test` |
| Wake 配置、构建配置、导出边界 | `build:library` + `test` |
| `standards/*` | 至少选择一个受影响下游包运行 `lint` / `test` |

## 提交、版本与发布

- commit subject 与 body 必须使用英文并遵循 Conventional Commits：`<type>(<scope>): <subject>`。
- scope 应使用组件名或工具名；跨工作区基础设施用 `repo` / `ci`。一个 commit 应只做一件事。
- 生成文件只可与触发其变化的源修改在同一个 commit 中提交；不得添加 `Co-Authored-By` 行。
- 发布必须由 `.github/workflows/release.yml` 中的 CI 和 `yarn changeset:release` 驱动，不得本地执行 `npm publish`。
- 版本采用手动修改相关 `package.json#version`，并以独立的 `chore({pkg}): bump version to x.y.z` 提交；多包用 `chore(repo): ...`。版本提交应与已验收的功能修改分开。
