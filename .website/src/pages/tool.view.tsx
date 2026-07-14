import { css } from "@linaria/core";
import { Link, NavLink, useParams } from "react-router";
import toolboxManifest from "../_generated/toolboxManifest.js";
import Markdown from "../components/markdown.js";
import TableOfContents from "../components/tableOfContents.js";
import { extractHeadings } from "../components/toc.js";
import { GithubIcon, IssueIcon, EditIcon, HistoryIcon } from "../components/icons.js";

const wrapStyle = css`
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 190px;
    max-width: 1240px;
    margin: 0 auto;
    padding: 24px 24px 72px;
    gap: 32px;

    /* 放不下第三栏时, TOC 自身隐藏 (见 tableOfContents.tsx), 这里同步收掉它的列。 */
    @media (max-width: 1180px) {
        grid-template-columns: 200px minmax(0, 1fr);
    }

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

const stageStyle = css`
    font-size: 11px;
    font-weight: 600;
    color: var(--muted-foreground);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 9px;
    background: var(--muted);
`;

const markdownStyle = css`
    width: 100%;

    /*
     * 正文行宽 —— README 是长文, 满宽时中文一行近 60 字, 回扫容易串行。
     * 收到 ~44 字; 代码块与表格不受限, 仍可用满整个内容区。
     */
    p,
    ul,
    ol,
    blockquote,
    h1,
    h2,
    h3,
    h4 {
        max-width: 44em;
    }

    /* 锚点跳转时给顶部 sticky header 让位, 否则标题会被压在导航栏底下。 */
    h2,
    h3 {
        scroll-margin-top: 78px;
    }

    /*
     * 尾部滚动余量。没有它, 文末的短小节无法滚到判定线以上 —— 点击目录只能停在半空,
     * 滚动侦测也无从把"停在末节"与"到达页底"区分开, 末几项便永远高亮不正确。
     */
    padding-block-end: 34vh;
`;

const ToolView = () => {
    const { slug } = useParams<{ slug: string }>();
    const tool = toolboxManifest.find(t => t.slug === slug);
    const repoBase = "https://github.com/hotlif/crab-dev";

    const sourceHref = tool ? `${repoBase}/tree/canary/toolbox/${tool.slug}` : repoBase;
    const readmeHref = tool ? `${repoBase}/blob/canary/toolbox/${tool.slug}/README.md` : repoBase;
    const changelogHref = tool
        ? `${repoBase}/commits/canary/toolbox/${tool.slug}`
        : `${repoBase}/commits/canary`;
    const issueHref = tool
        ? `${repoBase}/issues/new?title=${encodeURIComponent(`[${tool.pkg}] `)}`
        : `${repoBase}/issues/new`;

    /*
     * README 开头的居中 hero 块（<div align="center"> 内含 h1 与简介）与页面 header
     * 的标题、描述完全重复，渲染前剥掉，避免同一页出现两个大标题。
     */
    const normalizedReadme = tool?.readme
        ? tool.readme
            .trimStart()
            .replace(/^<div align="center">[\s\S]*?<\/div>\s*/, "")
            .trimStart()
        : "";

    const headings = extractHeadings(normalizedReadme);

    if (!tool) {
        return (
            <div className={wrapStyle}>
                <div />
                <div className={contentStyle}>
                    <h1 className={titleStyle}>工具不存在</h1>
                    <p className={subtitleStyle}>
                        没有找到 slug 为 <code>{slug}</code> 的工具。
                        <Link to="/toolchain"> 返回工具链 </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={wrapStyle}>
            <aside className={sidebarStyle} aria-label="工具列表">
                <div className={sidebarTitleStyle}>工具 · {toolboxManifest.length}</div>
                {toolboxManifest.map(t => (
                    <NavLink
                        key={t.slug}
                        to={`/toolchain/${t.slug}`}
                        className={({ isActive }) => `${sidebarLinkStyle}${isActive ? " active" : ""}`}
                    >
                        {t.title}
                    </NavLink>
                ))}
            </aside>

            <article className={contentStyle}>
                <header className={headerStyle}>
                    <div className={breadcrumbStyle}>
                        <Link to="/">首页</Link>
                        <span>/</span>
                        <Link to="/toolchain">工具链</Link>
                        <span>/</span>
                        <span>{tool.title}</span>
                    </div>
                    <div className={titleRowStyle}>
                        <h1 className={titleStyle}>{tool.title}</h1>
                        <span className={pkgStyle}>{tool.pkg}</span>
                        {tool.stage && <span className={stageStyle}>{tool.stage}</span>}
                    </div>
                    {tool.description && <p className={subtitleStyle}>{tool.description}</p>}
                    <div className={metaPanelStyle}>
                        <div className={metaRowStyle}>
                            <span className={metaLabelStyle}>安装</span>
                            <code className={usageCodeStyle}>{`yarn add -D ${tool.pkg}`}</code>
                        </div>
                        <div className={metaRowStyle}>
                            <span className={metaLabelStyle}>反馈</span>
                            <div className={linksRowStyle}>
                                <a className={actionLinkStyle} href={sourceHref} target="_blank" rel="noreferrer">
                                    <GithubIcon className={iconStyle} />
                                    toolbox/{tool.slug}
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
                                <a className={actionLinkStyle} href={changelogHref} target="_blank" rel="noreferrer">
                                    <HistoryIcon className={iconStyle} />
                                    更新日志
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {normalizedReadme && (
                    <Markdown className={markdownStyle}>{normalizedReadme}</Markdown>
                )}
            </article>

            <TableOfContents items={headings} docKey={tool.slug} />
        </div>
    );
};

export default ToolView;
