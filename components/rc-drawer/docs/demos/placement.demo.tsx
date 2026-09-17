export const meta = {
    title: "四个方向",
    description: "通过 `placement` 控制滑出方向；关闭时沿原方向退出，进入平缓、退出利落。",
};

import { useState } from "react";
import Button from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";

import Drawer, { type DrawerPlacement } from "../../src/index.js";

const buttonRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const PlacementDemo = () => {
    const [placement, setPlacement] = useState<DrawerPlacement>("right");
    const [open, setOpen] = useState(false);
    const openAt = (nextPlacement: DrawerPlacement) => {
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
            </div>
            <Drawer
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
