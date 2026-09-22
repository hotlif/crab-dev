import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button, { ButtonGroup } from "@crab-dev/rc-button";
import ConfigProvider from "@crab-dev/rc-config-provider";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";

const stack = css`display: grid; min-width: 0; gap: ${token.space["section-gap"]};`;
const controls = css`
    display: flex; flex-wrap: wrap; gap: ${token.space["section-gap"]};
    & > div { display: grid; gap: ${token.space["component-gap"]}; }
    & strong { color: ${token.color.text.secondary}; font-size: ${token.typography.label.medium["font-size"]}; }
`;
const surface = css`
    padding: ${token.space["group-gap"]}; border-radius: ${token.shape.large};
    color: ${token.color.text.primary}; background: ${token.color.surface.low};
    border: 1px solid ${token.color.border.subtle}; min-width: 0;
`;
const row = css`display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; align-items: center;`;
const note = css`&& { margin: 0; font-size: ${token.typography.body.medium["font-size"]}; color: ${token.color.text.secondary}; }`;
const message = css`
    && { margin: 0; min-height: ${token.typography.body.medium["line-height"]}; font-size: ${token.typography.body.medium["font-size"]}; color: ${token.color.text.secondary}; }
    &[data-error='true'] { color: ${token.color.feedback.error.text}; }
`;

export default function Example() {
    const messageId = useId();
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [brandColor, setBrandColor] = useState("#6750a4");
    const [mode, setMode] = useState("default");
    const [value, setValue] = useState<string | number>("email");
    const invalid = mode === "error" && value === "";
    return (
        <div className={stack}>
            <div className={controls}>
                <div role="group" aria-label="示例主题">
                    <strong>主题</strong>
                    <ButtonGroup variant="connected" appearance="tonal">
                        {(["light", "dark"] as const).map(item => <Button key={item} isSelected={theme === item} onClick={() => setTheme(item)}>{item === "light" ? "浅色" : "深色"}</Button>)}
                    </ButtonGroup>
                </div>
                <div role="group" aria-label="示例状态">
                    <strong>状态</strong>
                    <ButtonGroup variant="connected" appearance="tonal">
                        {[["default", "可用"], ["disabled", "禁用"], ["error", "校验"]].map(([key, label]) => <Button key={key} isSelected={mode === key} onClick={() => { setMode(key); setValue(key === "error" ? "" : "email"); }}>{label}</Button>)}
                    </ButtonGroup>
                </div>
                <div role="group" aria-label="Radio 品牌色">
                    <strong>品牌色</strong>
                    <ButtonGroup variant="connected" appearance="tonal">
                        {[["紫色", "#6750a4"], ["蓝色", "#1677ff"], ["绿色", "#087f5b"]].map(([label, color]) => <Button key={color} isSelected={brandColor === color} onClick={() => setBrandColor(color)}>{label}</Button>)}
                    </ButtonGroup>
                </div>
            </div>
            <ConfigProvider theme={theme} brandColor={brandColor} className={surface}>
                <section className={stack} aria-label="Radio 交互试验区">
                    <strong>接收摘要的方式</strong>
                    <RadioGroup value={value} onChange={setValue} disabled={mode === "disabled"} aria-label="摘要接收方式" aria-describedby={messageId}>
                        <Radio value="inbox" aria-invalid={invalid || undefined} aria-describedby={messageId}>站内通知</Radio>
                        <Radio value="email" aria-invalid={invalid || undefined} aria-describedby={messageId}>邮件摘要</Radio>
                    </RadioGroup>
                    <p className={message} id={messageId} data-error={invalid} aria-live="polite">
                        {invalid ? "请选择一种接收方式。" : mode === "disabled" ? "通知服务暂停，设置暂时不可修改。" : `已选择${value === "email" ? "邮件摘要" : "站内通知"}。`}
                    </p>
                    <p className={note}>Tab 进入选项组，方向键切换；悬停或按住选项，查看圆形状态层。</p>
                </section>
            </ConfigProvider>
            <div className={stack}>
                <strong>兼容尺寸</strong>
                <div className={row}>
                    {(["small", "middle", "large"] as const).map(size => <RadioGroup key={size} size={size} defaultValue="selected" aria-label={`${size} 尺寸`}><Radio value="selected">{size === "middle" ? "20px · 默认" : size === "small" ? "16px · small" : "24px · large"}</Radio></RadioGroup>)}
                </div>
                <p className={note}>默认使用 20px 圆环。16px 与 24px 为 Crab 保留的兼容尺寸，点击目标均为 48px。</p>
            </div>
        </div>
    );
}
