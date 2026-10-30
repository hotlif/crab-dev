import { css } from '@crab-dev/css';
import token, { vars } from './token.js';

export const invertStyle = css`
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

export const baseStyle = css`
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
