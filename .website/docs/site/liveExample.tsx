import { Component, Suspense, lazy, useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
import Spin from "@crab-dev/rc-spin";
import Preview from "@crab-dev/rc-component-preview";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { subscribeTheme } from "./componentDemoFrame.js";
import "@crab-dev/rc-button/css/index.css";
import "@crab-dev/rc-alert/css/index.css";
import "@crab-dev/rc-spin/css/index.css";
import "@crab-dev/rc-component-preview/css/index.css";

export type ExampleLoader = () => Promise<{ default: ComponentType }>;

const layout = css`
    min-width: 0;
`;
const externalHeading = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.space["component-gap"]};
    margin-bottom: ${token.space["stack-gap"]};
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.strong};
`;
const previewHeading = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.space["stack-gap"]};
    & button {
        font-weight: ${token.font.weight.body};
        color: ${token.color.text.secondary};
    }
`;

export class PreviewBoundary extends Component<
    { children: ReactNode; onRetry: () => void },
    { failed: boolean }
> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? (
            <Alert
                type="error"
                title="示例暂时无法显示"
                action={<Button onClick={this.props.onRetry}>重新加载示例</Button>}
            >
                请重试；仍失败时可先阅读下方完整代码。
            </Alert>
        ) : (
            this.props.children
        );
    }
}

export function InlineExample({
    load,
    resetKey = 0,
}: {
    readonly load: ExampleLoader;
    readonly resetKey?: number;
}) {
    // Keep the resolved lazy resource while resetting the live component instance.
    // A new lazy resource is needed only for a failed module's explicit retry.
    const [Example, setExample] = useState(() => lazy(load));
    const [retryAttempt, setRetryAttempt] = useState(0);
    const retry = () => {
        setExample(() => lazy(load));
        setRetryAttempt((value) => value + 1);
    };
    return (
        <PreviewBoundary key={`${resetKey}:${retryAttempt}`} onRetry={retry}>
            <Suspense fallback={<Spin tip="正在加载当前步骤" />}>
                <Example />
            </Suspense>
        </PreviewBoundary>
    );
}

export default function LiveExample({
    title,
    description,
    sourceCode,
    load,
    heading = "inside",
    density = "compact",
}: {
    readonly title: string;
    readonly description?: ReactNode;
    readonly sourceCode: string;
    readonly load: ExampleLoader;
    readonly heading?: "inside" | "outside";
    readonly density?: "compact" | "regular";
}) {
    const [attempt, setAttempt] = useState(0);
    const [codeTheme, setCodeTheme] = useState<"light" | "dark">("light");
    const [copyError, setCopyError] = useState("");
    useEffect(() => subscribeTheme(setCodeTheme), []);
    const reset = () => setAttempt((value) => value + 1);
    return (
        <section
            className={layout}
            aria-label={`${title} 运行示例`}
            data-live-example
            data-wake-demo
        >
            {heading === "outside" && (
                <header className={externalHeading}>
                    <span>
                        {title}
                        <span aria-hidden="true"> / </span>交互示例
                    </span>
                    <Button
                        appearance="text"
                        size="small"
                        aria-label={`重置${title}`}
                        onClick={reset}
                    >
                        重置示例
                    </Button>
                </header>
            )}
            <Preview
                title={
                    heading === "inside" ? (
                        <span className={previewHeading}>
                            {title}
                            <Button
                                size="small"
                                appearance="text"
                                aria-label={`重置${title}`}
                                onClick={reset}
                            >
                                重置
                            </Button>
                        </span>
                    ) : undefined
                }
                description={description}
                sourceCode={sourceCode}
                codeTheme={codeTheme}
                density={density}
                onCopyCode={async (code) => {
                    try {
                        await navigator.clipboard.writeText(code);
                        setCopyError("");
                    } catch (error) {
                        setCopyError("复制未完成，请展开源码后手动选择复制。");
                        throw error;
                    }
                }}
            >
                <InlineExample load={load} resetKey={attempt} />
            </Preview>
            {copyError && (
                <Alert type="error" title="复制失败">
                    {copyError}
                </Alert>
            )}
        </section>
    );
}
