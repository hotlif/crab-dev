import { css, cx } from "@linaria/core";
import { useState, type FC, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism } from "react-syntax-highlighter";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light.js";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark.js";
import { CopyIcon, CheckIcon } from "./icons.js";
import { useTheme } from "../theme/useTheme.js";
import DemoGallery from "./demoGallery.js";
import type { DemoMeta, ApiPropMeta } from "../_generated/manifest.js";

const proseStyle = css`
    color: var(--text-primary);
    font-size: 15px;
    line-height: 1.75;

    > :first-child {
        margin-top: 0;
    }

    h1, h2, h3, h4, h5, h6 {
        color: var(--text-primary);
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.25;
        margin: 2em 0 0.6em;
        scroll-margin-top: 96px;
    }
    h1 { font-size: 32px; margin-top: 0; }
    h2 {
        font-size: 22px;
        margin-top: 1.6em;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-subtle);
    }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }

    p {
        margin: 0.8em 0;
        color: var(--text-secondary);
    }

    a {
        color: var(--accent-600);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color var(--transition-fast);
    }
    a:hover {
        border-bottom-color: var(--accent-600);
    }

    ul, ol {
        margin: 0.8em 0;
        padding-left: 1.4em;
        color: var(--text-secondary);
    }
    li { margin: 0.3em 0; }
    li::marker { color: var(--text-tertiary); }

    blockquote {
        margin: 1em 0;
        padding: 12px 16px;
        border-left: 3px solid var(--accent-500);
        background: var(--surface-sunken);
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
        color: var(--text-secondary);
        > p { margin: 0.4em 0; }
    }

    hr {
        border: none;
        border-top: 1px solid var(--border-subtle);
        margin: 2em 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.2em 0;
        font-size: 14px;
        border: 1px solid var(--border-default);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--surface-raised);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--border-subtle) 72%, transparent) inset;
    }
    thead {
        background: color-mix(in oklab, var(--surface-sunken) 78%, var(--surface-raised));
    }
    th, td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid color-mix(in oklab, var(--border-subtle) 88%, transparent);
    }
    th {
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        letter-spacing: 0.01em;
    }
    td {
        color: var(--text-secondary);
    }
    tbody tr:nth-child(2n) {
        background: color-mix(in oklab, var(--surface-sunken) 48%, transparent);
    }
    tbody tr:last-child td {
        border-bottom: none;
    }
    tbody tr:hover {
        background: color-mix(in oklab, var(--accent-50) 52%, var(--surface-raised));
    }

    code {
        font-family: var(--font-mono);
        font-size: 0.88em;
        padding: 2px 6px;
        background: var(--surface-sunken);
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
        color: var(--accent-700);
    }

    pre {
        margin: 1.2em 0;
        background: transparent !important;
    }

    img {
        max-width: 100%;
        border-radius: var(--radius-md);
    }

    div[align="center"] {
        text-align: center;
        margin: 0.8em 0;
        > h1 { margin-top: 0; }
    }
`;

const codeBlockStyle = css`
    position: relative;
    margin: 1.2em 0;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--surface-sunken);
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

const CodeRenderer: FC<CodeProps> = ({ inline, className, children }) => {
    const { theme } = useTheme();
    const [copied, setCopied] = useState(false);

    if (inline || !className) {
        return <code className={className}>{children}</code>;
    }

    const match = /language-(\w+)/.exec(className ?? "");
    const lang = match?.[1] ?? "text";
    const codeText = String(children ?? "").replace(/\n$/, "");

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeText);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            // ignore
        }
    };

    return (
        <div className={codeBlockStyle}>
            <div className={codeHeaderStyle}>
                <span>{lang}</span>
                <button type="button" className={copyButtonStyle} onClick={onCopy} aria-label="复制代码">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "已复制" : "复制"}
                </button>
            </div>
            <Prism
                language={lang}
                style={theme === "dark" ? oneDark : oneLight}
                wrapLongLines
                customStyle={{
                    margin: 0,
                    padding: "16px 18px",
                    background: "transparent",
                    fontSize: 13.5,
                    fontFamily: "var(--font-mono)",
                }}
                codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
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

const Markdown: FC<MarkdownProps> = ({ children, className, demos = [], api = [] }) => {
    const markdownComponents: Components = {
        code: CodeRenderer,
        demos: () => (demos.length > 0 ? <DemoGallery demos={demos} /> : null),
        api: () => <ApiTable api={api} />,
    } as Components;

    return (
        <div className={cx(proseStyle, className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default Markdown;
