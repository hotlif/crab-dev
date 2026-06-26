/**
 * title = "基础图元"
 * description = "在 Canvas 中声明矩形与圆形，颜色支持 OKLCh / 十六进制，opacity 控制透明度。"
 */

import { css } from "@linaria/core";
import { Canvas, Rect, Circle } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

const BasicDemo = () => {
    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={220}>
                <Rect x={30} y={40} width={140} height={90} fill="oklch(0.62 0.21 28)" />
                <Rect x={90} y={90} width={140} height={90} fill="oklch(0.7 0.16 160)" opacity={0.75} />
                <Circle cx={320} cy={90} r={55} fill="oklch(0.6 0.2 255)" />
                <Circle cx={350} cy={150} r={40} fill="oklch(0.8 0.16 90)" opacity={0.8} />
            </Canvas>
        </div>
    );
};

export default BasicDemo;
