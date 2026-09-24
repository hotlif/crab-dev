export const meta = {
    title: "四个方向",
    description: "通过 `placement` 控制滑出方向；关闭时沿原方向退出。RTL 示例将逻辑起点映射到右侧，并演示旧时长变量的兼容。",
};

import { useState } from "react";
import Button from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

import Drawer, { type DrawerPlacement } from "../../src/index.js";

const buttonRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
`;
const customMotionStyle = css`--drawer-panel-animation-duration: ${token.motion.sheet['exit-duration']};`;

const PlacementDemo = () => {
    const [placement, setPlacement] = useState<DrawerPlacement>("right");
    const [open, setOpen] = useState(false);
    const [rtl, setRtl] = useState(false);
    const openAt = (nextPlacement: DrawerPlacement, nextRtl = false) => {
        setRtl(nextRtl);
        setPlacement(nextPlacement);
        setOpen(true);
    };
    return (
        <>
            <div className={buttonRowStyle}>
                <Button onClick={() => openAt("left")}>从左侧</Button>
                <Button onClick={() => openAt("right")}>从右侧</Button>
                <Button onClick={() => openAt("top")}>从顶部</Button>
                <Button onClick={() => openAt("bottom")}>从底部</Button>
                <Button onClick={() => openAt("left", true)}>RTL 逻辑起点</Button>
                <Button onClick={() => openAt("right", true)}>RTL 逻辑终点</Button>
            </div>
            <Drawer
                dir={rtl ? "rtl" : "ltr"}
                className={rtl ? customMotionStyle : undefined}
                open={open}
                onOpenChange={setOpen}
                placement={placement}
                title={`Placement: ${placement}`}
            >
                <p>当前位置：{placement}</p>
            </Drawer>
        </>
    );
};

export default PlacementDemo;
