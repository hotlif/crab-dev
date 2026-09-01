export const meta = {
    title: "属性驱动动画",
    description: "用 React state 逐帧更新图元 props，Canvas 内部 rAF 渲染循环自动重绘，演示流畅动画。",
};

import { css } from "@crab-dev/css";
import { useEffect, useState } from "react";
import { Canvas, Group, Rect, Circle } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #0b0b12;
`;

const CX = 210;
const CY = 110;
const COUNT = 6;

const AnimationDemo = () => {
    const [t, setT] = useState(0);

    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = () => {
            setT((performance.now() - start) / 1000);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const planets = Array.from({ length: COUNT }, (_, i) => {
        const speed = 0.6 + i * 0.25;
        const radius = 28 + i * 13;
        const angle = t * speed + (i / COUNT) * Math.PI * 2;
        return {
            cx: CX + Math.cos(angle) * radius,
            cy: CY + Math.sin(angle) * radius,
            hue: Math.round((i / COUNT) * 360),
        };
    });

    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={220}>
                {/* 整体随时间缓慢自转 */}
                <Group x={CX} y={CY} rotation={t * 0.1}>
                    <Rect x={-6} y={-6} width={12} height={12} radius={3} fill="oklch(0.85 0.18 90)" />
                </Group>
                {planets.map((p, i) => (
                    <Circle
                        key={i}
                        cx={p.cx}
                        cy={p.cy}
                        r={6 + i}
                        fill={`oklch(0.7 0.2 ${p.hue})`}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default AnimationDemo;
