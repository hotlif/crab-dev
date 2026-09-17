import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Avatar from "@crab-dev/rc-avatar";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [square, setSquare] = useState(false);
    return (
        <div className={layout}>
            <Avatar shape={square ? "square" : "circle"} size="large">
                林
            </Avatar>
            <Button onClick={() => setSquare((value) => !value)}>切换头像形状</Button>
        </div>
    );
}
