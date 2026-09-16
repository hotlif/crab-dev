import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { Canvas, Rect, Circle } from "@crab-dev/rc-canvas";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    return (
        <div className={layout}>
            <Canvas width={260} height={160}>
                <Rect
                    x={20}
                    y={25}
                    width={100}
                    height={90}
                    fill={token.color.feedback.info.solid}
                />
                <Circle cx={185} cy={70} r={35} fill={token.color.feedback.success.solid} />
            </Canvas>
            <p>左侧矩形，右侧圆形。</p>
        </div>
    );
}
