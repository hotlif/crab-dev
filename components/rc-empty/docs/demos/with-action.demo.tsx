
/**
 * title = "带操作区域"
 * description = "通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。"
 */

import Empty from "../../src/index.js";
import { css } from "@linaria/core";

const buttonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid oklch(0.87 0.005 286);
    background-color: oklch(0.220 0.005 286);
    color: oklch(0.980 0.002 286);
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: oklch(0.320 0.008 286);
    }
`;

const WithActionDemo = () => {
    return (
        <Empty
            preset="default"
            action={
                <button type="button" className={buttonStyle}>
                    立即创建
                </button>
            }
        />
    );
};

export default WithActionDemo;
