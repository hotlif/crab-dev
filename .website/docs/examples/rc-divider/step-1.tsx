import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Divider from "@crab-dev/rc-divider";
import "@crab-dev/rc-divider/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    return (
        <div className={layout}>
            <p>基本资料</p>
            <Divider />
            <p>通知设置</p>
        </div>
    );
}
