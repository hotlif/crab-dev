import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Checkbox, { CheckboxGroup } from "@crab-dev/rc-checkbox";
import ConfigProvider from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";

const layout = css`display: grid; gap: ${token.space["section-gap"]};`;
const row = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["component-gap"]};`;
const panels = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space["group-gap"]} * 11)), 1fr));
    gap: ${token.space["section-gap"]};
`;
const panel = css`
    min-width: 0;
    padding: ${token.space["section-gap"]};
    background: ${token.color.background.surface};
    color: ${token.color.text.primary};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
`;
const group = css`display: flex; flex-direction: column; align-items: flex-start; gap: 0;`;
const helpStyle = css`
    margin: 0;
    font-size: ${token.font.size.body};
    color: ${token.color.text.secondary};
    &[data-invalid='true'] { color: ${token.color.feedback.error.text}; }
`;

function ThemePanel({ theme }: { theme: "light" | "dark" }) {
    const [selected, setSelected] = useState<Array<string | number>>(["email"]);
    const [agreed, setAgreed] = useState(false);
    const helpId = useId();
    const title = theme === "light" ? "浅色" : "深色";
    return (
        <ConfigProvider theme={theme} className={panel}>
            <section className={layout} aria-label={`${title} MD3 Checkbox`}>
                <strong>{title}</strong>
                <div>
                    <Checkbox checked={selected.length === 2} indeterminate={selected.length === 1}
                        onChange={checked => setSelected(checked ? ["email", "inbox"] : [])}>全选通知</Checkbox>
                    <CheckboxGroup className={group} value={selected} onChange={setSelected}>
                        <Checkbox value="email">邮件通知</Checkbox>
                        <Checkbox value="inbox">站内消息</Checkbox>
                    </CheckboxGroup>
                </div>
                <div className={row}>
                    <Checkbox disabled>不可用</Checkbox>
                    <Checkbox disabled defaultChecked>已选禁用</Checkbox>
                </div>
                <div>
                    <Checkbox checked={agreed} onChange={setAgreed} aria-invalid={!agreed} aria-describedby={helpId}>
                        同意服务条款
                    </Checkbox>
                    <p id={helpId} className={helpStyle} data-invalid={!agreed} aria-live="polite">
                        {agreed ? "已同意服务条款。" : "请先同意服务条款。"}
                    </p>
                </div>
            </section>
        </ConfigProvider>
    );
}

export default function Example() {
    const [brandColor, setBrandColor] = useState("#6750a4");
    return (
        <ConfigProvider brandColor={brandColor} className={layout}>
            <div className={row} role="group" aria-label="Checkbox 品牌色">
                {[["紫色", "#6750a4"], ["蓝色", "#1677ff"], ["绿色", "#087f5b"]].map(([name, color]) => (
                    <Button key={color} size="small" isSelected={brandColor === color} onClick={() => setBrandColor(color)}>{name}</Button>
                ))}
            </div>
            <div className={panels}>
                <ThemePanel theme="light" />
                <ThemePanel theme="dark" />
            </div>
        </ConfigProvider>
    );
}
