import { cx } from '@crab-dev/css';
import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckIcon, CodeIcon, CopyIcon, ExternalLinkIcon, EyeIcon } from './icons.js';
import { cardStyle, stageStyle, stageContentStyle, stageCompactStyle, stageSpaciousStyle, metaInfoStyle, metaTitleRowStyle, metaTitleStyle, metaDescStyle, metaActionsStyle, sourceFrameStyle, sourceFrameExpandedStyle, sourceFrameDarkStyle, sourceClipStyle, sourceScrollStyle, sourceLoadingStyle, sourceLoadingDarkStyle } from "./preview.styles.js";
const SourceCode = lazy(() => import('./sourceCode.js').then((module) => ({
    default: module.SourceCode,
})));

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
    /** 附加预览操作，显示在复制和源码按钮之前。 */
    actions?: ReactNode;
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
    actions,
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
    const { locale } = useLocale();
    const copy = locale === 'en-US'
        ? { actions: 'Preview actions', copyCode: 'Copy code', copied: 'Copied', copy: 'Copy', hideSource: 'Hide source', showSource: 'Show source', collapse: 'Collapse', source: 'Source', open: 'Open in new window', window: 'New window', loading: 'Loading syntax highlighting…' }
        : { actions: '预览操作', copyCode: '复制代码', copied: '已复制', copy: '复制', hideSource: '收起源码', showSource: '查看源码', collapse: '收起', source: '源码', open: '在新窗口打开', window: '新窗口', loading: '正在加载源码高亮…' };
    const hasSource = typeof sourceCode === 'string' && sourceCode.length > 0;
    const hasPath = typeof path === 'string' && path.length > 0;
    const hasDescription =
        description != null && (typeof description !== 'string' || description.length > 0);
    const hasInfo = title != null || hasDescription;

    const [expanded, setExpanded] = useState(defaultExpanded && hasSource);
    // Load the highlighter on first expansion; retain it through the closing transition.
    const [sourceMounted, setSourceMounted] = useState(defaultExpanded && hasSource);
    const sourceId = useId();
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
        setSourceMounted(true);
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
        <article className={cx.call(undefined, cardStyle, className)} {...restProps}>
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
                className={cx.call(undefined, stageStyle,
                    density === 'compact' && stageCompactStyle,
                    density === 'spacious' && stageSpaciousStyle,
                )}
            >
                <div className={stageContentStyle}>{children}</div>
            </div>

            {(actions != null || hasSource || hasPath) && (
                <div className={metaActionsStyle} role="group" aria-label={copy.actions}>
                    {actions}
                    {hasSource && (
                        <Button
                            appearance="text"
                            size="xs"
                            type="button"
                            icon={copied ? <CheckIcon /> : <CopyIcon />}
                            onClick={handleCopy}
                            aria-label={copy.copyCode}
                            aria-live="polite"
                        >
                            {copied ? copy.copied : copy.copy}
                        </Button>
                    )}
                    {hasSource && (
                        <Button
                            appearance="text"
                            size="xs"
                            isSelected={expanded}
                            type="button"
                            icon={expanded ? <EyeIcon /> : <CodeIcon />}
                            onClick={handleToggle}
                            aria-expanded={expanded}
                            aria-controls={sourceId}
                            aria-label={expanded ? copy.hideSource : copy.showSource}
                        >
                            {expanded ? copy.collapse : copy.source}
                        </Button>
                    )}
                    {hasPath && (
                        <Button
                            appearance="text"
                            size="xs"
                            type="button"
                            icon={<ExternalLinkIcon />}
                            onClick={handleOpen}
                            aria-label={copy.open}
                        >
                            {copy.window}
                        </Button>
                    )}
                </div>
            )}

            {hasSource && (
                <div
                    id={sourceId}
                    className={cx.call(undefined, sourceFrameStyle,
                        codeTheme === 'dark' && sourceFrameDarkStyle,
                        expanded && sourceFrameExpandedStyle,
                    )}
                    aria-hidden={!expanded}
                    inert={!expanded}
                >
                    <div className={sourceClipStyle}>
                        {sourceMounted && (
                            <div className={sourceScrollStyle}>
                                <Suspense
                                    fallback={(
                                        <div className={cx.call(undefined, sourceLoadingStyle, codeTheme === 'dark' && sourceLoadingDarkStyle)} role="status">
                                            {copy.loading}
                                        </div>
                                    )}
                                >
                                    <SourceCode
                                        sourceCode={sourceCode ?? ''}
                                        language={language}
                                        codeTheme={codeTheme}
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default Preview;
