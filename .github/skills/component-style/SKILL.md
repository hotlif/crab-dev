---
name: component-style
description: "crab-dev 组件视觉与交互质感规范。设计语言四原则：精准（Precision）、克制（Restraint）、理性（Rational）、稳态（Steady）。使用场景：编写或审查 Linaria 样式；设计尺寸 / 间距 / 圆角 / 字号 / 阴影阶梯；实现 hover / focus-visible / active / disabled / selected / loading / 空态等全量状态；选择动效时长与缓动；修复无障碍（ARIA、键盘可达、对比度）问题；处理文本截断、溢出滚动、响应式边界；审查颜色 / z-index / elevation 是否走令牌；做交付前质感自检。禁止用于：纯逻辑 / 纯数据处理代码。"
argument-hint: "描述需要样式约束的组件、状态或视觉细节"
---

# 组件风格约束（Component Style）

> 本 SKILL 是 `copilot-instructions.md` §8.8 的实战落地指南。本仓库为组件库，**视觉与交互质量是交付的核心指标**；功能跑通只是起点，不是终点。

## 零、设计语言四原则（MUST）

crab-dev 的视觉语言是**一套在令牌层自洽**的系统。任一 rc-* 组件**必须**同时体现以下四个原则，缺一不可：

### 1. 精准（Precision）

- **像素级对齐**：所有尺寸落在令牌阶梯上，不得出现离散的魔法数值；图标、文字、行盒的垂直中线必须对齐。
- **时序级反馈**：交互反馈**必须**在 100ms 内给出第一次视觉回应；过渡时长按"微交互 ≤ 200ms / 层级展开 200–400ms / 页面级 ≤ 500ms"分档。
- **令牌级一致**：同一语义（如 `hover`、`danger`、`disabled`）在任何组件里**必须**解析到**同一条**令牌链路；禁止同义异构。

### 2. 克制（Restraint）

- **低饱和、强对比**：色彩主要由明度和语义角色承担层级，而非堆饱和度；主色只在少数关键节点出现，**不得**滥用品牌色作为大面积背景。
- **薄边界、轻阴影**：默认边框宽度**必须**为 1 逻辑像素；阴影仅用于表达**层级关系**（`float` / `overlay`），**不得**作为装饰。
- **留白优先**：信息密度不足时先加留白而不是加装饰；可动可不动时**必须**不动。

### 3. 理性（Rational）

- **阶梯可推导**：small / medium / large 的 height、padding、font-size **必须**呈等差或等比，且可由令牌计算得出。
- **状态可枚举**：任何可交互元素的视觉状态**必须**是 §三 所列集合的子集，不得发明私有状态；选中 / 展开 / 忙碌**必须**用标准 ARIA 或 `data-state` 属性驱动。
- **层级可推演**：`z-index`、`elevation`、`opacity` **必须**来自语义层令牌（`dialog`、`overlay`、`popover`、`tooltip`、`toast`），不得就地写死数字。

### 4. 稳态（Steady）

- **布局不跳动**：hover / active / focus 的样式切换**不得**改变元素盒模型尺寸；需要强调时用 `box-shadow` / `outline` / `transform: scale()` 模拟。
- **状态有回退**：`prefers-reduced-motion`、`forced-colors`、键盘焦点、触控目标、320px 最小宽度 —— 每一种退化路径**必须**有显式处理。
- **边界不破版**：文本必须能优雅截断；长内容必须能内部滚动；最小宽度下必须不破版。

> **交付心态**：写完组件后，对照上述四原则逐条质询自己的每一行样式。任一条不能在令牌层给出解释，就**必须**回到令牌层补齐，而不是在组件里打补丁。

---

## 一、唯一数据源

所有视觉可调参数**必须**来自令牌层，不得在组件内硬编码。

| 维度 | 令牌来源 | 硬编码判定 |
|------|----------|------------|
| 颜色 | `token.color.*`（OKLCh） | ❌ 出现 `#fff`、`rgb(...)`、`hsl(...)`、十六进制 |
| 间距 | `token.space.*` | ❌ 模板内 `12px`、`0.75rem` 类魔法数 |
| 字号 / 行高 | `token.font.size.*` | ❌ `px` 写死字号 |
| 圆角 | `token.radius.*` | ❌ `border-radius: 8px` 类写死 |
| 阴影 | `token.shadow.*` | ❌ 自拼 `0 2px 8px rgba(...)` |
| 透明度 | `token.opacity.*` | ❌ `opacity: 0.65` 写死 |
| 动效 | `token.transition` / `token.motion.*` | ❌ 就地写 `100ms ease` |
| 层级 | `token.z-index.*`（若存在） | ❌ `z-index: 999` 写死 |

> 令牌缺失时的正确做法：先在 `rc-token-semantic/token.toml` 或组件的 `token.toml` 中补齐 → `yarn generate:token` → 再在组件中引用。**严禁**在组件内就地硬编码"补位"。

## 二、Linaria 编写纪律

Linaria 是零运行时方案，`` css`...` `` 模板内**不得**插入运行时变量（props / state / 函数入参）。  
运行时分支**必须**拆为多个静态样式，通过 `cx()` 组合。

```typescript
// ❌ 错：bordered 在构建期不存在
const wrong = css`
    border-color: ${bordered ? token.border.default : 'transparent'};
`;

// ✅ 对：拆成两段静态样式，运行时用 cx()
const withBorder = css` border-color: ${token.border.default}; `;
const noBorder   = css` border-color: transparent; `;

<span className={cx(base, bordered ? withBorder : noBorder)} />
```

同理，尺寸、颜色变体等**必须**预先枚举成多个静态样式，**不得**在模板中插值运行时变量。

## 三、全量状态（MUST）

任何可交互元素的样式块**必须**覆盖以下状态，缺一不可：

| 状态 | 选择器 | 视觉要求 |
|------|--------|----------|
| 默认 | —— | 遵循令牌 |
| 悬停 | `&:hover:not(:disabled)` | 轻微反馈（背景 / 边框 / 阴影其一） |
| 键盘焦点 | `&:focus-visible` | **必须**有明显指示（通常 `outline` 或 `box-shadow`）；**不得**用 `outline: none` 留空 |
| 按压 | `&:active:not(:disabled)` | 亮度 / 位移微调 |
| 禁用 | `&:disabled` 或 `[aria-disabled="true"]` | `cursor: not-allowed` + `opacity: token.opacity.disabled`，且无 hover 响应 |
| 选中 / 展开 | `&[aria-selected="true"]` / `&[aria-expanded="true"]` / `&[data-state="..."]` | 与默认态有明显差异 |
| 加载 | `&[aria-busy="true"]` 或组件内 loading 标志 | 配合 spinner / 骨架，**不得**仅靠禁用表达 |

> **规则：边框状态切换用 `box-shadow` / `outline` 模拟，不得切换 `border-width` 导致布局跳动。**

## 四、动效（MUST）

1. 过渡**必须**引用 `token.transition` 或语义层定义的缓动，**不得**就地写 `ease` / `linear`。
2. 时长分档（crab-dev 标准）：
   - 微交互（hover、按压、聚焦）：≤ 200ms
   - 展开 / 折叠 / 层弹出：200–400ms
   - 页面级切换：≤ 500ms
3. 缓动**必须**使用令牌中定义的 `cubic-bezier`（典型值 `cubic-bezier(0.4, 0, 0.2, 1)`），**不得**就地自拟曲线。
4. **必须**尊重系统偏好：

```typescript
const animated = css`
    transition: ${token.transition};
    @media (prefers-reduced-motion: reduce) {
        transition: none;
        animation: none;
    }
`;
```

## 五、无障碍基线（MUST）

1. 图标按钮**必须**提供 `aria-label`；仅图标无可见文本时视觉传达不足。
2. 颜色对比度**必须**达到 WCAG 2.2 AA：正文 4.5:1，大字号 / 图标 3:1。**不得**仅以颜色区分状态（配合形状 / 文案 / 图标）。
3. **不得**使用 `tabindex` 正数；DOM 顺序与视觉顺序**必须**一致。
4. 鼠标光标**必须**与语义一致：可点击 `pointer`、禁用 `not-allowed`、文本 `text`、拖拽 `grab` / `grabbing`。
5. 可交互元素在键盘下**必须**可达；Enter / Space 等常见键**必须**触发对应动作。

## 六、密度与阶梯（MUST）

同一组件的 small / medium / large 尺寸**必须**保持等差或等比阶梯（height / padding / font-size 同步缩放）。

常用阶梯参考：

| 尺寸 | height | font | padding-inline | radius |
|------|--------|------|----------------|--------|
| small | 24px | caption | 8px | sm |
| medium | 32px | body | 12px | md |
| large | 40px | subhead | 16px | md |

图标与文字垂直对齐**应**使用 `height: calc(font-size * line-height)` 匹配行盒（见 component-workflow 令牌对齐技巧）。

## 七、边界与降级（SHOULD）

1. **文本截断**：单行 `text-overflow: ellipsis` + `overflow: hidden` + `white-space: nowrap`；多行 `-webkit-line-clamp`；**应**配合 `title` 属性或 Tooltip 回退。
2. **溢出滚动**：长列表 / 长文本**应**走内部滚动而非撑破父容器；表格**应**支持粘性表头。
3. **响应式底线**：组件**应**在 320px 最小宽度下不破版。
4. **空态 / 错误态 / 加载态**：**必须**显式设计，**不得**返回 `null` 或裸文字；**应**使用仓库已有的 skeleton / empty / error 语义。

## 八、禁止清单（MUST NOT）

| # | 禁止 | 替代 |
|---|------|------|
| 1 | `!important` | 修令牌或提升选择器特异性；若必须使用，**必须**注释原因 |
| 2 | 内联 `style={{...}}` | 一律走 Linaria + token |
| 3 | 写死 `z-index` 数字 | 走 `token.z-index.*`，未定义则先补令牌 |
| 4 | `outline: none` 而无替代 | 提供 `:focus-visible` 样式 |
| 5 | `px` 写字号 / 行高 | 用 token 或 `rem` |
| 6 | `dangerouslySetInnerHTML` | 用 React 原生机制；确需使用须任务明确并附来源 |
| 7 | 在 `` css`...` `` 中插值运行时变量 | 拆静态样式 + `cx()` |
| 8 | 非命中令牌的裸颜色（`#xxx` / `rgb(...)`） | 走 `token.color.*` |

## 九、自检表（交付前必走）

- [ ] **四原则贯通**：精准 / 克制 / 理性 / 稳态，每一条都能在当前组件的样式中指出具体体现
- [ ] 所有可见像素数值、颜色、字号、圆角、阴影、透明度、动效均来自 `token.*`
- [ ] `` css`...` `` 中无运行时插值
- [ ] 所有可交互元素具备 hover / focus-visible / active / disabled 四态样式
- [ ] `prefers-reduced-motion: reduce` 下禁用非必要动画
- [ ] 图标按钮有 `aria-label`，对比度达 AA
- [ ] small / medium / large 阶梯符合等差或等比
- [ ] 空态 / 错误态 / 加载态均有显式设计
- [ ] 320px 最小宽度下不破版
- [ ] 文本溢出有优雅降级（ellipsis / line-clamp / Tooltip）

> **交付心态**：写完后自问 —— "这份组件的每一个像素、每一次反馈、每一层状态，是否都能在令牌层和四原则中找到解释？"任一处解释不通，就**必须**回到令牌层或状态枚举重修，而不是在组件里打补丁。**不得**以"功能跑通"作为收工理由。
