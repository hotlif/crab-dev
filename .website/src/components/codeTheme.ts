import type { CSSProperties } from "react";

/**
 * 语法高亮配色 —— 取代 Prism 自带的 vs / vs-dark。
 *
 * 两点取舍:
 * 1. 全部走 CSS 变量, 明暗主题由 `[data-theme]` 自动切换, 无需在组件里按 theme 选主题对象;
 * 2. 低饱和 + 有限色相。vs 主题在白底并置纯蓝关键字、深红字符串与绿色斜体注释, 密集代码下
 *    十分刺眼, 也与站点的中性灰调性冲突。这里把色相收敛到蓝 / 绿 / 赭 / 紫四支低饱和色,
 *    注释退为灰色且不加斜体。
 *
 * 背景一律 transparent —— 容器 (markdown.tsx 的 codeBlockStyle) 已给底色, 若此处再上一层底,
 * 会出现"框中框"的双层背景。
 */
const codeTheme: Record<string, CSSProperties> = {
    'pre[class*="language-"]': {
        color: "var(--code-fg)",
        background: "transparent",
        margin: 0,
    },
    'code[class*="language-"]': {
        color: "var(--code-fg)",
        background: "transparent",
    },
    comment: { color: "var(--code-comment)" },
    prolog: { color: "var(--code-comment)" },
    doctype: { color: "var(--code-comment)" },
    cdata: { color: "var(--code-comment)" },

    punctuation: { color: "var(--code-punctuation)" },
    operator: { color: "var(--code-punctuation)" },

    keyword: { color: "var(--code-keyword)" },
    "attr-name": { color: "var(--code-keyword)" },
    tag: { color: "var(--code-keyword)" },
    selector: { color: "var(--code-keyword)" },
    important: { color: "var(--code-keyword)" },
    atrule: { color: "var(--code-keyword)" },

    string: { color: "var(--code-string)" },
    "attr-value": { color: "var(--code-string)" },
    char: { color: "var(--code-string)" },
    regex: { color: "var(--code-string)" },
    inserted: { color: "var(--code-string)" },

    number: { color: "var(--code-number)" },
    boolean: { color: "var(--code-number)" },
    constant: { color: "var(--code-number)" },
    symbol: { color: "var(--code-number)" },
    deleted: { color: "var(--code-number)" },

    function: { color: "var(--code-function)" },
    "class-name": { color: "var(--code-function)" },
    builtin: { color: "var(--code-function)" },
    property: { color: "var(--code-fg)" },
    variable: { color: "var(--code-fg)" },

    bold: { fontWeight: 600 },
    italic: { fontStyle: "italic" },
};

export default codeTheme;
