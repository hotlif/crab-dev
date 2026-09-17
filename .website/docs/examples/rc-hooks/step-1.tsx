import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useControllableValue } from "@crab-dev/rc-hooks";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useControllableValue({
        defaultValue: 0,
    });
    return (
        <div className={layout}>
            <Button onClick={() => setValue(value + 1)}>增加数量</Button>
            <output>数量：{value}</output>
        </div>
    );
}
