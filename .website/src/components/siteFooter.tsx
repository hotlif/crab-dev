import { css } from "@linaria/core";
import type { FC } from "react";

const footerStyle = css`
    border-top: 1px solid var(--border);
    margin-top: 56px;
    padding: 28px 24px;
    color: var(--muted-foreground);
    font-size: 12px;
`;

const innerStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
`;

const linksStyle = css`
    display: flex;
    gap: 14px;
    > a {
        color: var(--muted-foreground);
        padding: 2px 6px;
        border-radius: 6px;
    }
    > a:hover {
        color: var(--foreground);
        background: var(--accent);
    }
`;

const SiteFooter: FC = () => {
    return (
        <footer className={footerStyle}>
            <div className={innerStyle}>
                <span>© {new Date().getFullYear()} @crab-dev · 安静而精确的 React 组件库</span>
                <nav className={linksStyle} aria-label="次级导航">
                    <a href="https://github.com/hotlif/crab-dev" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="/components">组件</a>
                </nav>
            </div>
        </footer>
    );
};

export default SiteFooter;
