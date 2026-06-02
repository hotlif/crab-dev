import { css, cx } from "@linaria/core";
import { Link, NavLink, useLocation } from "react-router";
import { useState, type FC } from "react";
import { SunIcon, MoonIcon, GithubIcon, MenuIcon, CloseIcon, CrabMarkIcon } from "./icons.js";
import { useTheme } from "../theme/useTheme.js";

const headerStyle = css`
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: saturate(180%) blur(16px);
    -webkit-backdrop-filter: saturate(180%) blur(16px);
    background: var(--surface-overlay);
    border-bottom: 1px solid var(--border);
    transition: background-color var(--transition-base), border-color var(--transition-base);
`;

const innerStyle = css`
    max-width: 1200px;
    margin: 0 auto;
    height: 58px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 720px) {
        padding: 0 16px;
        gap: 12px;
    }
`;

const brandStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
`;

const brandMarkStyle = css`
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--foreground);
    box-shadow: 0 1px 4px oklch(0% 0 0 / 0.28), inset 0 0 0 1px oklch(100% 0 0 / 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--background);
    flex-shrink: 0;
`;

const navStyle = css`
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;

    @media (max-width: 720px) {
        display: none;
    }
`;

const navLinkStyle = css`
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted-foreground);
    transition: color var(--transition-fast), background-color var(--transition-fast);

    &:hover {
        color: var(--foreground);
        background: var(--accent);
    }

    &.active {
        color: var(--foreground);
        background: var(--accent);
    }
`;

const actionsStyle = css`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
`;

const iconButtonStyle = css`
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--muted-foreground);
    cursor: pointer;
    transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);

    &:hover {
        color: var(--foreground);
        background: var(--accent);
    }

    &:focus-visible {
        outline: none;
        border-color: var(--ring);
        box-shadow: 0 0 0 3px oklch(70.8% 0 0 / 0.35);
    }
`;

const mobileToggleStyle = css`
    display: none;
    @media (max-width: 720px) {
        display: inline-flex;
    }
`;

const mobileNavStyle = css`
    display: none;
    @media (max-width: 720px) {
        display: flex;
        flex-direction: column;
        padding: 8px 16px 16px;
        border-top: 1px solid var(--border);
        gap: 4px;
    }
`;

interface NavEntry {
    to: string;
    label: string;
    end?: boolean;
}

const NAV_ENTRIES: NavEntry[] = [
    { to: "/", label: "首页", end: true },
];

const SiteHeader: FC = () => {
    const { theme, toggle } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <header className={headerStyle}>
            <div className={innerStyle}>
                <Link to="/" className={brandStyle} onClick={() => setMobileOpen(false)}>
                    <span aria-hidden className={brandMarkStyle}>
                        <CrabMarkIcon width={26} height={26} />
                    </span>
                    Crab Design
                </Link>

                <nav className={navStyle} aria-label="主导航">
                    {NAV_ENTRIES.map(entry => (
                        <NavLink
                            key={entry.to}
                            to={entry.to}
                            end={entry.end}
                            className={({ isActive }) => cx(navLinkStyle, isActive && "active")}
                        >
                            {entry.label}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/components"
                        className={({ isActive }) =>
                            cx(navLinkStyle, (isActive || location.pathname.startsWith("/components/")) && "active")
                        }
                    >
                        组件库
                    </NavLink>
                </nav>

                <div className={actionsStyle}>
                    <a
                        className={iconButtonStyle}
                        href="https://github.com/hotlif/crab-dev"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub 仓库"
                    >
                        <GithubIcon />
                    </a>
                    <button
                        type="button"
                        className={iconButtonStyle}
                        onClick={toggle}
                        aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
                    >
                        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <button
                        type="button"
                        className={cx(iconButtonStyle, mobileToggleStyle)}
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            {mobileOpen && (
                <div className={mobileNavStyle}>
                    {NAV_ENTRIES.map(entry => (
                        <NavLink
                            key={entry.to}
                            to={entry.to}
                            end={entry.end}
                            className={({ isActive }) => cx(navLinkStyle, isActive && "active")}
                            onClick={() => setMobileOpen(false)}
                        >
                            {entry.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
};

export default SiteHeader;
