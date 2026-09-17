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
            <Button onClick={() => message.success("资料已保存")}>模拟成功</Button>
            <Button onClick={() => message.error("保存失败，请重试")}>模拟失败</Button>
        </div>
    );
}
