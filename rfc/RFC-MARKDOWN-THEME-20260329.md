<div align="center">
	<h1>RFC-MARKDOWN-THEME-20260329</h1>
</div>

## 概述

当应用需要渲染来自 CMS、Markdown 文件、用户输入等**不受控的 HTML 内容**时，缺乏统一的排版样式方案会导致：

1. **样式缺失** — 原生 HTML 元素（`<h1>`、`<blockquote>`、`<table>` 等）无任何视觉表现，与组件库风格脱节。
2. **逐项手写** — 开发者为每类元素单独编写排版样式，工作量大且不一致。
3. **主题不联动** — Markdown 渲染区域无法随组件库的 Light/Dark/Brand 主题自动切换。
4. **尺寸不适配** — 不同场景（文章正文、侧边帮助面板、对话气泡）需要不同排版尺寸，无统一缩放方案。

为解决上述问题，参考 [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) 的 `prose` 模式，在此提出 **Markdown 主题排版 Token 提案**。本 RFC 基于 RFC-DESIGN-TOKEN-20260329 的三层架构，为 Markdown / 富文本内容定义一套完整的排版 Token 系统。

## 目标

| 目标 | 说明 |
|------|------|
| **开箱即用** | 提供 `.prose` 基础类，包裹即获得美观的排版默认值 |
| **主题联动** | 排版 Token 引用 Design Token 的 Semantic 层，Light/Dark/Brand 切换自动生效 |
| **尺寸可缩放** | 提供 `prose-sm` / `prose-base` / `prose-lg` / `prose-xl` 四个尺寸变体 |
| **颜色可定制** | 通过 CSS Custom Properties 暴露所有颜色变量，消费方可按需覆写 |
| **零运行时** | 基于 Linaria 编译为静态 CSS，不引入额外 JS 开销 |
| **可组合** | 支持 `not-prose` 沙箱机制，嵌入区域可脱离排版样式 |

## 非目标

- 不实现 Markdown 解析器 — 仅提供样式层，解析交由 `react-markdown`、`mdx` 等外部工具。
- 不替代组件 API — 组件库的 `<Button>`、`<Table>` 等组件仍使用各自的 Component Token。
- 不提供代码高亮 — 代码块的语法高亮由 Prism / Shiki 等外部库处理，本 RFC 仅定义 `<pre>` / `<code>` 的容器样式。

---

## 详细设计

### 1. 架构定位

Markdown 主题排版位于 Design Token 三层架构的 **Layer 3（Component Token）** 层级，作为一个特殊的"排版组件"存在：

```
Layer 1 — Global Tokens
  └─ 色彩刻度、字号刻度、间距刻度 ...

Layer 2 — Semantic Tokens
  └─ --color-text-primary, --color-bg-surface ...

Layer 3 — Component Tokens
  ├─ --button-*            (Button 组件)
  ├─ --dialog-*            (Dialog 组件)
  └─ --prose-*             (Markdown 排版)  ← 本 RFC
```

### 2. Token 定义

#### 2.1 颜色 Token

所有颜色 Token 以 `--prose-` 为前缀，引用 Semantic 层变量，确保主题切换自动生效。

**Light 主题默认值**：

```css
:root,
[data-theme="light"] {
    /* ── 正文 ── */
    --prose-body:                  var(--color-text-primary);
    --prose-headings:              var(--gray-900);
    --prose-lead:                  var(--color-text-secondary);
    --prose-links:                 var(--color-text-link);
    --prose-links-hover:           var(--color-text-link-hover);
    --prose-bold:                  var(--gray-900);
    --prose-counters:              var(--gray-500);
    --prose-bullets:               var(--gray-300);

    /* ── 分隔线 ── */
    --prose-hr:                    var(--color-border-default);

    /* ── 引用 ── */
    --prose-quotes:                var(--gray-900);
    --prose-quote-borders:         var(--color-border-default);

    /* ── 题注 ── */
    --prose-captions:              var(--color-text-secondary);

    /* ── 代码 ── */
    --prose-code:                  var(--gray-900);
    --prose-code-bg:               var(--gray-100);
    --prose-pre-code:              var(--gray-200);
    --prose-pre-bg:                var(--gray-800);

    /* ── 键盘 ── */
    --prose-kbd:                   var(--gray-900);
    --prose-kbd-bg:                var(--gray-100);
    --prose-kbd-border:            var(--gray-300);
    --prose-kbd-shadow:            oklch(0 0 0 / 10%);

    /* ── 表格 ── */
    --prose-th-borders:            var(--gray-300);
    --prose-td-borders:            var(--color-border-default);
    --prose-th-bg:                 var(--gray-50);

    /* ── 图片/图表 ── */
    --prose-img-border:            transparent;
    --prose-img-radius:            var(--radius-2);
    --prose-figcaption:            var(--color-text-secondary);
}
```

**Dark 主题覆写**：

```css
[data-theme="dark"] {
    --prose-body:                  oklch(1 0 0 / 0.82);
    --prose-headings:              oklch(1 0 0 / 0.92);
    --prose-lead:                  oklch(1 0 0 / 0.60);
    --prose-links:                 oklch(0.720 0.165 254);
    --prose-links-hover:           oklch(0.800 0.120 255);
    --prose-bold:                  oklch(1 0 0 / 0.92);
    --prose-counters:              oklch(1 0 0 / 0.45);
    --prose-bullets:               oklch(1 0 0 / 0.30);

    --prose-hr:                    oklch(0.373 0.016 261);

    --prose-quotes:                oklch(1 0 0 / 0.85);
    --prose-quote-borders:         oklch(0.373 0.016 261);

    --prose-captions:              oklch(1 0 0 / 0.50);

    --prose-code:                  oklch(1 0 0 / 0.90);
    --prose-code-bg:               oklch(1 0 0 / 0.08);
    --prose-pre-code:              oklch(1 0 0 / 0.75);
    --prose-pre-bg:                oklch(0 0 0 / 50%);

    --prose-kbd:                   oklch(1 0 0 / 0.90);
    --prose-kbd-bg:                oklch(1 0 0 / 0.08);
    --prose-kbd-border:            oklch(1 0 0 / 0.15);
    --prose-kbd-shadow:            oklch(0 0 0 / 25%);

    --prose-th-borders:            oklch(1 0 0 / 0.15);
    --prose-td-borders:            oklch(1 0 0 / 0.08);
    --prose-th-bg:                 oklch(1 0 0 / 0.04);

    --prose-img-border:            transparent;
    --prose-figcaption:            oklch(1 0 0 / 0.50);
}
```

#### 2.2 尺寸 Token

排版尺寸不通过 CSS Custom Properties 暴露（避免运行时切换带来的复杂性），而是通过编译时的 **尺寸变体类** 提供。

每个尺寸变体定义以下维度：

| 维度 | 说明 |
|------|------|
| `fontSize` | 正文基准字号 |
| `lineHeight` | 正文行高 |
| `maxWidth` | 最佳阅读宽度 |
| 元素级 `fontSize` | 各标题/代码/caption 相对于基准的比例 |
| 元素级 `margin` / `padding` | 各元素的垂直间距和内边距 |

**四个尺寸变体**：

| 变体 | 正文字号 | 行高 | 最佳宽度 | 适用场景 |
|------|---------|------|---------|---------|
| `prose-sm` | 14px (0.875rem) | 1.714 (24/14) | 65ch | 侧边栏帮助、紧凑面板 |
| `prose-base` | 16px (1rem) | 1.75 (28/16) | 65ch | 文章正文（默认） |
| `prose-lg` | 18px (1.125rem) | 1.778 (32/18) | 65ch | 宽松排版、文档页 |
| `prose-xl` | 20px (1.25rem) | 1.8 (36/20) | 65ch | 演示文稿、大屏 |

#### 2.3 排版尺度表（Base: 16px）

下表列出 `prose-base` 变体下各元素的完整排版尺度。其他变体按比例缩放。

**标题**：

| 元素 | 字号 | 字重 | 行高 | 上边距 | 下边距 |
|------|------|------|------|--------|--------|
| `h1` | 2.25em (36px) | 800 | 1.111 | 0 | 0.889em (32px) |
| `h2` | 1.5em (24px) | 700 | 1.333 | 2em (48px) | 1em (24px) |
| `h3` | 1.25em (20px) | 600 | 1.6 | 1.6em (32px) | 0.6em (12px) |
| `h4` | 1em (16px) | 600 | 1.5 | 1.5em (24px) | 0.5em (8px) |

**正文元素**：

| 元素 | 字号 | 行高 | 上/下边距 | 备注 |
|------|------|------|-----------|------|
| `p` | 1em | 1.75 | 1.25em (20px) | — |
| `[class~="lead"]` | 1.25em (20px) | 1.6 | 1.2em (24px) | 摘要/引言段 |
| `blockquote` | 1em | 1.625 | 1.6em (32px) | 左侧 0.25rem 边框 |
| `ul` / `ol` | 1em | 1.75 | 1.25em (20px) | paddingInlineStart: 1.625em |
| `li` | 1em | — | 0.5em (8px) | — |
| `hr` | — | — | 3em (48px) | 1px border-top |

**代码**：

| 元素 | 字号 | 行高 | 圆角 | padding |
|------|------|------|------|---------|
| `code` (inline) | 0.875em (14px) | — | 0.25rem | 0.2em 0.4em |
| `pre` (block) | 0.875em (14px) | 1.714 | 0.375rem (6px) | 0.857em 1.143em |

**表格**：

| 元素 | 字号 | padding | 备注 |
|------|------|---------|------|
| `thead th` | 0.875em | 0 0.571em 0.571em | 底部 1px 边框 |
| `tbody td` | — | 0.571em | 底部 1px 边框 |

**媒体**：

| 元素 | 上/下边距 | 备注 |
|------|-----------|------|
| `img` | 2em (32px) | 可选圆角 `--prose-img-radius` |
| `figure` | 2em (32px) | — |
| `figcaption` | 0.857em (12px) 上 | 字号 0.875em |
| `video` | 2em (32px) | — |

---

### 3. CSS 类设计

#### 3.1 基础类 `.prose`

`.prose` 作为容器类，对其内部所有原生 HTML 元素施加排版样式：

```tsx
<article className="prose">
    {/* Markdown 渲染输出 */}
</article>
```

**实现原理**（Linaria CSS）：

```typescript
import { css } from '@linaria/core';

export const prose = css`
    color: var(--prose-body);
    max-width: 65ch;
    font-size: 1rem;
    line-height: 1.75;

    /* ── 标题 ── */
    h1 {
        color: var(--prose-headings);
        font-weight: 800;
        font-size: 2.25em;
        margin-top: 0;
        margin-bottom: 0.889em;
        line-height: 1.111;
    }

    h2 {
        color: var(--prose-headings);
        font-weight: 700;
        font-size: 1.5em;
        margin-top: 2em;
        margin-bottom: 1em;
        line-height: 1.333;
    }

    h3 {
        color: var(--prose-headings);
        font-weight: 600;
        font-size: 1.25em;
        margin-top: 1.6em;
        margin-bottom: 0.6em;
        line-height: 1.6;
    }

    h4 {
        color: var(--prose-headings);
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        line-height: 1.5;
    }

    /* ── 段落 ── */
    p {
        margin-top: 1.25em;
        margin-bottom: 1.25em;
    }

    /* ── 链接 ── */
    a {
        color: var(--prose-links);
        text-decoration: underline;
        font-weight: 500;
        transition: color var(--duration-fast) var(--easing-default);

        &:hover {
            color: var(--prose-links-hover);
        }
    }

    /* ── 粗体 ── */
    strong {
        color: var(--prose-bold);
        font-weight: 600;
    }

    /* ── 列表 ── */
    ol {
        list-style-type: decimal;
        margin-top: 1.25em;
        margin-bottom: 1.25em;
        padding-inline-start: 1.625em;
    }

    ul {
        list-style-type: disc;
        margin-top: 1.25em;
        margin-bottom: 1.25em;
        padding-inline-start: 1.625em;
    }

    ol > li::marker {
        font-weight: 400;
        color: var(--prose-counters);
    }

    ul > li::marker {
        color: var(--prose-bullets);
    }

    li {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    /* ── 引用 ── */
    blockquote {
        font-weight: 500;
        font-style: italic;
        color: var(--prose-quotes);
        border-inline-start-width: 0.25rem;
        border-inline-start-color: var(--prose-quote-borders);
        margin-top: 1.6em;
        margin-bottom: 1.6em;
        padding-inline-start: 1em;
    }

    /* ── 分隔线 ── */
    hr {
        border-color: var(--prose-hr);
        border-top-width: 1px;
        margin-top: 3em;
        margin-bottom: 3em;
    }

    /* ── 行内代码 ── */
    code {
        color: var(--prose-code);
        background-color: var(--prose-code-bg);
        font-weight: 600;
        font-size: 0.875em;
        border-radius: 0.25rem;
        padding: 0.2em 0.4em;
    }

    /* ── 代码块 ── */
    pre {
        color: var(--prose-pre-code);
        background-color: var(--prose-pre-bg);
        overflow-x: auto;
        font-weight: 400;
        font-size: 0.875em;
        line-height: 1.714;
        margin-top: 1.714em;
        margin-bottom: 1.714em;
        border-radius: 0.375rem;
        padding: 0.857em 1.143em;
    }

    pre code {
        background-color: transparent;
        border-width: 0;
        border-radius: 0;
        padding: 0;
        font-weight: inherit;
        color: inherit;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
    }

    /* ── 键盘 ── */
    kbd {
        color: var(--prose-kbd);
        background-color: var(--prose-kbd-bg);
        border: 1px solid var(--prose-kbd-border);
        box-shadow: 0 2px 0 var(--prose-kbd-shadow);
        font-weight: 500;
        font-family: inherit;
        font-size: 0.875em;
        border-radius: 0.25rem;
        padding: 0.125em 0.375em;
    }

    /* ── 表格 ── */
    table {
        width: 100%;
        table-layout: auto;
        font-size: 0.875em;
        line-height: 1.714;
        margin-top: 2em;
        margin-bottom: 2em;
    }

    thead {
        border-bottom-width: 1px;
        border-bottom-color: var(--prose-th-borders);
    }

    thead th {
        color: var(--prose-headings);
        background-color: var(--prose-th-bg);
        font-weight: 600;
        vertical-align: bottom;
        padding-inline-end: 0.571em;
        padding-bottom: 0.571em;
        padding-inline-start: 0.571em;
    }

    tbody tr {
        border-bottom-width: 1px;
        border-bottom-color: var(--prose-td-borders);
    }

    tbody tr:last-child {
        border-bottom-width: 0;
    }

    tbody td {
        vertical-align: baseline;
        padding: 0.571em;
    }

    /* ── 媒体 ── */
    img {
        margin-top: 2em;
        margin-bottom: 2em;
        border: 1px solid var(--prose-img-border);
        border-radius: var(--prose-img-radius);
    }

    picture {
        display: block;
        margin-top: 2em;
        margin-bottom: 2em;
    }

    video {
        margin-top: 2em;
        margin-bottom: 2em;
    }

    figure {
        margin-top: 2em;
        margin-bottom: 2em;
    }

    figure > * {
        margin-top: 0;
        margin-bottom: 0;
    }

    figcaption {
        color: var(--prose-figcaption);
        font-size: 0.875em;
        line-height: 1.428;
        margin-top: 0.857em;
    }

    /* ── 定义列表 ── */
    dl {
        margin-top: 1.25em;
        margin-bottom: 1.25em;
    }

    dt {
        color: var(--prose-headings);
        font-weight: 600;
        margin-top: 1.25em;
    }

    dd {
        margin-top: 0.5em;
        padding-inline-start: 1.625em;
    }

    /* ── 通用规则 ── */
    > :first-child {
        margin-top: 0;
    }

    > :last-child {
        margin-bottom: 0;
    }

    h2 + *,
    h3 + *,
    h4 + * {
        margin-top: 0;
    }

    hr + * {
        margin-top: 0;
    }
`;
```

#### 3.2 尺寸变体类

```css
.prose-sm   { font-size: 0.875rem; line-height: 1.714; }
.prose-base { font-size: 1rem;     line-height: 1.75;  }  /* 默认 */
.prose-lg   { font-size: 1.125rem; line-height: 1.778; }
.prose-xl   { font-size: 1.25rem;  line-height: 1.8;   }
```

尺寸变体使用与 `prose` 同级的 multi-class 模式：

```tsx
<article className="prose prose-lg">
    {/* 大号排版 */}
</article>
```

各尺寸变体内部元素的详细尺度（以 em 为单位，自动跟随基准字号缩放）：

| 元素属性 | `prose-sm` (14px) | `prose-base` (16px) | `prose-lg` (18px) | `prose-xl` (20px) |
|---------|------------------|--------------------|--------------------|-------------------|
| `h1` fontSize | 2.143em (30px) | 2.25em (36px) | 2.667em (48px) | 2.8em (56px) |
| `h2` fontSize | 1.429em (20px) | 1.5em (24px) | 1.667em (30px) | 1.8em (36px) |
| `h3` fontSize | 1.286em (18px) | 1.25em (20px) | 1.333em (24px) | 1.5em (30px) |
| `p` marginY | 1.143em (16px) | 1.25em (20px) | 1.333em (24px) | 1.2em (24px) |
| `pre` fontSize | 0.857em (12px) | 0.875em (14px) | 0.889em (16px) | 0.9em (18px) |
| `pre` padding | 0.571em 0.857em | 0.857em 1.143em | 0.889em 1.333em | 1em 1.2em |
| `pre` borderRadius | 0.25rem (4px) | 0.375rem (6px) | 0.375rem (6px) | 0.5rem (8px) |
| `table` fontSize | 0.857em (12px) | 0.875em (14px) | 0.889em (16px) | 0.9em (18px) |
| `hr` marginY | 2.857em (40px) | 3em (48px) | 3.111em (56px) | 2.8em (56px) |
| `img` marginY | 1.714em (24px) | 2em (32px) | 1.778em (32px) | 2em (40px) |
| `blockquote` marginY | 1.286em (18px) | 1.6em (26px) | 1.778em (32px) | 2em (40px) |

#### 3.3 Dark 模式

通过 `prose-invert` 类手动触发暗色排版（当不使用全局 `data-theme` 时）：

```tsx
{/* 方式一：跟随全局主题 — 自动生效，无需额外类 */}
<article className="prose">
    {content}
</article>

{/* 方式二：手动反转 — 在局部亮色区域内强制暗色排版 */}
<div className="dark-section">
    <article className="prose prose-invert">
        {content}
    </article>
</div>
```

`prose-invert` 实现原理：将所有 `--prose-*` 颜色变量重新指向 Dark 值：

```css
.prose-invert {
    --prose-body:           oklch(1 0 0 / 0.82);
    --prose-headings:       oklch(1 0 0 / 0.92);
    --prose-lead:           oklch(1 0 0 / 0.60);
    --prose-links:          oklch(0.720 0.165 254);
    --prose-links-hover:    oklch(0.800 0.120 255);
    --prose-bold:           oklch(1 0 0 / 0.92);
    --prose-counters:       oklch(1 0 0 / 0.45);
    --prose-bullets:        oklch(1 0 0 / 0.30);
    --prose-hr:             oklch(0.373 0.016 261);
    --prose-quotes:         oklch(1 0 0 / 0.85);
    --prose-quote-borders:  oklch(0.373 0.016 261);
    --prose-captions:       oklch(1 0 0 / 0.50);
    --prose-code:           oklch(1 0 0 / 0.90);
    --prose-code-bg:        oklch(1 0 0 / 0.08);
    --prose-pre-code:       oklch(1 0 0 / 0.75);
    --prose-pre-bg:         oklch(0 0 0 / 50%);
    --prose-kbd:            oklch(1 0 0 / 0.90);
    --prose-kbd-bg:         oklch(1 0 0 / 0.08);
    --prose-kbd-border:     oklch(1 0 0 / 0.15);
    --prose-kbd-shadow:     oklch(0 0 0 / 25%);
    --prose-th-borders:     oklch(1 0 0 / 0.15);
    --prose-td-borders:     oklch(1 0 0 / 0.08);
    --prose-th-bg:          oklch(1 0 0 / 0.04);
    --prose-figcaption:     oklch(1 0 0 / 0.50);
}
```

#### 3.4 沙箱机制 `.not-prose`

嵌入在 `.prose` 容器中的非 Markdown 内容（如组件 demo、交互区域）可使用 `.not-prose` 脱离排版样式：

```tsx
<article className="prose">
    <h1>文档标题</h1>
    <p>正文内容...</p>

    <div className="not-prose">
        {/* 此区域不受 prose 样式影响 */}
        <ComponentDemo />
    </div>

    <p>继续正文...</p>
</article>
```

实现方式：在所有 `.prose` 内的元素选择器上添加 `:not()` 排除：

```css
.prose :where(h1):not(:where(.not-prose, .not-prose *)) {
    /* h1 样式 */
}
```

> 使用 `:where()` 包裹以保持零特异性，便于消费方覆写。

#### 3.5 宽度控制

`.prose` 默认限制 `max-width: 65ch` 以保证最佳阅读体验。如需内容填满容器，添加 `max-w-none` 类或直接覆写：

```tsx
{/* 填满容器宽度 */}
<article className="prose" style={{ maxWidth: 'none' }}>
    {content}
</article>
```

---

### 4. Token 映射关系

#### 4.1 Semantic → Prose Token 映射

| Semantic Token | → Prose Token | 用途 |
|---|---|---|
| `--color-text-primary` | `--prose-body` | 正文颜色 |
| `--color-text-secondary` | `--prose-lead`, `--prose-captions`, `--prose-figcaption` | 辅助文字 |
| `--color-text-link` | `--prose-links` | 链接颜色 |
| `--color-text-link-hover` | `--prose-links-hover` | 链接悬停 |
| `--color-border-default` | `--prose-hr`, `--prose-td-borders`, `--prose-quote-borders` | 分隔线/边框 |
| `--gray-900` | `--prose-headings`, `--prose-bold`, `--prose-quotes`, `--prose-code`, `--prose-kbd` | 强调文字 |
| `--gray-500` | `--prose-counters` | 列表序号 |
| `--gray-300` | `--prose-bullets`, `--prose-th-borders`, `--prose-kbd-border` | 弱化视觉元素 |
| `--gray-200` | `--prose-pre-code` | 代码块前景 |
| `--gray-100` | `--prose-code-bg`, `--prose-kbd-bg` | 行内代码/键盘底色 |
| `--gray-50` | `--prose-th-bg` | 表头底色 |
| `--gray-800` | `--prose-pre-bg` | 代码块底色 |

#### 4.2 对比度验证清单

| 组合 | Light 对比度 | Dark 对比度 | WCAG AA |
|------|-------------|-------------|---------|
| `--prose-body` on `--color-bg-surface` | ≥ 12:1 | ≥ 10:1 | ✅ |
| `--prose-headings` on `--color-bg-surface` | ≥ 14:1 | ≥ 12:1 | ✅ |
| `--prose-links` on `--color-bg-surface` | ≥ 4.5:1 | ≥ 4.5:1 | ✅ |
| `--prose-lead` on `--color-bg-surface` | ≥ 5:1 | ≥ 4.5:1 | ✅ |
| `--prose-pre-code` on `--prose-pre-bg` | ≥ 8:1 | ≥ 5:1 | ✅ |
| `--prose-code` on `--prose-code-bg` | ≥ 12:1 | ≥ 8:1 | ✅ |
| `--prose-kbd` on `--prose-kbd-bg` | ≥ 12:1 | ≥ 8:1 | ✅ |

---

### 5. 自定义颜色主题

消费方可创建自定义排版颜色主题，通过覆写 `--prose-*` 变量实现。

#### 5.1 品牌主题示例

```css
/* 为 Brand B 创建专属排版主题 */
[data-brand="brand-b"] {
    --prose-links:         oklch(0.585 0.233 277);
    --prose-links-hover:   oklch(0.520 0.242 281);
    --prose-code:          oklch(0.585 0.233 277);
    /* 其余 Token 自动继承默认值 */
}
```

#### 5.2 局部覆写

```css
/* 营销页面使用暖色调排版 */
.marketing-prose {
    --prose-headings:      oklch(0.350 0.070 30);
    --prose-links:         oklch(0.550 0.200 25);
    --prose-links-hover:   oklch(0.480 0.230 22);
    --prose-quote-borders: oklch(0.769 0.188 70);
}
```

```tsx
<article className="prose marketing-prose">
    {content}
</article>
```

#### 5.3 完整颜色变量清单

以下为所有可覆写的 `--prose-*` 颜色变量：

| 变量 | 作用对象 | 默认引用 (Light) |
|------|---------|-----------------|
| `--prose-body` | 正文 `color` | `var(--color-text-primary)` |
| `--prose-headings` | `h1`–`h4`, `dt`, `thead th` | `var(--gray-900)` |
| `--prose-lead` | `[class~="lead"]` | `var(--color-text-secondary)` |
| `--prose-links` | `a` | `var(--color-text-link)` |
| `--prose-links-hover` | `a:hover` | `var(--color-text-link-hover)` |
| `--prose-bold` | `strong` | `var(--gray-900)` |
| `--prose-counters` | `ol > li::marker` | `var(--gray-500)` |
| `--prose-bullets` | `ul > li::marker` | `var(--gray-300)` |
| `--prose-hr` | `hr` | `var(--color-border-default)` |
| `--prose-quotes` | `blockquote` | `var(--gray-900)` |
| `--prose-quote-borders` | `blockquote` border | `var(--color-border-default)` |
| `--prose-captions` | `figcaption` | `var(--color-text-secondary)` |
| `--prose-code` | `code` (inline) | `var(--gray-900)` |
| `--prose-code-bg` | `code` (inline) background | `var(--gray-100)` |
| `--prose-pre-code` | `pre code` | `var(--gray-200)` |
| `--prose-pre-bg` | `pre` background | `var(--gray-800)` |
| `--prose-kbd` | `kbd` | `var(--gray-900)` |
| `--prose-kbd-bg` | `kbd` background | `var(--gray-100)` |
| `--prose-kbd-border` | `kbd` border | `var(--gray-300)` |
| `--prose-kbd-shadow` | `kbd` box-shadow | `oklch(0 0 0 / 10%)` |
| `--prose-th-borders` | `thead` 底部边框 | `var(--gray-300)` |
| `--prose-td-borders` | `tbody tr` 底部边框 | `var(--color-border-default)` |
| `--prose-th-bg` | `thead th` 底色 | `var(--gray-50)` |
| `--prose-img-border` | `img` border | `transparent` |
| `--prose-img-radius` | `img` border-radius | `var(--radius-2)` |
| `--prose-figcaption` | `figcaption` | `var(--color-text-secondary)` |

---

### 6. 组件实现

#### 6.1 包结构

```
components/rc-prose/
├── token.toml                   ← Prose Token 定义
├── package.json
├── tsconfig.json
├── eslint.config.js
├── src/
│   ├── prose.tsx                ← 主组件
│   ├── types.ts                 ← Props 接口
│   ├── styles/
│   │   ├── base.ts              ← 基础排版样式
│   │   ├── sizes.ts             ← 尺寸变体样式
│   │   └── colors.ts            ← 颜色 Token 注入
│   ├── token.ts                 ← 自动生成
│   ├── index.ts
│   └── __tests__/
│       └── prose.test.tsx
├── docs/
│   ├── basic.demo.tsx
│   ├── sizes.demo.tsx
│   ├── dark.demo.tsx
│   └── custom-theme.demo.tsx
└── css/
    └── index.css
```

#### 6.2 Props 接口

```typescript
import type { HTMLAttributes, Ref } from 'react';

type ProseSize = 'sm' | 'base' | 'lg' | 'xl';

interface ProseProps extends HTMLAttributes<HTMLDivElement> {
    /** 排版尺寸变体，默认 'base' */
    size?: ProseSize;

    /** 是否使用暗色排版（独立于全局主题） */
    invert?: boolean;

    /**
     * HTML 标签名
     * @default 'div'
     */
    as?: 'div' | 'article' | 'section' | 'main';

    ref?: Ref<HTMLDivElement>;
}

export type { ProseProps, ProseSize };
```

#### 6.3 组件实现

```typescript
import { css, cx } from '@linaria/core';
import type { ProseProps } from './types.js';

const baseStyle = css`/* ... 完整排版样式 ... */`;

const sizeStyles = {
    sm:   css`font-size: 0.875rem; line-height: 1.714;`,
    base: css`font-size: 1rem;     line-height: 1.75;`,
    lg:   css`font-size: 1.125rem; line-height: 1.778;`,
    xl:   css`font-size: 1.25rem;  line-height: 1.8;`,
};

const invertStyle = css`
    --prose-body:           oklch(1 0 0 / 0.82);
    --prose-headings:       oklch(1 0 0 / 0.92);
    /* ... 全部暗色覆写 ... */
`;

function Prose({ size = 'base', invert = false, as: Tag = 'div', className, children, ref, ...rest }: ProseProps) {
    return (
        <Tag
            ref={ref}
            className={cx(
                baseStyle,
                sizeStyles[size],
                invert && invertStyle,
                className,
            )}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default Prose;
```

#### 6.4 导出

```typescript
// index.ts
export { default } from './prose.js';
export type { ProseProps, ProseSize } from './types.js';
```

---

### 7. token.toml 定义

```toml
[build]
output = "./src/token.ts"
prefix = "prose"

[token]
# ── 颜色 ──
body = "var(--color-text-primary)"
headings = "var(--gray-900)"
lead = "var(--color-text-secondary)"
links = "var(--color-text-link)"
links-hover = "var(--color-text-link-hover)"
bold = "var(--gray-900)"
counters = "var(--gray-500)"
bullets = "var(--gray-300)"
hr = "var(--color-border-default)"
quotes = "var(--gray-900)"
quote-borders = "var(--color-border-default)"
captions = "var(--color-text-secondary)"
code = "var(--gray-900)"
code-bg = "var(--gray-100)"
pre-code = "var(--gray-200)"
pre-bg = "var(--gray-800)"
kbd = "var(--gray-900)"
kbd-bg = "var(--gray-100)"
kbd-border = "var(--gray-300)"
kbd-shadow = "oklch(0 0 0 / 10%)"
th-borders = "var(--gray-300)"
td-borders = "var(--color-border-default)"
th-bg = "var(--gray-50)"
img-border = "transparent"
img-radius = "var(--radius-2)"
figcaption = "var(--color-text-secondary)"
```

---

### 8. 使用示例

#### 8.1 基本用法

```tsx
import Prose from '@crab-dev/rc-prose';

function ArticlePage({ html }: { html: string }) {
    return (
        <Prose as="article" dangerouslySetInnerHTML={{ __html: html }} />
    );
}
```

#### 8.2 配合 MDX

```tsx
import Prose from '@crab-dev/rc-prose';
import Content from './article.mdx';

function DocPage() {
    return (
        <Prose as="article" size="lg">
            <Content />
        </Prose>
    );
}
```

#### 8.3 不同尺寸

```tsx
{/* 侧边帮助面板 — 紧凑 */}
<Prose size="sm">{helpContent}</Prose>

{/* 文章正文 — 默认 */}
<Prose>{articleContent}</Prose>

{/* 演示文稿 — 大号 */}
<Prose size="xl">{presentationContent}</Prose>
```

#### 8.4 嵌套组件沙箱

```tsx
<Prose>
    <h2>组件文档</h2>
    <p>以下是组件的实际效果：</p>

    <div className="not-prose">
        <ButtonDemo />
    </div>

    <p>如上所示，按钮支持三种变体。</p>
</Prose>
```

#### 8.5 自定义主题

```tsx
<Prose
    as="article"
    className="marketing-prose"
    style={{
        '--prose-links': 'oklch(0.550 0.200 25)',
        '--prose-headings': 'oklch(0.350 0.070 30)',
    } as React.CSSProperties}
>
    {marketingContent}
</Prose>
```

#### 8.6 配合 @mdx-js/loader + @mdx-js/react（Lignify / Crustify 场景）

##### 构建管线

在 Crustify 构建体系中，MDX 文件经过以下 Webpack loader 管线处理（自下而上执行）：

```
@wyw-in-js/webpack-loader    ← 4. 提取 Linaria css`` 为静态 CSS
        ↑
  thread-loader               ← 3. 多线程加速
        ↑
  babel-loader                 ← 2. React Compiler + TypeScript 转译
        ↑
  @mdx-js/loader               ← 1. MDX → React 组件
    options:
      format: "mdx"
      providerImportSource: "@mdx-js/react"
      remarkPlugins: [remarkGfm, [remarkFrontmatter, "toml"]]
```

关键配置 `providerImportSource: "@mdx-js/react"` 使 MDX 编译产物在运行时从 `MDXProvider` 上下文中查找自定义组件映射。其中 `wrapper` 是一个特殊的映射键，MDX 会用它包裹整个编译输出的根节点。

##### 核心设计：wrapper + not-prose

利用 `MDXProvider` 的 `wrapper` 组件将 `<Prose>` 自动注入为 MDX 内容的根容器，同时在自定义组件映射中预置 `.not-prose` 隔离层：

```tsx
// lignify/template/layouts/docLayout.tsx
import { useOutlet } from 'react-router';
import { MDXProvider, type MDXComponents } from '@mdx-js/react';
import Prose from '@crab-dev/rc-prose';
import DemoMasonry from '../components/code';
import DocGen from '../components/docgen';

const mdxComponents: MDXComponents = {
    // wrapper — MDX 编译产物的根容器，自动包裹 <Prose>
    wrapper: ({ children }) => (
        <Prose as="article" style={{ maxWidth: 'none' }}>
            {children}
        </Prose>
    ),

    // 自定义组件 — 自带 not-prose 隔离
    Demos: (props) => (
        <div className="not-prose">
            <DemoMasonry {...props} />
        </div>
    ),
    API: (props) => (
        <div className="not-prose">
            <DocGen {...props} />
        </div>
    ),
};

const DocLayout = () => {
    const outlet = useOutlet();
    return (
        <div style={{ padding: '0 4rem 4rem 4rem' }}>
            <MDXProvider components={mdxComponents}>
                {outlet}
            </MDXProvider>
        </div>
    );
};
```

`tabsLayout.tsx` 同理，在 `<main>` 区域内以相同的 `mdxComponents` 配置 `<MDXProvider>`。

##### MDX 文档编写

MDX 作者无需关心样式容器或隔离层，直接使用标准 Markdown 语法和自定义组件：

```mdx
# Button 组件

按钮支持多种变体和尺寸。

<Demos path="button/basic" />

## API 文档

<API path="src/button.tsx" />
```

- 标准 Markdown 元素（`h1`–`h4`、`p`、`a`、`blockquote`、`table`、`pre` 等）由 `wrapper` 注入的 `.prose` CSS 类统一控制排版。
- `<Demos>` / `<API>` 通过 `MDXProvider` 映射时已预置 `.not-prose` 包裹，渲染的组件 Demo 和属性表格不受排版样式干扰。

##### 设计要点

| 要点 | 说明 |
|------|------|
| **`wrapper` 自动注入** | MDX 编译产物会将所有内容包裹在 `wrapper` 中，无需在每个 MDX 文件中手动套 `<Prose>` |
| **`.not-prose` 预置隔离** | 自定义组件在映射层统一添加 `.not-prose`，MDX 作者无需手动处理 |
| **主题自动联动** | `--prose-*` 变量引用 Semantic Token，`data-theme` 切换后 MDX 文档区域自动跟随主题 |
| **Linaria 兼容** | `wrapper` 中的 Prose 样式在 `@wyw-in-js/webpack-loader` 阶段提取为静态 CSS，零运行时开销 |
| **宽度不限制** | Lignify 文档场景通过 `style={{ maxWidth: 'none' }}` 取消 65ch 宽度限制，内容铺满面板 |

##### 数据流

```
.mdx 文件
  │
  ↓ @mdx-js/loader
  │   remarkGfm (表格/删除线)
  │   remarkFrontmatter (TOML 元数据)
  │   providerImportSource: @mdx-js/react
  │
  ↓ 编译为 React 组件
  │
  ↓ MDX 运行时
  │   从 MDXProvider context 查找 components
  │
  ├─ wrapper
  │   └─ <Prose as="article">        ← 注入 .prose 容器
  │       ├─ h1/h2/p/a/table/pre...  ← 由 .prose CSS 选择器匹配
  │       ├─ <div class="not-prose">
  │       │   └─ <DemoMasonry />      ← 隔离于排版样式
  │       └─ <div class="not-prose">
  │           └─ <DocGen />           ← 隔离于排版样式
  │
  ↓ 渲染输出
      --prose-* CSS 变量
        → 引用 Semantic Token → 引用 Global Token
        → data-theme 切换时自动传导到排版区域
```

#### 8.7 配合 react-markdown

[react-markdown](https://github.com/remarkjs/react-markdown) 将 Markdown 字符串在客户端渲染为 React 元素。与 `<Prose>` 配合时只需将其作为子组件包裹即可。

##### 基本用法

```tsx
import Prose from '@crab-dev/rc-prose';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownArticle({ content }: { content: string }) {
    return (
        <Prose as="article">
            <Markdown remarkPlugins={[remarkGfm]}>
                {content}
            </Markdown>
        </Prose>
    );
}
```

`react-markdown` 将 Markdown 解析为原生 HTML 元素（`h1`–`h4`、`p`、`a`、`table`、`pre` 等），这些元素自动被 `.prose` CSS 选择器匹配，无需额外配置。

##### 嵌入自定义组件

通过 `react-markdown` 的 `components` prop 覆写特定元素渲染，同时保持排版样式不受干扰：

```tsx
import Prose from '@crab-dev/rc-prose';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents: Components = {
    // 覆写代码块 — 集成语法高亮
    pre({ children }) {
        return (
            <div className="not-prose">
                <SyntaxHighlighter>{children}</SyntaxHighlighter>
            </div>
        );
    },

    // 覆写链接 — 外部链接新窗口打开
    a({ href, children, ...rest }) {
        const isExternal = href?.startsWith('http');
        return (
            <a
                href={href}
                {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                {...rest}
            >
                {children}
            </a>
        );
    },
};

function RichMarkdown({ content }: { content: string }) {
    return (
        <Prose as="article">
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
            </Markdown>
        </Prose>
    );
}
```

##### 与 §8.6 MDX 方案的差异

| 维度 | react-markdown | @mdx-js/loader + @mdx-js/react |
|------|---------------|-------------------------------|
| **渲染时机** | 运行时解析 Markdown 字符串 | 构建时编译 `.mdx` 为 React 组件 |
| **输入** | `string`（来自 CMS / API / 用户输入） | `.mdx` 文件（本地静态内容） |
| **Prose 注入** | 外层手动包裹 `<Prose>` | `wrapper` 组件自动注入 |
| **自定义组件** | `components` prop 覆写 HTML 元素 | `MDXProvider` 映射 + JSX 自定义标签 |
| **not-prose 隔离** | 在 `components` 覆写中手动添加 | 在 `MDXProvider` 映射中预置 |
| **remark 插件** | 运行时传入 `remarkPlugins` | 构建时在 Webpack loader options 中配置 |
| **适用场景** | 动态内容（CMS、用户输入、API 返回） | 静态文档（组件库文档、技术博客） |

> **选型建议**：本地 `.mdx` 文件优先使用 §8.6 的 MDX 构建方案（零运行时开销）；来自外部数据源的 Markdown 字符串使用 `react-markdown` + `<Prose>` 包裹。

---

### 9. 响应式策略

#### 9.1 尺寸断点切换

在不同视口下使用不同的排版尺寸：

```tsx
import { useMediaQuery } from '@crab-dev/rc-hooks';

function ResponsiveArticle({ children }: { children: React.ReactNode }) {
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const isMediumScreen = useMediaQuery('(min-width: 768px)');

    const size = isLargeScreen ? 'lg' : isMediumScreen ? 'base' : 'sm';

    return <Prose size={size}>{children}</Prose>;
}
```

#### 9.2 纯 CSS 方案

也可通过 CSS 媒体查询直接控制基准字号：

```css
.responsive-prose {
    font-size: 0.875rem;     /* 移动端 14px */
}

@media (min-width: 768px) {
    .responsive-prose {
        font-size: 1rem;     /* 平板 16px */
    }
}

@media (min-width: 1024px) {
    .responsive-prose {
        font-size: 1.125rem; /* 桌面 18px */
    }
}
```

由于所有内部元素使用 `em` 单位，改变基准字号即可实现全局等比缩放。

---

### 10. 与 Design Token 系统的集成

#### 10.1 架构合规性

本 RFC 完全遵循 RFC-DESIGN-TOKEN-20260329 的三层架构：

| 层级 | Prose 中的体现 |
|------|--------------|
| **Layer 1 — Global** | 引用 `--gray-*`、`--radius-*` 等全局刻度 |
| **Layer 2 — Semantic** | 引用 `--color-text-*`、`--color-border-*` 等语义变量 |
| **Layer 3 — Component** | 定义 `--prose-*` 前缀的组件级 Token |

#### 10.2 主题切换数据流

```
setTheme('dark')
  → <html data-theme="dark">
    → [data-theme="dark"] {
        --color-text-primary: oklch(1 0 0 / 0.88);
        --prose-body: oklch(1 0 0 / 0.82);
        ...
      }
      → .prose 内所有元素颜色自动切换
      → 尺寸/间距不受影响
```

#### 10.3 品牌切换数据流

```
setBrand('brand-b')
  → <html data-brand="brand-b">
    → [data-brand="brand-b"] {
        --color-text-link: oklch(0.585 0.233 277);
        --prose-links: oklch(0.585 0.233 277);
      }
      → .prose 内链接颜色自动切换
      → 其余排版样式不受影响
```

### 11. 无障碍要求

1. **对比度** — 所有颜色组合满足 WCAG 2.1 AA（正文 ≥ 4.5:1，大号文本 ≥ 3:1）。见 §4.2 对比度验证清单。
2. **语义化 HTML** — `.prose` 不改变 HTML 语义，标题层级由内容决定。
3. **焦点可见** — 链接 `:focus-visible` 使用全局焦点环 Token（`--color-focus-ring` / `--focus-ring-width`）。
4. **减弱动效** — 链接 hover 过渡使用 `--duration-fast`，在 `prefers-reduced-motion: reduce` 下自动降为 0ms。
5. **阅读宽度** — `max-width: 65ch` 限制行宽，符合可读性最佳实践（每行 45–75 字符）。

