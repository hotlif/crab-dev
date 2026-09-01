import { css, cx } from '@crab-dev/css';
import { useEffect, useRef, useState } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
// @ts-expect-error: 第三方库类型定义不全；CJS 子路径同时兼容 Wake 的 ESM 与 CommonJS 产物。
import oneLight from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light.js';
// @ts-expect-error: 第三方库类型定义不全；CJS 子路径同时兼容 Wake 的 ESM 与 CommonJS 产物。
import oneDark from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark.js';
import token from './token.js';
import { CheckIcon, CodeIcon, CopyIcon, ExternalLinkIcon, EyeIcon } from './icons.js';

export type PreviewDensity = 'compact' | 'regular' | 'spacious';
export type PreviewCodeTheme = 'light' | 'dark';

export interface PreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** 中间信息栏的标题；可以是文本或自定义节点 */
    title?: ReactNode;
    /**
     * 描述内容（标题下方一行）。
     * - 传入 string 时按 Markdown 内联语法渲染；
     * - 传入 ReactNode 时原样渲染。
     */
    description?: ReactNode;
    /** 在新窗口打开的 URL；为空时隐藏外链按钮 */
    path?: string;
    /** 展示在源码区的代码字符串；为空时隐藏「源码」按钮 */
    sourceCode?: string;
    /** 源码语言，默认 tsx */
    language?: string;
    /** 源码高亮主题，默认 light */
    codeTheme?: PreviewCodeTheme;
    /** 预览区密度，控制舞台留白 */
    density?: PreviewDensity;
    /** 默认是否展开代码，默认 false */
    defaultExpanded?: boolean;
    /** 自定义新窗口打开方式，默认 window.open */
    onOpenExternal?: (path: string) => void;
    /** 自定义复制行为；默认 navigator.clipboard.writeText */
    onCopyCode?: (code: string) => Promise<void> | void;
}

/* ────────────────────────── 卡片 ────────────────────────── */

const cardStyle = css`
    position: relative;
    border: 1px solid ${token.card.border.color};
    border-radius: ${token.card.border.radius};
    background-color: ${token.card.background.color};
    box-shadow: ${token.card.shadow};
    overflow: hidden;
    transition: ${token.transition};

    &:hover {
        border-color: ${token.card.border['color-hover']};
        box-shadow: ${token.card['shadow-hover']};
    }
`;

/* ────────────────────────── 舞台 ────────────────────────── */

const stageStyle = css`
    position: relative;
    padding: ${token.stage.padding};
    min-height: ${token.stage['min-height']};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: auto;
    background-color: ${token.stage.background.color};
`;

const stageContentStyle = css`
    width: 100%;
`;

const stageCompactStyle = css`
    padding: 16px 18px;
    min-height: 88px;
`;

const stageSpaciousStyle = css`
    padding: 30px 24px;
    min-height: 156px;
`;

/* ────────────────────────── 标题栏（Stage 上方） ────────────────────────── */

const metaInfoStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.meta.info.gap};
    padding: 16px 20px;
    background-color: ${token.meta.info.background.color};
    min-width: 0;
    border-bottom: 1px ${token.meta.info.divider.style} ${token.meta.border.color};
`;

/* 标题行：标题靠左，虚线在右侧填充到行尾 */

const metaTitleRowStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;

    &::after {
        content: '';
        flex: 1 1 auto;
        height: 0;
        border-top: 1px ${token.meta.info.divider.style} ${token.meta.border.color};
    }
`;

const metaTitleStyle = css`
    flex-shrink: 0;
    color: ${token.meta.title.color};
    font-size: ${token.meta.title.font.size};
    font-weight: ${token.meta.title.font.weight};
    letter-spacing: ${token.meta.title['letter-spacing']};
    line-height: ${token.meta.title['line-height']};
`;

const metaDescStyle = css`
    color: ${token.meta.desc.color};
    font-size: ${token.meta.desc.font.size};
    line-height: ${token.meta.desc['line-height']};

    > p {
        margin: 0;
    }
    > p + p {
        margin-top: 6px;
    }
    code {
        padding: ${token.meta.desc.code.padding};
        border-radius: ${token.meta.desc.code.border.radius};
        background-color: ${token.meta.desc.code.background.color};
        color: ${token.meta.desc.code.color};
        font-family: ${token.source.font.family};
        font-size: 0.92em;
    }
    a {
        color: ${token.meta.title.color};
        text-decoration: underline;
        text-decoration-color: ${token.meta.border.color};
        text-underline-offset: 3px;
        transition: ${token.transition};
    }
    a:hover {
        text-decoration-color: currentColor;
    }
`;

/* 右对齐的操作栏：复制 / 源码 / 新窗口（图标 + 文字） */

const metaActionsStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.meta.actions.gap};
    padding: ${token.meta.actions.padding};
    background-color: ${token.meta.actions.background.color};
    border-top: 1px ${token.meta.actions.border.style} ${token.meta.border.color};

    @media (max-width: 520px) {
        justify-content: stretch;
        flex-wrap: wrap;
    }
`;

const actionButtonStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.action.gap};
    height: ${token.action.height};
    padding: ${token.action.padding};
    border: 1px solid ${token.action.border.color};
    border-radius: ${token.action.border.radius};
    background-color: ${token.action.background.color};
    color: ${token.action.color};
    font-size: ${token.action.font.size};
    font-weight: ${token.action.font.weight};
    line-height: 1;
    cursor: pointer;
    user-select: none;
    transition: ${token.transition};

    & svg {
        flex-shrink: 0;
    }

    &:hover {
        color: ${token.action['color-hover']};
        background-color: ${token.action.background['color-hover']};
        border-color: ${token.action.border['color-hover']};
    }
    &:focus-visible {
        outline: none;
        border-color: ${token.action.border['color-focus']};
    }
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`;

const actionButtonActiveStyle = css`
    color: ${token.action['color-active']};
    background-color: ${token.action.background['color-active']};
    border-color: ${token.action.border['color-active']};
    box-shadow: ${token.action['shadow-active']};

    &:hover {
        color: ${token.action['color-active']};
        background-color: ${token.action.background['color-active']};
        border-color: ${token.action.border['color-active']};
    }
`;

const actionButtonSuccessStyle = css`
    color: ${token.feedback.success.color};

    &:hover {
        color: ${token.feedback.success.color};
    }
`;

/* ────────────────────────── 代码区（展开/折叠） ────────────────────────── */

const sourceFrameStyle = css`
    position: relative;
    background-color: ${token.source.background.color};
    border-top: 1px solid ${token.source.border.color};
    overflow: hidden;
    transition: ${token['transition-expand']};
    padding: 1rem;
`;

const sourceFrameExpandedStyle = css`
    max-height: ${token.source['expanded-height']};
`;

const sourceScrollStyle = css`
    max-height: ${token.source['expanded-height']};
    overflow: auto;
    scrollbar-gutter: stable;

    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${token.source.scrollbar.color};
        border-radius: 6px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: ${token.source.scrollbar['color-hover']};
    }

    pre {
        margin: 0 !important;
        background: transparent !important;
        font-variant-ligatures: contextual !important;
        font-feature-settings: 'liga' 1, 'calt' 1 !important;
    }

    .linenumber {
        display: inline-block !important;
        min-width: ${token.source.gutter['min-width']} !important;
        padding-right: ${token.source.gutter['padding-right']} !important;
        margin-right: ${token.source.gutter['margin-right']} !important;
        text-align: right !important;
        color: ${token.source.gutter.color} !important;
        user-select: none;
        font-variant-numeric: tabular-nums;
    }
`;

/* ────────────────────────── Prism 配置 ────────────────────────── */

const prismCustomStyle = {
    margin: 0,
    padding: `${token.source['padding-block']} 0`,
    background: 'transparent',
    fontSize: token.source.font.size,
    fontFamily: token.source.font.family,
    lineHeight: token.source['line-height'],
    tabSize: token.source['tab-size'],
    MozTabSize: token.source['tab-size'],
    textShadow: 'none',
} as const;

const prismCodeTagProps = {
    style: {
        fontFamily: token.source.font.family,
        fontSize: token.source.font.size,
        lineHeight: token.source['line-height'],
    },
} as const;

const prismLineNumberStyle = {
    minWidth: token.source.gutter['min-width'],
    paddingRight: token.source.gutter['padding-right'],
    marginRight: token.source.gutter['margin-right'],
    color: token.source.gutter.color,
    textAlign: 'right' as const,
    userSelect: 'none' as const,
    fontVariantNumeric: 'tabular-nums' as const,
};

const COPY_FEEDBACK_MS = 1400;

const writeToClipboard = async (code: string): Promise<boolean> => {
    if (typeof navigator === 'undefined') return false;
    const clipboard = navigator.clipboard;
    if (!clipboard?.writeText) return false;
    try {
        await clipboard.writeText(code);
        return true;
    } catch {
        return false;
    }
};

const Preview: FC<PreviewProps> = ({
    title,
    description,
    children,
    sourceCode,
    path,
    language = 'tsx',
    codeTheme = 'light',
    density = 'regular',
    defaultExpanded = false,
    onOpenExternal,
    onCopyCode,
    className,
    ...restProps
}) => {
    const hasSource = typeof sourceCode === 'string' && sourceCode.length > 0;
    const hasPath = typeof path === 'string' && path.length > 0;
    const hasDescription =
        description != null && (typeof description !== 'string' || description.length > 0);
    const hasInfo = title != null || hasDescription;

    const [expanded, setExpanded] = useState(defaultExpanded && hasSource);
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (copyTimerRef.current != null) {
                clearTimeout(copyTimerRef.current);
                copyTimerRef.current = null;
            }
        };
    }, []);

    const flashCopied = () => {
        setCopied(true);
        if (copyTimerRef.current != null) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => {
            setCopied(false);
            copyTimerRef.current = null;
        }, COPY_FEEDBACK_MS);
    };

    const handleCopy = async () => {
        if (!hasSource) return;
        if (onCopyCode) {
            try {
                await onCopyCode(sourceCode);
                flashCopied();
            } catch {
                /* 由调用方负责错误反馈 */
            }
            return;
        }
        const ok = await writeToClipboard(sourceCode);
        if (ok) flashCopied();
    };

    const handleToggle = () => {
        if (!hasSource) return;
        setExpanded((v) => !v);
    };

    const handleOpen = () => {
        if (!hasPath) return;
        if (onOpenExternal) {
            onOpenExternal(path);
            return;
        }
        if (typeof window !== 'undefined') {
            window.open(path, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <article className={cx(cardStyle, className)} {...restProps}>
            {hasInfo && (
                <div className={metaInfoStyle}>
                    {title != null && (
                        <div className={metaTitleRowStyle}>
                            <span className={metaTitleStyle}>{title}</span>
                        </div>
                    )}
                    {hasDescription && (
                        <div className={metaDescStyle}>
                            {typeof description === 'string'
                                ? <ReactMarkdown>{description}</ReactMarkdown>
                                : description}
                        </div>
                    )}
                </div>
            )}

            <div
                className={cx(
                    stageStyle,
                    density === 'compact' && stageCompactStyle,
                    density === 'spacious' && stageSpaciousStyle,
                )}
            >
                <div className={stageContentStyle}>{children}</div>
            </div>

            {(hasSource || hasPath) && (
                <div className={metaActionsStyle} role="group" aria-label="预览操作">
                    {hasSource && (
                        <button
                            type="button"
                            className={cx(
                                actionButtonStyle,
                                copied && actionButtonSuccessStyle,
                            )}
                            onClick={handleCopy}
                            aria-label="复制代码"
                            aria-live="polite"
                        >
                            {copied ? <CheckIcon /> : <CopyIcon />}
                            {copied ? '已复制' : '复制'}
                        </button>
                    )}
                    {hasSource && (
                        <button
                            type="button"
                            className={cx(
                                actionButtonStyle,
                                expanded && actionButtonActiveStyle,
                            )}
                            onClick={handleToggle}
                            aria-expanded={expanded}
                            aria-label={expanded ? '收起源码' : '查看源码'}
                        >
                            {expanded ? <EyeIcon /> : <CodeIcon />}
                            {expanded ? '收起' : '源码'}
                        </button>
                    )}
                    {hasPath && (
                        <button
                            type="button"
                            className={actionButtonStyle}
                            onClick={handleOpen}
                            aria-label="在新窗口打开"
                        >
                            <ExternalLinkIcon />
                            新窗口
                        </button>
                    )}
                </div>
            )}

            {expanded && (
                <div
                    className={cx(
                        sourceFrameStyle,
                        sourceFrameExpandedStyle,
                    )}
                    aria-hidden={!expanded}
                >
                    <div className={sourceScrollStyle}>
                        <Prism
                            language={language}
                            style={codeTheme === 'dark' ? oneDark : oneLight}
                            wrapLongLines
                            showLineNumbers
                            lineNumberStyle={prismLineNumberStyle}
                            customStyle={prismCustomStyle}
                            codeTagProps={prismCodeTagProps}
                        >
                            {sourceCode ?? ""}
                        </Prism>
                    </div>
                </div>
            )}
        </article>
    );
};

export default Preview;
