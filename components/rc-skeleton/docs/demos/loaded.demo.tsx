/**
 * title = "加载完成"
 * description = "`loading=false` 时直接渲染 `children`，便于包裹真实内容。"
 */

import { useEffect, useState } from "react";
import { css } from "@linaria/core";

import Skeleton from "../../src/index.js";

const contentStyle = css`
    padding: 12px 16px;
    border-radius: 8px;
    background-color: oklch(0.97 0.004 286);
    color: oklch(0.2 0.01 286);
    font-size: 14px;
    line-height: 1.6;
`;

const LoadedDemo = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(false), 1600);
        return () => window.clearTimeout(timer);
    }, []);
    return (
        <Skeleton loading={loading} rows={3}>
            <div className={contentStyle}>
                内容已加载完成。真实节点替换骨架后布局不会跳动，卡片的外框、间距都与占位保持一致。
            </div>
        </Skeleton>
    );
};

export default LoadedDemo;
