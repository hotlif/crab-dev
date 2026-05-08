import { css } from "@linaria/core";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import manifest from "../_generated/manifest.js";
import { SearchIcon } from "../components/icons.js";
import { groupComponents } from "../components/categories.js";

const wrapStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px 72px;

    @media (max-width: 720px) {
        padding: 40px 16px;
    }
`;

const headerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 34px;
`;

const titleStyle = css`
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.08;
    letter-spacing: -0.03em;
    font-weight: 700;
    color: var(--text-primary);
`;

const leadStyle = css`
    font-size: 15px;
    color: var(--muted-foreground);
    line-height: 1.65;
    max-width: 60ch;
`;

const searchWrapStyle = css`
    position: relative;
    margin: 26px 0 24px;
    max-width: 480px;
`;

const searchInputStyle = css`
    width: 100%;
    padding: 11px 14px 11px 38px;
    font-size: 13.5px;
    font-family: inherit;
    border-radius: calc(var(--radius-md) - 2px);
    border: 1px solid var(--input);
    background: color-mix(in oklab, var(--background) 92%, var(--card));
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:focus-visible {
        border-color: var(--ring);
        box-shadow: 0 0 0 3px oklch(70.8% 0 0 / 0.35);
    }
`;

const searchIconStyle = css`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
`;

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
`;

const cardStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 18px 16px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-raised);
    color: var(--text-primary);
    text-decoration: none;
    transition: border-color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

    &:hover {
        border-color: var(--border-default);
        background: color-mix(in oklab, var(--accent) 76%, var(--card));
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }

    &:focus-visible {
        outline: none;
        border-color: var(--ring);
        box-shadow: 0 0 0 3px oklch(70.8% 0 0 / 0.35);
    }

    > .row {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        min-height: 24px;
        padding-right: 68px;
    }

    > .row > .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.35;
        letter-spacing: -0.01em;
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    > .desc {
        font-size: 12.5px;
        color: var(--muted-foreground);
        line-height: 1.55;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    > .meta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-family: var(--font-mono);
        color: var(--text-tertiary);
        white-space: nowrap;
    }

    > .meta > .dot {
        width: 3px;
        height: 3px;
        border-radius: 999px;
        background: var(--text-tertiary);
        opacity: 0.6;
    }

    > .version {
        position: absolute;
        top: 10px;
        right: 10px;
        display: inline-flex;
        font-size: 10.5px;
        font-family: var(--font-mono);
        color: var(--foreground);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 2px 8px;
        background: color-mix(in oklab, var(--card) 86%, var(--tone-cyan-soft));
    }
`;

const emptyStyle = css`
    padding: 48px 0;
    text-align: center;
    color: var(--text-tertiary);
`;

const groupHeadingStyle = css`
    margin: 28px 0 14px;
    display: flex;
    align-items: baseline;
    gap: 12px;

    > h2 {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.01em;
    }
    > span {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-tertiary);
    }
`;

const OverviewView = () => {
    const [query, setQuery] = useState("");
    type OverviewItem = (typeof manifest)[number] & { version?: string };

    const getVersionLabel = (version?: string): string => {
        const raw = (version ?? "0.0.0").trim();
        return raw.startsWith("v") ? raw : `v${raw}`;
    };

    const filtered = useMemo<OverviewItem[]>(() => {
        const q = query.trim().toLowerCase();
        const items = manifest as OverviewItem[];
        if (!q) return items;
        return items.filter(
            item =>
                item.slug.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q),
        );
    }, [query]);

    return (
        <div className={wrapStyle}>
            <div className={headerStyle}>
                <h1 className={titleStyle}>组件总览</h1>
                <p className={leadStyle}>
                    共收录 {manifest.length} 个组件，覆盖通用、导航、数据录入与反馈等核心场景。
                </p>
            </div>

            <div className={searchWrapStyle}>
                <span className={searchIconStyle}><SearchIcon /></span>
                <input
                    type="search"
                    className={searchInputStyle}
                    placeholder="搜索组件名称或描述"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    aria-label="搜索组件"
                />
            </div>

            {filtered.length === 0 ? (
                <div className={emptyStyle}>未找到匹配的组件。</div>
            ) : query.trim() ? (
                <div className={gridStyle}>
                    {filtered.map(item => (
                        <Link key={item.slug} to={`/components/${item.slug}`} className={cardStyle}>
                            <div className="row">
                                <span className="title">{item.title}</span>
                            </div>
                            <span className="desc">
                                {item.description || `@crab-dev/${item.slug}`}
                            </span>
                            <span className="meta">
                                <span>{item.demos.length} demos</span>
                                <span className="dot" />
                                <span>{item.pkg}</span>
                            </span>
                            <span className="version">{getVersionLabel(item.version)}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                groupComponents(filtered).map(group => (
                    <section key={group.category.id}>
                        <div className={groupHeadingStyle}>
                            <h2>{group.category.title}</h2>
                            <span>{group.items.length}</span>
                        </div>
                        <div className={gridStyle}>
                            {group.items.map(item => (
                                <Link key={item.slug} to={`/components/${item.slug}`} className={cardStyle}>
                                    <div className="row">
                                        <span className="title">{item.title}</span>
                                    </div>
                                    <span className="desc">
                                        {item.description || `@crab-dev/${item.slug}`}
                                    </span>
                                    <span className="meta">
                                        <span>{item.demos.length} demos</span>
                                        <span className="dot" />
                                        <span>{item.pkg}</span>
                                    </span>
                                    <span className="version">{getVersionLabel(item.version)}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
};

export default OverviewView;
