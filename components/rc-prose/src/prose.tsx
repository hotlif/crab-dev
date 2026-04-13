import { css, cx } from '@linaria/core';
import type { ProseProps, ProseSize } from './types.js';
import token from './token.js';

// ── 暗色模式覆写 ──────────────────────────────────────────────────────────────

const invertStyle = css`
    --prose-body:             oklch(1 0 0 / 0.82);
    --prose-headings:         oklch(1 0 0 / 0.92);
    --prose-lead-color:       oklch(1 0 0 / 0.60);
    --prose-links:            oklch(0.720 0.165 254);
    --prose-links-hover:      oklch(0.800 0.120 255);
    --prose-bold:             oklch(1 0 0 / 0.92);
    --prose-counters:         oklch(1 0 0 / 0.45);
    --prose-bullets:          oklch(1 0 0 / 0.30);
    --prose-hr-color:         oklch(0.373 0.016 261);
    --prose-quotes:           oklch(1 0 0 / 0.85);
    --prose-quote-borders:    oklch(0.373 0.016 261);
    --prose-captions:         oklch(1 0 0 / 0.50);
    --prose-code-color:       oklch(1 0 0 / 0.90);
    --prose-code-bg:          oklch(1 0 0 / 0.08);
    --prose-pre-color:        oklch(1 0 0 / 0.75);
    --prose-pre-bg:           oklch(0 0 0 / 50%);
    --prose-kbd-color:        oklch(1 0 0 / 0.90);
    --prose-kbd-shadows:      oklch(0 0 0 / 25%);
    --prose-th-borders:       oklch(1 0 0 / 0.15);
    --prose-thead-bg:         oklch(1 0 0 / 0.05);
    --prose-td-borders:       oklch(1 0 0 / 0.08);
`;

// ── 基础结构样式（颜色、字重、装饰）─────────────────────────────────────────

const baseStyle = css`
    color: ${token['body']};
    max-width: ${token['max-width']};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-kerning: normal;
    overflow-wrap: break-word;

    /* ── 段落 ── */
    & [class~="lead"] {
        color: ${token['lead']['color']};
    }

    /* ── 链接 ── */
    & a {
        color: ${token['links']};
        text-decoration: none;
        font-weight: ${token['a']['font-weight']};
        transition: color 150ms ease;

        &:hover {
            color: ${token['links-hover']};
            text-decoration: underline;
        }
    }

    /* ── 粗体 ── */
    & strong {
        color: ${token['bold']};
        font-weight: ${token['strong']['font-weight']};
    }

    & a strong,
    & blockquote strong,
    & thead th strong {
        color: inherit;
    }

    /* ── 列表 ── */
    & ol {
        list-style-type: decimal;
    }

    & ol[type="A"] {
        list-style-type: upper-alpha;
    }

    & ol[type="a"] {
        list-style-type: lower-alpha;
    }

    & ol[type="A" s] {
        list-style-type: upper-alpha;
    }

    & ol[type="a" s] {
        list-style-type: lower-alpha;
    }

    & ol[type="I"] {
        list-style-type: upper-roman;
    }

    & ol[type="i"] {
        list-style-type: lower-roman;
    }

    & ol[type="I" s] {
        list-style-type: upper-roman;
    }

    & ol[type="i" s] {
        list-style-type: lower-roman;
    }

    & ol[type="1"] {
        list-style-type: decimal;
    }

    & ul {
        list-style-type: disc;
    }

    & ol > li::marker {
        font-weight: ${token['marker']['font-weight']};
        color: ${token['counters']};
    }

    & ul > li::marker {
        color: ${token['bullets']};
    }

    /* ── 标题 ── */
    & h1 {
        color: ${token['headings']};
        font-weight: ${token['h1']['font-weight']};
    }

    & h1 strong {
        font-weight: 900;
        color: inherit;
    }

    & h2 {
        color: ${token['headings']};
        font-weight: ${token['h2']['font-weight']};
    }

    & h2 strong {
        font-weight: 800;
        color: inherit;
    }

    & h3 {
        color: ${token['headings']};
        font-weight: ${token['h3']['font-weight']};
    }

    & h3 strong {
        font-weight: 700;
        color: inherit;
    }

    & h4 {
        color: ${token['headings']};
        font-weight: ${token['h4']['font-weight']};
    }

    & h4 strong {
        font-weight: 700;
        color: inherit;
    }

    /* ── dt ── */
    & dt {
        color: ${token['headings']};
        font-weight: ${token['dt']['font-weight']};
    }

    /* ── 分隔线 ── */
    & hr {
        border-color: ${token['hr']['color']};
        border-top-width: 1px;
    }

    /* ── 引用 ── */
    & blockquote {
        font-weight: ${token['blockquote']['font-weight']};
        color: ${token['quotes']};
        border-inline-start: 0.25rem solid ${token['quote-borders']};
        padding-inline-start: 1em;
    }

    /* ── 行内代码 ── */
    & code {
        color: ${token['code']['color']};
        font-weight: ${token['code']['font-weight']};
        background-color: ${token['code']['bg']};
        border-radius: 0.3rem;
    }

    & a code,
    & h1 code,
    & h2 code,
    & h3 code,
    & h4 code,
    & blockquote code,
    & thead th code {
        color: inherit;
    }

    /* ── 代码块 ── */
    & pre {
        color: ${token['pre']['color']};
        background-color: ${token['pre']['bg']};
        overflow-x: auto;
        font-weight: ${token['pre']['font-weight']};
    }

    & pre code {
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
    & kbd {
        font-weight: ${token['kbd']['font-weight']};
        font-family: inherit;
        color: ${token['kbd']['color']};
        box-shadow: 0 0 0 1px ${token['kbd']['shadows']},
                    0 3px 0 ${token['kbd']['shadows']};
    }

    /* ── 表格 ── */
    & table {
        width: 100%;
        table-layout: auto;
        border-collapse: separate;
        border-spacing: 0;
        border: 1px solid ${token['td-borders']};
        border-radius: 0.75rem;
        overflow: hidden;
    }

    & thead {
        background-color: ${token['thead']['bg']};
    }

    & thead th {
        color: ${token['headings']};
        font-weight: ${token['th']['font-weight']};
        vertical-align: bottom;
        border-bottom: 1px solid ${token['th-borders']};
    }

    & tbody tr {
        border-bottom: 1px solid ${token['td-borders']};
    }

    & tbody tr:last-child {
        border-bottom: none;
    }

    & tbody td {
        vertical-align: baseline;
    }

    & tfoot {
        border-top: 1px solid ${token['th-borders']};
    }

    & tfoot td {
        vertical-align: top;
    }

    & th,
    & td {
        text-align: start;
    }

    /* ── 媒体 ── */
    & picture {
        display: block;
    }

    & img,
    & video {
        max-width: 100%;
    }

    & figure > * {
        margin-top: 0;
        margin-bottom: 0;
    }

    & figcaption {
        color: ${token['captions']};
    }
`;

// ── 尺寸变体 ────────────────────────────────────────────────────────────────

const sizeStyles: Record<ProseSize, string> = {
    sm: css`
        font-size: 0.875rem;
        line-height: 1.5714;

        & p {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & [class~="lead"] {
            font-size: 1.2857em;
            line-height: 1.45;
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & blockquote {
            margin-top: 0.8571em;
            margin-bottom: 0.8571em;
            padding-inline-start: 0.8571em;
        }

        & h1 {
            font-size: 1.8571em;
            margin-top: 0;
            margin-bottom: 0.4286em;
            line-height: 1.2;
        }

        & h2 {
            font-size: 1.2857em;
            margin-top: 1.1429em;
            margin-bottom: 0.4286em;
            line-height: 1.35;
        }

        & h3 {
            font-size: 1.1429em;
            margin-top: 0.8571em;
            margin-bottom: 0.2857em;
            line-height: 1.45;
        }

        & h4 {
            margin-top: 0.7143em;
            margin-bottom: 0.2143em;
            line-height: 1.45;
        }

        & img {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & picture {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & picture > img {
            margin-top: 0;
            margin-bottom: 0;
        }

        & video {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & kbd {
            font-size: 0.8571em;
            border-radius: 0.3125rem;
            padding-top: 0.1429em;
            padding-inline-end: 0.3571em;
            padding-bottom: 0.1429em;
            padding-inline-start: 0.3571em;
        }

        & code {
            font-size: 0.8571em;
            padding: 0.0714em 0.2143em;
        }

        & h2 code {
            font-size: 0.9em;
        }

        & h3 code {
            font-size: 0.8889em;
        }

        & pre {
            font-size: 0.8571em;
            line-height: 1.6;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
            border-radius: 0.25rem;
            padding-top: 0.5714em;
            padding-inline-end: 0.8571em;
            padding-bottom: 0.5714em;
            padding-inline-start: 0.8571em;
        }

        & ol {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & ul {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & li {
            margin-top: 0.1429em;
            margin-bottom: 0.1429em;
        }

        & ol > li {
            padding-inline-start: 0.4286em;
        }

        & ul > li {
            padding-inline-start: 0.4286em;
        }

        & > ul > li p {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & > ul > li > p:first-child {
            margin-top: 0.7143em;
        }

        & > ul > li > p:last-child {
            margin-bottom: 0.7143em;
        }

        & > ol > li > p:first-child {
            margin-top: 0.7143em;
        }

        & > ol > li > p:last-child {
            margin-bottom: 0.7143em;
        }

        & ul ul,
        & ul ol,
        & ol ul,
        & ol ol {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & dl {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & dt {
            margin-top: 0.7143em;
        }

        & dd {
            margin-top: 0.2857em;
            padding-inline-start: 1.4286em;
        }

        & hr {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & hr + * {
            margin-top: 0;
        }

        & h2 + * {
            margin-top: 0;
        }

        & h3 + * {
            margin-top: 0;
        }

        & h4 + * {
            margin-top: 0;
        }

        & table {
            font-size: 0.8571em;
            line-height: 1.5;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & thead th {
            padding: 0.6667em 0.8em;
        }

        & tbody td,
        & tfoot td {
            padding: 0.6667em 0.8em;
        }

        & figure {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & figcaption {
            font-size: 0.8571em;
            line-height: 1.3333;
            margin-top: 0.6667em;
        }

        & > :first-child {
            margin-top: 0;
        }

        & > :last-child {
            margin-bottom: 0;
        }
    `,

    base: css`
        font-size: 1rem;
        line-height: 1.65;

        & p {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & [class~="lead"] {
            font-size: 1.2em;
            line-height: 1.5;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & blockquote {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & h1 {
            font-size: 1.625em;
            margin-top: 0;
            margin-bottom: 0.5em;
            line-height: 1.2;
        }

        & h2 {
            font-size: 1.25em;
            margin-top: 1.4em;
            margin-bottom: 0.4em;
            line-height: 1.3;
        }

        & h3 {
            font-size: 1.0625em;
            margin-top: 1.2em;
            margin-bottom: 0.35em;
            line-height: 1.4;
        }

        & h4 {
            margin-top: 1em;
            margin-bottom: 0.3em;
            line-height: 1.5;
        }

        & img {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & picture {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & picture > img {
            margin-top: 0;
            margin-bottom: 0;
        }

        & video {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & kbd {
            font-size: 0.875em;
            border-radius: 0.3125rem;
            padding-top: 0.1875em;
            padding-inline-end: 0.375em;
            padding-bottom: 0.1875em;
            padding-inline-start: 0.375em;
        }

        & code {
            font-size: 0.875em;
            padding: 0.1em 0.32em;
        }

        & h2 code {
            font-size: 0.875em;
        }

        & h3 code {
            font-size: 0.9em;
        }

        & pre {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
            border-radius: 0.5rem;
            padding-top: 0.875em;
            padding-inline-end: 1.125em;
            padding-bottom: 0.875em;
            padding-inline-start: 1.125em;
        }

        & ol {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & ul {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & li {
            margin-top: 0.35em;
            margin-bottom: 0.35em;
        }

        & ol > li {
            padding-inline-start: 0.375em;
        }

        & ul > li {
            padding-inline-start: 0.375em;
        }

        & > ul > li p {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & > ul > li > p:first-child {
            margin-top: 0.65em;
        }

        & > ul > li > p:last-child {
            margin-bottom: 0.65em;
        }

        & > ol > li > p:first-child {
            margin-top: 0.65em;
        }

        & > ol > li > p:last-child {
            margin-bottom: 0.65em;
        }

        & ul ul,
        & ul ol,
        & ol ul,
        & ol ol {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & dl {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
        }

        & dt {
            margin-top: 0.65em;
        }

        & dd {
            margin-top: 0.375em;
            padding-inline-start: 1.4em;
        }

        & hr {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & hr + * {
            margin-top: 0;
        }

        & h2 + * {
            margin-top: 0;
        }

        & h3 + * {
            margin-top: 0;
        }

        & h4 + * {
            margin-top: 0;
        }

        & table {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & thead th {
            padding: 0.5714em 0.75em;
        }

        & tbody td,
        & tfoot td {
            padding: 0.5714em 0.75em;
        }

        & figure {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & figcaption {
            font-size: 0.875em;
            line-height: 1.4286;
            margin-top: 0.55em;
        }

        & > :first-child {
            margin-top: 0;
        }

        & > :last-child {
            margin-bottom: 0;
        }
    `,

    lg: css`
        font-size: 1.125rem;
        line-height: 1.6667;

        & p {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & [class~="lead"] {
            font-size: 1.2222em;
            line-height: 1.45;
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & blockquote {
            margin-top: 1.1111em;
            margin-bottom: 1.1111em;
            padding-inline-start: 1em;
        }

        & h1 {
            font-size: 2.2222em;
            margin-top: 0;
            margin-bottom: 0.5556em;
            line-height: 1.1;
        }

        & h2 {
            font-size: 1.4444em;
            margin-top: 1.3333em;
            margin-bottom: 0.5556em;
            line-height: 1.3;
        }

        & h3 {
            font-size: 1.2222em;
            margin-top: 1.1111em;
            margin-bottom: 0.4444em;
            line-height: 1.45;
        }

        & h4 {
            margin-top: 1em;
            margin-bottom: 0.3333em;
            line-height: 1.45;
        }

        & img {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & picture {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & picture > img {
            margin-top: 0;
            margin-bottom: 0;
        }

        & video {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & kbd {
            font-size: 0.8889em;
            border-radius: 0.3125rem;
            padding-top: 0.2222em;
            padding-inline-end: 0.4444em;
            padding-bottom: 0.2222em;
            padding-inline-start: 0.4444em;
        }

        & code {
            font-size: 0.8889em;
            padding: 0.1111em 0.2778em;
        }

        & h2 code {
            font-size: 0.8667em;
        }

        & h3 code {
            font-size: 0.875em;
        }

        & pre {
            font-size: 0.8889em;
            line-height: 1.65;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
            border-radius: 0.375rem;
            padding-top: 0.8889em;
            padding-inline-end: 1.3333em;
            padding-bottom: 0.8889em;
            padding-inline-start: 1.3333em;
        }

        & ol {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & ul {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & li {
            margin-top: 0.3333em;
            margin-bottom: 0.3333em;
        }

        & ol > li {
            padding-inline-start: 0.4444em;
        }

        & ul > li {
            padding-inline-start: 0.4444em;
        }

        & > ul > li p {
            margin-top: 0.6667em;
            margin-bottom: 0.6667em;
        }

        & > ul > li > p:first-child {
            margin-top: 0.8889em;
        }

        & > ul > li > p:last-child {
            margin-bottom: 0.8889em;
        }

        & > ol > li > p:first-child {
            margin-top: 0.8889em;
        }

        & > ol > li > p:last-child {
            margin-bottom: 0.8889em;
        }

        & ul ul,
        & ul ol,
        & ol ul,
        & ol ol {
            margin-top: 0.5556em;
            margin-bottom: 0.5556em;
        }

        & dl {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & dt {
            margin-top: 0.8889em;
        }

        & dd {
            margin-top: 0.4444em;
            padding-inline-start: 1.5556em;
        }

        & hr {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & hr + * {
            margin-top: 0;
        }

        & h2 + * {
            margin-top: 0;
        }

        & h3 + * {
            margin-top: 0;
        }

        & h4 + * {
            margin-top: 0;
        }

        & table {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & thead th {
            padding: 0.75em 0.875em;
        }

        & tbody td,
        & tfoot td {
            padding: 0.75em 0.875em;
        }

        & figure {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & figcaption {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 0.75em;
        }

        & > :first-child {
            margin-top: 0;
        }

        & > :last-child {
            margin-bottom: 0;
        }
    `,

    xl: css`
        font-size: 1.25rem;
        line-height: 1.65;

        & p {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & [class~="lead"] {
            font-size: 1.15em;
            line-height: 1.45;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & blockquote {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
            padding-inline-start: 1em;
        }

        & h1 {
            font-size: 2.2em;
            margin-top: 0;
            margin-bottom: 0.6em;
            line-height: 1.05;
        }

        & h2 {
            font-size: 1.5em;
            margin-top: 1.3em;
            margin-bottom: 0.55em;
            line-height: 1.2;
        }

        & h3 {
            font-size: 1.25em;
            margin-top: 1.1em;
            margin-bottom: 0.45em;
            line-height: 1.35;
        }

        & h4 {
            margin-top: 1em;
            margin-bottom: 0.35em;
            line-height: 1.5;
        }

        & img {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & picture {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & picture > img {
            margin-top: 0;
            margin-bottom: 0;
        }

        & video {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & kbd {
            font-size: 0.9em;
            border-radius: 0.3125rem;
            padding-top: 0.25em;
            padding-inline-end: 0.4em;
            padding-bottom: 0.25em;
            padding-inline-start: 0.4em;
        }

        & code {
            font-size: 0.9em;
            padding: 0.1em 0.25em;
        }

        & h2 code {
            font-size: 0.8611em;
        }

        & h3 code {
            font-size: 0.9em;
        }

        & pre {
            font-size: 0.9em;
            line-height: 1.65;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
            border-radius: 0.5rem;
            padding-top: 1em;
            padding-inline-end: 1.25em;
            padding-bottom: 1em;
            padding-inline-start: 1.25em;
        }

        & ol {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & ul {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & li {
            margin-top: 0.3em;
            margin-bottom: 0.3em;
        }

        & ol > li {
            padding-inline-start: 0.4em;
        }

        & ul > li {
            padding-inline-start: 0.4em;
        }

        & > ul > li p {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & > ul > li > p:first-child {
            margin-top: 0.8em;
        }

        & > ul > li > p:last-child {
            margin-bottom: 0.8em;
        }

        & > ol > li > p:first-child {
            margin-top: 0.8em;
        }

        & > ol > li > p:last-child {
            margin-bottom: 0.8em;
        }

        & ul ul,
        & ul ol,
        & ol ul,
        & ol ol {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & dl {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & dt {
            margin-top: 0.8em;
        }

        & dd {
            margin-top: 0.45em;
            padding-inline-start: 1.5em;
        }

        & hr {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & hr + * {
            margin-top: 0;
        }

        & h2 + * {
            margin-top: 0;
        }

        & h3 + * {
            margin-top: 0;
        }

        & h4 + * {
            margin-top: 0;
        }

        & table {
            font-size: 0.9em;
            line-height: 1.5;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & thead th {
            padding: 0.8em 0.875em;
        }

        & tbody td,
        & tfoot td {
            padding: 0.8em 0.875em;
        }

        & figure {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & figcaption {
            font-size: 0.9em;
            line-height: 1.5556;
            margin-top: 0.8em;
        }

        & > :first-child {
            margin-top: 0;
        }

        & > :last-child {
            margin-bottom: 0;
        }
    `,
};

// ── 组件 ──────────────────────────────────────────────────────────────────────

function Prose({
    size = 'base',
    invert = false,
    as: Tag = 'div',
    className,
    children,
    ref,
    ...rest
}: ProseProps) {
    return (
        <Tag
            ref={ref as React.Ref<HTMLDivElement>}
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
