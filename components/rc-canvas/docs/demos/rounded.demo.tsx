export const meta = {
    title: "圆角矩形（SDF）",
    description: "radius > 0 时自动切换到 SDF 着色器，边缘与圆角均为亚像素级抗锯齿。",
};

import { css } from "@crab-dev/css";
import { Canvas, Rect } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

const RoundedDemo = () => {
    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={180}>
                <Rect x={30} y={50} width={100} height={80} radius={4} fill="oklch(0.62 0.21 28)" />
                <Rect x={160} y={50} width={100} height={80} radius={16} fill="oklch(0.6 0.2 255)" />
                <Rect x={290} y={50} width={100} height={80} radius={40} fill="oklch(0.7 0.16 160)" />
            </Canvas>
        </div>
    );
};

export default RoundedDemo;
