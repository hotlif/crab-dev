import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "@crab-dev/rc-line-edit";

const field = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    max-width: 20rem;
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;

export default function Example() {
    return (
        <label className={field}>
            项目名称（最多 30 字）
            <LineEdit placeholder="例如：组件文档改版" maxLength={30} />
        </label>
    );
}
