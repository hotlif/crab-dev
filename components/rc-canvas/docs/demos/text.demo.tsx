export const meta = {
    title: "文字渲染",
    description: "文字经 OffscreenCanvas 生成字形位图并上传为 R8 纹理，在 GPU 端以 alpha mask 着色。",
};

import { css } from "@crab-dev/css";
import { Canvas, Text, Rect } from "../../src/index.js";

const wrapStyle = css`
    display: block;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid var(--border-subtle, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
`;

const TextDemo = () => {
    return (
        <div className={wrapStyle}>
            <Canvas width={420} height={200}>
                <Text x={24} y={50} fontSize={28} fill="oklch(0.2 0 0)">Hello WebGL</Text>
                <Text x={24} y={95} fontSize={18} fill="oklch(0.6 0.2 255)">纯 GPU 文字渲染</Text>
                <Rect x={24} y={120} width={200} height={40} radius={8} fill="oklch(0.62 0.21 28)" />
                <Text x={40} y={148} fontSize={18} fill="oklch(0.98 0 0)">叠加在图形之上</Text>
            </Canvas>
        </div>
    );
};

export default TextDemo;
