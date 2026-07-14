export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

/**
 * 标题 → 锚点 id。
 *
 * TOC 从 markdown 源文本提取标题, 而 id 由 markdown.tsx 在渲染标题时生成 —— 两处必须用
 * 同一个函数, 否则锚点对不上, 点了跳不动。
 */
export const slugify = (text: string): string =>
    text
        .trim()
        .toLowerCase()
        .replace(/[`*_~]/g, "")
        // 非字母 / 数字(含 CJK)一律折成连字符
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

/**
 * 从 markdown 源提取 h2 / h3。
 *
 * 逐行扫描而非解析 AST: 只需标题, 且必须跳过 ``` 围栏内的内容 —— 代码里的注释行
 * (如 `## 说明`) 不是标题。
 */
export const extractHeadings = (markdown: string): TocItem[] => {
    const items: TocItem[] = [];
    let inFence = false;

    for (const line of markdown.split("\n")) {
        if (/^\s*(```|~~~)/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
        if (!match) continue;

        const level = match[1].length === 2 ? 2 : 3;
        const text = match[2].replace(/[`*_~]/g, "").trim();
        if (!text) continue;

        items.push({ id: slugify(text), text, level });
    }

    return items;
};
