# 组件设计原则（Design Principles）

> 本文件把 Don Norman《设计心理学》(The Design of Everyday Things) 的五个核心交互原则
> ——**示能 / 意符 / 映射 / 反馈 / 限制**——落地为 **crab-dev** 组件库的硬约束。措辞遵循
> RFC 2119：**必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、
> **可 (MAY)**。冲突时优先级：**MUST > SHOULD > MAY**。
>
> **范围声明**：本文件覆盖**设计与交互原则**——组件"是否好用、是否可被无师自通地发现"。
> 它**不重复**技术细节：令牌三层架构与 Linaria 零运行时纪律见
> [`tech-stack-constraints.md`](./tech-stack-constraints.md) §5–§6；Props 与可辨识联合类型见
> 同文件 §7；全量状态的测试约定见 [`component-constraints.md`](./component-constraints.md) §3。
> 本文件与根 `CLAUDE.md` 一致、互为展开，出现歧义以 `CLAUDE.md` 为准。

---

## §0 总纲：可发现性与概念模型

组件是用户手中的"日常之物"。一个好组件**必须**做到**无需说明书即可上手**——这就是**可发现性
(Discoverability)**。可发现性不是单点技巧，而是下列五个原则共同作用的结果，缺一则用户困惑：

| 原则 | 回答的问题 | 一句话 |
|------|-----------|--------|
| **示能 (Affordance)** | 这里**能**做什么？ | 元素的可感知属性暗示可能的操作 |
| **意符 (Signifiers)** | 我该**怎么**做、做在**哪**？ | 可感知的线索，明确指示操作方式与位置 |
| **映射 (Mapping)** | 控制与结果**如何对应**？ | 控件与其效果之间的关系符合空间 / 文化直觉 |
| **反馈 (Feedback)** | 我做了之后**发生了什么**？ | 操作后系统即时、明确地告知结果 |
| **限制 (Constraints)** | 我**不能**做什么、如何**防错**？ | 主动收窄可能操作，阻止错误于发生之前 |

**总约束（MUST）：** 每个 `rc-*` 组件的每一个可交互元素，都**必须**能在这五个原则下逐条给出交代。
任一原则解释不通，**必须**回到设计（令牌 / 状态枚举 / ARIA / 类型）层修正，**不得**以"功能跑通"
为由收工。功能是起点，可用性才是交付标准。

> **概念模型 (Conceptual Model)：** 组件的视觉与行为**必须**让用户形成**正确的心智预期**。
> 长得像开关就必须能拨动、像链接就必须可跳转、像禁用就必须真的不可用。**不得**制造
> "看起来是 A、实际是 B"的错觉——错误的概念模型比没有模型更糟。

---

## §1 示能（Affordance）——让"能做什么"可被看见

**定义：** 示能是元素的属性与用户能力之间的关系所暗示的**可能操作**。在屏幕上，起作用的是
**感知到的示能**——用户"看上去觉得能做"的事。

**约束：**

- **可交互必须显得可交互（MUST）**：可点击 / 可输入 / 可拖拽 / 可展开的元素，**必须**具备与其
  操作相符的感知示能——光标语义、hover 反馈、边框或填充其一。**不得**让可交互元素看起来是静态文本。
- **不可交互不得伪装示能（MUST）**：纯展示元素**不得**带 hover 高亮、pointer 光标等交互暗示，
  以免诱导用户徒劳点击。
- **光标即示能（MUST）**：鼠标光标**必须**与语义一致——可点击 `pointer`、文本 `text`、
  禁用 `not-allowed`、拖拽 `grab` / `grabbing`。
- **命中区域即示能（MUST）**：可点击目标的命中区域**必须**足够大到"看得见就点得中"；图标类
  小控件**必须**用 `min-block-size` / `min-inline-size` 或 padding 撑起下限，**不得**让命中区
  小于其视觉尺寸。
- **禁用即移除示能（MUST）**：`disabled` / `[aria-disabled="true"]` 态**必须**同时撤销全部示能
  ——`cursor: not-allowed`、无 hover 响应、`pointer-events` 阻断，并降低不透明度到
  `token.opacity.disabled`。

```tsx
// ✅ 可点击项：感知示能齐全（光标 + hover 反馈 + 命中区域下限）
const clickable = css`
    cursor: pointer;
    min-block-size: 24px;                              /* 命中区域下限，避免"看得见点不中" */
    &:hover:not(:disabled) {
        background-color: ${token.option['color-hover']};   /* 组件令牌 $ref → semantic color.background.hover-subtle */
    }
`;

// ❌ 纯展示文本却带 hover 高亮与 pointer —— 伪造示能，诱导徒劳点击
const bad = css`cursor: pointer; &:hover { background: #f5f5f5; }`;
```

---

## §2 意符（Signifiers）——把"怎么做"标示出来

**定义：** 示能只说明"可能"，**意符**才明确告诉用户操作在**哪里**、**如何**进行。意符是可被感知的
标志：图标、标签、焦点环、箭头、占位符、状态徽记。**可发现性主要由意符承载。**

**约束：**

- **操作必须自带意符（MUST）**：每个可操作元素**必须**提供明确意符——可展开给下拉箭头、可清除给
  `×`、可搜索给放大镜、必填给 `*`、有上限给字符计数。隐含操作**必须**显性化。
- **键盘焦点必须可见（MUST）**：`:focus-visible` **必须**有明显意符（`outline` 或
  `box-shadow: token.shadow['focus-ring']`）。**不得**使用 `outline: none` 而不给替代——那等于
  抹掉键盘用户唯一的位置意符。
- **状态必须有意符（MUST）**：选中 / 展开 / 加载 / 错误 / 当前项等状态**必须**各有可感知标志
  （✓、箭头旋转、spinner 或骨架、红边 + 错误文案、`aria-current`），并由标准 ARIA 或 `data-state`
  驱动而非仅靠样式。
- **意符不得单一通道（MUST）**：**不得**仅用颜色传达状态（红=错、绿=对）。**必须**叠加形状 /
  图标 / 文案，保证色觉障碍用户与 `forced-colors` 模式下仍可感知（WCAG 2.2：正文对比 4.5:1，
  图标 / 大字 3:1）。
- **隐藏意符必须有替代（SHOULD）**：仅在 hover 时出现的操作（如列表项上的删除按钮）**应**保留
  一条持久可达的替代路径（键盘可聚焦、或常驻的次级入口），**不应**让操作只对鼠标悬停可见。

```tsx
// ✅ 意符齐全：可见图标 + 无障碍名(aria-label) + 可见焦点意符
const focusStyle = css`
    &:focus-visible {
        outline: none;                        /* 仅因下一行立即给出替代意符，方才允许 */
        box-shadow: ${token.shadow.focus};    /* 组件令牌 $ref → semantic shadow.focus-ring */
    }
`;
<button aria-label="清除" className={cx(iconBtn, focusStyle)}><ClearIcon /></button>

// ❌ 仅凭颜色表达错误态 —— 色盲用户与高对比模式下失效
<input className={onlyRedBorder} />               /* 必须叠加错误图标 + 文案 + aria-invalid */
```

---

## §3 映射（Mapping）——让控制与结果自然对应

**定义：** 映射是控件与其作用效果之间的关系。**自然映射**借助空间对应与文化惯例，让人一看便知，
无需记忆与标注。

**约束：**

- **三序一致（MUST）**：**DOM 顺序 = 视觉顺序 = Tab 焦点顺序**三者**必须**一致。**不得**使用正数
  `tabindex` 打乱自然焦点流；视觉重排（`order` / `flex-direction: row-reverse` 等）**不得**造成
  焦点顺序与阅读顺序错位。
- **空间映射符合直觉（MUST）**：方向键导航方向**必须**与视觉布局一致（上下列表用 ↑↓、水平用 ←→）；
  "下一步 / 前进"置右、"上一步 / 返回"置左；递增在上或右。
- **控制与对象就近（SHOULD）**：控件**应**靠近其所作用的对象——关闭按钮落在它所关闭的容器上，
  操作按钮紧邻其作用区。用**格式塔接近性**（间距走 `token.space.*`）表达"谁属于谁"。
- **遵循既有惯例（MUST）**：图标与手势**必须**沿用用户在其它产品中已习得的映射——`×`=关闭、
  放大镜=搜索、汉堡=菜单、开关右滑=开。**不得**为求新异而重新发明与主流相悖的映射
  （Jakob 定律：用户把在别处积累的预期带到这里）。
- **触发器与目标显式关联（MUST）**：展开 / 面板 / 弹层的触发者与被控对象**必须**用
  `aria-controls` / `aria-expanded` / `aria-labelledby` 建立可编程映射，不能只靠视觉相邻。

```tsx
// ✅ 自然映射：DOM=视觉=Tab 三序一致；触发器→面板显式关联
<button aria-expanded={open} aria-controls={panelId}>展开</button>
<div id={panelId} role="region" hidden={!open}>…</div>

// ❌ 正 tabindex 打乱焦点流，破坏"阅读顺序=操作顺序"的自然映射
<button tabIndex={3}>先聚焦到我</button>
```

---

## §4 反馈（Feedback）——让每次操作都有回应

**定义：** 反馈是操作后系统对"发生了什么"的即时、明确告知。**反馈必须及时且信息充分，但不得过量**
——沉默使人焦虑，噪声令人麻木。

**约束：**

- **即时回应（MUST）**：交互（hover / 按压 / 聚焦 / 选中）的视觉反馈**必须**近乎即时，走
  `token.motion.interaction`（`duration.fast`）；用户操作与首次视觉回应之间**不得**有可感知延迟。
- **耗时操作必须显性进行中（MUST）**：预计超过约 400ms 的操作（多尔蒂阈值）**必须**给出进行中
  反馈——`aria-busy` + spinner / 骨架 / 进度，**不得**留下无回应的"死界面"。
- **全量状态覆盖（MUST）**：任何可交互元素的样式**必须**覆盖其适用状态集合：默认 / hover /
  `:focus-visible` / `:active` / 选中·展开 / disabled / loading / error / empty。缺失即等于
  对该情形"沉默"。（状态清单与测试见 [`component-constraints.md`](./component-constraints.md) §3。）
- **动效走令牌、可降级（MUST）**：过渡时长与缓动**必须**引用 `token.motion.*`，**不得**就地写
  `100ms ease`；并**必须**在 `@media (prefers-reduced-motion: reduce)` 下移除非必要动画。
- **异步用 Actions 表达（SHOULD）**：异步提交 / pending / 乐观更新**应**用 React 19 Actions
  （`useActionState` / `useFormStatus` / `useOptimistic`），由框架统一驱动 pending 反馈，
  **不应**手搓一套 `isLoading` state（见 [`tech-stack-constraints.md`](./tech-stack-constraints.md) §4.5）。
- **反馈不得引起布局跳动（MUST）**：hover / active / focus 的反馈**不得**改变元素盒模型尺寸而
  造成回流抖动；需要强调时用 `box-shadow` / `outline` / `transform: scale()` 模拟，
  切边框用 `box-shadow` 而非切换 `border-width`。
- **反馈适度（SHOULD）**：错误**应**就近定位到字段（`aria-describedby` 指向错误文案），
  **不应**用全局弹窗轰炸；成功的轻反馈**不应**打断心流。

```tsx
// ✅ 反馈走令牌 + 尊重系统偏好 + 稳态（阴影模拟，不改盒模型）
const feedback = css`
    transition: ${token.transition};              /* $ref → semantic motion.interaction */
    &:active:not(:disabled) { transform: scale(0.98); }   /* 位移反馈，不改尺寸 */
    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

// ❌ 就地写死动效 + 切 border-width 致布局跳动
const bad = css`transition: all 100ms ease; &:hover { border-width: 2px; }`;
```

---

## §5 限制（Constraints）——用约束防错于未然

**定义：** 限制主动收窄"可能的操作"，把错误挡在发生之前。Norman 分四类：物理、文化、语义、
逻辑限制。核心是**防错 (Poka-yoke)**：让错误的操作难以甚至无法执行。

**约束：**

- **防错优于报错（MUST）**：可预见的非法操作**必须**提前用 `disabled` / `aria-disabled` 收窄，
  而非放行后再报错。禁用时**应**说明原因（`title` / 关联提示），使"为何不能"可被发现。
- **禁用而非隐藏（SHOULD）**：预期会出现、只是当前不可用的操作**应**保留并置灰，而非直接消失
  ——消失会破坏用户的概念模型与位置记忆。仅当操作在当前上下文**完全**不适用时方可移除。
- **破坏性操作必须设限（MUST）**：不可逆 / 破坏性操作（删除、清空、覆盖）**必须**有二次确认
  （复用 `@crab-dev/rc-dialog`）或提供撤销，**不得**一击即毁。
- **输入约束前置（MUST）**：数值范围、`maxLength`、格式限制**必须**在输入层就地约束并给出意符
  （字符计数、范围提示），把非法值挡在提交之前，而非提交后校验。
- **类型层做逻辑限制（MUST）**：互斥的能力 / 无障碍约束**必须**用**可辨识联合类型**表达，让非法
  组合在编译期就不可拼出（见 [`tech-stack-constraints.md`](./tech-stack-constraints.md) §7），
  这是最强的一类限制。
- **宽进严出（SHOULD）**：对用户输入**应**宽容（trim 空白、容忍大小写与常见格式差异），对外产出
  **应**严格规范（波斯特尔稳健性原则）——用输入侧的语义限制换取更低的出错率。
- **降级路径必须显式（MUST）**：`forced-colors`、`prefers-reduced-motion`、键盘可达、触控目标、
  320px 最小宽度——每一种环境限制都**必须**有显式处理，不能默认"不会发生"。

```tsx
// ✅ 逻辑限制：互斥能力在类型层即不可同时表达（最强的防错）
type Props =
    | { checkable: true;  onCheck: (v: boolean) => void }
    | { checkable?: false; onCheck?: never };

// ✅ 防错优于报错：非法即禁用并说明原因，而非放行后弹错
<Button disabled={!canSubmit} aria-disabled={!canSubmit} title={submitBlockedReason}>
    提交
</Button>

// ✅ 破坏性操作设二次确认（复用 rc-dialog，勿自造）
<Dialog title="确认删除？" onConfirm={remove} />
```

---

## §6 交付前设计五问（MUST 全部通过）

写完 / 审查组件后，对照五原则逐条自问；任一为"否"即**必须**回到设计层重修，**不得**交付：

- [ ] **示能**：用户光看外观，能否分辨哪些元素**能操作**、怎么操作它？禁用态是否真的移除了示能？
- [ ] **意符**：每个操作与状态是否都有**可感知的线索**？键盘焦点是否始终可见？是否不止靠颜色？
- [ ] **映射**：控制与其结果的对应是否**符合空间与文化直觉**？DOM = 视觉 = Tab 三序是否一致？
- [ ] **反馈**：每次操作是否都有**即时且适度**的回应？耗时操作有进行中态？反馈是否不引起布局跳动？
- [ ] **限制**：非法操作是否被**提前挡住**而非事后报错？破坏性操作有确认 / 撤销？降级路径是否显式？

> **收工心态：** 好的组件让用户"一看就会、一试就对、错也错不了"。若还需要一句"其实你得先……"的
> 口头说明，说明某个原则尚未在组件里落地——回到令牌、状态、ARIA 或类型层补齐，而不是写进文档凑数。
