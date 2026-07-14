import { css } from "@linaria/core";
import { isValidElement, useEffect, useRef, useState, type FC, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Prose from "@crab-dev/rc-prose";
import { Prism } from "react-syntax-highlighter";
import codeTheme from "./codeTheme.js";
import { CopyIcon, CheckIcon } from "./icons.js";
import { slugify } from "./toc.js";
import DemoGallery from "./demoGallery.js";
import type { DemoMeta, ApiPropMeta } from "../_generated/manifest.js";

const codeBlockStyle = css`
    position: relative;
    margin: 1.2em 0;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--surface-sunken);

    /*
     * rc-prose 用 :where(& pre / & code) 给代码上了自己的底色与内距。本容器已提供底色,
     * 若不中和, 灰底里会再套一层浅底, 成为"框中框"。:where() 特异性为 0, 这里直接覆盖。
     */
    & pre {
        margin: 0;
        padding: 0;
        background: transparent;
        border-radius: 0;
    }

    & pre code {
        padding: 0;
        background: transparent;
        border-radius: 0;
        font-weight: 400;
    }
`;

const codeHeaderStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    border-bottom: 1px solid var(--border-subtle);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
    text-transform: lowercase;
`;

const copyButtonStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-tertiary);
    font-size: 12px;
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
`;

interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: ReactNode;
}

const COPY_FEEDBACK_MS = 1400;

const copyToClipboard = async (code: string): Promise<boolean> => {
    if (typeof navigator === "undefined") return false;
    const clipboard = navigator.clipboard;
    if (!clipboard?.writeText) return false;
    try {
        await clipboard.writeText(code);
        return true;
    } catch {
        return false;
    }
};

const CodeRenderer: FC<CodeProps> = ({ inline, className, children }) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current != null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    if (inline || !className) {
        return <code className={className}>{children}</code>;
    }

    const match = /language-(\w+)/.exec(className);
    const lang = match?.[1] ?? "text";
    const codeText = String(children ?? "").replace(/\n$/, "");

    const onCopy = async () => {
        const ok = await copyToClipboard(codeText);
        if (!ok) return;
        setCopied(true);
        if (timerRef.current != null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCopied(false);
            timerRef.current = null;
        }, COPY_FEEDBACK_MS);
    };

    return (
        <div className={codeBlockStyle}>
            <div className={codeHeaderStyle}>
                <span>{lang}</span>
                <button
                    type="button"
                    className={copyButtonStyle}
                    onClick={onCopy}
                    aria-label="复制代码"
                    aria-live="polite"
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "已复制" : "复制"}
                </button>
            </div>
            <Prism
                language={lang}
                style={codeTheme}
                wrapLongLines
                customStyle={{
                    margin: 0,
                    padding: "16px 18px",
                    background: "transparent",
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontFamily: "var(--font-mono)",
                }}
                codeTagProps={{
                    style: { fontFamily: "var(--font-mono)", background: "transparent" },
                }}
            >
                {codeText}
            </Prism>
        </div>
    );
};

interface MarkdownProps {
    children: string;
    className?: string;
    demos?: DemoMeta[];
    api?: ApiPropMeta[];
}

const apiTitleStyle = css`
    margin-top: 8px;
    margin-bottom: 10px;
    font-size: 12px;
    color: var(--text-tertiary);
`;

interface ApiTableProps {
    api: ApiPropMeta[];
}

const ApiTable: FC<ApiTableProps> = ({ api }) => {
    if (api.length === 0) {
        return <p className={apiTitleStyle}>未找到可用的 API 描述信息。</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>属性</th>
                    <th>说明</th>
                    <th>类型</th>
                    <th>默认值</th>
                </tr>
            </thead>
            <tbody>
                {api.map(prop => (
                    <tr key={prop.name}>
                        <td><code>{prop.name}</code></td>
                        <td>{prop.description || "-"}</td>
                        <td><code>{prop.type || "-"}</code></td>
                        <td><code>{prop.defaultValue || "-"}</code></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/** 标题文本可能夹着 <code> 等元素, 取其纯文本以生成与 TOC 一致的 slug。 */
const childrenToText = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(childrenToText).join("");
    if (isValidElement(node)) {
        return childrenToText((node.props as { children?: ReactNode }).children);
    }
    return "";
};

const Markdown: FC<MarkdownProps> = ({ children, className, demos = [], api = [] }) => {
    const markdownComponents: Components = {
        code: CodeRenderer,
        // 锚点 id —— 供右侧 TOC 跳转与滚动高亮定位。
        h2: ({ children: c }) => <h2 id={slugify(childrenToText(c))}>{c}</h2>,
        h3: ({ children: c }) => <h3 id={slugify(childrenToText(c))}>{c}</h3>,
        // CodeRenderer 自带容器, 若仍包在 markdown 原生的 <pre> 里, rc-prose 会再给外层 pre
        // 上一层底色与内距, 形成"框中框"。这里让 pre 透传, 由 CodeRenderer 独立成块。
        pre: ({ children }) => <>{children}</>,
        demos: () => (demos.length > 0 ? <DemoGallery demos={demos} /> : null),
        api: () => <ApiTable api={api} />,
    } as Components;

    return (
        <Prose className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
            >
                {children}
            </ReactMarkdown>
        </Prose>
    );
};

export default Markdown;
