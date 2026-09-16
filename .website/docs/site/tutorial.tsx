import { use, useEffect, useId, useState } from "react";
import { TutorialDirectoryContext } from "./siteContext.js";
import type { ComponentType } from "react";
import { createPortal } from "react-dom";
import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
import { PreviewBoundary, InlineExample } from "./liveExample.js";
import Preview from "@crab-dev/rc-component-preview";
import token from "@crab-dev/rc-token-semantic";
import ComponentDemoFrame, { subscribeTheme } from "./componentDemoFrame.js";
import "@crab-dev/rc-theme/css/index.css";
import "@crab-dev/rc-button/css/index.css";
import "@crab-dev/rc-alert/css/index.css";
import "@crab-dev/rc-spin/css/index.css";
import type { ComponentDemoRecord } from "./componentDemos.js";

export interface TutorialStep {
    readonly id: string;
    readonly title: string;
    readonly goal: string;
    readonly why: string;
    readonly instruction: string;
    readonly expected: string;
    readonly changes: readonly string[];
    readonly sourceCode: string;
    readonly preview:
        | { readonly kind: "inline"; readonly load: () => Promise<{ default: ComponentType }> }
        | { readonly kind: "workbench"; readonly demo: ComponentDemoRecord };
}

export interface TutorialRecord {
    readonly id: string;
    readonly title: string;
    readonly steps: readonly TutorialStep[];
}

const lessonStyle = css`
    display: grid;
    overflow-anchor: none;
    gap: ${token.space["group-gap"]};
    min-width: 0;
    margin-block: ${token.space["section-gap"]};
`;
const stepsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["component-gap"]};
    /* 高于 Wake 的文章列表规则，仅重置教学导航，不影响示例内的列表。 */
    && {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    & > li {
        padding: 0;
        margin: 0;
    }
    & button {
        min-height: calc(${token.space["card-padding"]} * 2);
        white-space: normal;
        border-color: transparent;
        color: ${token.color.text.secondary};
        box-shadow: none;
    }
    @media (max-width: 767px) {
        & button { min-height: calc(${token.space["card-padding"]} * 2 + ${token.space["inline-gap"]}); }
    }
    & button[aria-current="step"] {
        color: ${token.color.text.primary};
        background: ${token.color.background.sunken};
        border-color: ${token.color.border.subtle};
        font-weight: ${token.font.weight.heading};
    }
`;
const bodyStyle = css`
    min-width: 0;
    scroll-margin-block-start: calc(${token.space["page-padding"]} * 4);
    &:focus-visible {
        outline: 2px solid ${token.color.focus.ring};
        outline-offset: 2px;
    }
`;
const eyebrowStyle = css`
    color: ${token.color.text.tertiary};
    font-size: ${token.font.size.caption};
    font-weight: ${token.font.weight.heading};
    && {
        margin: 0 0 ${token.space["component-gap"]};
    }
`;
const copyStyle = css`
    /* 文章排版只在教学讲解处覆盖，不穿透运行中的组件。 */
    && > h3 {
        margin: 0 0 ${token.space["component-gap"]};
        font-size: ${token.font.size.heading};
        font-weight: ${token.font.weight.heading};
        line-height: 1.5;
    }
    && > h4 {
        margin: ${token.space["section-gap"]} 0 ${token.space["component-gap"]};
        font-size: ${token.font.size.body};
    }
    && > p {
        margin: 0 0 ${token.space["stack-gap"]};
    }
    && > ul {
        margin: 0 0 ${token.space["section-gap"]};
        padding-inline-start: ${token.space["card-padding"]};
    }
    && > ul > li {
        margin: ${token.space["inline-gap"]} 0;
        padding: 0;
    }
`;
const previewTitleStyle = css`
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${token.space["stack-gap"]};
    & button {
        font-weight: ${token.font.weight.body};
    }
`;
const instructionStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    margin-block: ${token.space["section-gap"]};
    padding: ${token.space["section-gap"]};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    background: ${token.color.background.sunken};
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.body};
    & > p {
        margin: 0;
    }
    & strong {
        color: ${token.color.text.primary};
        font-weight: ${token.font.weight.label};
    }
`;
const actionsStyle = css`
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: ${token.space["stack-gap"]};
    margin-block-start: ${token.space["section-gap"]};
`;
const canvasStyle = css`
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    color: ${token.color.text.primary};
    & > * {
        max-width: 100%;
    }
    & input,
    & textarea {
        max-width: 100%;
    }
    &:focus-visible {
        outline: 2px solid ${token.color.focus.ring};
    }
    @media (forced-colors: active) {
        border: 1px solid CanvasText;
    }
    @media (prefers-reduced-motion: reduce) {
        scroll-behavior: auto;
    }
`;
const directoryStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    margin-block-end: ${token.space["section-gap"]};
    font-size: ${token.font.size.body};
    & > strong {
        font-size: ${token.font.size.caption};
        color: ${token.color.text.secondary};
        font-weight: ${token.font.weight.label};
    }
    & button {
        justify-content: start;
        white-space: normal;
        text-align: start;
        min-height: calc(${token.space["control-padding-y"]} * 6);
    }
`;

function StepDirectory({
    tutorial,
    index,
    panelId,
    onSelect,
}: {
    readonly tutorial: TutorialRecord;
    readonly index: number;
    readonly panelId: string;
    readonly onSelect: (index: number) => void;
}) {
    const slot = use(TutorialDirectoryContext);
    return (
        slot &&
        createPortal(
            <nav className={directoryStyle} aria-label="本课步骤目录">
                <strong>本课步骤</strong>
                {tutorial.steps.map((step, position) => (
                    <Button
                        key={step.id}
                        appearance="text"
                        aria-current={position === index ? "step" : undefined}
                        aria-controls={panelId}
                        onClick={() => {
                            onSelect(position);
                            document.getElementById(panelId)?.focus({ preventScroll: true });
                            document.getElementById(panelId)?.scrollIntoView({ block: "start" });
                        }}
                    >
                        {position + 1}. {step.title}
                    </Button>
                ))}
            </nav>,
            slot,
        )
    );
}

export default function Tutorial({ tutorial }: { readonly tutorial: TutorialRecord }) {
    const [index, setIndex] = useState(0);
    const [attempt, setAttempt] = useState(0);
    const [codeTheme, setCodeTheme] = useState<"light" | "dark">("light");
    const [copyError, setCopyError] = useState("");
    const panelId = useId();
    useEffect(() => subscribeTheme(setCodeTheme), []);
    const step = tutorial.steps[index];
    if (!step)
        return (
            <Alert type="error" title="教程缺少步骤">
                请检查教程配置。
            </Alert>
        );
    const reset = () => setAttempt((value) => value + 1);
    const changes = step.changes.filter((change) => change !== step.goal);
    const select = (next: number) => {
        setIndex(next);
        setAttempt(0);
        setCopyError("");
    };

    return (
        <section
            className={lessonStyle}
            aria-label={`${tutorial.title} 分步教程`}
            data-tutorial={tutorial.id}
        >
            <StepDirectory tutorial={tutorial} index={index} panelId={panelId} onSelect={select} />
            <ol className={stepsStyle} aria-label="学习步骤">
                {tutorial.steps.map((item, position) => (
                    <li key={item.id}>
                        <Button
                            appearance="text"
                            aria-current={position === index ? "step" : undefined}
                            aria-controls={panelId}
                            onClick={() => select(position)}
                        >
                            {String(position + 1).padStart(2, "0")} · {item.title}
                        </Button>
                    </li>
                ))}
            </ol>
            <div id={panelId} className={bodyStyle} tabIndex={-1}>
                <p className={eyebrowStyle} aria-live="polite">
                    第 {index + 1} / {tutorial.steps.length} 步 · {step.title}
                </p>
                <div className={copyStyle}>
                    <h3>{step.goal}</h3>
                    <p>{step.why}</p>
                    {changes.length === 1 && (
                        <p>
                            <strong>代码变化：</strong>
                            {changes[0]}
                        </p>
                    )}
                    {changes.length > 1 && (
                        <>
                            <h4>代码变化</h4>
                            <ul>
                                {changes.map((change) => (
                                    <li key={change}>{change}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
                <div className={instructionStyle}>
                    <p>
                        <strong>动手试试</strong>{"\u3000"}{step.instruction}
                    </p>
                    <p>
                        <strong>你会看到</strong>{"\u3000"}{step.expected}
                    </p>
                </div>
                <Preview
                    key={step.id}
                    density="compact"
                    title={
                        <span className={previewTitleStyle}>
                            <span>运行效果</span>
                            <Button
                                appearance="text"
                                size="small"
                                aria-label="重置当前示例"
                                aria-controls={`${panelId}-preview`}
                                onClick={reset}
                            >
                                重置
                            </Button>
                        </span>
                    }
                    description={
                        step.preview.kind === "inline"
                            ? undefined
                            : "隔离工作台示例；源码中的包内导入需在对应组件工作区使用。"
                    }
                    sourceCode={step.sourceCode}
                    codeTheme={codeTheme}
                    onCopyCode={async (source) => {
                        try {
                            await navigator.clipboard.writeText(source);
                            setCopyError("");
                        } catch (error) {
                            setCopyError("复制未完成，请展开源码后手动选择复制。");
                            throw error;
                        }
                    }}
                >
                    <div className={canvasStyle} data-wake-demo id={`${panelId}-preview`}>
                        {step.preview.kind === "inline" ? (
                            <InlineExample key={step.id} load={step.preview.load} resetKey={attempt} />
                        ) : (
                            <PreviewBoundary key={`${step.id}:${attempt}`} onRetry={reset}>
                                <ComponentDemoFrame
                                    demo={step.preview.demo}
                                    onThemeChange={setCodeTheme}
                                />
                            </PreviewBoundary>
                        )}
                    </div>
                </Preview>
                {copyError && <p role="status">{copyError}</p>}
                <nav className={actionsStyle} aria-label="教程翻页">
                    <Button disabled={index === 0} onClick={() => select(index - 1)}>
                        上一步
                    </Button>
                    <Button
                        appearance="primary"
                        disabled={index === tutorial.steps.length - 1}
                        onClick={() => select(index + 1)}
                    >
                        下一步
                    </Button>
                </nav>
            </div>
        </section>
    );
}
