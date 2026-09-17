import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import NumberEdit from "@crab-dev/rc-number-edit";
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
    return (
        <label className={fieldStyle}>
            购买数量（1–10）
            <NumberEdit defaultValue={2} min={1} max={10} step={1} />
        </label>
    );
}
