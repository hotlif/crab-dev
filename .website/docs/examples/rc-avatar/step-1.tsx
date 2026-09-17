import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Avatar from "@crab-dev/rc-avatar";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    return (
        <div className={layout}>
            <Avatar>林</Avatar>
            <p>林晓 · 产品设计</p>
        </div>
    );
}
