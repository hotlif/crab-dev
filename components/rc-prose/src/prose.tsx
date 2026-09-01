import { css, cx } from '@crab-dev/css';
import type { Ref } from 'react';
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
    :where(& [class~="lead"]) {
        color: ${token['lead']['color']};
    }

    /* ── 链接 ── */
    :where(& a) {
        color: ${token['links']};
        text-decoration: none;
        font-weight: ${token['a']['font-weight']};
        transition: color 150ms ease;

        :where(&:hover) {
            color: ${token['links-hover']};
            text-decoration: underline;
        }
    }

    /* ── 粗体 ── */
    :where(& strong) {
        color: ${token['bold']};
        font-weight: ${token['strong']['font-weight']};
    }

    :where(& a strong),
    :where(& blockquote strong),
    :where(& thead th strong) {
        color: inherit;
    }

    /* ── 列表 ── */
    :where(& ol) {
        list-style-type: decimal;
    }

    :where(& ol[type="A"]) {
        list-style-type: upper-alpha;
    }

    :where(& ol[type="a"]) {
        list-style-type: lower-alpha;
    }

    :where(& ol[type="A" s]) {
        list-style-type: upper-alpha;
    }

    :where(& ol[type="a" s]) {
        list-style-type: lower-alpha;
    }

    :where(& ol[type="I"]) {
        list-style-type: upper-roman;
    }

    :where(& ol[type="i"]) {
        list-style-type: lower-roman;
    }

    :where(& ol[type="I" s]) {
        list-style-type: upper-roman;
    }

    :where(& ol[type="i" s]) {
        list-style-type: lower-roman;
    }

    :where(& ol[type="1"]) {
        list-style-type: decimal;
    }

    :where(& ul) {
        list-style-type: disc;
    }

    :where(& ol > li::marker) {
        font-weight: ${token['marker']['font-weight']};
        color: ${token['counters']};
    }

    :where(& ul > li::marker) {
        color: ${token['bullets']};
    }

    /* ── 标题 ── */
    :where(& h1) {
        color: ${token['headings']};
        font-weight: ${token['h1']['font-weight']};
    }

    :where(& h1 strong) {
        font-weight: 900;
        color: inherit;
    }

    :where(& h2) {
        color: ${token['headings']};
        font-weight: ${token['h2']['font-weight']};
    }

    :where(& h2 strong) {
        font-weight: 800;
        color: inherit;
    }

    :where(& h3) {
        color: ${token['headings']};
        font-weight: ${token['h3']['font-weight']};
    }

    :where(& h3 strong) {
        font-weight: 700;
        color: inherit;
    }

    :where(& h4) {
        color: ${token['headings']};
        font-weight: ${token['h4']['font-weight']};
    }

    :where(& h4 strong) {
        font-weight: 700;
        color: inherit;
    }

    /* ── dt ── */
    :where(& dt) {
        color: ${token['headings']};
        font-weight: ${token['dt']['font-weight']};
    }

    /* ── 分隔线 ── */
    :where(& hr) {
        border-color: ${token['hr']['color']};
        border-top-width: 1px;
    }

    /* ── 引用 ── */
    :where(& blockquote) {
        font-weight: ${token['blockquote']['font-weight']};
        color: ${token['quotes']};
        border-inline-start: 0.25rem solid ${token['quote-borders']};
        padding-inline-start: 1em;
    }

    /* ── 行内代码 ── */
    :where(& code) {
        color: ${token['code']['color']};
        font-weight: ${token['code']['font-weight']};
        background-color: ${token['code']['bg']};
        border-radius: 0.3rem;
    }

    :where(& a code),
    :where(& h1 code),
    :where(& h2 code),
    :where(& h3 code),
    :where(& h4 code),
    :where(& blockquote code),
    :where(& thead th code) {
        color: inherit;
    }

    /* ── 代码块 ── */
    :where(& pre) {
        color: ${token['pre']['color']};
        background-color: ${token['pre']['bg']};
        overflow-x: auto;
        font-weight: ${token['pre']['font-weight']};
    }

    :where(& pre code) {
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
    :where(& kbd) {
        font-weight: ${token['kbd']['font-weight']};
        font-family: inherit;
        color: ${token['kbd']['color']};
        box-shadow: 0 0 0 1px ${token['kbd']['shadows']},
                    0 3px 0 ${token['kbd']['shadows']};
    }

    /* ── 表格 ── */
    :where(& table) {
        width: 100%;
        table-layout: auto;
        border-collapse: separate;
        border-spacing: 0;
        border: 1px solid ${token['td-borders']};
        border-radius: 0.75rem;
        overflow: hidden;
    }

    :where(& thead) {
        background-color: ${token['thead']['bg']};
    }

    :where(& thead th) {
        color: ${token['headings']};
        font-weight: ${token['th']['font-weight']};
        vertical-align: bottom;
        border-bottom: 1px solid ${token['th-borders']};
    }

    :where(& tbody tr) {
        border-bottom: 1px solid ${token['td-borders']};
    }

    :where(& tbody tr:last-child) {
        border-bottom: none;
    }

    :where(& tbody td) {
        vertical-align: baseline;
    }

    :where(& tfoot) {
        border-top: 1px solid ${token['th-borders']};
    }

    :where(& tfoot td) {
        vertical-align: top;
    }

    :where(& th),
    :where(& td) {
        text-align: start;
    }

    /* ── 媒体 ── */
    :where(& picture) {
        display: block;
    }

    :where(& img),
    :where(& video) {
        max-width: 100%;
    }

    :where(& figure > *) {
        margin-top: 0;
        margin-bottom: 0;
    }

    :where(& figcaption) {
        color: ${token['captions']};
    }
`;

// ── 尺寸变体 ────────────────────────────────────────────────────────────────

const sizeStyles: Record<ProseSize, string> = {
    sm: css`
        font-size: 0.875rem;
        line-height: 1.5714;

        :where(& p) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        :where(& [class~="lead"]) {
            font-size: 1.2857em;
            line-height: 1.45;
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        :where(& blockquote) {
            margin-top: 0.8571em;
            margin-bottom: 0.8571em;
            padding-inline-start: 0.8571em;
        }

        :where(& h1) {
            font-size: 1.8571em;
            margin-top: 0;
            margin-bottom: 0.4286em;
            line-height: 1.2;
        }

        :where(& h2) {
            font-size: 1.2857em;
            margin-top: 1.1429em;
            margin-bottom: 0.4286em;
            line-height: 1.35;
        }

        :where(& h3) {
            font-size: 1.1429em;
            margin-top: 0.8571em;
            margin-bottom: 0.2857em;
            line-height: 1.45;
        }

        :where(& h4) {
            margin-top: 0.7143em;
            margin-bottom: 0.2143em;
            line-height: 1.45;
        }

        :where(& img) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        :where(& picture) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        :where(& picture > img) {
            margin-top: 0;
            margin-bottom: 0;
        }

        :where(& video) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        :where(& kbd) {
            font-size: 0.8571em;
            border-radius: 0.3125rem;
            padding-top: 0.1429em;
            padding-inline-end: 0.3571em;
            padding-bottom: 0.1429em;
            padding-inline-start: 0.3571em;
        }

        :where(& code) {
            font-size: 0.8571em;
            padding: 0.0714em 0.2143em;
        }

        :where(& h2 code) {
            font-size: 0.9em;
        }

        :where(& h3 code) {
            font-size: 0.8889em;
        }

        :where(& pre) {
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

        :where(& ol) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        :where(& ul) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        :where(& li) {
            margin-top: 0.1429em;
            margin-bottom: 0.1429em;
        }

        :where(& ol > li) {
            padding-inline-start: 0.4286em;
        }

        :where(& ul > li) {
            padding-inline-start: 0.4286em;
        }

        :where(& > ul > li p) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        :where(& > ul > li > p:first-child) {
            margin-top: 0.7143em;
        }

        :where(& > ul > li > p:last-child) {
            margin-bottom: 0.7143em;
        }

        :where(& > ol > li > p:first-child) {
            margin-top: 0.7143em;
        }

        :where(& > ol > li > p:last-child) {
            margin-bottom: 0.7143em;
        }

        :where(& ul ul),
        :where(& ul ol),
        :where(& ol ul),
        :where(& ol ol) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        :where(& dl) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        :where(& dt) {
            margin-top: 0.7143em;
        }

        :where(& dd) {
            margin-top: 0.2857em;
            padding-inline-start: 1.4286em;
        }

        :where(& hr) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        :where(& hr + *) {
            margin-top: 0;
        }

        :where(& h2 + *) {
            margin-top: 0;
        }

        :where(& h3 + *) {
            margin-top: 0;
        }

        :where(& h4 + *) {
            margin-top: 0;
        }

        :where(& table) {
            font-size: 0.8571em;
            line-height: 1.5;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        :where(& thead th) {
            padding: 0.6667em 0.8em;
        }

        :where(& tbody td),
        :where(& tfoot td) {
            padding: 0.6667em 0.8em;
        }

        :where(& figure) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        :where(& figcaption) {
            font-size: 0.8571em;
            line-height: 1.3333;
            margin-top: 0.6667em;
        }

        :where(& > :first-child) {
            margin-top: 0;
        }

        :where(& > :last-child) {
            margin-bottom: 0;
        }
    `,

    base: css`
        font-size: 1rem;
        line-height: 1.65;

        :where(& p) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        :where(& [class~="lead"]) {
            font-size: 1.2em;
            line-height: 1.5;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        :where(& blockquote) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& h1) {
            font-size: 1.625em;
            margin-top: 0;
            margin-bottom: 0.5em;
            line-height: 1.2;
        }

        :where(& h2) {
            font-size: 1.25em;
            margin-top: 1.4em;
            margin-bottom: 0.4em;
            line-height: 1.3;
        }

        :where(& h3) {
            font-size: 1.0625em;
            margin-top: 1.2em;
            margin-bottom: 0.35em;
            line-height: 1.4;
        }

        :where(& h4) {
            margin-top: 1em;
            margin-bottom: 0.3em;
            line-height: 1.5;
        }

        :where(& img) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& picture) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& picture > img) {
            margin-top: 0;
            margin-bottom: 0;
        }

        :where(& video) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& kbd) {
            font-size: 0.875em;
            border-radius: 0.3125rem;
            padding-top: 0.1875em;
            padding-inline-end: 0.375em;
            padding-bottom: 0.1875em;
            padding-inline-start: 0.375em;
        }

        :where(& code) {
            font-size: 0.875em;
            padding: 0.1em 0.32em;
        }

        :where(& h2 code) {
            font-size: 0.875em;
        }

        :where(& h3 code) {
            font-size: 0.9em;
        }

        :where(& pre) {
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

        :where(& ol) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        :where(& ul) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        :where(& li) {
            margin-top: 0.35em;
            margin-bottom: 0.35em;
        }

        :where(& ol > li) {
            padding-inline-start: 0.375em;
        }

        :where(& ul > li) {
            padding-inline-start: 0.375em;
        }

        :where(& > ul > li p) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        :where(& > ul > li > p:first-child) {
            margin-top: 0.65em;
        }

        :where(& > ul > li > p:last-child) {
            margin-bottom: 0.65em;
        }

        :where(& > ol > li > p:first-child) {
            margin-top: 0.65em;
        }

        :where(& > ol > li > p:last-child) {
            margin-bottom: 0.65em;
        }

        :where(& ul ul),
        :where(& ul ol),
        :where(& ol ul),
        :where(& ol ol) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        :where(& dl) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
        }

        :where(& dt) {
            margin-top: 0.65em;
        }

        :where(& dd) {
            margin-top: 0.375em;
            padding-inline-start: 1.4em;
        }

        :where(& hr) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& hr + *) {
            margin-top: 0;
        }

        :where(& h2 + *) {
            margin-top: 0;
        }

        :where(& h3 + *) {
            margin-top: 0;
        }

        :where(& h4 + *) {
            margin-top: 0;
        }

        :where(& table) {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& thead th) {
            padding: 0.5714em 0.75em;
        }

        :where(& tbody td),
        :where(& tfoot td) {
            padding: 0.5714em 0.75em;
        }

        :where(& figure) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        :where(& figcaption) {
            font-size: 0.875em;
            line-height: 1.4286;
            margin-top: 0.55em;
        }

        :where(& > :first-child) {
            margin-top: 0;
        }

        :where(& > :last-child) {
            margin-bottom: 0;
        }
    `,

    lg: css`
        font-size: 1.125rem;
        line-height: 1.6667;

        :where(& p) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        :where(& [class~="lead"]) {
            font-size: 1.2222em;
            line-height: 1.45;
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        :where(& blockquote) {
            margin-top: 1.1111em;
            margin-bottom: 1.1111em;
            padding-inline-start: 1em;
        }

        :where(& h1) {
            font-size: 2.2222em;
            margin-top: 0;
            margin-bottom: 0.5556em;
            line-height: 1.1;
        }

        :where(& h2) {
            font-size: 1.4444em;
            margin-top: 1.3333em;
            margin-bottom: 0.5556em;
            line-height: 1.3;
        }

        :where(& h3) {
            font-size: 1.2222em;
            margin-top: 1.1111em;
            margin-bottom: 0.4444em;
            line-height: 1.45;
        }

        :where(& h4) {
            margin-top: 1em;
            margin-bottom: 0.3333em;
            line-height: 1.45;
        }

        :where(& img) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        :where(& picture) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        :where(& picture > img) {
            margin-top: 0;
            margin-bottom: 0;
        }

        :where(& video) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        :where(& kbd) {
            font-size: 0.8889em;
            border-radius: 0.3125rem;
            padding-top: 0.2222em;
            padding-inline-end: 0.4444em;
            padding-bottom: 0.2222em;
            padding-inline-start: 0.4444em;
        }

        :where(& code) {
            font-size: 0.8889em;
            padding: 0.1111em 0.2778em;
        }

        :where(& h2 code) {
            font-size: 0.8667em;
        }

        :where(& h3 code) {
            font-size: 0.875em;
        }

        :where(& pre) {
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

        :where(& ol) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        :where(& ul) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        :where(& li) {
            margin-top: 0.3333em;
            margin-bottom: 0.3333em;
        }

        :where(& ol > li) {
            padding-inline-start: 0.4444em;
        }

        :where(& ul > li) {
            padding-inline-start: 0.4444em;
        }

        :where(& > ul > li p) {
            margin-top: 0.6667em;
            margin-bottom: 0.6667em;
        }

        :where(& > ul > li > p:first-child) {
            margin-top: 0.8889em;
        }

        :where(& > ul > li > p:last-child) {
            margin-bottom: 0.8889em;
        }

        :where(& > ol > li > p:first-child) {
            margin-top: 0.8889em;
        }

        :where(& > ol > li > p:last-child) {
            margin-bottom: 0.8889em;
        }

        :where(& ul ul),
        :where(& ul ol),
        :where(& ol ul),
        :where(& ol ol) {
            margin-top: 0.5556em;
            margin-bottom: 0.5556em;
        }

        :where(& dl) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        :where(& dt) {
            margin-top: 0.8889em;
        }

        :where(& dd) {
            margin-top: 0.4444em;
            padding-inline-start: 1.5556em;
        }

        :where(& hr) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        :where(& hr + *) {
            margin-top: 0;
        }

        :where(& h2 + *) {
            margin-top: 0;
        }

        :where(& h3 + *) {
            margin-top: 0;
        }

        :where(& h4 + *) {
            margin-top: 0;
        }

        :where(& table) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        :where(& thead th) {
            padding: 0.75em 0.875em;
        }

        :where(& tbody td),
        :where(& tfoot td) {
            padding: 0.75em 0.875em;
        }

        :where(& figure) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        :where(& figcaption) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 0.75em;
        }

        :where(& > :first-child) {
            margin-top: 0;
        }

        :where(& > :last-child) {
            margin-bottom: 0;
        }
    `,

    xl: css`
        font-size: 1.25rem;
        line-height: 1.65;

        :where(& p) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        :where(& [class~="lead"]) {
            font-size: 1.15em;
            line-height: 1.45;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        :where(& blockquote) {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
            padding-inline-start: 1em;
        }

        :where(& h1) {
            font-size: 2.2em;
            margin-top: 0;
            margin-bottom: 0.6em;
            line-height: 1.05;
        }

        :where(& h2) {
            font-size: 1.5em;
            margin-top: 1.3em;
            margin-bottom: 0.55em;
            line-height: 1.2;
        }

        :where(& h3) {
            font-size: 1.25em;
            margin-top: 1.1em;
            margin-bottom: 0.45em;
            line-height: 1.35;
        }

        :where(& h4) {
            margin-top: 1em;
            margin-bottom: 0.35em;
            line-height: 1.5;
        }

        :where(& img) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& picture) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& picture > img) {
            margin-top: 0;
            margin-bottom: 0;
        }

        :where(& video) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& kbd) {
            font-size: 0.9em;
            border-radius: 0.3125rem;
            padding-top: 0.25em;
            padding-inline-end: 0.4em;
            padding-bottom: 0.25em;
            padding-inline-start: 0.4em;
        }

        :where(& code) {
            font-size: 0.9em;
            padding: 0.1em 0.25em;
        }

        :where(& h2 code) {
            font-size: 0.8611em;
        }

        :where(& h3 code) {
            font-size: 0.9em;
        }

        :where(& pre) {
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

        :where(& ol) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        :where(& ul) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        :where(& li) {
            margin-top: 0.3em;
            margin-bottom: 0.3em;
        }

        :where(& ol > li) {
            padding-inline-start: 0.4em;
        }

        :where(& ul > li) {
            padding-inline-start: 0.4em;
        }

        :where(& > ul > li p) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        :where(& > ul > li > p:first-child) {
            margin-top: 0.8em;
        }

        :where(& > ul > li > p:last-child) {
            margin-bottom: 0.8em;
        }

        :where(& > ol > li > p:first-child) {
            margin-top: 0.8em;
        }

        :where(& > ol > li > p:last-child) {
            margin-bottom: 0.8em;
        }

        :where(& ul ul),
        :where(& ul ol),
        :where(& ol ul),
        :where(& ol ol) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        :where(& dl) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        :where(& dt) {
            margin-top: 0.8em;
        }

        :where(& dd) {
            margin-top: 0.45em;
            padding-inline-start: 1.5em;
        }

        :where(& hr) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        :where(& hr + *) {
            margin-top: 0;
        }

        :where(& h2 + *) {
            margin-top: 0;
        }

        :where(& h3 + *) {
            margin-top: 0;
        }

        :where(& h4 + *) {
            margin-top: 0;
        }

        :where(& table) {
            font-size: 0.9em;
            line-height: 1.5;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& thead th) {
            padding: 0.8em 0.875em;
        }

        :where(& tbody td),
        :where(& tfoot td) {
            padding: 0.8em 0.875em;
        }

        :where(& figure) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        :where(& figcaption) {
            font-size: 0.9em;
            line-height: 1.5556;
            margin-top: 0.8em;
        }

        :where(& > :first-child) {
            margin-top: 0;
        }

        :where(& > :last-child) {
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
            ref={ref as Ref<HTMLDivElement>}
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


