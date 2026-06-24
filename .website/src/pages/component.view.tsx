import { css } from "@linaria/core";
import { useMemo } from "react";
import { Link, NavLink, useParams } from "react-router";
import manifest from "../_generated/manifest.js";
import Markdown from "../components/markdown.js";
import { groupComponents } from "../components/categories.js";
import { GithubIcon, IssueIcon, EditIcon, CompassIcon, HistoryIcon } from "../components/icons.js";

const wrapStyle = css`
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 72px;
    gap: 32px;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        padding: 24px 16px 64px;
        gap: 16px;
    }
`;

const sidebarStyle = css`
    align-self: start;
    position: sticky;
    top: 72px;
    max-height: calc(100vh - 104px);
    overflow-y: auto;
    padding: 8px 4px;
    border-right: 1px solid var(--border);
    padding-right: 16px;

    @media (max-width: 960px) {
        position: static;
        max-height: none;
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
        padding-right: 0;
        padding-bottom: 12px;
        overflow-x: auto;
        white-space: nowrap;
        display: flex;
        gap: 4px;
    }
`;

const sidebarTitleStyle = css`
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    padding: 0 12px 8px;

    @media (max-width: 960px) {
        display: none;
    }
`;

const sidebarLinkStyle = css`
    display: block;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color var(--transition-fast), background-color var(--transition-fast);
    white-space: nowrap;

    &:hover {
        color: var(--foreground);
        background: var(--accent);
    }

    &.active {
        color: var(--foreground);
        background: var(--accent);
        font-weight: 500;
    }
`;

const contentStyle = css`
    min-width: 0;
`;

const headerStyle = css`
    margin-bottom: 16px;
    padding: 16px 20px;
    border-radius: var(--radius-lg);
    background: var(--card);
`;

const breadcrumbStyle = css`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted-foreground);
    margin-bottom: 6px;

    > a:hover { color: var(--accent-600); }
`;

const titleRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 2px;
`;

const titleStyle = css`
    font-size: clamp(26px, 3.2vw, 36px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
`;

const pkgStyle = css`
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted-foreground);
    padding: 4px 8px;
    border-radius: 999px;
    background: var(--muted);
    border: 1px solid var(--border);
`;

const subtitleStyle = css`
    color: var(--muted-foreground);
    font-size: 15px;
    line-height: 1.6;
    margin: 8px 0 0;
`;

const metaPanelStyle = css`
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const metaRowStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 26px;

    @media (max-width: 720px) {
        align-items: flex-start;
        min-height: 0;
    }
`;

const metaLabelStyle = css`
    flex-shrink: 0;
    width: 40px;
    font-size: 12px;
    color: var(--text-tertiary);
    line-height: 1.6;
`;

const usageCodeStyle = css`
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-primary);
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`;

const linksRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0;
`;

const actionLinkStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color var(--transition-fast);
    padding: 2px 0;

    & + & {
        margin-left: 12px;
        padding-left: 12px;
        border-left: 1px solid var(--border);
    }

    &:hover {
        color: var(--foreground);
    }

    &:focus-visible {
        outline: none;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
`;

const iconStyle = css`
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.88;
`;

const sidebarGroupStyle = css`
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;

    @media (max-width: 960px) {
        flex-direction: row;
        margin-bottom: 0;
        gap: 4px;
    }
`;

const sidebarGroupLabelStyle = css`
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    padding: 12px 12px 6px;

    @media (max-width: 960px) {
        display: none;
    }
`;

const ComponentView = () => {
    const { slug } = useParams<{ slug: string }>();
    const item = useMemo(() => manifest.find(m => m.slug === slug), [slug]);
    const repoBase = "https://github.com/hotlif/crab-dev";

    const usageName = useMemo(() => {
        if (!item) return "Component";
        return item.slug
            .replace(/^rc-/, "")
            .split("-")
            .filter(Boolean)
            .map(part => part[0]?.toUpperCase() + part.slice(1))
            .join("");
    }, [item]);

    const usageCode = useMemo(() => {
        if (!item) return "";
        return `import ${usageName} from '${item.pkg}';`;
    }, [item, usageName]);

    const sourceHref = useMemo(() => {
        if (!item) return repoBase;
        return `${repoBase}/tree/canary/components/${item.slug}`;
    }, [item]);

    const issueHref = useMemo(() => {
        if (!item) return `${repoBase}/issues/new`;
        return `${repoBase}/issues/new?title=${encodeURIComponent(`[${item.pkg}] `)}`;
    }, [item]);

    const readmeHref = useMemo(() => {
        if (!item) return repoBase;
        return `${repoBase}/blob/canary/components/${item.slug}/README.md`;
    }, [item]);

    const guideHref = `${repoBase}/blob/canary/rfc/RFC-DESIGN-TOKEN-20260329.md`;

    const changelogHref = useMemo(() => {
        if (!item) return `${repoBase}/commits/canary`;
        return `${repoBase}/commits/canary/components/${item.slug}`;
    }, [item]);
    const normalizedReadme = useMemo(() => {
        if (!item?.readme) return "";

        const readme = item.readme.trimStart();
        const description = item.description?.trim();
        if (!description) return readme;

        // Avoid showing the same description twice (page header + README first line).
        const escaped = description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const leadingDescription = new RegExp(`^${escaped}\\s*\\n+`);
        return readme.replace(leadingDescription, "");
    }, [item]);

    if (!item) {
        return (
            <div className={wrapStyle}>
                <div />
                <div className={contentStyle}>
                    <h1 className={titleStyle}>组件不存在</h1>
                    <p className={subtitleStyle}>
                        没有找到 slug 为 <code>{slug}</code> 的组件。
                        <Link to="/components"> 返回总览 </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={wrapStyle}>
            <aside className={sidebarStyle} aria-label="组件列表">
                <div className={sidebarTitleStyle}>组件 · {manifest.length}</div>
                {groupComponents(manifest).map(group => (
                    <div key={group.category.id} className={sidebarGroupStyle}>
                        <div className={sidebarGroupLabelStyle}>{group.category.title}</div>
                        {group.items.map(m => (
                            <NavLink
                                key={m.slug}
                                to={`/components/${m.slug}`}
                                className={({ isActive }) =>
                                    `${sidebarLinkStyle}${isActive ? " active" : ""}`
                                }
                            >
                                {m.title}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </aside>

            <article className={contentStyle}>
                <header className={headerStyle}>
                    <div className={breadcrumbStyle}>
                        <Link to="/">首页</Link>
                        <span>/</span>
                        <Link to="/components">组件</Link>
                        <span>/</span>
                        <span>{item.title}</span>
                    </div>
                    <div className={titleRowStyle}>
                        <h1 className={titleStyle}>{item.title}</h1>
                        <span className={pkgStyle}>{item.pkg}</span>
                    </div>
                    {item.description && (
                        <p className={subtitleStyle}>{item.description}</p>
                    )}
                    <div className={metaPanelStyle}>
                        <div className={metaRowStyle}>
                            <span className={metaLabelStyle}>使用</span>
                            <code className={usageCodeStyle}>{usageCode}</code>
                        </div>
                        <div className={metaRowStyle}>
                            <span className={metaLabelStyle}>反馈</span>
                            <div className={linksRowStyle}>
                                <a className={actionLinkStyle} href={sourceHref} target="_blank" rel="noreferrer">
                                    <GithubIcon className={iconStyle} />
                                    components/{item.slug}
                                </a>
                                <a className={actionLinkStyle} href={issueHref} target="_blank" rel="noreferrer">
                                    <IssueIcon className={iconStyle} />
                                    提交问题
                                </a>
                            </div>
                        </div>
                        <div className={metaRowStyle}>
                            <span className={metaLabelStyle}>文档</span>
                            <div className={linksRowStyle}>
                                <a className={actionLinkStyle} href={readmeHref} target="_blank" rel="noreferrer">
                                    <EditIcon className={iconStyle} />
                                    编辑此页
                                </a>
                                <a className={actionLinkStyle} href={guideHref} target="_blank" rel="noreferrer">
                                    <CompassIcon className={iconStyle} />
                                    设计指南
                                </a>
                                <a className={actionLinkStyle} href={changelogHref} target="_blank" rel="noreferrer">
                                    <HistoryIcon className={iconStyle} />
                                    更新日志
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {normalizedReadme && (
                    <Markdown
                        className={css`
                            width: 100%;
                        `}
                        demos={item.demos}
                        api={item.api}
                    >
                        {normalizedReadme}
                    </Markdown>
                )}
            </article>
        </div>
    );
};

export default ComponentView;
