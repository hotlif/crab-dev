# 组件实现约定

继承[根规则](../AGENTS.md)。产品层级见[库架构](../.website/docs/guides/library-architecture.mdx)，公共接口见[公共 API](../.website/docs/guides/public-api.mdx)，设计和尺寸见[设计体系](../.website/docs/guides/design-styles.mdx)、[尺寸与密度](../.website/docs/guides/component-sizing.mdx)。产品元数据只维护[产品清单](../library.manifest.json)。

## 包结构与依赖

- 源码使用 `src/{component}.tsx`、`src/types.ts`、`src/index.ts`；测试在 `src/__tests__/`；文档源为 `docs/index.mdx`，示例为 `docs/demos/*.demo.tsx`。API 从真实 TS 类型与 Wake 原始 `public/docgen.json` 元数据共同生成，源类型为权威，不手工补 API 表。
- 主组件默认导出；类型、Hook 和工具具名导出。基础支撑、CSS-only 或无主组件包按职责声明导出，不强造 React 组件。
- 优先复用已有 `@crab-dev/rc-*` 通用能力并声明依赖，不以原生重复实现等价组件或引入第三方 UI 库替代。
- 实际使用 `react` / `react-dom` 的公开包在 `peerDependencies` 声明宿主需求，并保留 `devDependencies` 供构建与测试；不放入 `dependencies` 引入多副本，独立消费不能依赖隐式 peer。区分运行时和文档依赖，文档依赖不得冒充运行时拓扑。
- 继承共享 TypeScript 预设，不覆盖已有选项；严格模式、ESNext、bundler 解析、4 空格缩进。组件内优先相对导入，仅深层路径需要时使用 `@/`、`@@/`。

## React 与接口

- 渲染纯净，遵守 Rules of React。ref 是普通 prop，不使用 `forwardRef`，挂载清理优先 ref callback cleanup。context 使用 `use(Context)` 和 `<Context value={...}>`。
- 默认不手写 `useMemo` / `useCallback` / `memo`。跨渲染可变实例、latest-ref、值相等依赖、编译器不能判定的昂贵纯计算或未编译消费方引用稳定性例外，均须就近注明类别与原因。effect 最新值优先 `useEffectEvent`，不得随意在渲染期写 ref。
- 关联 label、说明和标题的 ID 使用 `useId`。异步提交优先 Actions、`useActionState`、`useFormStatus`、`useOptimistic` 与 transition。
- 原生属性经 `Omit` 继承后覆盖；互斥与无障碍约束用可辨识联合。泛型用普通函数，不用 `React.FC`、`any` 或非必要双重断言。
- 值和 Group 采用 `value` / `defaultValue` / `onValueChange`，单控件布尔采用 `checked` / `defaultChecked` / `onCheckedChange`；合法的只读受控展示允许省略语义回调。原生 `onChange` 保留 DOM 语义。具名集合保留 `selectedKeys` / `checkedKeys` / `expandedKeys` 与对应 Change 回调，详情说明原因和事件。
- 配置采用 `designSystem`、`colorMode`、`brandColor`、`size`、`density`。通用尺寸 `small / medium / large` 与密度 `compact / standard / comfortable` 独立；Button 的 `xs / s / m / l / xl` 等专门变体必须显式声明。

## 样式与设计体系

- ID 仅 `md3` / `apple` / `shadcn`，默认 `md3`，名称与出处从公共 registry 读取。Apple 是依据 Apple 原则自主实现的 Web 体系，不复刻特定 macOS 版本。
- 先确定组件/变体，查阅对应官方指南、规格、无障碍和实现。MD3 Expressive 同时对照 Material Web 文档、示例、行为、样式和令牌，明确基线与 Expressive 差异。
- 不能以主色/圆角覆盖宣称完成一套体系；颜色、排版、形状、尺寸、层级、图标、状态、动效和交互都按矩阵验收。没有直接对应组件时记录扩展依据。
- L1 全局 → L2 语义/设计映射 → L3 组件。`token.toml` 优先 `$ref()` 上一层，颜色使用 OKLCh；设计、明暗和密度覆盖 L2，组件不按旧设计名分支。
- Crab CSS 插值静态求值，条件样式拆静态块并用 `cx()`；不以内联 `style` 绕过令牌。修改 TOML 运行 `generate:token`，不得手改 `src/token.ts`。
- CSS 模板内注释使用 `/* */`，不得使用 JavaScript 的 `//`；当前编译器保留行注释文本，会使相邻选择器或声明失效。状态样式需核对真实构建 CSS。
- 组合组件定制 Button 时通过公开 `TokenVars` 映射局部前景、状态层和焦点角色；原生 button 不匹配旧的 `[role="button"]` 选择器。视觉边界与粗指针命中区域分别验证。
- 焦点轮廓须在真实滚动、折叠、选中和 sticky 层下保持可见；按需使用随公开宽度变化的内置轮廓，不以取消必要的 overflow 或改变虚拟测量来隐藏问题。
- 空数据的 loading/error 状态优先于默认 Empty；刷新已有数据时保留数据。
- `data-crab-design` 承载设计体系，`data-theme` 承载解析后 light/dark；Portal 和嵌套 Provider 保持边界一致。

## 测试与交付

- 包内 `yarn test` 使用 Wake Test，单文件也通过包脚本传路径，不手拼 Node 启动命令。
- 核心 API 从 `@crab-dev/wake/test`、React API 从 `@crab-dev/wake/test/react` 导入；render、act、事件、Hook 与 clock 按异步 API 使用。cleanup 交 Wake；替身使用 `mock.fn` / `mock.module` / `mock.import`。
- 从具体源文件导入被测组件。DOM 无布局引擎，浮层/尺寸/动画用保留语义的最小替身；缺失 API 在 `beforeAll` stub。act 告警和泄漏视为错误，coverage 使用 text/lcov。
- 测试环境按实际依赖选择；DOM 是一般组件的轻量入口，不要求所有包强用 DOM。Date 等依赖真实浏览器日期/Intl、布局或平台能力的测试可使用包内声明的 browser 环境，并记录实际运行条件。
- `package.json#crab.requiredChecks` 登记的已有 `test:*` 脚本属于必跑检查，通过包内 `check` 或根 `test:required` 执行；不能以默认 DOM 测试通过替代登记的 browser 回归。
- 源码验证 lint/typecheck/test，令牌/构建/导出另执行对应生成与构建；适用的键盘、焦点、触控、强制颜色和减少动画另有浏览器证据。
- 生命周期与设计覆盖依据真实证据更新；例外注明理由、范围、验证和退出条件，不以跳过、全局抑制或历史截图代替完成。
