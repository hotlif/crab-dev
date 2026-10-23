export const meta = {
    title: "加载完成",
    description: "`loading=false` 时直接渲染 `children`。点击重新加载，观察占位与真实内容的切换。",
};

import { useTransition } from "react";
import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";

import Skeleton from "../../src/index.js";

const stackStyle = css`
    display: grid;
    justify-items: start;
    gap: ${token.space["stack-gap"]};
`;

const contentStyle = css`
    box-sizing: border-box;
    width: 100%;
    min-height: ${token.size[96]};
    padding: ${token.space["card-padding"]};
    border-radius: ${token.shape.card};
    background-color: ${token.color.surface.container};
    color: ${token.color.text.primary};
    font-size: ${token.font.size.body};
    line-height: ${token.font["line-height"].body};
`;

const statusStyle = css`
    margin: 0;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;

const LoadedDemo = () => {
    const [loading, startTransition] = useTransition();

    const reload = () => {
        startTransition(async () => {
            await new Promise<void>((resolve) => window.setTimeout(resolve, 1600));
        });
    };

    return (
        <div className={stackStyle}>
            <Button appearance="outlined" disabled={loading} onClick={reload}>
                {loading ? "正在加载" : "重新加载"}
            </Button>
            <div className={contentStyle}>
                <Skeleton loading={loading} rows={3}>
                    内容已加载完成。骨架占位与真实内容共用同一容器，背景与文字随当前主题切换。
                </Skeleton>
            </div>
            <p className={statusStyle} role="status" aria-live="polite">
                {loading ? "正在加载示例内容…" : "示例内容已就绪。"}
            </p>
        </div>
    );
};

export default LoadedDemo;
