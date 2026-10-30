import { css } from "@crab-dev/css";
import Button, { type ButtonProps } from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = {
    title: "完整操作状态矩阵",
    description: "逐档核对五种外观的真实交互、选中、禁用和加载状态；尺寸与页面密度独立。",
};

const scene = css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${token.space['group-gap']};
    padding: ${token.space['group-gap']};
    color: ${token.color.text.primary};
    background-color: ${token.color.background.surface};
`;
const actions = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;
const sizes = ["xs", "s", "m", "l", "xl"] as const;
const states = ["default", "disabled", "selected", "unselected", "loading", "variants"] as const;
const icon = <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" /></svg>;

export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const id = useId();
    const [size, setSize] = useState<NonNullable<ButtonProps['size']>>("s");
    const [state, setState] = useState<typeof states[number]>("default");
    const english = locale === "en-US";
    return <section className={scene} aria-label="Button visual matrix">
        <div className={actions}>
            <label htmlFor={`${id}-size`}>验收尺寸</label>
            <select id={`${id}-size`} value={size} onChange={event => {
                const value = event.currentTarget.value;
                if (sizes.some(item => item === value)) setSize(value as typeof size);
            }}>{sizes.map(value => <option key={value}>{value}</option>)}</select>
            <label htmlFor={`${id}-state`}>验收状态</label>
            <select id={`${id}-state`} value={state} onChange={event => {
                const value = event.currentTarget.value;
                if (states.some(item => item === value)) setState(value as typeof state);
            }}>{states.map(value => <option key={value}>{value}</option>)}</select>
        </div>
        <div className={actions} data-visual-scene data-size={size} data-state={state}>
            {(["primary", "tonal", "outlined", "text", "elevated"] as const).map(appearance => <Button key={appearance}
                data-appearance={appearance} appearance={appearance} size={size}
                disabled={state === "disabled"} loading={state === "loading"}
                isSelected={appearance !== "text" && (state === "selected" || state === "unselected") ? state === "selected" : undefined}
            >{english ? `Save ${appearance}` : `保存 · ${appearance}`}</Button>)}
        </div>
        {state === "variants" && <>
            <div className={actions} aria-label="Shapes and icons">
                <Button size={size} shape="square" icon={icon}>Square</Button>
                <Button size={size} shape="round" iconAfter={icon}>Round</Button>
                <Button size={size} shape="circle" icon={icon} aria-label="Add item" />
            </div>
            <div className={actions} aria-label="Danger actions">
                {(["primary", "tonal", "outlined", "text", "elevated"] as const).map(appearance => <Button key={appearance} size={size} appearance={appearance} danger icon={icon}>{english ? "Delete" : "删除"}</Button>)}
            </div>
            <div className={actions} aria-label="Compatibility appearances">
                {(["danger", "link", "dashed", "subtle"] as const).map(appearance => <Button key={appearance} size={size} appearance={appearance}>{appearance}</Button>)}
            </div>
            <Button size={size} shouldFitContainer>保存完整工作区 · Save the complete workspace</Button>
        </>}
    </section>;
}
