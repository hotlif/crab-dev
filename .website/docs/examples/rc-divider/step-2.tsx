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
            <Divider>通知设置</Divider>
            <p>选择需要接收的通知类型。</p>
            <Divider decorative />
        </div>
    );
}
