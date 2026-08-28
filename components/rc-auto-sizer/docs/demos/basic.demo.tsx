export const meta = {
    title: "基础用法",
    description: "AutoSizer 自动感知容器尺寸，将 width 和 height 传入子渲染函数。拖拽窗口边缘或改变面板大小时，子内容会随之更新。",
};
import AutoSizer from "../../src/index.js";
import { css } from "@crab-dev/css";

const wrapperStyle = css`
    width: 100%;
    height: 300px;
    border: 1px dashed oklch(70% 0 0);
    border-radius: 4px;
    overflow: hidden;
`;

const contentStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: oklch(97% 0 0);
    font-size: 14px;
    color: oklch(45% 0 0);
    font-variant-numeric: tabular-nums;
`;

export default function BasicDemo() {
    return (
        <div className={wrapperStyle}>
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        className={contentStyle}
                        style={{ width, height }}
                    >
                        {`容器尺寸：${width} × ${height} px`}
                    </div>
                )}
            </AutoSizer>
        </div>
    );
}
