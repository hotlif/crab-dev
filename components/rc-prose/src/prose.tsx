import { css, cx } from '@crab-dev/css';
import type { Ref } from 'react';
import type { ProseProps, ProseSize } from './types.js';
import token, { vars } from './token.js';

// ── 暗色模式覆写 ──────────────────────────────────────────────────────────────

const invertStyle = css`
    ${vars["body.color"]}: ${token.inverse.body.color};
    ${vars["heading.color"]}: ${token.inverse.heading.color};
    ${vars["lead.color"]}: ${token.inverse.lead.color};
    ${vars["link.color"]}: ${token.inverse.link.color};
    ${vars["link.color-hover"]}: ${token.inverse.link["color-hover"]};
    ${vars["link.outline-color-focus"]}: ${token.inverse.link["outline-color-focus"]};
    ${vars["strong.color"]}: ${token.inverse.strong.color};
    ${vars["list.counter.color"]}: ${token.inverse.list.counter.color};
    ${vars["list.bullet.color"]}: ${token.inverse.list.bullet.color};
    ${vars["hr.border-color"]}: ${token.inverse.hr["border-color"]};
    ${vars["blockquote.color"]}: ${token.inverse.blockquote.color};
    ${vars["blockquote.border-color"]}: ${token.inverse.blockquote["border-color"]};
    ${vars["caption.color"]}: ${token.inverse.caption.color};
    ${vars["code.color"]}: ${token.inverse.code.color};
    ${vars["code.background-color"]}: ${token.inverse.code["background-color"]};
    ${vars["pre.color"]}: ${token.inverse.pre.color};
    ${vars["pre.background-color"]}: ${token.inverse.pre["background-color"]};
    ${vars["kbd.color"]}: ${token.inverse.kbd.color};
    ${vars["kbd.box-shadow"]}: ${token.inverse.kbd["box-shadow"]};
    ${vars["table.heading.border-color"]}: ${token.inverse.table.heading["border-color"]};
    ${vars["table.heading.background-color"]}: ${token.inverse.table.heading["background-color"]};
    ${vars["table.cell.border-color"]}: ${token.inverse.table.cell["border-color"]};
`;

// Descendant selectors keep one root class of specificity. not-prose skips
// descendant rules; inherited root typography remains normal CSS inheritance.
// ── 基础结构样式（颜色、字重、装饰）─────────────────────────────────────────

const baseStyle = css`
    color: ${token.body.color};
    font-family: ${token.body['font-family']};
    max-width: ${token.root['max-width']};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-kerning: normal;
    overflow-wrap: break-word;

    /* ── 段落 ── */
    & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token['lead']['color']};
    }

    /* ── 链接 ── */
    & :where(a):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.link.color};
        text-decoration: none;
        font-weight: ${token['a']['font-weight']};
        transition: color 150ms ease;

        &:hover {
            color: ${token.link['color-hover']};
            text-decoration: underline;
        }

        &:focus-visible {
            outline: ${token.link['outline-width-focus']} solid ${token.link['outline-color-focus']};
            outline-offset: ${token.link['outline-offset-focus']};
        }

        @media (forced-colors: active) {
            &:focus-visible { outline-color: Highlight; }
        }

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    /* ── 粗体 ── */
    & :where(strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.strong.color};
        font-weight: ${token['strong']['font-weight']};
    }

    & :where(a strong):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(blockquote strong):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(thead th strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: inherit;
    }

    /* ── 列表 ── */
    & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: decimal;
    }

    & :where(ol[type="A"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: upper-alpha;
    }

    & :where(ol[type="a"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: lower-alpha;
    }

    & :where(ol[type="A" s]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: upper-alpha;
    }

    & :where(ol[type="a" s]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: lower-alpha;
    }

    & :where(ol[type="I"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: upper-roman;
    }

    & :where(ol[type="i"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: lower-roman;
    }

    & :where(ol[type="I" s]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: upper-roman;
    }

    & :where(ol[type="i" s]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: lower-roman;
    }

    & :where(ol[type="1"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: decimal;
    }

    & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        list-style-type: disc;
    }

    & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *))::marker {
        font-weight: ${token['marker']['font-weight']};
        color: ${token.list.counter.color};
    }

    & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *))::marker {
        color: ${token.list.bullet.color};
    }

    /* ── 标题 ── */
    & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['h1']['font-weight']};
    }

    & :where(h1 strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font-weight: 900;
        color: inherit;
    }

    & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['h2']['font-weight']};
    }

    & :where(h2 strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font-weight: 800;
        color: inherit;
    }

    & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['h3']['font-weight']};
    }

    & :where(h3 strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font-weight: 700;
        color: inherit;
    }

    & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['h4']['font-weight']};
    }

    & :where(h4 strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font-weight: 700;
        color: inherit;
    }

    /* ── dt ── */
    & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['dt']['font-weight']};
    }

    /* ── 分隔线 ── */
    & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        border-color: ${token.hr["border-color"]};
        border-top-width: 1px;
    }

    /* ── 引用 ── */
    & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font-weight: ${token['blockquote']['font-weight']};
        color: ${token.blockquote.color};
        border-inline-start: 0.25rem solid ${token.blockquote["border-color"]};
        padding-inline-start: 1em;
    }

    /* Programming syntax keeps its reading order inside an RTL article.
       Isolation also prevents surrounding punctuation joining the code run. */
    & :where(pre, code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        direction: ltr;
        unicode-bidi: isolate;
    }

    /* ── 行内代码 ── */
    & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
        border: 0;
        font-family: monospace;
        line-height: inherit;
        color: ${token['code']['color']};
        font-weight: ${token['code']['font-weight']};
        background-color: ${token.code["background-color"]};
        border-radius: ${token.code['border-radius']};
    }

    & :where(a code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(h1 code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(h4 code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(blockquote code):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(thead th code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: inherit;
    }

    /* ── 代码块 ── */
    & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        border: 0;
        text-align: start;
        font-family: monospace;
        color: ${token['pre']['color']};
        background-color: ${token.pre["background-color"]};
        overflow-x: auto;
        font-weight: ${token['pre']['font-weight']};
    }

    & :where(pre code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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
    & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        font: inherit;
        font-weight: ${token['kbd']['font-weight']};
        border: 0;
        background: transparent;
        color: ${token['kbd']['color']};
        box-shadow: ${token.kbd["box-shadow"]};
    }

    /* ── 表格 ── */
    & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        width: 100%;
        table-layout: auto;
        border-collapse: separate;
        border-spacing: 0;
        border: 1px solid ${token.table.cell["border-color"]};
        border-radius: ${token.table['border-radius']};
        overflow: hidden;
    }

    & :where(thead):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        background-color: ${token.table.heading["background-color"]};
    }

    & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.heading.color};
        font-weight: ${token['th']['font-weight']};
        vertical-align: bottom;
        border-bottom: 1px solid ${token.table.heading["border-color"]};
    }

    & :where(tbody tr:not(:last-child) > th):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(tbody tr:not(:last-child) > td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        border-bottom: 1px solid ${token.table.cell["border-color"]};
    }

    & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        vertical-align: baseline;
    }

    & :where(tfoot > tr:first-child > th):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(tfoot > tr:first-child > td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        border-top: 1px solid ${token.table.heading["border-color"]};
    }

    & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        vertical-align: top;
    }

    & :where(th):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        text-align: start;
    }

    /* ── 媒体 ── */
    & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        display: block;
    }

    & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)),
    & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        max-width: 100%;
    }

    & :where(figure > *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        margin-top: 0;
        margin-bottom: 0;
    }

    & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
        color: ${token.caption.color};
    }
`;

// ── 尺寸变体 ────────────────────────────────────────────────────────────────

const sizeStyles: Record<ProseSize, string> = {
    sm: css`
        font-size: 0.875rem;
        line-height: 1.5714;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2857em;
            line-height: 1.45;
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8571em;
            margin-bottom: 0.8571em;
            padding-inline-start: 0.8571em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.8571em;
            margin-top: 0;
            margin-bottom: 0.4286em;
            line-height: 1.2;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2857em;
            margin-top: 1.1429em;
            margin-bottom: 0.4286em;
            line-height: 1.35;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.1429em;
            margin-top: 0.8571em;
            margin-bottom: 0.2857em;
            line-height: 1.45;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.2143em;
            line-height: 1.45;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            border-radius: 0.3125rem;
            padding-top: 0.1429em;
            padding-inline-end: 0.3571em;
            padding-bottom: 0.1429em;
            padding-inline-start: 0.3571em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            padding: 0.0714em 0.2143em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
            padding-inline-start: 1.4286em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.1429em;
            margin-bottom: 0.1429em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4286em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4286em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.7143em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.7143em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4286em;
            margin-bottom: 0.4286em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
            margin-bottom: 0.7143em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.7143em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.2857em;
            padding-inline-start: 1.4286em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            line-height: 1.5;
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.6667em 0.8em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.6667em 0.8em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1429em;
            margin-bottom: 1.1429em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8571em;
            line-height: 1.3333;
            margin-top: 0.6667em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    base: css`
        font-size: ${token.body['font-size']};
        line-height: ${token.body['line-height']};

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2em;
            line-height: 1.5;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h1['font-size']};
            margin-top: 0;
            margin-bottom: 0.5em;
            line-height: ${token.h1['line-height']};
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h2['font-size']};
            margin-top: 1.4em;
            margin-bottom: 0.4em;
            line-height: ${token.h2['line-height']};
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: ${token.h3['font-size']};
            margin-top: 1.2em;
            margin-bottom: 0.35em;
            line-height: ${token.h3['line-height']};
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.3em;
            line-height: ${token.h4['line-height']};
            font-size: ${token.h4['font-size']};
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            border-radius: 0.3125rem;
            padding-top: 0.1875em;
            padding-inline-end: 0.375em;
            padding-bottom: 0.1875em;
            padding-inline-start: 0.375em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            padding: 0.1em 0.32em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
            padding-inline-start: 1.4em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.35em;
            margin-bottom: 0.35em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.375em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.375em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.65em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.65em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.42em;
            margin-bottom: 0.42em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
            margin-bottom: 0.65em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.65em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.375em;
            padding-inline-start: 1.4em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            line-height: 1.6;
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.5714em 0.75em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.5714em 0.75em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 1em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
            line-height: 1.4286;
            margin-top: 0.55em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    lg: css`
        font-size: 1.125rem;
        line-height: 1.6667;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2222em;
            line-height: 1.45;
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1111em;
            margin-bottom: 1.1111em;
            padding-inline-start: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 2.2222em;
            margin-top: 0;
            margin-bottom: 0.5556em;
            line-height: 1.1;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.4444em;
            margin-top: 1.3333em;
            margin-bottom: 0.5556em;
            line-height: 1.3;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.2222em;
            margin-top: 1.1111em;
            margin-bottom: 0.4444em;
            line-height: 1.45;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.3333em;
            line-height: 1.45;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            border-radius: 0.3125rem;
            padding-top: 0.2222em;
            padding-inline-end: 0.4444em;
            padding-bottom: 0.2222em;
            padding-inline-start: 0.4444em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            padding: 0.1111em 0.2778em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8667em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.875em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
            padding-inline-start: 1.5556em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.3333em;
            margin-bottom: 0.3333em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4444em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4444em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6667em;
            margin-bottom: 0.6667em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8889em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8889em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.5556em;
            margin-bottom: 0.5556em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
            margin-bottom: 0.8889em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8889em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.4444em;
            padding-inline-start: 1.5556em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.75em 0.875em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.75em 0.875em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.3333em;
            margin-bottom: 1.3333em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8889em;
            line-height: 1.5;
            margin-top: 0.75em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0;
        }
    `,

    xl: css`
        font-size: 1.25rem;
        line-height: 1.65;

        & :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where([class~="lead"]):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.15em;
            line-height: 1.45;
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
            padding-inline-start: 1em;
        }

        & :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 2.2em;
            margin-top: 0;
            margin-bottom: 0.6em;
            line-height: 1.05;
        }

        & :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.5em;
            margin-top: 1.3em;
            margin-bottom: 0.55em;
            line-height: 1.2;
        }

        & :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 1.25em;
            margin-top: 1.1em;
            margin-bottom: 0.45em;
            line-height: 1.35;
        }

        & :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1em;
            margin-bottom: 0.35em;
            line-height: 1.5;
        }

        & :where(img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(picture):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(picture > img):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
            margin-bottom: 0;
        }

        & :where(video):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(kbd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            border-radius: 0.3125rem;
            padding-top: 0.25em;
            padding-inline-end: 0.4em;
            padding-bottom: 0.25em;
            padding-inline-start: 0.4em;
        }

        & :where(code):not(:where(pre code, [class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            padding: 0.1em 0.25em;
        }

        & :where(h2 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.8611em;
        }

        & :where(h3 code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
        }

        & :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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

        & :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
            padding-inline-start: 1.5em;
        }

        & :where(li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.3em;
            margin-bottom: 0.3em;
        }

        & :where(ol > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4em;
        }

        & :where(ul > li):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding-inline-start: 0.4em;
        }

        & > :where(ul) > :where(li) :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & > :where(ul) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & > :where(ul) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8em;
        }

        & > :where(ol) > :where(li) > :where(p:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & > :where(ol) > :where(li) > :where(p:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-bottom: 0.8em;
        }

        & :where(ul ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ul ol):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ul):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(ol ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.6em;
            margin-bottom: 0.6em;
        }

        & :where(dl):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
            margin-bottom: 0.8em;
        }

        & :where(dt):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.8em;
        }

        & :where(dd):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0.45em;
            padding-inline-start: 1.5em;
        }

        & :where(hr):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & :where(hr + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h2 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h3 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(h4 + *):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & :where(table):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            line-height: 1.5;
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(thead th):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.8em 0.875em;
        }

        & :where(tbody td):not(:where([class~="not-prose"], [class~="not-prose"] *)),
        & :where(tfoot td):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            padding: 0.8em 0.875em;
        }

        & :where(figure):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 1.4em;
            margin-bottom: 1.4em;
        }

        & :where(figcaption):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            font-size: 0.9em;
            line-height: 1.5556;
            margin-top: 0.8em;
        }

        & > :where(:first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
            margin-top: 0;
        }

        & > :where(:last-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
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


