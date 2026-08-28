export const meta = {
    title: "四个方向",
    description: "通过 `placement` 控制抽屉从哪个方向滑出。",
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
    const [placement, setPlacement] = useState<DrawerPlacement | null>(null);
    return (
        <>
            <div className={buttonRowStyle}>
                <Button onClick={() => setPlacement("left")}>从左侧</Button>
                <Button onClick={() => setPlacement("right")}>从右侧</Button>
                <Button onClick={() => setPlacement("top")}>从顶部</Button>
                <Button onClick={() => setPlacement("bottom")}>从底部</Button>
            </div>
            <Drawer
                open={placement !== null}
                onOpenChange={(next) => !next && setPlacement(null)}
                placement={placement ?? "right"}
                title={`Placement: ${placement ?? ""}`}
            >
                <p>当前位置：{placement}</p>
            </Drawer>
        </>
    );
};

export default PlacementDemo;
