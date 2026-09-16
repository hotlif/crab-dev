import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from "@crab-dev/rc-text-edit";
import "@crab-dev/rc-text-edit/css/index.css";
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
            项目说明
            <TextEdit placeholder="描述本次改版目标" maxLength={120} />
        </label>
    );
}
