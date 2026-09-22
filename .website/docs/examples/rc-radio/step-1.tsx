import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";

const layout = css`
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    align-items: stretch;
    gap: ${token.space["group-gap"]};
    width: 100%; min-width: 0;
    @media (max-width: 720px) { grid-template-columns: minmax(0, 1fr); }
`;
const stack = css`display: grid; gap: ${token.space["stack-gap"]}; min-width: 0;`;
const heading = css`
    && { margin: 0; font-size: ${token.typography.headline.small["font-size"]};
    line-height: ${token.typography.headline.small["line-height"]};
    font-weight: ${token.typography.headline.small.emphasized["font-weight"]}; }
`;
const note = css`&& { margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.medium["line-height"]}; }`;
const choices = css`&& { display: grid; gap: ${token.space["component-gap"]}; width: 100%; }`;
const choice = css`
    padding: ${token.space["component-gap"]}; border-radius: ${token.shape.large};
    background: ${token.color.surface.low}; border: 1px solid transparent;
    transition: background-color ${token.motion.effects.fast}, border-color ${token.motion.effects.fast};
    &[data-state='checked'] { background: ${token.color.secondary.container}; border-color: ${token.color.brand.primary}; }
    & > span:last-child { display: grid; gap: ${token.space["inline-gap"]}; }
    & strong { font-weight: ${token.typography.title.medium.emphasized["font-weight"]}; }
    & small { font-size: ${token.typography.body.small["font-size"]}; line-height: ${token.typography.body.small["line-height"]}; color: ${token.color.text.secondary}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { border-color: CanvasText; &[data-state='checked'] { border-color: Highlight; } }
`;
const preview = css`
    color: ${token.color.text.primary};
    padding: ${token.space["section-gap"]};
    min-width: 0;
    & > div { height: 100%; }
`;
const previewBody = css`
    display: flex; flex-direction: column; align-items: start;
    gap: ${token.space["section-gap"]}; height: 100%;
    & p { margin: 0; }
`;
const mark = css`
    display: grid; place-items: center;
    width: ${token.size["56"]}; height: ${token.size["56"]}; border-radius: ${token.shape.large};
    color: ${token.color.text["on-brand"]}; background: ${token.color.brand.primary};
    font-size: ${token.typography.headline.medium["font-size"]};
`;
const timing = css`
    font-size: ${token.typography.headline.large["font-size"]};
    line-height: ${token.typography.headline.large["line-height"]};
    font-weight: ${token.typography.headline.large.emphasized["font-weight"]}; overflow-wrap: anywhere;
`;
const status = css`display: block; margin-top: auto; font-size: ${token.typography.label.large["font-size"]}; line-height: ${token.typography.label.large["line-height"]};`;
const options = [
    { value: "daily", label: "每天摘要", description: "每天集中查看项目动态。", timing: "每天 09:00", preview: "每天为你整理前一天的更新，保留工作节奏。" },
    { value: "weekly", label: "每周摘要", description: "每周一次，关注重要进展。", timing: "周一 09:00", preview: "把一周的进展汇成一封摘要，让注意力留给重要的事。" },
    { value: "important", label: "仅重要通知", description: "只接收提及、审批与风险提醒。", timing: "需要时通知", preview: "普通动态保持安静，与你有关的重要事项及时送达。" },
];

export default function Example() {
    const headingId = useId();
    const helpId = useId();
    const [value, setValue] = useState<string | number>("weekly");
    const selected = options.find(option => option.value === value) ?? options[1];
    return (
        <div className={layout}>
            <div className={stack}>
                <h3 id={headingId} className={heading}>以你的节奏，接收动态。</h3>
                <p id={helpId} className={note}>选择一种通知频率，预览会随选择更新。</p>
                <RadioGroup className={choices} value={value} onChange={setValue} aria-labelledby={headingId} aria-describedby={helpId}>
                    {options.map(option => (
                        <Radio key={option.value} value={option.value} className={choice}>
                            <strong>{option.label}</strong><small>{option.description}</small>
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
            <section aria-label="通知预览" className={preview}>
                <div className={previewBody}>
                    <span className={mark} aria-hidden="true">↗</span>
                    <p>你的通知预览</p>
                    <strong className={timing}>{selected.timing}</strong>
                    <p>{selected.preview}</p>
                    <output className={status} aria-live="polite">已选择 · {selected.label}</output>
                </div>
            </section>
        </div>
    );
}
