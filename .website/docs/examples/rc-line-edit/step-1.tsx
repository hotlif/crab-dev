import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";

const stage = css`
    display: grid;
    gap: ${token.space['section-gap']};
    width: 100%;
    max-width: calc(${token.size['40']} * 12);
    min-width: 0;
`;
const choices = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;
const result = css`
    color: ${token.color.text.secondary};
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
    overflow-wrap: anywhere;
    font-size: ${token.typography.body.medium['font-size']};
    line-height: ${token.typography.body.medium['line-height']};
    & span:last-child { color: ${token.color.text.primary}; min-width: 0; }
`;

export default function Example() {
    const [value, setValue] = useState("下一件好作品");
    const [appearance, setAppearance] = useState<"filled" | "outlined">("filled");
    return <div className={stage}>
            <div className={choices} role="group" aria-label="输入框外观">
                <Button appearance={appearance === "filled" ? "tonal" : "text"} aria-pressed={appearance === "filled"} onClick={() => setAppearance("filled")}>填充 Filled</Button>
                <Button appearance={appearance === "outlined" ? "tonal" : "text"} aria-pressed={appearance === "outlined"} onClick={() => setAppearance("outlined")}>描边 Outlined</Button>
            </div>
            <LineEdit label="项目名称" appearance={appearance} value={value} onChange={event => setValue(event.target.value)}
                supportingText="起一个容易记住的名字，最多 30 字。" maxLength={30} showCount allowClear onClear={() => setValue("")} />
            <output className={result}><span>当前值</span><span>{value || "等待新的灵感"}</span></output>
    </div>;
}
