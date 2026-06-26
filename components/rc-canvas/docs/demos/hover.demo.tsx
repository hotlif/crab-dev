/**
 * title = "hover 回调"
 * description = "通过 onMouseEnter / onMouseLeave 响应图元悬停事件，驱动颜色高亮与状态提示。三种图元均支持该回调。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import { Canvas, Rect, Circle, Line, Text } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

export default function HoverDemo() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={240}>
                <Text
                    x={20} y={14}
                    fontSize={12}
                    fill={hovered ? "oklch(0.4 0.15 250)" : "oklch(0.65 0 0)"}
                >
                    {hovered ? `当前悬停：${hovered}` : "将鼠标移到图形上"}
                </Text>

                <Rect
                    x={40} y={56}
                    width={120} height={72}
                    radius={8}
                    fill={hovered === 'Rect' ? "oklch(0.55 0.22 28)" : "oklch(0.72 0.15 28)"}
                    cursor="pointer"
                    onMouseEnter={() => setHovered('Rect')}
                    onMouseLeave={() => setHovered(null)}
                />

                <Circle
                    cx={280} cy={96}
                    r={54}
                    fill={hovered === 'Circle' ? "oklch(0.5 0.22 255)" : "oklch(0.66 0.18 255)"}
                    cursor="pointer"
                    onMouseEnter={() => setHovered('Circle')}
                    onMouseLeave={() => setHovered(null)}
                />

                <Line
                    x1={40} y1={190}
                    x2={220} y2={190}
                    lineWidth={hovered === 'Line' ? 8 : 4}
                    color={hovered === 'Line' ? "oklch(0.42 0.22 160)" : "oklch(0.6 0.18 160)"}
                    cursor="pointer"
                    onMouseEnter={() => setHovered('Line')}
                    onMouseLeave={() => setHovered(null)}
                />
            </Canvas>
        </div>
    );
}
