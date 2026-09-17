import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Tag from "@crab-dev/rc-tag";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    return (
        <div className={layout}>
            <Tag>设计系统</Tag>
            <Tag color="success">已完成</Tag>
        </div>
    );
}
