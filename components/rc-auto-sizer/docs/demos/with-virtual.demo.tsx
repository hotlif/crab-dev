/**
 * title = "配合虚拟滚动"
 * description = "AutoSizer 将容器尺寸透传给 Virtual 组件的 viewportWidth / viewportHeight，实现响应式虚拟滚动。"
 */
import AutoSizer from "../../src/index.js";
import { css } from "@linaria/core";

const wrapperStyle = css`
    width: 100%;
    height: 400px;
    border: 1px solid oklch(88% 0 0);
    border-radius: 4px;
    overflow: hidden;
`;

const placeholderStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: oklch(98% 0.005 250);
    font-size: 13px;
    color: oklch(50% 0 0);
`;

const badgeStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    background-color: oklch(93% 0.02 250);
    color: oklch(40% 0.08 250);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
`;

export default function WithVirtualDemo() {
    return (
        <div className={wrapperStyle}>
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        className={placeholderStyle}
                        style={{ width, height }}
                    >
                        <span>此处传入 Virtual 组件</span>
                        <div>
                            <span className={badgeStyle}>viewportWidth: {width}px</span>
                            {" "}
                            <span className={badgeStyle}>viewportHeight: {height}px</span>
                        </div>
                    </div>
                )}
            </AutoSizer>
        </div>
    );
}
