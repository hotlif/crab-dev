export const meta = {
    title: "任意角度直线",
    description: "直线在顶点着色器端挤出为带宽度的四边形，支持任意斜率与线宽。",
};

import { css } from "@crab-dev/css";
import { Canvas, Line } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

// 以画布中心为原点放射一圈直线，直观展示任意角度支持
const CX = 210;
const CY = 110;
const R = 90;
const SPOKES = 12;

const LineDemo = () => {
    const lines = Array.from({ length: SPOKES }, (_, i) => {
        const angle = (i / SPOKES) * Math.PI * 2;
        return {
            x2: CX + Math.cos(angle) * R,
            y2: CY + Math.sin(angle) * R,
            hue: Math.round((i / SPOKES) * 360),
        };
    });

    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={220}>
                {lines.map((l, i) => (
                    <Line
                        key={i}
                        x1={CX}
                        y1={CY}
                        x2={l.x2}
                        y2={l.y2}
                        color={`oklch(0.6 0.2 ${l.hue})`}
                        lineWidth={i % 2 === 0 ? 4 : 2}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default LineDemo;
