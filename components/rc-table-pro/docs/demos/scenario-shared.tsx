import { useEffect, useState, type ReactNode } from "react";
import { css, cx } from "@crab-dev/css";
import LineEdit from "@crab-dev/rc-line-edit";
import token from "@crab-dev/rc-token-semantic";

const frameStyle = css`
    display: grid;
    gap: ${token.space['stack-gap']};
    min-width: 0;
    color: ${token.color.text.primary};
    font-family: ${token.font.family.body};
`;

const headingStyle = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: ${token.space['component-gap']};
`;

const titleStyle = css`
    margin: 0;
    font-size: ${token.font.size.subhead};
    font-weight: ${token.font.weight.strong};
`;

const descriptionStyle = css`
    margin: ${token.space['inline-gap']} 0 0;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;

const metricsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
    margin: 0;
`;

const metricStyle = css`
    display: grid;
    gap: ${token.space['inline-gap']};
    min-width: calc(${token.size[96]} + ${token.size[32]});
    padding: ${token.space['component-gap']} ${token.space['stack-gap']};
    border-radius: ${token.shape.medium};
    background: ${token.color.surface.container};
    dt { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
    dd { margin: 0; font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.strong}; }
`;

const feedbackStyle = css`
    min-height: ${token.size[32]};
    display: flex;
    align-items: center;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;

export const scenarioTableStyle = css`
    width: 100%;
    height: calc(${token.size[96]} * 5 + ${token.size[48]});
    min-height: calc(${token.size[96]} * 3);
`;

export const scenarioActionsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
`;

export function ScenarioFrame({ title, description, metrics, actions, feedback, children }: {
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string }>;
    actions?: ReactNode;
    feedback: string;
    children: ReactNode;
}) {
    return (
        <section className={frameStyle} aria-label={title}>
            <div className={headingStyle}>
                <div><h3 className={titleStyle}>{title}</h3><p className={descriptionStyle}>{description}</p></div>
                {actions}
            </div>
            <dl className={metricsStyle}>
                {metrics.map(metric => (
                    <div className={metricStyle} key={metric.label}>
                        <dt>{metric.label}</dt><dd>{metric.value}</dd>
                    </div>
                ))}
            </dl>
            <div className={feedbackStyle} role="status" aria-live="polite">{feedback}</div>
            {children}
        </section>
    );
}

const pillBaseStyle = css`
    display: inline-flex;
    align-items: center;
    padding: ${token.space['inline-gap']} ${token.space['component-gap']};
    border-radius: ${token.shape.full};
    font-size: ${token.font.size.caption};
    font-weight: ${token.font.weight.label};
    white-space: nowrap;
`;
const pillSuccessStyle = css`color: ${token.color.feedback.success.text}; background: ${token.color.feedback.success.background};`;
const pillWarningStyle = css`color: ${token.color.feedback.warning.text}; background: ${token.color.feedback.warning.background};`;
const pillErrorStyle = css`color: ${token.color.feedback.error.text}; background: ${token.color.feedback.error.background};`;
const pillInfoStyle = css`color: ${token.color.feedback.info.text}; background: ${token.color.feedback.info.background};`;

export function StatusPill({ children, tone }: { children: ReactNode; tone: "success" | "warning" | "error" | "info" }) {
    const toneStyle = {
        success: pillSuccessStyle,
        warning: pillWarningStyle,
        error: pillErrorStyle,
        info: pillInfoStyle,
    }[tone];
    return <span className={cx(pillBaseStyle, toneStyle)}>{children}</span>;
}

export function KeywordFilter({ label, value, onValueChange }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
}) {
    const [draft, setDraft] = useState(value);
    useEffect(() => { setDraft(value); }, [value]);
    return (
        <LineEdit
            aria-label={`筛选${label}`}
            size="small"
            value={draft}
            placeholder="输入后按回车"
            onChange={event => setDraft(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter") onValueChange(draft.trim()); }}
        />
    );
}

export const formatCny = (value: number) => new Intl.NumberFormat("zh-CN", {
    style: "currency", currency: "CNY", maximumFractionDigits: 0,
}).format(value);

export function waitForScenarioRequest(signal: AbortSignal, duration = 180): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) { reject(new Error("请求已取消")); return; }
        const finish = () => { signal.removeEventListener("abort", abort); resolve(); };
        const timer = setTimeout(finish, duration);
        const abort = () => {
            clearTimeout(timer);
            signal.removeEventListener("abort", abort);
            reject(new Error("请求已取消"));
        };
        signal.addEventListener("abort", abort, { once: true });
    });
}
