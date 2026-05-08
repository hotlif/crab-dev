import { css } from "@linaria/core";
import { Link } from "react-router";
import { ArrowRightIcon } from "../components/icons.js";

const wrapStyle = css`
    max-width: 760px;
    margin: 0 auto;
    padding: 84px 24px;
    text-align: center;
`;

const codeStyle = css`
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted-foreground);
    letter-spacing: 0.04em;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 4px 10px;
`;

const titleStyle = css`
    margin: 16px 0 12px;
    font-size: clamp(36px, 6vw, 58px);
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--text-primary);
`;

const leadStyle = css`
    color: var(--muted-foreground);
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 24px;
`;

const buttonStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: calc(var(--radius-md) - 2px);
    border: 1px solid var(--primary);
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: transform var(--transition-fast), background-color var(--transition-fast);

    &:hover {
        transform: translateY(-1px);
        background: var(--accent-foreground);
        color: var(--primary-foreground);
    }
`;

const NotFoundView = () => {
    return (
        <div className={wrapStyle}>
            <span className={codeStyle}>404 / Not Found</span>
            <h1 className={titleStyle}>这里什么都没有</h1>
            <p className={leadStyle}>
                你访问的页面不存在或已被移除。可以从首页或组件总览重新开始。
            </p>
            <Link to="/" className={buttonStyle}>
                返回首页
                <ArrowRightIcon />
            </Link>
        </div>
    );
};

export default NotFoundView;
