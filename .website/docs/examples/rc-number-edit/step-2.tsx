import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import NumberEdit from "@crab-dev/rc-number-edit";
import "@crab-dev/rc-number-edit/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    min-width: 0;
    max-width: calc(${token.space["section-gap"]} * 24);
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
export default function Example() {
    const [value, setValue] = useState<number | null>(2);
    return (
        <div className={layout}>
            <label className={fieldStyle}>
                购买数量（1–10）
                <NumberEdit value={value} onChange={setValue} min={1} max={10} />
            </label>
            <output>总价：¥{(value ?? 0) * 80}</output>
        </div>
    );
}
