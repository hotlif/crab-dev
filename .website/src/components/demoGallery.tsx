import { css } from "@linaria/core";
import { useEffect, useState, type FC, type ReactNode, type ComponentType } from "react";
import { Prism } from "react-syntax-highlighter";
import vs from "react-syntax-highlighter/dist/esm/styles/prism/vs.js";
import vsDark from "react-syntax-highlighter/dist/esm/styles/prism/vs-dark.js";


import demoLoaders from "../_generated/demoLoaders.js";
import type { DemoMeta } from "../_generated/manifest.js";
import { CodeIcon, CopyIcon, CheckIcon } from "./icons.js";
import { useTheme } from "../theme/useTheme.js";

const cardStyle = css`
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--surface-raised);
    overflow: hidden;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

    &:hover {
        border-color: var(--border-default);
        box-shadow: var(--shadow-md);
    }
`;

const stageStyle = css`
    padding: 24px 22px;
    background:
        linear-gradient(var(--surface-raised), var(--surface-raised)) padding-box,
        repeating-linear-gradient(
            45deg,
            var(--border-subtle) 0 1px,
            transparent 1px 12px
        );
    background-clip: padding-box;
    border-bottom: 1px solid var(--border-subtle);
    min-height: 120px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: auto;

    &[data-density="compact"] {
        padding: 16px 18px;
        min-height: 88px;
    }

    &[data-density="spacious"] {
        padding: 30px 24px;
        min-height: 156px;
    }

    @media (max-width: 720px) {
        padding: 18px 14px;
        min-height: 96px;

        &[data-density="compact"] {
            padding: 12px;
            min-height: 76px;
        }

        &[data-density="spacious"] {
            padding: 18px 14px;
            min-height: 108px;
        }
    }

    > * {
        max-width: 100%;
    }
`;

const headerStyle = css`
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-bottom: 1px solid var(--border-subtle);
`;

const titleStyle = css`
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.005em;
`;

const descStyle = css`
    font-size: 13px;
    color: var(--text-tertiary);
    line-height: 1.6;
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    padding: 8px 12px;
    background: var(--surface-sunken);
    border-bottom: 1px solid transparent;

    &[data-open="true"] {
        border-bottom-color: var(--border-subtle);
    }
`;

const iconButtonStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: transparent;
    font-size: 12px;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color var(--transition-fast), background-color var(--transition-fast);

    &:hover {
        color: var(--text-primary);
        background: var(--surface-raised);
    }
    &:focus-visible {
        outline: none;
        border-color: var(--accent-500);
    }
    &[data-active="true"] {
        color: var(--accent-700);
        background: var(--accent-50);
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const sourceStyle = css`
    background: var(--surface-sunken);
    overflow: hidden;
`;

const errorStyle = css`
    padding: 24px;
    color: var(--text-tertiary);
    font-size: 13px;
    text-align: center;
    font-family: var(--font-mono);
    line-height: 1.6;
    max-width: 100%;
    word-break: break-word;
`;

interface DemoBlockProps {
    meta: DemoMeta;
}

type StageDensity = "compact" | "regular" | "spacious";

const COMPACT_STAGE_SLUGS = new Set([
    "rc-button",
    "rc-badge",
    "rc-tag",
    "rc-avatar",
    "rc-checkbox",
    "rc-radio",
    "rc-switch",
    "rc-slider",
    "rc-tooltip",
]);

const SPACIOUS_STAGE_SLUGS = new Set([
    "rc-table",
    "rc-tree",
    "rc-virtual",
    "rc-prose",
    "rc-app-main-layout",
    "rc-masonry",
]);

const getStageDensity = (demoPath: string): StageDensity => {
    const matched = demoPath.match(/components\/(rc-[^/]+)/);
    const slug = matched?.[1];
    if (!slug) return "regular";
    if (COMPACT_STAGE_SLUGS.has(slug)) return "compact";
    if (SPACIOUS_STAGE_SLUGS.has(slug)) return "spacious";
    return "regular";
};

const DemoBlock: FC<DemoBlockProps> = ({ meta }) => {
    const { theme } = useTheme();
    const [Element, setElement] = useState<ReactNode>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const stageDensity = getStageDensity(meta.path);

    useEffect(() => {
        const loader = demoLoaders[meta.path];
        if (!loader) {
            setError("未找到 demo 加载器");
            return;
        }
        let mounted = true;
        loader()
            .then(mod => {
                if (!mounted) return;
                const C = mod.default as ComponentType;
                setElement(<C />);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!mounted) return;
                const msg = err instanceof Error ? err.message : String(err);
                setError(`无法加载示例: ${msg}`);
            });
        return () => {
            mounted = false;
        };
    }, [meta.path]);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(meta.source);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            // ignore
        }
    };

    return (
        <article className={cardStyle}>
            <div className={stageStyle} data-density={stageDensity}>
                {error ? (
                    <div className={errorStyle}>{error}</div>
                ) : (
                    Element
                )}
            </div>
            {(meta.title || meta.description) && (
                <div className={headerStyle}>
                    {meta.title && <div className={titleStyle}>{meta.title}</div>}
                    {meta.description && <div className={descStyle}>{meta.description}</div>}
                </div>
            )}
            <div className={toolbarStyle} data-open={open}>
                <button
                    type="button"
                    className={iconButtonStyle}
                    onClick={onCopy}
                    aria-label="复制代码"
                    disabled={!meta.source}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "已复制" : "复制"}
                </button>
                <button
                    type="button"
                    className={iconButtonStyle}
                    onClick={() => setOpen(prev => !prev)}
                    aria-expanded={open}
                    aria-label={open ? "收起代码" : "展开代码"}
                    data-active={open}
                >
                    <CodeIcon />
                    {open ? "收起" : "源码"}
                </button>
            </div>
            {open && meta.source && (
                <div className={sourceStyle}>
                    <Prism
                        language="tsx"
                        style={theme === "dark" ? vsDark : vs}
                        wrapLongLines
                        customStyle={{
                            margin: 0,
                            padding: "18px 20px",
                            background: "transparent",
                            fontSize: 13,
                            fontFamily: "var(--font-mono)",
                        }}
                        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
                    >
                        {meta.source}
                    </Prism>
                </div>
            )}
        </article>
    );
};

const gridStyle = css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
`;

interface DemoGalleryProps {
    demos: DemoMeta[];
}

const DemoGallery: FC<DemoGalleryProps> = ({ demos }) => {
    if (demos.length === 0) return null;
    return (
        <div className={gridStyle}>
            {demos.map(d => (
                <DemoBlock key={d.path} meta={d} />
            ))}
        </div>
    );
};

export default DemoGallery;
