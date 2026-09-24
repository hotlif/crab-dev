import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useMessage } from "@crab-dev/rc-message";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [message, holder] = useMessage();
    return (
        <div className={layout}>
            {holder}
            <Button onClick={() => { message.success("资料已保存"); }}>保存资料</Button>
        </div>
    );
}
