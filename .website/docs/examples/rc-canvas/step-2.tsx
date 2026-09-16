import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { Canvas, Rect } from "@crab-dev/rc-canvas";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [moved, setMoved] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setMoved((value) => !value)}>移动矩形</Button>
            <Canvas width={260} height={160}>
                <Rect
                    x={moved ? 130 : 20}
                    y={25}
                    width={100}
                    height={90}
                    fill={token.color.feedback.info.solid}
                />
            </Canvas>
            <output>矩形横坐标：{moved ? 130 : 20}</output>
        </div>
    );
}
