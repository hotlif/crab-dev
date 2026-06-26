/**
 * title = "分组变换与嵌套"
 * description = "Group 维护 TRS 矩阵栈，子孙坐标随父级平移 / 旋转 / 缩放叠加，支持任意层级嵌套。"
 */

import { css } from "@linaria/core";
import { Canvas, Group, Rect, Circle } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

// 一个可复用的"图标"：内部用本地坐标系绘制，被不同 Group 变换复用
const Badge = () => (
    <>
        <Rect x={-30} y={-30} width={60} height={60} radius={12} fill="oklch(0.6 0.2 255)" />
        <Circle cx={0} cy={0} r={16} fill="oklch(0.95 0.02 255)" />
    </>
);

const GroupDemo = () => {
    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={220}>
                {/* 原始 */}
                <Group x={70} y={110}>
                    <Badge />
                </Group>
                {/* 旋转 30° */}
                <Group x={170} y={110} rotation={Math.PI / 6}>
                    <Badge />
                </Group>
                {/* 放大 1.4 倍 */}
                <Group x={270} y={110} scaleX={1.4} scaleY={1.4}>
                    <Badge />
                </Group>
                {/* 嵌套：外层旋转 + 内层平移 */}
                <Group x={360} y={110} rotation={-Math.PI / 8}>
                    <Group scaleX={0.9} scaleY={0.9}>
                        <Badge />
                    </Group>
                </Group>
            </Canvas>
        </div>
    );
};

export default GroupDemo;
