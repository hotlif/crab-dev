export const meta = {
    title: "整体透明度（opacity）",
    description: "opacity 同时作用于 fill 和 stroke，从 1.0 到 0.1 均匀过渡，Line 的 color 同样受影响。",
};

import { css } from "@crab-dev/css";
import { Canvas, Rect, Circle, Line } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

const STEPS = 5;
const opacities = Array.from({ length: STEPS }, (_, i) => 1 - i * (0.9 / (STEPS - 1)));

export default function OpacityDemo() {
    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={240}>
                {/* Rect：fill + stroke 同时透明 */}
                {opacities.map((op, i) => (
                    <Rect
                        key={i}
                        x={20 + i * 76} y={20}
                        width={64} height={64}
                        radius={8}
                        fill="oklch(0.62 0.21 28)"
                        stroke="oklch(0.35 0.2 28)"
                        strokeWidth={3}
                        opacity={op}
                    />
                ))}

                {/* Circle：同上 */}
                {opacities.map((op, i) => (
                    <Circle
                        key={i}
                        cx={52 + i * 76} cy={148}
                        r={28}
                        fill="oklch(0.6 0.2 255)"
                        stroke="oklch(0.35 0.2 255)"
                        strokeWidth={3}
                        opacity={op}
                    />
                ))}

                {/* Line */}
                {opacities.map((op, i) => (
                    <Line
                        key={i}
                        x1={20 + i * 76} y1={210}
                        x2={72 + i * 76} y2={210}
                        color="oklch(0.45 0.2 160)"
                        lineWidth={4}
                        opacity={op}
                    />
                ))}
            </Canvas>
        </div>
    );
}
