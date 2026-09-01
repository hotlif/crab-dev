<div align="center">
	<h1>RFC-DESIGN-TOKEN-20260329</h1>
</div>

> 历史 RFC：当前实现已迁移到 Wake 与 `@crab-dev/css`；文中的旧工具链描述仅用于记录提案背景。

## 概述

当组件库中的组件各自硬编码颜色、间距、字号等视觉参数时，会出现以下问题：

1. **主题切换困难**——更换品牌色需逐组件修改，遗漏难以避免。
2. **设计-工程不一致**——设计稿标注与代码中的魔法值缺乏映射关系。
3. **消费方定制成本高**——无统一覆写入口，fork 源码是唯一手段。

为解决上述问题，在此提出 **Design Token 三层架构提案**。本 RFC 定义了一套与具体项目无关的通用规范，适用于任何基于 CSS Custom Properties 的 React / Web 组件库。

## 目标

| 目标 | 说明 |
|------|------|
| **单一事实来源** | 所有视觉参数集中定义，消除组件间硬编码重复 |
| **设计-工程一致性** | Token 名称对齐设计稿标注，减少翻译偏差 |
| **主题可切换** | 同一套 Token 名称，在不同主题下绑定不同值（Light / Dark / Brand） |
| **多平台可移植** | Token 以数据格式（JSON / TOML / YAML）定义，可编译为 CSS、iOS、Android、Figma 等输出 |
| **运行时可覆写** | 最终输出为 CSS Custom Properties，消费方无需重新构建即可定制 |

## 非目标

- 不定义具体色值——色值由设计团队确定，本 RFC 仅规定结构和命名规则。
- 不涉及组件 API 设计——仅覆盖样式变量层。

---

## 详细设计

### 1. Token 三层架构

```
┌──────────────────────────────────────────────────────────┐
│  Layer 3 — Component Tokens（组件级）                      │
│  直接绑定到组件样式的变量                                    │
│  例: --button-primary-bg, --dialog-overlay-bg             │
└──────────────────┬───────────────────────────────────────┘
                   │ 继承 / 别名引用
┌──────────────────▼───────────────────────────────────────┐
│  Layer 2 — Semantic Tokens（语义级）                       │
│  表达设计意图，不依赖具体组件                                 │
│  例: --color-bg-brand, --color-text-primary               │
└──────────────────┬───────────────────────────────────────┘
                   │ 引用
┌──────────────────▼───────────────────────────────────────┐
│  Layer 1 — Global Tokens（全局基础级）                      │
│  与设计语境无关的原始刻度值                                   │
│  例: --gray-900, --blue-500, --space-4, --radius-2        │
└──────────────────────────────────────────────────────────┘
```

**各层职责对比**

| 维度 | Global Token | Semantic Token | Component Token |
|------|-------------|----------------|-----------------|
| **内容** | 原始调色板、间距刻度、字体刻度 | 绑定到设计意图的别名 | 绑定到组件部位/状态的变量 |
| **与主题的关系** | 主题无关（同一套刻度） | 主题相关（Light/Dark 值不同） | 通常引用 Semantic，必要时自定义 |
| **变更频率** | 极低（设计语言大版本） | 低（新增主题/微调色彩） | 中（随组件迭代） |
| **谁来维护** | 设计系统核心团队 | 设计系统核心团队 | 组件开发者 |
| **消费者** | Semantic Token | Component Token | 组件内部样式代码 |

**为什么要分三层？**

- **如果只有 Global**：组件直接引用 `--blue-500`，更换品牌色时需逐一修改所有组件。
- **如果只有 Semantic**：没有统一的原始值来源，多个 Semantic Token 可能定义了重复的颜色值，改一处漏一处。
- **如果缺少 Component**：消费方无法针对单个组件做精细覆写（例如只改弹窗遮罩而不影响全局 overlay 色）。

---

### 2. 命名规范

#### 2.1 通用命名公式

```
--{scope}-{category}-{property}[-{variant}][-{state}]
```

| 段 | 是否必选 | 含义 | 取值规则 |
|----|---------|------|---------|
| `scope` | 必选 | 层级/所属范围 | Global: 空或 `g`；Semantic: `color`/`space`/`radius`/`font`/`shadow`/`motion`；Component: 组件名如 `button`/`dialog` |
| `category` | 必选 | 功能分类 | `bg`, `text`, `border`, `fill`, `brand`, `size`, `primary`, `heading` 等 |
| `property` | 必选 | CSS 属性或设计属性 | `color`, `size`, `weight`, `radius`, `width`, `height`, `gap`, `padding` 等 |
| `variant` | 可选 | 尺寸/外观变体 | `lg`, `md`, `sm`, `subtle`, `ghost` 等 |
| `state` | 可选 | 交互状态，使用 `-` 连接在末尾 | `-hover`, `-active`, `-focus`, `-disabled` |

#### 2.2 各层命名模板

**Layer 1 — Global Tokens**

```
--{color-family}-{step}          颜色刻度（OKLCh 色彩空间）
--space-{step}                   间距刻度
--radius-{step}                  圆角刻度
--font-size-{step}               字号刻度
--font-weight-{name}             字重
--line-height-{step}             行高
--shadow-{step}                  阴影刻度
--z-{name}                       层级刻度
--duration-{name}                动效时长
--easing-{name}                  缓动函数
```

> **为什么选择 OKLCh？**
>
> - **感知均匀**——同等 Chroma / Lightness 差值在视觉上产生等量的色差，传统 HSL 做不到这一点。
> - **色相稳定**——调节明度时色相不会发生偏移（HSL 中常见蓝色→紫色漂移）。
> - **主题友好**——Dark 主题只需调节 Lightness 通道，Chroma 和 Hue 保持不变，自动获得和谐的暗色变体。
> - **浏览器原生支持**——CSS Color Level 4 已在所有主流浏览器中实现 `oklch()` 函数。
>
> OKLCh 语法：`oklch(Lightness Chroma Hue [/ Alpha])`
> - **Lightness** `0–1`（0 = 纯黑，1 = 纯白）
> - **Chroma** `0–0.4`（0 = 灰，越大越饱和）
> - **Hue** `0–360`（色相角度）

**示例**：

```css
/* 颜色 — 使用色系名 + 数字刻度 (100–900)，OKLCh 色彩空间 */
--gray-50:     oklch(0.985 0.002 265);
--gray-100:    oklch(0.967 0.003 265);
--gray-200:    oklch(0.928 0.006 265);
--gray-300:    oklch(0.872 0.010 258);
--gray-400:    oklch(0.707 0.015 261);
--gray-900:    oklch(0.210 0.020 265);
--blue-500:    oklch(0.623 0.214 259);
--blue-600:    oklch(0.546 0.245 262);
--red-500:     oklch(0.637 0.237 25);
--green-500:   oklch(0.723 0.219 149);
--amber-500:   oklch(0.769 0.188 70);

/* 间距 — 使用 4px 基准倍数 */
--space-0:     0px;
--space-0-5:   2px;
--space-1:     4px;
--space-1-5:   6px;
--space-2:     8px;
--space-3:     12px;
--space-4:     16px;
--space-5:     20px;
--space-6:     24px;
--space-8:     32px;
--space-10:    40px;
--space-12:    48px;
--space-16:    64px;

/* 圆角 — 增加半步级精细刻度 */
--radius-0-5:  1px;
--radius-1:    2px;
--radius-1-5:  3px;
--radius-2:    4px;
--radius-2-5:  5px;
--radius-3:    6px;
--radius-4:    8px;
--radius-5:    10px;
--radius-6:    12px;
--radius-8:    16px;
--radius-full: 9999px;

/* 字号 */
--font-size-xs:   12px;
--font-size-sm:   14px;
--font-size-md:   16px;
--font-size-lg:   18px;
--font-size-xl:   20px;
--font-size-2xl:  24px;

/* 字重 */
--font-weight-regular:   400;
--font-weight-medium:    500;
--font-weight-semibold:  600;
--font-weight-bold:      700;

/* 阴影 */
--shadow-sm:  0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);

/* z-index 层级刻度 */
--z-base:      0;
--z-raised:    1;
--z-dropdown:  1000;
--z-sticky:    1100;
--z-overlay:   1300;
--z-dialog:    1400;
--z-popover:   1500;
--z-toast:     1600;
--z-tooltip:   1700;

/* 动效 */
--duration-fast:    100ms;
--duration-normal:  200ms;
--duration-slow:    300ms;
--easing-default:   cubic-bezier(0.4, 0, 0.2, 1);
--easing-in:        cubic-bezier(0.4, 0, 1, 1);
--easing-out:       cubic-bezier(0, 0, 0.2, 1);
```

**Layer 2 — Semantic Tokens**

```
--color-{intent}-{property}[-{state}]      语义颜色
--space-{semantic-name}                     语义间距
--radius-{semantic-name}                    语义圆角
--font-size-{semantic-name}                 语义字号
--shadow-{semantic-name}                    语义阴影
--z-{semantic-name}                         语义层级
--motion-{semantic-name}                    语义动效
```

**示例**：

```css
/* ── 颜色：品牌 ── */
--color-brand-primary:                 var(--blue-500);
--color-brand-primary-hover:           var(--blue-600);
--color-brand-primary-active:          var(--blue-700);

/* ── 颜色：背景 ── */
--color-bg-surface:                    oklch(1 0 0);
--color-bg-elevated:                   oklch(1 0 0);
--color-bg-overlay:                    oklch(0 0 0 / 45%);
--color-bg-disabled:                   var(--gray-100);
--color-bg-hover-subtle:               oklch(0 0 0 / 4%);

/* ── 颜色：文本 ── */
--color-text-primary:                  var(--gray-900);
--color-text-secondary:                var(--gray-600);
--color-text-tertiary:                 var(--gray-400);
--color-text-on-brand:                 oklch(1 0 0);
--color-text-disabled:                 var(--gray-300);
--color-text-link:                     var(--blue-500);
--color-text-link-hover:               var(--blue-600);

/* ── 颜色：边框 ── */
--color-border-default:                var(--gray-200);
--color-border-hover:                  var(--gray-300);
--color-border-focus:                  var(--blue-500);
--color-border-error:                  var(--red-500);

/* ── 颜色：反馈 ── */
--color-feedback-error:                var(--red-500);
--color-feedback-error-bg:             var(--red-50);
--color-feedback-success:              var(--green-500);
--color-feedback-success-bg:           var(--green-50);
--color-feedback-warning:              var(--amber-500);
--color-feedback-warning-bg:           var(--amber-50);

/* ── 颜色：填充 ── */
--color-fill-inactive:                 var(--gray-200);
--color-fill-active:                   var(--blue-500);

/* ── 语义间距（细粒度） ── */
--space-inline-gap:                    var(--space-1);     /* 行内元素间隔（图标与文字） */
--space-component-gap:                 var(--space-2);     /* 组件内元素间隔 */
--space-stack-gap:                     var(--space-3);     /* 垂直堆叠间隔 */
--space-section-gap:                   var(--space-4);     /* 区块间隔 */
--space-group-gap:                     var(--space-6);     /* 分组间隔 */
--space-page-padding:                  var(--space-6);     /* 页面边距 */
--space-control-padding-x:             var(--space-3);     /* 控件水平内边距 */
--space-control-padding-y:             var(--space-1-5);   /* 控件垂直内边距 */
--space-card-padding:                  var(--space-5);     /* 卡片/面板内边距 */
--space-dialog-padding:                var(--space-6);     /* 弹窗内边距 */

/* ── 语义圆角（细粒度） ── */
--radius-badge:                        var(--radius-1);    /* 徽标 */
--radius-control:                      var(--radius-3);    /* 表单控件 */
--radius-card:                         var(--radius-4);    /* 卡片 */
--radius-popover:                      var(--radius-4);    /* 气泡 / 下拉 */
--radius-dialog:                       var(--radius-6);    /* 弹窗 */
--radius-tooltip:                      var(--radius-2);    /* 提示 */
--radius-pill:                         var(--radius-full); /* 药丸形 */

/* ── 语义阴影 ── */
--shadow-dropdown:                     var(--shadow-md);
--shadow-dialog:                       var(--shadow-lg);

/* ── 语义层级 ── */
--z-index-dropdown:                    var(--z-dropdown);
--z-index-sticky:                      var(--z-sticky);
--z-index-overlay:                     var(--z-overlay);
--z-index-dialog:                      var(--z-dialog);
--z-index-popover:                     var(--z-popover);
--z-index-toast:                       var(--z-toast);
--z-index-tooltip:                     var(--z-tooltip);

/* ── 语义动效 ── */
--motion-fade:                         var(--duration-normal) var(--easing-default);
--motion-expand:                       var(--duration-slow) var(--easing-out);
```

**Layer 3 — Component Tokens**

```
--{component}-{part}-{property}[-{variant}][-{state}]
```

**示例**（以 Button / Dialog / Form / DatePicker / Slider 为例）：

```css
/* Button */
--button-bg:                           var(--color-bg-surface);
--button-bg-hover:                     var(--color-bg-hover-subtle);
--button-bg-primary:                   var(--color-brand-primary);
--button-bg-primary-hover:             var(--color-brand-primary-hover);
--button-text-color:                   var(--color-text-primary);
--button-text-color-primary:           var(--color-text-on-brand);
--button-border-color:                 var(--color-border-default);
--button-border-radius:                var(--radius-control);
--button-padding-x:                    var(--space-control-padding-x);
--button-height-sm:                    24px;
--button-height-md:                    32px;
--button-height-lg:                    40px;
--button-font-size:                    var(--font-size-sm);
--button-gap:                          var(--space-inline-gap);
--button-opacity-loading:              0.65;

/* Dialog */
--dialog-bg:                           var(--color-bg-elevated);
--dialog-overlay-bg:                   var(--color-bg-overlay);
--dialog-border-radius:                var(--radius-dialog);
--dialog-shadow:                       var(--shadow-dialog);
--dialog-padding:                      var(--space-dialog-padding);
--dialog-heading-font-size:            var(--font-size-lg);
--dialog-heading-font-weight:          var(--font-weight-semibold);
--dialog-footer-gap:                   var(--space-component-gap);
--dialog-z-index:                      var(--z-index-dialog);
--dialog-overlay-z-index:              var(--z-index-overlay);

/* Form */
--form-label-font-size:                var(--font-size-sm);
--form-label-font-weight:              var(--font-weight-medium);
--form-label-color:                    var(--color-text-primary);
--form-label-spacing:                  var(--space-inline-gap);
--form-item-spacing:                   var(--space-section-gap);
--form-helper-font-size:               var(--font-size-xs);
--form-helper-color:                   var(--color-text-secondary);
--form-error-color:                    var(--color-feedback-error);

/* DatePicker */
--date-picker-cell-size:               32px;
--date-picker-cell-radius:             var(--radius-tooltip);
--date-picker-cell-bg-hover:           var(--color-bg-hover-subtle);
--date-picker-cell-bg-selected:        var(--color-brand-primary);
--date-picker-cell-text-selected:      var(--color-text-on-brand);
--date-picker-header-font-size:        var(--font-size-sm);
--date-picker-panel-padding:           var(--space-card-padding);
--date-picker-dropdown-z-index:        var(--z-index-dropdown);

/* Slider */
--slider-track-height:                 4px;
--slider-track-bg:                     var(--color-fill-inactive);
--slider-track-bg-active:              var(--color-fill-active);
--slider-thumb-size:                   16px;
--slider-thumb-bg:                     var(--color-bg-surface);
--slider-thumb-border-color:           var(--color-fill-active);
--slider-thumb-border-width:           2px;
--slider-tooltip-z-index:              var(--z-index-tooltip);
```

#### 2.3 命名对比：正确 vs 错误

| ✅ 正确 | ❌ 错误 | 原因 |
|---------|---------|------|
| `--color-brand-primary` | `--blue-main` | Semantic 层禁止出现具体颜色名 |
| `--button-bg-primary-hover` | `--button-primary-hover-bg` | 状态后缀 (`-hover`) 必须位于末尾 |
| `--color-bg-overlay` | `--color-mask-bg` | 统一术语：用 `overlay` 不用 `mask` |
| `--slider-track-bg-active` | `--slider-blue-track` | 禁止在名称中嵌入具体颜色 |
| `--gray-900` | `--global-dark` | Global 层用刻度数字，不用语义描述 |
| `--color-text-primary` | `--sem-gray-900-text` | Semantic 层表达意图，不暴露原始值 |
| `--form-label-font-size` | `--form-lbl-fs` | 禁止自创缩写，保持完整拼写 |
| `--button-height-lg` | `--button-h-l` | 尺寸变体用 `sm` / `md` / `lg`，不用单字母 |
| `--date-picker-cell-radius` | `--datepicker-cell-bdrs` | 组件名使用 kebab-case，属性名完整拼写 |

#### 2.4 命名规范要点总结

1. **全部使用 kebab-case**（小写 + 连字符）。
2. **禁止无规律缩写**——`bg` (background)、`sm`/`md`/`lg` (尺寸) 为公认缩写，可使用；其余一律完整拼写。
3. **状态后缀居末尾**——`-hover`、`-active`、`-focus`、`-disabled` 永远是变量名的最后一段。
4. **Global 层不带语义**——只有色系名 + 刻度、间距刻度、字号刻度。
5. **Semantic 层只表达意图**——`brand`、`text`、`bg`、`border`、`feedback`，不出现具体组件名或颜色名。
6. **Component 层以组件名开头**——确保全局唯一，避免跨组件冲突。

---

### 3. 核心 Token 映射树

#### 3.1 色彩 (Colors)

**Global → Semantic 映射（含 Light / Dark 值差异）**

| Global Token | Light 值 (OKLCh) | Semantic Token | Light 值 | Dark 值 |
|-------------|---------|----------------|---------|---------|
| `--gray-900` | `oklch(0.210 0.020 265)` | `--color-text-primary` | `var(--gray-900)` | `oklch(1 0 0 / 0.88)` |
| `--gray-600` | `oklch(0.446 0.018 264)` | `--color-text-secondary` | `var(--gray-600)` | `oklch(1 0 0 / 0.65)` |
| `--gray-300` | `oklch(0.872 0.010 258)` | `--color-text-disabled` | `var(--gray-300)` | `oklch(1 0 0 / 0.25)` |
| `--gray-200` | `oklch(0.928 0.006 265)` | `--color-border-default` | `var(--gray-200)` | `oklch(0.373 0.016 261)` |
| `--gray-100` | `oklch(0.967 0.003 265)` | `--color-bg-disabled` | `var(--gray-100)` | `oklch(1 0 0 / 0.08)` |
| `--blue-500` | `oklch(0.623 0.214 259)` | `--color-brand-primary` | `var(--blue-500)` | `oklch(0.720 0.165 254)` |
| `--blue-600` | `oklch(0.546 0.245 262)` | `--color-brand-primary-hover` | `var(--blue-600)` | `oklch(0.800 0.120 255)` |
| `--blue-700` | `oklch(0.488 0.243 264)` | `--color-brand-primary-active` | `var(--blue-700)` | `var(--blue-500)` |
| — | — | `--color-bg-surface` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| — | — | `--color-bg-elevated` | `oklch(1 0 0)` | `oklch(0.258 0 0)` |
| — | — | `--color-bg-overlay` | `oklch(0 0 0 / 45%)` | `oklch(0 0 0 / 65%)` |
| — | — | `--color-text-on-brand` | `oklch(1 0 0)` | `oklch(1 0 0)` |
| `--red-500` | `oklch(0.637 0.237 25)` | `--color-feedback-error` | `var(--red-500)` | `oklch(0.795 0.105 20)` |
| `--green-500` | `oklch(0.723 0.219 149)` | `--color-feedback-success` | `var(--green-500)` | `oklch(0.878 0.155 150)` |
| `--amber-500` | `oklch(0.769 0.188 70)` | `--color-feedback-warning` | `var(--amber-500)` | `oklch(0.882 0.157 84)` |

**Semantic → Component 映射（色彩类）**

| Semantic Token | → Button | → Dialog | → Form | → DatePicker | → Slider |
|---|---|---|---|---|---|
| `--color-brand-primary` | `--button-bg-primary` | — | — | `--date-picker-cell-bg-selected` | `--slider-track-bg-active` |
| `--color-brand-primary-hover` | `--button-bg-primary-hover` | — | — | — | — |
| `--color-text-on-brand` | `--button-text-color-primary` | — | — | `--date-picker-cell-text-selected` | — |
| `--color-bg-surface` | `--button-bg` | — | — | — | `--slider-thumb-bg` |
| `--color-bg-elevated` | — | `--dialog-bg` | — | — | — |
| `--color-bg-overlay` | — | `--dialog-overlay-bg` | — | — | — |
| `--color-bg-hover-subtle` | `--button-bg-hover` | — | — | `--date-picker-cell-bg-hover` | — |
| `--color-text-primary` | `--button-text-color` | — | `--form-label-color` | — | — |
| `--color-text-secondary` | — | — | `--form-helper-color` | — | — |
| `--color-border-default` | `--button-border-color` | — | — | — | — |
| `--color-bg-disabled` | `--button-bg-disabled` | — | — | — | — |
| `--color-feedback-error` | — | — | `--form-error-color` | — | — |
| `--color-fill-inactive` | — | — | — | — | `--slider-track-bg` |
| `--color-fill-active` | — | — | — | — | `--slider-thumb-border-color` |

#### 3.2 尺寸与间距 (Sizes / Spacing)

**Global → Semantic 映射**

| Global Token | 值 | Semantic Token | 典型用途 |
|-------------|-----|----------------|---------|
| `--space-1` | `4px` | `--space-inline-gap` | 图标与文字、标签与输入框间距 |
| `--space-1-5` | `6px` | `--space-control-padding-y` | 控件垂直内边距 |
| `--space-2` | `8px` | `--space-component-gap` | 按钮内元素间距、按钮组间隔 |
| `--space-3` | `12px` | `--space-stack-gap`, `--space-control-padding-x` | 垂直堆叠间隔、控件水平内边距 |
| `--space-4` | `16px` | `--space-section-gap` | 表单项间距 |
| `--space-5` | `20px` | `--space-card-padding` | 卡片/面板内边距 |
| `--space-6` | `24px` | `--space-group-gap`, `--space-page-padding`, `--space-dialog-padding` | 弹窗 padding、页面边距、分组间隔 |
| `--radius-1` | `2px` | `--radius-badge` | 徽标 |
| `--radius-2` | `4px` | `--radius-tooltip` | 提示框 |
| `--radius-3` | `6px` | `--radius-control` | 按钮、输入框圆角 |
| `--radius-4` | `8px` | `--radius-card`, `--radius-popover` | 卡片、气泡/下拉 |
| `--radius-6` | `12px` | `--radius-dialog` | 弹窗圆角 |
| `--radius-full` | `9999px` | `--radius-pill` | 药丸形 |
| `--font-size-xs` | `12px` | `--form-helper-font-size` 等 | 辅助文字 |
| `--font-size-sm` | `14px` | `--button-font-size` 等 | 正文、按钮文字 |
| `--font-size-md` | `16px` | — | 小标题 |
| `--font-size-lg` | `18px` | `--dialog-heading-font-size` 等 | 弹窗标题 |

**Semantic → Component 映射（尺寸类）**

| Semantic Token | → Button | → Dialog | → Form | → DatePicker | → Slider |
|---|---|---|---|---|---|
| `--radius-control` | `--button-border-radius` | — | — | — | — |
| `--radius-tooltip` | — | — | — | `--date-picker-cell-radius` | — |
| `--radius-dialog` | — | `--dialog-border-radius` | — | — | — |
| `--space-inline-gap` | `--button-gap` | — | `--form-label-spacing` | — | — |
| `--space-component-gap` | — | `--dialog-footer-gap` | — | — | — |
| `--space-section-gap` | — | — | `--form-item-spacing` | — | — |
| `--space-card-padding` | — | — | — | `--date-picker-panel-padding` | — |
| `--space-dialog-padding` | — | `--dialog-padding` | — | — | — |
| `--space-control-padding-x` | `--button-padding-x` | — | — | — | — |
| `--font-size-sm` | `--button-font-size` | — | `--form-label-font-size` | `--date-picker-header-font-size` | — |
| `--font-size-lg` | — | `--dialog-heading-font-size` | — | — | — |
| `--font-size-xs` | — | — | `--form-helper-font-size` | — | — |
| `--shadow-dialog` | — | `--dialog-shadow` | — | — | — |
| `--font-weight-medium` | — | — | `--form-label-font-weight` | — | — |
| `--font-weight-semibold` | — | `--dialog-heading-font-weight` | — | — | — |

#### 3.3 层级 (Z-Index)

**Global → Semantic → Component 映射**

| Global Token | 值 | Semantic Token | → Component Token |
|---|---|---|---|
| `--z-dropdown` | `1000` | `--z-index-dropdown` | `--date-picker-dropdown-z-index` |
| `--z-sticky` | `1100` | `--z-index-sticky` | — |
| `--z-overlay` | `1300` | `--z-index-overlay` | `--dialog-overlay-z-index` |
| `--z-dialog` | `1400` | `--z-index-dialog` | `--dialog-z-index` |
| `--z-popover` | `1500` | `--z-index-popover` | — |
| `--z-toast` | `1600` | `--z-index-toast` | `--notification-z-index` |
| `--z-tooltip` | `1700` | `--z-index-tooltip` | `--slider-tooltip-z-index` |

> **层级规则**：值越大越靠前，各层级之间保留 100 的间隔以便插入自定义层。
> 消费方可覆写 Component Token 来调整单个组件的层级，而不影响全局层级次序。

#### 3.4 映射树可视化

```
Global                    Semantic                        Component
───────                   ────────                        ─────────

--blue-500
  └─ oklch(0.623 0.214 259)
                          ──→ --color-brand-primary ───→ --button-bg-primary
                            │                            --date-picker-cell-bg-selected
                            │                            --slider-track-bg-active
                            └→ --color-fill-active ────→ --slider-thumb-border-color

--gray-900
  └─ oklch(0.210 0.020 265)
                          ──→ --color-text-primary ────→ --button-text-color
                                                         --form-label-color

--gray-200
  └─ oklch(0.928 0.006 265)
                          ──→ --color-border-default ──→ --button-border-color
                            └→ --color-fill-inactive ──→ --slider-track-bg

oklch(1 0 0) ────────────→ --color-bg-surface ────────→ --button-bg
                            │                            --slider-thumb-bg
                            └→ --color-bg-elevated ───→ --dialog-bg

oklch(0 0 0 / 45%) ─────→ --color-bg-overlay ────────→ --dialog-overlay-bg

--red-500
  └─ oklch(0.637 0.237 25)
                          ──→ --color-feedback-error ──→ --form-error-color

--radius-3
  └─ 6px ────────────────→ --radius-control ──────────→ --button-border-radius
--radius-6
  └─ 12px ───────────────→ --radius-dialog ───────────→ --dialog-border-radius

--z-dialog
  └─ 1400 ───────────────→ --z-index-dialog ──────────→ --dialog-z-index
--z-overlay
  └─ 1300 ───────────────→ --z-index-overlay ─────────→ --dialog-overlay-z-index
--z-dropdown
  └─ 1000 ───────────────→ --z-index-dropdown ────────→ --date-picker-dropdown-z-index
```

---

### 4. 工程化落地

#### 4.1 CSS Variables 参考实现（含 Light / Dark 主题切换）

```css
/* ================================================================
   Layer 1 — Global Tokens
   与主题无关的原始刻度值。所有主题共享同一套 Global Token。
   色彩使用 OKLCh 色彩空间：oklch(Lightness Chroma Hue)
   ================================================================ */

:root {
    /* ── 颜色刻度 (OKLCh) ── */
    --gray-50:   oklch(0.985 0.002 265);
    --gray-100:  oklch(0.967 0.003 265);
    --gray-200:  oklch(0.928 0.006 265);
    --gray-300:  oklch(0.872 0.010 258);
    --gray-400:  oklch(0.707 0.015 261);
    --gray-500:  oklch(0.551 0.018 264);
    --gray-600:  oklch(0.446 0.018 264);
    --gray-700:  oklch(0.373 0.016 261);
    --gray-800:  oklch(0.278 0.016 265);
    --gray-900:  oklch(0.210 0.020 265);

    --blue-50:   oklch(0.970 0.014 255);
    --blue-100:  oklch(0.932 0.032 255);
    --blue-500:  oklch(0.623 0.214 259);
    --blue-600:  oklch(0.546 0.245 262);
    --blue-700:  oklch(0.488 0.243 264);

    --red-50:    oklch(0.971 0.013 17);
    --red-500:   oklch(0.637 0.237 25);
    --green-50:  oklch(0.982 0.018 155);
    --green-500: oklch(0.723 0.219 149);
    --amber-50:  oklch(0.988 0.023 95);
    --amber-500: oklch(0.769 0.188 70);

    /* ── 间距刻度 (4px base) ── */
    --space-0:   0px;
    --space-0-5: 2px;
    --space-1:   4px;
    --space-1-5: 6px;
    --space-2:   8px;
    --space-3:   12px;
    --space-4:   16px;
    --space-5:   20px;
    --space-6:   24px;
    --space-8:   32px;
    --space-10:  40px;
    --space-12:  48px;
    --space-16:  64px;

    /* ── 圆角刻度（含半步级） ── */
    --radius-0-5:  1px;
    --radius-1:    2px;
    --radius-1-5:  3px;
    --radius-2:    4px;
    --radius-2-5:  5px;
    --radius-3:    6px;
    --radius-4:    8px;
    --radius-5:    10px;
    --radius-6:    12px;
    --radius-8:    16px;
    --radius-full: 9999px;

    /* ── 字号刻度 ── */
    --font-size-xs:   12px;
    --font-size-sm:   14px;
    --font-size-md:   16px;
    --font-size-lg:   18px;
    --font-size-xl:   20px;
    --font-size-2xl:  24px;

    /* ── 字重 ── */
    --font-weight-regular:  400;
    --font-weight-medium:   500;
    --font-weight-semibold: 600;
    --font-weight-bold:     700;

    /* ── 行高 ── */
    --line-height-tight:  1.25;
    --line-height-normal: 1.5;
    --line-height-loose:  1.75;

    /* ── 阴影刻度 ── */
    --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);

    /* ── z-index 层级刻度 ── */
    --z-base:      0;
    --z-raised:    1;
    --z-dropdown:  1000;
    --z-sticky:    1100;
    --z-overlay:   1300;
    --z-dialog:    1400;
    --z-popover:   1500;
    --z-toast:     1600;
    --z-tooltip:   1700;

    /* ── 动效 ── */
    --duration-fast:    100ms;
    --duration-normal:  200ms;
    --duration-slow:    300ms;
    --easing-default:   cubic-bezier(0.4, 0, 0.2, 1);
    --easing-in:        cubic-bezier(0.4, 0, 1, 1);
    --easing-out:       cubic-bezier(0, 0, 0.2, 1);
}


/* ================================================================
   Layer 2 — Semantic Tokens (Light Theme, 默认)
   ================================================================ */

:root,
[data-theme="light"] {
    /* ── 品牌色 ── */
    --color-brand-primary:            var(--blue-500);
    --color-brand-primary-hover:      var(--blue-600);
    --color-brand-primary-active:     var(--blue-700);

    /* ── 背景 ── */
    --color-bg-surface:               oklch(1 0 0);
    --color-bg-elevated:              oklch(1 0 0);
    --color-bg-overlay:               oklch(0 0 0 / 45%);
    --color-bg-disabled:              var(--gray-100);
    --color-bg-hover-subtle:          oklch(0 0 0 / 4%);

    /* ── 文本 ── */
    --color-text-primary:             var(--gray-900);
    --color-text-secondary:           var(--gray-600);
    --color-text-tertiary:            var(--gray-400);
    --color-text-on-brand:            oklch(1 0 0);
    --color-text-disabled:            var(--gray-300);
    --color-text-link:                var(--blue-500);
    --color-text-link-hover:          var(--blue-600);

    /* ── 边框 ── */
    --color-border-default:           var(--gray-200);
    --color-border-hover:             var(--gray-300);
    --color-border-focus:             var(--blue-500);
    --color-border-error:             var(--red-500);

    /* ── 反馈 ── */
    --color-feedback-error:           var(--red-500);
    --color-feedback-error-bg:        var(--red-50);
    --color-feedback-success:         var(--green-500);
    --color-feedback-success-bg:      var(--green-50);
    --color-feedback-warning:         var(--amber-500);
    --color-feedback-warning-bg:      var(--amber-50);

    /* ── 填充 ── */
    --color-fill-inactive:            var(--gray-200);
    --color-fill-active:              var(--blue-500);

    /* ── 语义间距（细粒度） ── */
    --space-inline-gap:               var(--space-1);
    --space-component-gap:            var(--space-2);
    --space-stack-gap:                var(--space-3);
    --space-section-gap:              var(--space-4);
    --space-group-gap:                var(--space-6);
    --space-page-padding:             var(--space-6);
    --space-control-padding-x:        var(--space-3);
    --space-control-padding-y:        var(--space-1-5);
    --space-card-padding:             var(--space-5);
    --space-dialog-padding:           var(--space-6);

    /* ── 语义圆角（细粒度） ── */
    --radius-badge:                   var(--radius-1);
    --radius-control:                 var(--radius-3);
    --radius-card:                    var(--radius-4);
    --radius-popover:                 var(--radius-4);
    --radius-dialog:                  var(--radius-6);
    --radius-tooltip:                 var(--radius-2);
    --radius-pill:                    var(--radius-full);

    /* ── 语义阴影 ── */
    --shadow-dropdown:                var(--shadow-md);
    --shadow-dialog:                  var(--shadow-lg);

    /* ── 语义层级 ── */
    --z-index-dropdown:               var(--z-dropdown);
    --z-index-sticky:                 var(--z-sticky);
    --z-index-overlay:                var(--z-overlay);
    --z-index-dialog:                 var(--z-dialog);
    --z-index-popover:                var(--z-popover);
    --z-index-toast:                  var(--z-toast);
    --z-index-tooltip:                var(--z-tooltip);

    /* ── 语义动效 ── */
    --motion-fade:                    var(--duration-normal) var(--easing-default);
    --motion-expand:                  var(--duration-slow) var(--easing-out);
}


/* ================================================================
   Layer 2 — Semantic Tokens (Dark Theme)
   仅覆写与 Light 不同的值。
   ================================================================ */

[data-theme="dark"] {
    /* ── 品牌色 ── */
    --color-brand-primary:            oklch(0.720 0.165 254);
    --color-brand-primary-hover:      oklch(0.800 0.120 255);
    --color-brand-primary-active:     var(--blue-500);

    /* ── 背景 ── */
    --color-bg-surface:               oklch(0.205 0 0);
    --color-bg-elevated:              oklch(0.258 0 0);
    --color-bg-overlay:               oklch(0 0 0 / 65%);
    --color-bg-disabled:              oklch(1 0 0 / 0.08);
    --color-bg-hover-subtle:          oklch(1 0 0 / 0.06);

    /* ── 文本 ── */
    --color-text-primary:             oklch(1 0 0 / 0.88);
    --color-text-secondary:           oklch(1 0 0 / 0.65);
    --color-text-tertiary:            oklch(1 0 0 / 0.4);
    --color-text-on-brand:            oklch(1 0 0);
    --color-text-disabled:            oklch(1 0 0 / 0.25);
    --color-text-link:                oklch(0.720 0.165 254);
    --color-text-link-hover:          oklch(0.800 0.120 255);

    /* ── 边框 ── */
    --color-border-default:           oklch(0.373 0.016 261);
    --color-border-hover:             oklch(0.446 0.018 264);
    --color-border-focus:             oklch(0.720 0.165 254);
    --color-border-error:             oklch(0.795 0.105 20);

    /* ── 反馈 ── */
    --color-feedback-error:           oklch(0.795 0.105 20);
    --color-feedback-error-bg:        oklch(0.637 0.237 25 / 0.15);
    --color-feedback-success:         oklch(0.878 0.155 150);
    --color-feedback-success-bg:      oklch(0.723 0.219 149 / 0.15);
    --color-feedback-warning:         oklch(0.882 0.157 84);
    --color-feedback-warning-bg:      oklch(0.769 0.188 70 / 0.15);

    /* ── 填充 ── */
    --color-fill-inactive:            oklch(0.373 0.016 261);
    --color-fill-active:              oklch(0.720 0.165 254);

    /* ── 阴影（暗色下加深） ── */
    --shadow-dropdown:                0 4px 6px -1px oklch(0 0 0 / 0.3), 0 2px 4px -2px oklch(0 0 0 / 0.3);
    --shadow-dialog:                  0 10px 15px -3px oklch(0 0 0 / 0.4), 0 4px 6px -4px oklch(0 0 0 / 0.3);
}
```

#### 4.2 主题切换实现

```typescript
/**
 * 主题切换 — 通过 data-theme 属性驱动
 *
 * 原理：
 *   1. Global Token 始终不变（刻度值与主题无关）
 *   2. Semantic Token 在 [data-theme="dark"] 下被覆写
 *   3. Component Token 引用 Semantic Token，无需任何修改即可响应变化
 */
function setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
}

/** 跟随操作系统偏好自动切换 */
function initThemeFromSystem() {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(query.matches ? 'dark' : 'light');
    query.addEventListener('change', (e) => setTheme(e.matches ? 'dark' : 'light'));
}
```

**数据流示意**：

```
setTheme('dark')
  → <html data-theme="dark">
    → [data-theme="dark"] { --color-brand-primary: oklch(0.720 0.165 254); ... }
      → --button-bg-primary 引用 --color-brand-primary → 自动获得新值
      → --dialog-bg 引用 --color-bg-elevated → 自动获得新值
      → --dialog-z-index 引用 --z-index-dialog → 层级不受主题影响
      → 所有组件视觉同步切换，零代码修改
```

#### 4.3 消费方覆写方式

组件库消费方可在三个粒度进行定制，**无需 fork 源码**：

```css
/* 粒度一：覆写 Global，影响全部主题 */
:root {
    --blue-500: oklch(0.585 0.233 277);  /* 将品牌色从蓝色改为靛色 */
}

/* 粒度二：覆写 Semantic，影响所有使用该语义的组件 */
:root {
    --color-brand-primary: oklch(0.585 0.233 277);
    --color-brand-primary-hover: oklch(0.520 0.242 281);
}

/* 粒度三：覆写 Component，仅影响单个组件 */
:root {
    --dialog-border-radius: 16px;       /* 只改弹窗圆角 */
    --button-height-md: 36px;           /* 只改按钮中号高度 */
    --dialog-z-index: 2000;             /* 提高弹窗层级 */
}
```

#### 4.4 Component Token 声明位置

Component Token 的声明遵循**就近原则**，与组件代码共存，而非集中在全局样式文件中。

**目录结构**：

```
components/rc-button/
├── token.toml           ← Component Token 定义（单一事实来源）
├── src/
│   ├── token.ts         ← 自动生成（禁止手动编辑）
│   ├── button.tsx       ← 通过 import token 引用
│   └── index.ts
└── css/
    └── index.css        ← 编译后的静态 CSS（含 var() 引用）
```

**原则**：

1. **组件自包含** — Component Token 随组件发包，不依赖外部全局 CSS。
2. **按需加载** — 未使用的组件的 Token 不会出现在最终产物中。
3. **职责隔离** — 组件开发者维护自己的 `token.toml`，无需修改全局文件。

**Global / Semantic Token 的声明位置**：

Global Token 和 Semantic Token 在设计系统核心包（如 `@crab-dev/rc-theme`）中集中声明，通过一个顶层 CSS 文件注入 `:root`，作为所有组件的共享基础：

```
packages/rc-theme/
├── tokens/
│   ├── global.css       ← Global Token (:root)
│   ├── semantic.css     ← Semantic Token (Light 默认)
│   └── dark.css         ← Semantic Token (Dark 覆写)
└── index.css            ← 汇总入口，@import 以上三者
```

消费方只需在入口引入一次：

```typescript
import '@crab-dev/rc-theme/index.css';
```

---

### 5. token.toml 工具链

本规范采用 `token.toml` 作为 Token 的**单一事实来源**，通过自动化工具链生成 CSS 和 TypeScript 产物，杜绝手动维护带来的不一致。

#### 5.1 token.toml 文件结构

每个组件包含一个 `token.toml`，定义该组件的 Component Token：

```toml
[build]
output = "./src/token.ts"       # 自动生成的 TypeScript 文件路径
prefix = "button"               # CSS 变量前缀 → --button-*

[token]
# 嵌套键名映射到 CSS 变量名（用 . 分隔 → 用 - 连接）
# 值为 OKLCh 字面量或 var() 引用

transition = "transform 90ms ease-out, box-shadow 90ms ease-out, background-color 90ms ease-out"
opacity.loading = "0.65"

size.large.gap = "10px"
size.large.height = "40px"
size.large.padding = "0 15px"
size.large.border.radius = "10px"
size.large.font.size = "16px"

size.middle.gap = "8px"
size.middle.height = "32px"
size.middle.padding = "0 15px"
size.middle.border.radius = "8px"
size.middle.font.size = "14px"

primary.color = "oklch(1 0 0)"
primary.background.color = "oklch(0.623 0.214 259)"
primary.background.color-hover = "oklch(0.546 0.245 262)"
```

**命名映射规则**：

```
token.toml 键名              → CSS 变量名
─────────────────────────────────────────────
size.large.height            → --button-size-large-height
primary.background.color     → --button-primary-background-color
opacity.loading              → --button-opacity-loading
```

#### 5.2 自动生成产物

运行生成命令后，工具链读取 `token.toml` 并输出 TypeScript 文件：

```bash
# 单组件生成
packify generate:css-token

# 全量生成（monorepo 场景，通过 Turbo 并行）
yarn generate:token
```

生成的 `src/token.ts`（**禁止手动编辑**）：

```typescript
// ⚠️ AUTO-GENERATED from token.toml — do not edit

/** 扁平 CSS 变量名映射 */
export const vars = {
    'transition': '--button-transition',
    'opacity.loading': '--button-opacity-loading',
    'size.large.gap': '--button-size-large-gap',
    'size.large.height': '--button-size-large-height',
    'primary.color': '--button-primary-color',
    'primary.background.color': '--button-primary-background-color',
    'primary.background.color-hover': '--button-primary-background-color-hover',
    // ...
} as const;

/** 嵌套 Token 对象，值为 var(--name, fallback) */
const token = {
    transition: 'var(--button-transition, transform 90ms ease-out, ...)',
    opacity: {
        loading: 'var(--button-opacity-loading, 0.65)',
    },
    size: {
        large: {
            gap: 'var(--button-size-large-gap, 10px)',
            height: 'var(--button-size-large-height, 40px)',
            // ...
        },
    },
    primary: {
        color: 'var(--button-primary-color, oklch(1 0 0))',
        background: {
            color: 'var(--button-primary-background-color, oklch(0.623 0.214 259))',
            'color-hover': 'var(--button-primary-background-color-hover, oklch(0.546 0.245 262))',
        },
    },
} as const;

export default token;
```

#### 5.3 组件中消费 Token

在组件样式中直接引用生成的 `token` 对象：

```typescript
import { css } from '@crab-dev/css';
import token from './token.js';

const primaryStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary.background.color};

    &:hover {
        background-color: ${token.primary.background['color-hover']};
    }
`;
```

编译后输出的 CSS 中自动包含 `var()` 引用，消费方可通过覆写 CSS 变量定制样式。

#### 5.4 工具链流程图

```
token.toml                       packify generate:css-token
┌─────────────────┐              ┌──────────────────────────────┐
│ [build]         │              │ 1. 读取 token.toml           │
│   output, prefix│─────────────→│ 2. 解析 [build] + [token]   │
│ [token]         │              │ 3. 生成 vars 扁平映射        │
│   key = value   │              │ 4. 生成嵌套 token 对象       │
└─────────────────┘              │ 5. 写入 src/token.ts         │
                                 └──────────┬───────────────────┘
                                            │
                    ┌───────────────────────┐│┌───────────────────┐
                    │ src/token.ts          │││ css/index.css      │
                    │ (TypeScript 类型安全)  │←┘│ (编译后的静态 CSS)  │
                    └───────────────────────┘  └───────────────────┘
```

---

### 6. Token 扩展类别参考

以下列出完整类别清单，团队可按需选取并扩展：

| 类别 | Global 刻度示例 | Semantic 映射示例 | 典型消费组件 |
|------|---------------|------------------|-------------|
| **Color** | `--gray-*`, `--blue-*`, `--red-*`（OKLCh） | `--color-brand-*`, `--color-text-*`, `--color-bg-*` | 所有组件 |
| **Spacing** | `--space-0-5` ~ `--space-16` | `--space-inline-gap`, `--space-component-gap`, `--space-control-padding-*` | Button, Form, Dialog |
| **Border Radius** | `--radius-0-5` ~ `--radius-full` | `--radius-badge`, `--radius-control`, `--radius-dialog` | Button, Dialog, DatePicker |
| **Font Size** | `--font-size-xs` ~ `--font-size-2xl` | 直接使用或通过组件 Token | Button, Form, Dialog |
| **Font Weight** | `--font-weight-regular` ~ `--font-weight-bold` | 直接使用或通过组件 Token | Form Label, Dialog Heading |
| **Line Height** | `--line-height-tight/normal/loose` | 直接使用 | 多行文本组件 |
| **Shadow** | `--shadow-sm/md/lg` | `--shadow-dropdown`, `--shadow-dialog` | Dialog, Dropdown, DatePicker |
| **Opacity** | `--opacity-disabled: 0.4` | `--opacity-disabled` | Button (loading), 禁用态 |
| **Z-Index** | `--z-base` ~ `--z-tooltip` (0–1700) | `--z-index-dropdown`, `--z-index-dialog`, `--z-index-tooltip` | Dialog, Dropdown, Slider, Toast |
| **Motion** | `--duration-*`, `--easing-*` | `--motion-fade`, `--motion-expand` | 所有含动画组件 |
| **Border Width** | `--border-width-1: 1px`, `--border-width-2: 2px` | — | Button, Form Input |

---

### 7. 无障碍约束 (Accessibility)

#### 7.1 对比度要求

所有 Token 的色彩组合必须满足 **WCAG 2.1 AA 级**对比度标准：

| 场景 | 最低对比度 | Token 组合示例 |
|------|-----------|---------------|
| 正文文本 | 4.5:1 | `--color-text-primary` on `--color-bg-surface` |
| 大号文本（≥18px bold / ≥24px） | 3:1 | `--dialog-heading-*` on `--dialog-bg` |
| 交互控件边框 / 图标 | 3:1 | `--color-border-default` on `--color-bg-surface` |
| 品牌色上的前景 | 4.5:1 | `--color-text-on-brand` on `--color-brand-primary` |
| 禁用态 | 不作要求 | `--color-text-disabled` — 但须配合 `aria-disabled` |

> **OKLCh 下的对比度验证**：在 OKLCh 色彩空间中，仅靠 Lightness 差值无法直接推断 WCAG 对比度。仍须使用标准的相对亮度公式（基于 sRGB 线性化）进行验证。推荐工具：[APCA Contrast Calculator](https://www.myndex.com/APCA/) 或浏览器 DevTools 内置的对比度检查。

#### 7.2 焦点可见性 Token

为键盘导航提供统一的焦点环样式，新增以下 Token：

```css
/* ── Global ── */
--focus-ring-width:    2px;
--focus-ring-offset:   2px;
--focus-ring-style:    solid;

/* ── Semantic (Light) ── */
--color-focus-ring:    var(--blue-500);

/* ── Semantic (Dark) ── */
--color-focus-ring:    oklch(0.720 0.165 254);
```

**组件使用方式**：

```css
:focus-visible {
    outline: var(--focus-ring-width) var(--focus-ring-style) var(--color-focus-ring);
    outline-offset: var(--focus-ring-offset);
}
```

> 所有可交互组件（Button、Dialog 关闭按钮、Form 控件、DatePicker 日期格、Slider 滑块）必须在 `:focus-visible` 下展示焦点环。

#### 7.3 减弱动效 (Reduced Motion)

尊重用户的系统偏好，当 `prefers-reduced-motion: reduce` 时禁用或缩短动画：

```css
@media (prefers-reduced-motion: reduce) {
    :root {
        --duration-fast:    0ms;
        --duration-normal:  0ms;
        --duration-slow:    0ms;
    }
}
```

组件中使用 `--motion-*` Semantic Token 驱动动画，系统级偏好覆写 Global Token 后自动全局生效，组件无需额外适配。

#### 7.4 验证清单

新增或修改颜色 Token 时，必须验证以下组合：

- [ ] Light 主题下所有 text / bg 组合 ≥ 4.5:1
- [ ] Dark 主题下所有 text / bg 组合 ≥ 4.5:1
- [ ] 焦点环在所有背景色上清晰可见（含 Dark 主题）
- [ ] `prefers-reduced-motion: reduce` 下无残余动画
- [ ] 品牌色变体（如 Brand B）同样满足对比度要求

---

### 8. 多品牌主题扩展

当前定义了 Light / Dark 两套主题。扩展到多品牌时，使用 `data-brand` 属性叠加在 `data-theme` 之上。

#### 8.1 优先级模型

```
优先级（低 → 高）：

:root (Global 刻度)
  → [data-theme="light"] (Semantic 默认)
    → [data-brand="brand-b"] (品牌覆写)
      → Component Token (组件级)
        → 消费方自定义覆写
```

#### 8.2 CSS 结构

```css
/* ── 品牌 A（默认，无额外选择器） ── */
:root {
    --color-brand-primary: var(--blue-500);
}

/* ── 品牌 B ── */
[data-brand="brand-b"] {
    --color-brand-primary:        oklch(0.585 0.233 277);   /* 靛色系 */
    --color-brand-primary-hover:  oklch(0.520 0.242 281);
    --color-brand-primary-active: oklch(0.470 0.240 284);
    /* 其余 Semantic Token 不变，自动继承 */
}

/* ── 品牌 B + Dark 主题叠加 ── */
[data-brand="brand-b"][data-theme="dark"] {
    --color-brand-primary:        oklch(0.700 0.180 277);
    --color-brand-primary-hover:  oklch(0.780 0.130 278);
}
```

#### 8.3 切换方式

```typescript
function setBrand(brand: string) {
    document.documentElement.setAttribute('data-brand', brand);
}

// 同时切换品牌和主题
setBrand('brand-b');
setTheme('dark');
// → <html data-brand="brand-b" data-theme="dark">
```

#### 8.4 规则

1. 品牌覆写仅修改 **Semantic Token**，不修改 Global 刻度。
2. 每个品牌独立一个 CSS 文件（如 `brand-b.css`），按需加载。
3. Component Token 无需感知品牌——它们引用 Semantic Token，品牌切换自动传导。
4. 新增品牌时须对所有颜色组合执行 §7 无障碍对比度验证。

---

### 9. 响应式 Token（断点）

#### 9.1 Global 断点 Token

```css
:root {
    --breakpoint-sm:   640px;
    --breakpoint-md:   768px;
    --breakpoint-lg:   1024px;
    --breakpoint-xl:   1280px;
    --breakpoint-2xl:  1536px;
}
```

> **注意**：CSS Custom Properties 不能直接用于 `@media` 查询条件。断点 Token 主要用于 JS 侧逻辑和文档统一，CSS 中仍需使用字面值。

#### 9.2 响应式间距策略

通过媒体查询覆写 Semantic Token，实现不同视口下的间距适配：

```css
/* 移动端（默认）— 更紧凑 */
:root {
    --space-page-padding:       var(--space-4);     /* 16px */
    --space-section-gap:        var(--space-3);     /* 12px */
    --space-dialog-padding:     var(--space-4);     /* 16px */
}

/* 桌面端 ≥ 768px — 更宽松 */
@media (min-width: 768px) {
    :root {
        --space-page-padding:   var(--space-6);     /* 24px */
        --space-section-gap:    var(--space-4);     /* 16px */
        --space-dialog-padding: var(--space-6);     /* 24px */
    }
}

/* 大屏 ≥ 1280px */
@media (min-width: 1280px) {
    :root {
        --space-page-padding:   var(--space-8);     /* 32px */
    }
}
```

#### 9.3 响应式字号策略

对标题字号使用 `clamp()` 实现流体缩放：

```css
:root {
    --font-size-heading-1: clamp(var(--font-size-xl), 2.5vw, var(--font-size-2xl));
    --font-size-heading-2: clamp(var(--font-size-lg), 2vw, var(--font-size-xl));
}
```

#### 9.4 约束

- **Global Token 不随视口变化**——刻度值始终固定。
- **仅 Semantic Token 可在 `@media` 中覆写**——保持三层架构的隔离性。
- Component Token 引用 Semantic Token，自动响应视口变化，无需额外处理。

---

### 10. SSR 与首屏防闪烁

使用 `data-theme` 的方案在 SSR（Server-Side Rendering）场景下可能出现 **FOUC**（Flash of Wrong Theme）。

#### 10.1 阻塞脚本注入

在 `<head>` 中注入一段**同步阻塞脚本**，在页面渲染前确定主题：

```html
<head>
    <script>
        // 阻塞执行：在任何 CSS 渲染前设置 data-theme
        (function() {
            var saved = localStorage.getItem('theme');
            if (saved) {
                document.documentElement.setAttribute('data-theme', saved);
                return;
            }
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute(
                'data-theme',
                prefersDark ? 'dark' : 'light'
            );
        })();
    </script>
    <link rel="stylesheet" href="/tokens.css" />
</head>
```

**要点**：

1. **脚本必须放在 CSS `<link>` 之前** — 确保浏览器解析 CSS 前 `data-theme` 已就位。
2. **不可使用 `async` / `defer`** — 必须同步阻塞执行。
3. **服务端预设** — 如果有 Cookie / Session 记录用户偏好，在 SSR 时直接渲染 `<html data-theme="dark">`，脚本仅作为客户端降级。

#### 10.2 多品牌 SSR

品牌信息通常来自路由/域名，服务端可在渲染时直接注入：

```html
<!-- 服务端模板 -->
<html data-theme="<%= theme %>" data-brand="<%= brand %>">
```

#### 10.3 CSS 加载顺序

```
1. inline <script> 设置 data-theme / data-brand
2. <link> 加载 global.css（Global Token）
3. <link> 加载 semantic.css + dark.css（Semantic Token）
4. <link> 加载 brand-*.css（品牌覆写，可选）
5. 各组件 CSS 按需加载（Component Token）
```

> Dark 主题的 CSS 应始终加载（而非条件加载），因为 `data-theme` 属性选择器已保证隔离。条件加载会导致主题切换时的二次请求延迟。

---

### 11. OKLCh 降级策略

所有主流浏览器（Chrome 111+、Firefox 113+、Safari 15.4+）均已支持 `oklch()`。若需兼容更低版本浏览器，提供以下降级方案。

#### 11.1 Fallback 双行声明（推荐）

利用 CSS 的后声明覆盖规则，先写 Hex fallback，再写 OKLCh：

```css
:root {
    --blue-500: #3b82f6;                    /* fallback — 旧浏览器使用 */
    --blue-500: oklch(0.623 0.214 259);     /* 新浏览器覆写 */
}
```

> 不支持 `oklch()` 的浏览器会忽略第二行（解析为 invalid value），自动使用第一行。

工具链可在生成时自动输出双行：在 `token.toml` 中添加 fallback 标记：

```toml
[build]
output = "./src/token.ts"
prefix = "button"
fallback = true                 # 启用 Hex fallback 输出

[token]
primary.color = "oklch(1 0 0)"
```

#### 11.2 `@supports` 条件块

适用于需要整块替换的场景：

```css
:root {
    --color-brand-primary: #3b82f6;
}

@supports (color: oklch(0 0 0)) {
    :root {
        --color-brand-primary: oklch(0.623 0.214 259);
    }
}
```

#### 11.3 何时可以跳过降级

满足以下任一条件时，可不提供 fallback：

- 内部系统（企业后台），浏览器版本可控
- Electron / Tauri 等桌面应用，WebView 版本已知
- 产品已声明浏览器 baseline（如 Chrome 111+）
- SSR 环境无旧浏览器用户流量（通过 UA 统计确认）

---

### 12. Token 版本管理与废弃策略

Token 变更可能是 **breaking change**，需要明确的版本管理和迁移策略。

#### 12.1 变更分级

| 变更类型 | 影响 | 处理方式 | 发布策略 |
|---------|------|---------|---------|
| **新增 Token** | 无 breaking | 直接添加 | Patch / Minor |
| **修改 Token 值** | 视觉变化 | 在 CHANGELOG 中标注 | Patch / Minor |
| **重命名 Token** | ⚠ Breaking | 废弃旧名 + 别名过渡 | Minor（废弃）→ Major（移除） |
| **删除 Token** | ⚠ Breaking | 先废弃，至少保留 1 个 Major 版本 | Major |

#### 12.2 废弃流程

```
1. 标记废弃 → 2. 别名过渡 → 3. 构建警告 → 4. 移除
```

**步骤 1 & 2：标记废弃 + 别名过渡**

在 `token.toml` 中使用 `@deprecated` 注释，并保留旧名作为别名：

```toml
[token]
# @deprecated since v2.3 — 使用 size.medium 替代，将在 v3.0 移除
size.middle.height = "32px"

# 新命名
size.medium.height = "32px"
```

工具链生成的 CSS 中保留旧变量作为别名：

```css
/* 新 Token */
--button-size-medium-height: 32px;

/* 废弃别名 — 引用新 Token，保持向后兼容 */
--button-size-middle-height: var(--button-size-medium-height);
```

**步骤 3：构建时警告**

工具链在生成时检测 `@deprecated` 标记，输出控制台警告：

```
⚠ [packify] Deprecated token: button.size.middle.height
  → Use button.size.medium.height instead (removal: v3.0)
```

**步骤 4：移除**

在下一个 Major 版本中删除废弃的 Token 和别名。在 CHANGELOG 和迁移指南中列出所有被移除的变量。

#### 12.3 迁移指南模板

每次 Major 版本发布时，须提供迁移指南：

```markdown
## 从 v2.x 迁移到 v3.0

### Token 重命名

| 旧名称 (v2) | 新名称 (v3) |
|---|---|
| `--button-size-middle-*` | `--button-size-medium-*` |

### Token 移除

| 移除的 Token | 替代方案 |
|---|---|
| `--button-box-shadow-primary` | 使用 `--shadow-*` 语义 Token |
```

**自动迁移**：提供 codemod 脚本批量替换：

```bash
npx crab-codemod token-rename --from v2 --to v3
```

#### 12.4 语义化版本约定

| Token 操作 | 版本号变更 | 示例 |
|-----------|-----------|------|
| 新增 Token | Minor (x.**Y**.z) | v2.3.0 → v2.4.0 |
| 修改 Token 默认值 | Patch (x.y.**Z**) | v2.4.0 → v2.4.1 |
| 标记废弃（保留别名） | Minor | v2.4.0 → v2.5.0 |
| 移除废弃 Token | **Major** (**X**.y.z) | v2.5.0 → v3.0.0 |

---

## 落地计划

新增 Token 时，按以下检查清单逐项确认：

- [ ] 确认该值**是否已存在于 Global 刻度**，避免重复定义新刻度
- [ ] 确认该值**是否已有对应的 Semantic Token**，优先复用
- [ ] 如需新增 Semantic Token，确认命名符合 §2.2 模板
- [ ] 如需新增 Component Token，确认以**组件名开头**，并引用 Semantic Token 而非硬编码
- [ ] 确认 Dark 主题下该 Token 是否需要**差异值**（仅调整 OKLCh Lightness 通道）
- [ ] 颜色值使用 **OKLCh** 格式，禁止使用 Hex / RGB（降级 fallback 除外）
- [ ] 如涉及浮层/弹出层组件，确认 z-index 是否引用了 `--z-index-*` 语义 Token
- [ ] 颜色 Token 的 text / bg 组合满足 **WCAG AA 对比度**（§7.1）
- [ ] 可交互组件包含 `:focus-visible` 焦点环样式（§7.2）
- [ ] 动画使用 `--motion-*` Token，已兼容 `prefers-reduced-motion`（§7.3）
- [ ] 如涉及多品牌场景，确认品牌覆写仅修改 Semantic 层（§8）
- [ ] 如目标环境含旧浏览器，确认 OKLCh fallback 已启用（§11）
- [ ] 在 `token.toml` 中新增字段，运行 `packify generate:css-token` 重新生成 `token.ts`
- [ ] 在 TypeScript 类型定义中同步新增对应字段
- [ ] 通知设计团队在 Figma 中同步更新 Token

---

## 附录

### A. 命名术语保留词表

以下术语在本规范中有固定含义，**全团队统一使用**：

| 术语 | 含义 | 禁止替代词 |
|------|------|-----------|
| `surface` | 组件/卡片的底层背景 | `base`, `ground` |
| `elevated` | 浮层背景（弹窗、下拉） | `raised`, `popup` |
| `overlay` | 遮罩层背景 | `mask`, `backdrop` |
| `brand` | 品牌色 | `theme`, `accent`（accent 另有含义） |
| `subtle` | 低对比度/弱化 | `light`, `soft`, `muted` |
| `on-brand` | 品牌色上方的前景色 | `inverse`, `contrast` |
| `control` | 表单控件 | `input`, `field` |
| `feedback` | 错误 / 成功 / 警告 | `status`, `alert` |

### B. 设计对接规范

为确保设计与工程的 Token 同步，约定如下协作流程：

1. **设计师**在 Figma 中使用与 CSS 变量**同名**的 Variable（如 `color/brand/primary`）。
2. **变更提案**以 RFC 形式提交：包含变量名、Light/Dark 值、影响范围。
3. **Token 审核**由设计系统核心团队统一 Review，避免命名冲突和语义模糊。
4. 合并后由工程侧更新 Token 源文件，自动生成代码产物。

### C. Token 完整清单索引

以下为各层级 Token 的完整分类索引，供快速查阅。具体值参见 §3 核心 Token 映射树。

#### Layer 1 — Global Token

| 分类 | Token 范围 | 数量 |
|------|-----------|------|
| 色彩刻度 | `--{hue}-{50..950}` (OKLCh) | 每色阶 13 级 × N 色相 |
| 中性色刻度 | `--gray-{50..950}` | 13 级 |
| 间距刻度 | `--space-{0..16}` (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16) | 13 级 |
| 圆角刻度 | `--radius-{0.5..full}` (0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, full) | 11 级 |
| 字号刻度 | `--font-size-{xs..4xl}` | 9 级 |
| 行高刻度 | `--line-height-{tight..loose}` | 5 级 |
| 字重刻度 | `--font-weight-{regular..bold}` | 4 级 |
| 阴影刻度 | `--shadow-{1..5}` | 5 级 |
| z-index 刻度 | `--z-{base..tooltip}` (0, 100..1700) | 8 级 |
| 动效时长 | `--duration-{fast\|normal\|slow}` | 3 级 |
| 动效缓动 | `--easing-{default\|in\|out\|in-out}` | 4 级 |
| 边框宽度 | `--border-width-{1..3}` | 3 级 |
| 断点 | `--breakpoint-{sm\|md\|lg\|xl\|2xl}` | 5 级 |
| 焦点环 | `--focus-ring-{width\|offset\|style}` | 3 项 |

#### Layer 2 — Semantic Token

| 分类 | Token 示例 | 主题变体 |
|------|-----------|---------|
| 文本色 | `--color-text-{primary\|secondary\|tertiary\|disabled\|on-brand}` | Light / Dark |
| 背景色 | `--color-bg-{surface\|elevated\|overlay\|sunken}` | Light / Dark |
| 品牌色 | `--color-brand-{primary\|hover\|active\|disabled}` | Light / Dark |
| 反馈色 | `--color-{success\|warning\|error\|info}-{default\|subtle\|text}` | Light / Dark |
| 边框色 | `--color-border-{default\|subtle\|strong\|focus}` | Light / Dark |
| 焦点色 | `--color-focus-ring` | Light / Dark |
| 间距 | `--space-{inline-gap\|component-gap\|stack-gap\|section-gap\|...}` | 响应式覆写 |
| 圆角 | `--radius-{badge\|control\|card\|popover\|dialog\|tooltip\|pill}` | — |
| z-index | `--z-index-{dropdown\|sticky\|overlay\|modal\|popover\|toast\|tooltip}` | — |
| 字号-标题 | `--font-size-heading-{1\|2}` | 响应式 clamp() |
| 动效 | `--motion-{enter\|exit\|expand\|collapse}-{duration\|easing}` | reduced-motion |

#### Layer 3 — Component Token（按组件包）

| 组件包 | Token 前缀 | 典型 Token |
|--------|-----------|-----------|
| `rc-button` | `--button-*` | `height-{sm\|md\|lg}`, `padding-x`, `border-radius`, `font-size`, `bg-*`, `text-*` |
| `rc-dialog` | `--dialog-*` | `width-{sm\|md\|lg}`, `padding`, `border-radius`, `bg`, `z-index`, `overlay-bg` |
| `rc-date-picker` | `--date-picker-*` | `cell-size`, `header-height`, `bg`, `border-radius`, `selected-bg` |
| `rc-slider` | `--slider-*` | `track-height`, `thumb-size`, `track-bg`, `fill-bg`, `thumb-bg` |
| `rc-form` | `--form-*` | `label-gap`, `item-gap`, `error-color`, `help-color` |
| `rc-line-edit` | `--line-edit-*` | `height`, `padding-x`, `border-radius`, `bg`, `border-color`, `focus-border` |
| `rc-menu` | `--menu-*` | `item-height`, `padding-x`, `bg`, `hover-bg`, `active-bg`, `border-radius` |
| `rc-notification` | `--notification-*` | `width`, `padding`, `border-radius`, `bg`, `shadow`, `z-index` |
| `rc-table` | `--table-*` | `row-height`, `header-bg`, `border-color`, `stripe-bg`, `padding-x` |
| `rc-tree` | `--tree-*` | `indent`, `node-height`, `hover-bg`, `selected-bg`, `icon-size` |

### D. OKLCh 快速参考

**公式**：`oklch(L C H [/ A])`

| 通道 | 含义 | 范围 | 说明 |
|------|------|------|------|
| **L** (Lightness) | 亮度 | 0 – 1 | 0 = 黑色，1 = 白色 |
| **C** (Chroma) | 色度/饱和度 | 0 – 0.4+ | 0 = 灰色，值越大越鲜艳 |
| **H** (Hue) | 色相角 | 0 – 360 | 0/360 = 红，90 = 黄，180 = 青，270 = 蓝 |
| **A** (Alpha) | 透明度 | 0 – 1 | 可选，1 = 不透明 |

**常用色相角速查**：

```
  0°  红       Red
 30°  橙       Orange
 60°  黄       Yellow
 90°  黄绿     Yellow-Green
120°  绿       Green
180°  青       Cyan
210°  天蓝     Sky Blue
250°  蓝       Blue
270°  靛蓝     Indigo
300°  紫       Purple
330°  品红     Magenta
```

**Dark 主题快速调色法则**：

- **背景色**：降低 L 至 0.15–0.25，C 保持极低（0–0.02）
- **文本色**：提升 L 至 0.85–0.95
- **品牌色**：提升 L 约 +0.1，降低 C 约 −0.03（避免过亮刺眼）
- **反馈色**：保持 H 不变，仅调整 L 和 C

**与其他色彩空间的对比**：

| 特性 | Hex/RGB | HSL | OKLCh |
|------|---------|-----|-------|
| 感知均匀性 | ✗ | ✗ | ✓ |
| 色域覆盖 | sRGB | sRGB | P3+ |
| 亮度调整直觉 | 差 | 一般 | 好（L 通道线性对应感知亮度） |
| 浏览器支持 | 全部 | 全部 | Chrome 111+, FF 113+, Safari 15.4+ |

