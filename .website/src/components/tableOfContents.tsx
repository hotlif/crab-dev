import { css, cx } from "@linaria/core";
import { useEffect, useRef, useState, type FC, type MouseEvent } from "react";
import type { TocItem } from "./toc.js";

const wrapStyle = css`
    align-self: start;
    position: sticky;
    top: 72px;
    max-height: calc(100vh - 104px);
    overflow-y: auto;
    padding-left: 16px;
    border-left: 1px solid var(--border);

    /* 窄屏没有第三栏的空间; 内容本身仍可顺序阅读, 目录从略。 */
    @media (max-width: 1180px) {
        display: none;
    }
`;

const titleStyle = css`
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    padding: 0 0 10px;
`;

const listStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1px;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const linkStyle = css`
    display: block;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--muted-foreground);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);

    &:hover {
        color: var(--foreground);
        background: var(--accent);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--focus-ring-soft);
    }

    /* 当前小节 —— 除了变色, 还给一道左侧竖条: 不单靠颜色传达状态。 */
    &.active {
        color: var(--foreground);
        font-weight: 500;
        border-left-color: var(--foreground);
        background: var(--accent);
    }

    &.sub {
        padding-left: 18px;
        font-size: 12px;
    }
`;

interface TableOfContentsProps {
    items: TocItem[];
    /** 内容变化时重建观察者 —— 传当前文档的标识 (如 slug)。 */
    docKey: string;
}

const TableOfContents: FC<TableOfContentsProps> = ({ items, docKey }) => {
    const [activeId, setActiveId] = useState("");

    /*
     * 例外白名单 1 —— 可变实例状态 ref: 点击目录后的"锁定截止时刻", 跨事件持有且不应触发渲染。
     *
     * 为什么需要锁: 文档末尾的短小节, 滚到它与滚到页面底部是同一个 scrollY, 滚动侦测无从区分,
     * 只能一律判为末节。用户点了"HTML 生成"却高亮到最后一节, 是明显的错。这里让点击意图在平滑
     * 滚动期间压过侦测; 滚动停止后不再有 scroll 事件, 高亮便停在用户点的那一项。
     */
    const lockUntilRef = useRef(0);

    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]"),
        );
        if (nodes.length === 0) return;

        // 判定线取在 sticky header 下方一点; 当前小节 = 最后一个越过判定线的标题。
        const LINE = 90;
        let frame = 0;

        const update = () => {
            frame = 0;

            // 点击跳转期间, 高亮由点击决定, 不被途经的滚动位置改写。
            if (Date.now() < lockUntilRef.current) return;

            /*
             * 触底时把判定线放宽到视口中线。末节标题常常顶不到 LINE (页面已无可滚动余量),
             * 死守 LINE 会让它永远高亮不上; 而无条件取最后一节又会在用户刚滚到倒数第二节、
             * 页面恰好已触底时错误跳到末节。以中线判定, 两种情形都对。
             */
            const atBottom
                = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            const line = atBottom ? window.innerHeight / 2 : LINE;

            let current = nodes[0];
            for (const node of nodes) {
                if (node.getBoundingClientRect().top > line) break;
                current = node;
            }
            setActiveId(current.id);
        };

        // scroll 高频触发, 用 rAF 合并到每帧一次。
        const onScroll = () => {
            if (frame === 0) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame !== 0) cancelAnimationFrame(frame);
        };
    }, [docKey]);

    /*
     * 自行接管跳转。react-router 的 <ScrollRestoration> 把 hash 变化当作一次导航并重置滚动,
     * 会把浏览器原生的锚点跳转直接吃掉 —— 点了目录纹丝不动。这里阻止默认行为、手动滚动,
     * 再用 replaceState 更新 hash (不经 router, 因此不触发滚动恢复), 链接依旧可复制、可新窗口打开。
     */
    const onJump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        // 保留浏览器的组合键行为 (新标签页 / 新窗口)。
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        window.history.replaceState(null, "", `#${id}`);

        setActiveId(id);
        lockUntilRef.current = Date.now() + (reduced ? 100 : 800);
    };

    if (items.length < 3) return null;

    return (
        <nav className={wrapStyle} aria-label="本页目录">
            <div className={titleStyle}>本页目录</div>
            <ul className={listStyle}>
                {items.map(item => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={event => onJump(event, item.id)}
                            className={cx(
                                linkStyle,
                                item.level === 3 && "sub",
                                item.id === activeId && "active",
                            )}
                            aria-current={item.id === activeId ? "location" : undefined}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
